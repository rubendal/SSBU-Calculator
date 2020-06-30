function loadAsyncFunctionJSON(path, success, beforeSend, error) {
    $.ajax({
        'async': true,
        'url': path,
        'dataType': 'json',
        'beforeSend': function () {
            if (beforeSend !== undefined) {
                if (beforeSend != null) {
                    beforeSend();
                }
            }
        },
        'success': function (data) {
            success(data);
        },
        'error': function (xhr) {
            if (error !== undefined) {
                if (error != null) {
                    error(xhr);
                }
            }
        }
    });
}

//var throwData = loadJSONPath('./Data/Throws/throws.json'); //Throw data from Arthur's spreadsheet https://docs.google.com/spreadsheets/d/1E3kEQUOZy1C-kSzcoOSKay5gDqpo-ZZgq-8G511Bmw4/edit#gid=1810400970
var throwData = [];

//var localMoveData = loadJSONPath('./Data/movedata.json'); //Characters with local move data in their Data/Character directory

class HitboxActiveFrames {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
};

class CancelCond{
	constructor(cond) {
        this.rawValue = cond;
		if (cond.includes(">")) {
			//Greater than
			this.type = ">=";
			this.value = parseFloat(cond.replace(">", ""));
			this.values = null;
			this.rawValue = this.rawValue.replace(">", ">=")
            this.print = function(){
                return this.value + ">";
            }
            this.eval = function(value){
                return this.value <= value;
            }
        }else{
            if(/[0-9]+\-[0-9]+/i.test(cond)){
                //Range
				this.type = "-";
				this.value = null;
                this.values = [parseFloat(cond.split("-")[0]),parseFloat(cond.split("-")[1])];
                this.print = function(){
                    return this.values[0] + "-" + this.values[1];
                }
                this.eval = function(value){
                    return value >= this.values[0] && value <= this.values[1];
                }
            }else{
                this.type = "empty";
				this.value = null;
				this.values = null;
                this.print = function(){
                    return "-";
                }
                this.eval = function(value){
                    return false;
                }
            }
        }
    }
}

class MoveParser {
	constructor(id, name, base_damage, angle, bkb, kbg, hitboxActive, faf, landingLag, autoCancel, weightDependent, ignore_hitboxes, hitboxActiveTooltip, baseDamageTooltip) {
		if (base_damage == null)
			base_damage = "";
		if (angle == null)
			angle = "";
		if (bkb == null)
			bkb = "";
		if (kbg == null)
			kbg = "";


        this.id = id;
        this.name = name;
        this.angle = angle;
        this.faf = faf;

        this.base_damage = base_damage;
        this.bkb = bkb;
		this.kbg = kbg;

		if (this.bkb)
			this.bkb = this.bkb.replace("F:", "W:"); //Change FKB to WBKB for parser, to avoid issues with Smash 4 API data

        this.preDamage = 0;
        this.throw = name.includes("Fthrow") || name.includes("Bthrow") || name.includes("Uthrow") || name.includes("Dthrow");
        this.aerial = name.includes("Uair") || name.includes("Fair") || name.includes("Bair") || name.includes("Dair") || name.includes("Nair") || name.includes("Zair");
        this.grab = this.name == "Standing Grab" || this.name == "Dash Grab" || this.name == "Pivot Grab";

        this.landingLag = "-";
        this.autoCancel = [];

        this.counterMult = 0;
        var counterRegex = /(\([0-9]+(\.[0-9]+)*&#215;\))/i;

        this.shieldDamage = 0;
		var shieldDamageRegex = /\(\+[0-9]+\)/i;

		this.setweight = false;
		this.shieldstun = 1;

        if (!this.throw) {
            this.hitboxActive = parseHitbox(hitboxActive);
        } else {
            this.hitboxActive = parseHitbox("-");
            this.faf = NaN;
            var throwdamage = this.base_damage.split(",");
            if (throwdamage.length > 0) {
                for (var i = 0; i < throwdamage.length - 1; i++) {
                    throwdamage[i] = throwdamage[i].replace("&#37;", "").replace("%", "").replace("&#215;", "x");
                    var value = 0;
                    if (throwdamage[i].includes("x")) {
                        value = parseFloat(throwdamage[i].split("x")[0]) * parseFloat(throwdamage[i].split("x")[1]);
                    }
                    else{
                        value = parseFloat(throwdamage[i]);
                    }
                    this.preDamage += value;

                }
                this.base_damage = throwdamage[throwdamage.length - 1];
            }
        }

        if (counterRegex.test(this.base_damage)) {
            var c = counterRegex.exec(this.base_damage)[0].replace(/[a-z]|\(|\)/gi, "").replace("&#215;", "");
            this.counterMult = parseFloat(c);
        }

        this.hitboxes = this.hitboxActive;

        var rehitRateRegex = /(Rehit rate: [0-9]+)/i;
        this.rehitRate = 0;

        if(rehitRateRegex.test(hitboxActive)){
            this.rehitRate = parseFloat(/[0-9]+/i.exec(rehitRateRegex.exec(hitboxActive)[0])[0]);
        }
        
        this.count = 1;
        this.moves = [];
        var wbkb = 0;

        var damage = [];
        var angles = [];
        var kbgs = [];
        var bkbs = [];
        var fkbs = [];

		if (hitboxActiveTooltip || baseDamageTooltip) {
			var shieldDamage = 0;
			if (hitboxActiveTooltip != null && hitboxActiveTooltip.SD != undefined && hitboxActiveTooltip.SD != "") {
				shieldDamage = parseFloat(hitboxActiveTooltip.SD);
			} else if (baseDamageTooltip != null && baseDamageTooltip.SD != undefined && baseDamageTooltip.SD != "") {
				shieldDamage = parseFloat(baseDamageTooltip.SD);
			}

			this.shieldDamage = shieldDamage;

			var setweight = false;
			if (hitboxActiveTooltip != null && hitboxActiveTooltip.SetWeight != undefined) {
				shieldDamage = hitboxActiveTooltip.SetWeight;
			} else if (baseDamageTooltip != null && baseDamageTooltip.SetWeight != undefined) {
				setweight = baseDamageTooltip.SetWeight;
			}

			this.setweight = setweight;

			var shieldstunMult = 1;
			if (hitboxActiveTooltip != null && hitboxActiveTooltip.ShieldstunMultiplier != undefined && hitboxActiveTooltip.ShieldstunMultiplier != "") {
				shieldstunMult = parseFloat(hitboxActiveTooltip.ShieldstunMultiplier);
			} else if (baseDamageTooltip != null && baseDamageTooltip.OneVOne != undefined && baseDamageTooltip.OneVOne != "") {
				var shieldstunRegex = /Shieldstun Multiplier: (([0-9]|\.)+)/i;
				m = shieldstunRegex.exec(baseDamageTooltip.OneVOne);
				if (m != null && m.length > 0)
					shieldstunMult = parseFloat(m[1]);
			}

			this.shieldstun = shieldstunMult;

			//if (hitboxActiveTooltip) {
			//	shieldDamageRegex = /SD: \+?(-?[0-9]+)/i;

			//	var m = shieldDamageRegex.exec(hitboxActiveTooltip);
			//	if (m != null && m.length > 0) {
			//		this.shieldDamage = parseFloat(m[1]);
			//	}

			//	//Set weight
			//	this.setweight = hitboxActiveTooltip.includes("Set Weight");

			//	//Shieldstun multiplier
			//	var shieldstunRegex = /Shieldstun multiplier: (([0-9]|\.)+)/i;
			//	m = shieldstunRegex.exec(hitboxActiveTooltip);
			//	if (m != null && m.length > 0) {
			//		this.shieldstun = parseFloat(m[1]);
			//	}
			//}

			//if (baseDamageTooltip) {
			//	if (this.shieldDamage == 0) {
			//		shieldDamageRegex = /SD: \+?(-?[0-9]+)/i;

			//		var m = shieldDamageRegex.exec(baseDamageTooltip);
			//		if (m != null && m.length > 0) {
			//			this.shieldDamage = parseFloat(m[1]);
			//		}
			//	}

			//	//Set weight
			//	if (!this.setweight)
			//		this.setweight = baseDamageTooltip.includes("Set Weight");

			//	//Shieldstun multiplier
			//	if (this.shieldstun == 1) {
			//		var shieldstunRegex = /Shieldstun multiplier: (([0-9]|\.)+)/i;
			//		m = shieldstunRegex.exec(baseDamageTooltip);
			//		if (m != null && m.length > 0) {
			//			this.shieldstun = parseFloat(m[1]);
			//		}
			//	}
			//}
		}
		else {
			//Smash 4 format
			if (shieldDamageRegex.test(this.base_damage)) {
				this.shieldDamage = parseFloat(shieldDamageRegex.exec(this.base_damage)[0].replace(/\+|\(|\)/gi, ""));
			}
		}

        if(this.aerial){
            this.landingLag = parseFloat(landingLag);
            var cancels = autoCancel.split(",");
            for(var i=0;i<cancels.length;i++){
                this.autoCancel.push(new CancelCond(cancels[i]));
            }
		}

        if (this.base_damage !== undefined && this.bkb !== undefined && this.kbg !== undefined && this.angle !== undefined) {
            if (this.base_damage == "-" || this.base_damage == "" || this.base_damage == "?") {
                this.base_damage = "";
            }
            if (this.angle == "-" || this.angle == "" || this.angle == "?") {
                this.angle = "";
            }
            if (this.bkb == "-" || this.bkb == "" || this.bkb == "?") {
                this.bkb = "";
            }
            if (this.kbg == "-" || this.kbg == "" || this.kbg == "?") {
                this.kbg = "";
            }
            var hitbox = parseHitbox();

            var ryu_true = /\(True: [0-9]+(\.[0-9]+)*\)/gi;
            var is_ryu_special = false;

            if(ryu_true.test(this.base_damage)){
                is_ryu_special = true;
                this.base_damage = this.base_damage.split('(')[0] + "/" + this.base_damage.split(':')[1].replace(')',"");
            }

            if (this.base_damage.includes("/") || this.bkb.includes("/") || this.kbg.includes("/") || this.angle.includes("/")) {
                //multiple hitboxes
				var first_fkb = false;
				var multi_bkb_wbkb = false;
				var sbkb = 0;
				var multi_bkb = false;
                damage = this.base_damage.split("/");
                angles = this.angle.split("/");
				kbgs = this.kbg.split("/");

				//
                if(shieldDamageRegex.test(damage[damage.length-1])){
                    this.shieldDamage = parseFloat(shieldDamageRegex.exec(damage[damage.length-1])[0].replace(/\+|\(|\)/gi,""));
				}

                if (this.bkb.includes("W: ") && this.bkb.includes("B: ")) {
                    this.bkb = this.bkb.replace("/W:", "W:").replace("/B:", "B:").split(",").join("");
                    var w = this.bkb.split("W:");
                    if (w[1].includes("B:")) {
                        var b = w[1].split("B:")[1];
                        w = w[1].split("B:")[0];
                        fkbs = w.trim().split("/");
                        bkbs = b.trim().split("/");
                        first_fkb = true;
                    } else {
                        var b = this.bkb.split("B:")[1];
                        w = b.split("W:")[1];
                        b = b.trim().split("W:")[0];
                        fkbs = w.trim().split("/");
                        bkbs = b.trim().split("/");
					}
					var m = Math.max(damage.length, angles.length, kbgs.length);

					if (m == fkbs.length) {
						multi_bkb_wbkb = true;
						if (bkbs.length == fkbs.length) {
							multi_bkb = true;
						} else {
							sbkb = bkbs[0];
							multi_bkb = false;
						}
					}
                } else {
					if (this.bkb.includes("W: ")) {
						var v = this.bkb.split("/");
						//Check if W: is on the first hitbox (this often means all hitboxes are WBKB)
						if (v[0].includes("W: ")){
							fkbs = this.bkb.replace("W:", "").trim().split("/");
							first_fkb = true;
						} else {
							//Splitted in BKB and WBKB, however there is no B: indicator to know which are BKB, so every value before W: will be considered BKB
							var wb = false;
							bkbs = [];
							fkbs = [];
							for (var i = 0; i < v.length; i++) {
								if (v[i].includes("W: ")) {
									fkbs.push(v[i].replace("W:", "").trim());
									wb = true;
								} else {
									if (wb) {
										fkbs.push(v[i]);
									} else {
										bkbs.push(v[i]);
									}
								}
							}
						}
                    } else {
                        bkbs = this.bkb.split("/");
                    }
				}

				var hitbox_count = Math.max(damage.length, angles.length, kbgs.length, multi_bkb_wbkb ? fkbs.length : (fkbs.length + bkbs.length));
                var set_count = 0;
                var base_count = 0;
				for (var i = 0; i < hitbox_count; i++) {
					var hitbox_name = this.name;
					if (!is_ryu_special) {
						if (!ignore_hitboxes) {
							hitbox_name += " (Hitbox " + (i + 1) + ")";
						}
					} else {
						if (i == 1) {
							hitbox_name = "True " + hitbox_name;
						}
					}

					var d = i < damage.length ? damage[i] : damage[damage.length - 1];
					var a = i < angles.length ? angles[i] : angles[angles.length - 1];
					var k = i < kbgs.length ? kbgs[i] : kbgs[kbgs.length - 1];
					var b = 0;

					var s = 0;
					if (this.shieldDamage == 0) {
						if (shieldDamageRegex.test(d)) {
							s = parseFloat(shieldDamageRegex.exec(d)[0].replace(/\+|\(|\)/gi, ""));
						}
					} else {
						s = this.shieldDamage;
					}

					if (multi_bkb_wbkb) {
						if (multi_bkb) {
							wbkb = fkbs[set_count];
							b = bkbs[set_count];
						} else {
							wbkb = fkbs[set_count];
							b = sbkb;
						}
						set_count++;
					} else {
						if (first_fkb) {
							if (set_count < fkbs.length) {
								b = "0";
								wbkb = fkbs[set_count];
								set_count++;
							} else {
								if (bkbs.length > 0) {
									b = bkbs[base_count];
									wbkb = "0";
									base_count++;
								} else {
									b = "0";
									wbkb = fkbs[fkbs.length - 1];
								}
							}
						} else {
							if (base_count < bkbs.length) {
								b = bkbs[base_count];
								wbkb = "0";
								base_count++;
							} else {
								if (fkbs.length > 0) {
									b = "0";
									wbkb = fkbs[set_count];
									set_count++;
								} else {
									b = bkbs[bkbs.length - 1];
									wbkb = "0";
								}
							}
						}
					}
					this.moves.push(new Move(this.id, i, hitbox_name, this.name, parseFloat(d), parseFloat(a), parseFloat(b), parseFloat(k), parseFloat(wbkb), this.hitboxes, parseFloat(this.faf), parseFloat(this.landingLag), this.autoCancel, this.preDamage, this.counterMult, this.rehitRate, s, this.setweight, this.shieldstun));
                    if (ignore_hitboxes) {
                        return;
                    }
                }
            } else {
                //single hitbox
				if (this.bkb.includes("W: ") && this.bkb.includes("B: ")) {
					this.bkb = this.bkb.replace("/W:", "W:").replace("/B:", "B:").split(",").join("");
					var w = this.bkb.split("W:");
					if (w[1].includes("B:")) {
						var b = w[1].split("B:")[1];
						w = w[1].split("B:")[0];
						fkbs = w.trim().split("/");
						bkbs = b.trim().split("/");
						first_fkb = true;
					} else {
						var b = this.bkb.split("B:")[1];
						w = b.split("W:")[1];
						b = b.trim().split("W:")[0];
						fkbs = w.trim().split("/");
						bkbs = b.trim().split("/");
					}
					this.bkb = bkbs[0];
					wbkb = fkbs[0];
				} else {
					if (bkb.includes("W: ")) {
						this.bkb = "0";
						wbkb = bkb.replace("W: ", "");
					}
				}
                if (this.base_damage == "" && this.angle == "" && this.bkb == "" && this.kbg == "") {
					if (this.grab) {
						this.moves.push(new Move(this.id, 0, this.name, this.name, NaN, NaN, NaN, NaN, NaN, this.hitboxes, parseFloat(this.faf), parseFloat(this.landingLag), this.autoCancel, this.preDamage, this.counterMult, this.rehitRate, this.shieldDamage, this.setweight, this.shieldstun));
                    } else {
						this.moves.push(new Move(this.id, 0, this.name, this.name, NaN, NaN, NaN, NaN, NaN, this.hitboxes, parseFloat(this.faf), parseFloat(this.landingLag), this.autoCancel, this.preDamage, this.counterMult, this.rehitRate, this.shieldDamage, this.setweight, this.shieldstun).invalidate());
                    }
                } else {
					this.moves.push(new Move(this.id, 0, this.name, this.name, parseFloat(this.base_damage), parseFloat(this.angle), parseFloat(this.bkb), parseFloat(this.kbg), parseFloat(wbkb), this.hitboxes, parseFloat(this.faf), parseFloat(this.landingLag), this.autoCancel, this.preDamage, this.counterMult, this.rehitRate, this.shieldDamage, this.setweight, this.shieldstun));
                }
            }

        } else {
			this.moves.push(new Move(this.id, 0, this.name, this.name, NaN, NaN, NaN, NaN, NaN, [new HitboxActiveFrames(NaN, NaN)], NaN, parseFloat(this.landingLag), this.autoCancel, 0, this.counterMult, this.rehitRate, this.shieldDamage, this.setweight, this.shieldstun).invalidate());
        }


        function parseHitbox(hitboxActive) {
            var result = [];
            if (hitboxActive === undefined) {
                return [new HitboxActiveFrames(NaN,NaN)];
            }
            if (hitboxActive == "") {
                return [new HitboxActiveFrames(NaN, NaN)];
            }
            hitboxActive = hitboxActive.replace(/[a-z]|\?|\(.+\)|\:/gi, "");
            var hitbox = hitboxActive.split(",");
            for (var i = 0; i < hitbox.length; i++) {
                var start = hitbox[i].split("-")[0];
                var end = hitbox[i].split("-")[1];
                if (start == undefined) {
                    start = "0";
                }
                if (end == undefined) {
                    end = "0";
                }
                result.push(new HitboxActiveFrames(parseFloat(start), parseFloat(end)));
            }
            return result;
        }
    }
}

var previousMove = null;

class ChargeData{
    constructor(names,min,max,formula){
        this.names = names;
        this.min = min;
        this.max = max;
		this.formula = formula;
    }

    static get(list, move_name){
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].names.length;j++){
                if(move_name.includes(list[i].names[j])){
                    return list[i];
                }
            }
        }
        return null;
    }
};

var chargeMoves = [
	new ChargeData(["Palutena Bow", "Palutena's Bow", "Palutena's Bow (No Charge)", "Palutena's Bow (No Charge, Aerial)"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [3.2 + (frames * 0.09), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Silver Bow", "Silver Bow (No Charge)", "Silver Bow (No Charge, Aerial)"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [5.5 + (frames * 0.1417), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Flare Blade (Uncharged)"], 0, 239, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [8 + (frames * 5 / 30), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Shield Breaker (No Charge)"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [base_damage * ((60 - frames) / 60 + (frames * 2.2 / 60)), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Eruption"], 0, 119, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [10 + (frames * 4 / 30), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Quickdraw (Attack)"], 0, 70, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [base_damage + (frames * 0.1), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Giant Punch (Uncharged"], 0, 9, function (base_damage, bkb, kbg, shieldDamage, frames) {
		if (frames == 1) {
			frames = 0;
		}
		return [base_damage + (2 * frames), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Charge Shot"], 0, 112, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(5, 28, frames, 112), lerp(14, 46, frames, 112), lerp(42, 50, frames, 112), lerp(-2.5, -7, frames, 112)];
	}),
	new ChargeData(["Charge Blast (No Charge)"], 0, 119, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(base_damage, 22, frames, 120), lerp(bkb, 20, frames, 120), lerp(kbg, 64, frames, 120), shieldDamage];
	}),
	new ChargeData(["Hero's Bow (No Charge)"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [4 + (12 - 4) * (frames / 60), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Spin Attack (No Charge,"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [base_damage * ((60 - frames) / 60 + (frames * 1.6 / 60)), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["PK Flash (No Charge)", "PK Trash (No Charge)"], 0, 105, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [5 + (((frames + 15) / 120) * .32 * 100), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Dragon Fang Shot (Bite, No Charge)"], 0, 30, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(10,18,frames,30), 50, 100, 3];
	}),
	new ChargeData(["Dragon Fang Shot (Shot, No Charge)"], 0, 29, function (base_damage, bkb, kbg, shieldDamage, frames) {
			return [lerp(4,9,frames, 30), lerp(20, 30, frames, 30), kbg, shieldDamage];
	}),
	new ChargeData(["Aura Sphere (Release from Charge)"], 0, 89, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(10, 25, frames, 90) * 0.69, lerp(bkb, 35, frames, 90), lerp(kbg, 69, frames, 90), lerp(shieldDamage, 3, frames, 90)];
	}),
	new ChargeData(["Skull Bash"], 0, 89, function (base_damage, bkb, kbg, shieldDamage, frames) {
		//Formula by Arthur https://twitter.com/BenArthur_7/status/917873355386183686
		return [base_damage + ((6 / 35) * (frames + 1)), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Rollout (Ground, Release)", "Rollout (Aerial, Release)"], 0, 6.5, function (base_damage, bkb, kbg, shieldDamage, frames) {
		if (frames < 2)
			return [7, bkb];
		return [Math.max(Math.floor(frames * 1.5 * 3.4), 1), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Water Shuriken (Uncharged)"], 0, 39, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(3, 11, frames, 40), lerp(10, 20, frames, 40), lerp(45,85,frames,40), lerp(-1.5, -5.5, frames, 40)];
	}),
	new ChargeData(["Sun Salutation"], 0, 85, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(5, 21, frames, 85), 30, 63, lerp(-2.5, -5.3,frames, 85)];
	}),
	new ChargeData(["Shadow Ball"], 0, 119, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(2.5, 25, frames, 120), lerp(bkb, 30, frames, 120), lerp(kbg, 67, frames, 120), lerp(shieldDamage, -4, frames, 120)];
	})

];

class Move {
	constructor(api_id, hitbox_no, name, moveName, base_damage, angle, bkb, kbg, wbkb, hitboxActive, faf, landingLag, autoCancel, preDamage, counterMult, rehitRate, shieldDamage, setweight, shieldstun) {
        this.api_id = api_id;
        this.id = 0;
        this.hitbox_no = hitbox_no;
        this.name = name;
        this.moveName = moveName;
        this.base_damage = base_damage;
        this.angle = angle;
        this.bkb = bkb;
        this.kbg = kbg;
        this.wbkb = wbkb;
        this.hitboxActive = hitboxActive;
        this.faf = faf;
        this.landingLag = landingLag;
        this.autoCancel = autoCancel;
        this.preDamage = preDamage;
        this.counterMult = counterMult;
        this.rehitRate = rehitRate;
		this.shieldDamage = shieldDamage;
		this.setweight = setweight;
		this.shieldstun = shieldstun;
		this.weightDependent = false;

        this.eval_autoCancel = function(value){
            for(var i=0;i<this.autoCancel.length;i++){
                if(this.autoCancel[i].eval(value)){
                    return true;
                }
            }
            return false;
        }

        this.compareById = function(other){
            if(this.api_id < other.api_id){
                return -1;
            }
            if(this.api_id > other.api_id){
                return 1;
            }
            if(this.hitbox_no < other.hitbox_no){
                return -1;
            }
            if(this.hitbox_no > other.hitbox_no){
                return 1;
            }
            return 0;
        }

        this.valid = true;
        this.smash_attack = name.includes("Fsmash") || name.includes("Usmash") || name.includes("Dsmash");
		this.throw = name.includes("Fthrow") || name.includes("Bthrow") || name.includes("Uthrow") || name.includes("Dthrow");
		this.chargeable = name.includes("No Charge") || name.includes("Uncharged") || (name.includes("Eruption") && !name.includes("Fully Charged")) || name == "Charge Shot" || name == "Quickdraw (Attack)" || name == "Aura Sphere (Release from Charge)" || name == "Shadow Ball (Uncharged)" || name == "Skull Bash" || name.includes("Rollout (") || name == "Water Shuriken (Uncharged)" || name == "Sun Salutation" || name == "Palutena Bow" || name == "Silver Bow";
        this.grab = this.name == "Standing Grab" || this.name == "Dash Grab" || this.name == "Pivot Grab";
        this.tilt = this.name.includes("Utilt") || this.name.includes("Ftilt") || this.name.includes("Dtilt");
        this.jab = this.name.includes("Jab");
		this.aerial = this.name.includes("Uair") || this.name.includes("Fair") || this.name.includes("Bair") || this.name.includes("Dair") || this.name.includes("Nair"); // || this.name.includes("Zair"); Zair not really considered as an aerial in-game
		this.aerial_shieldstun = this.aerial && !this.name.includes("Landing");
        this.taunt = this.name.includes("Taunt");
        this.dashAttack = this.name.includes("Dash Attack");
        this.counter = this.counterMult != 0 || this.name.includes("Counter (Attack)") || this.name.includes("Substitute (Attack") || this.name.includes("Toad (Attack") || this.name.includes("Witch Time");
        this.commandGrab = !this.grab && (this.name.includes("Grab") || this.name.includes("Confusion") || (this.name.includes("Inhale") && !this.name.includes("Spit")) || (this.name.includes("Chomp") && !this.name.includes("Food") && !this.name.includes("Eating")) || this.name.includes("Egg Lay") || this.name.includes("Flame Choke")) && !this.name.includes("Attack") && !this.name.includes("(Hitbox)");
        this.unblockable = this.grab || this.throw || this.commandGrab || this.name.includes("Witch Time") || this.name.includes("KO Punch") || this.name == "Focus Attack (Stage 3)" || this.name == "Reflect Barrier"; 
        this.windbox = this.name.includes("Windbox") || this.name.includes("Flinchless") || this.name == "Hydro Pump" || this.name == "F.L.U.D.D (Attack)";
        this.multihit = /(Hit [0-9]+)/gi.test(this.name) || /(Hits [0-9]+\-[0-9]+)/gi.test(this.name) || this.name.includes("Final Hit") || this.rehitRate != 0;
		this.spike = this.angle >= 230 && this.angle <= 310;
		this.isFinishingTouch = false; // this.name.includes("Finishing Touch") && !this.name.includes("Windbox");

		this.maxSmashChargeMult = this.smash_attack ? 1.4 : 1;

        this.charge = null;
        if(this.chargeable){
            this.charge = ChargeData.get(chargeMoves, this.name);
			this.charge_damage = function (frames) {
				return +this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[0].toFixed(4);
			}
			this.charge_bkb = function (frames) {
				return (this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[1]);
			}
			this.charge_kbg = function (frames) {
				return (this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[2]);
			}
			this.charge_shieldDamage = function (frames) {
				return (this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[3]);
			}
        }

        this.invalidate = function () {
            this.valid = false;
            return this;
		}

		this.check = function () {
			if (isNaN(this.base_damage) && isNaN(this.angle) && isNaN(this.bkb) && isNaN(this.kbg))
				this.valid = false;
			
			return this;
		}

        this.addCharacter = function (character) {
            this.character = character;
            return this;
        }

        this.type = this.smash_attack ? "Smash" :
            this.throw ? "Throw" :
            this.grab ? "Grab" :
            this.tilt ? "Tilt" :
            this.jab ? "Jab" :
            this.aerial ? "Aerial" :
            this.taunt ? "Taunt" :
            this.dashAttack ? "DashAttack" :
			"Special";

		this.isGroundedAttack = this.smash_attack || this.tilt || this.jab || this.dashAttack;

        if (this.counter) {
            this.type += ",Counter";
        }

        if(this.commandGrab){
            this.type += ",CommandGrab";
        }

        if(this.unblockable && !this.throw && !this.grab && !this.commandGrab){
            this.type += ",Unblockable";
        }

        if(this.windbox){
            this.type += ",Windbox";
        }

        if(this.multihit){
            this.type += ",Multihit";
        }

        if(this.shieldDamage != 0){
            this.type += ",ExtraShieldDamage";
        }

        if(this.spike){
            this.type += ",Spike";
        }

        if(this.name.includes("True")){
            this.type += ",RyuTrue";
        }
        
        if((this.name.includes("Limit") && !this.name.includes("Limit Break")) || this.name.includes("Finishing Touch") ){
            this.type += ",LimitBreak";
		}

		if (this.weightDependent) {
			this.type += ",WeightDependent";
		}

		if (previousMove != null && isNaN(this.faf)) {
			if (previousMove.valid) {
				if (this.moveName.split("(")[0].trim() == previousMove.moveName.split("(")[0].trim()) {
					this.faf = previousMove.faf;
					if (this.autoCancel.length == 1) {
						if (this.autoCancel[0].type == "empty") {
							this.autoCancel = previousMove.autoCancel;
						}
					}
					if (this.landingLag == "-" || isNaN(this.landingLag)) {
						this.landingLag = previousMove.landingLag;
					}
				}
			}
        }
		previousMove = this;

		//Check if move can be used in the calculator
		if (isNaN(this.base_damage) && isNaN(this.angle) && isNaN(this.bkb) && isNaN(this.kbg))
			this.valid = false;

		//New data
		this.pikminColor = null;

		//Throws stuff
		this.throwApplierFrame = null;
		this.throwFAF = null;
		this.throwAnimationLength = null;
		this.calculateThrowData = null;
		this.throwDataExceptions = null;

		this.updateMoveData = function () {

			//Throws
			if (this.throw) {
				var gameName = gameNames[names.indexOf(this.character)];
				for (var i = 0; i < throwData.length - 1; i++) {
					if (throwData[i].Character == gameName) {
						var td = throwData[i];
						if (this.moveName == "Fthrow") {
							this.throwApplierFrame = td.ThrowApplierFrame.Fthrow;
							this.throwFAF = td.FAF.Fthrow;
							this.throwAnimationLength = td.AnimationLength.Fthrow;
							this.throwDataExceptions = td.Exceptions.Fthrow;
						} else if (this.moveName == "Bthrow") {
							this.throwApplierFrame = td.ThrowApplierFrame.Bthrow;
							this.throwFAF = td.FAF.Bthrow;
							this.throwAnimationLength = td.AnimationLength.Bthrow;
							this.throwDataExceptions = td.Exceptions.Bthrow;
						} else if (this.moveName == "Uthrow") {
							this.throwApplierFrame = td.ThrowApplierFrame.Uthrow;
							this.throwFAF = td.FAF.Uthrow;
							this.throwAnimationLength = td.AnimationLength.Uthrow;
							this.throwDataExceptions = td.Exceptions.Uthrow;
						} else if (this.moveName == "Dthrow") {
							this.throwApplierFrame = td.ThrowApplierFrame.Dthrow;
							this.throwFAF = td.FAF.Dthrow;
							this.throwAnimationLength = td.AnimationLength.Dthrow;
							this.throwDataExceptions = td.Exceptions.Dthrow;
						}
						break;
					}
				}
				if (gameName == "donkey") {
					//var td = throwData[throwData.length-1];
					//if (this.moveName == "Fthrow (Cargo)") {
					//	this.throwApplierFrame = td.ThrowApplierFrame.Fthrow;
					//	this.throwFAF = td.FAF.Fthrow;
					//	this.throwAnimationLength = td.AnimationLength.Fthrow;
					//	this.throwDataExceptions = td.Exceptions.Fthrow;
					//} else if (this.moveName == "Bthrow (Cargo)") {
					//	this.throwApplierFrame = td.ThrowApplierFrame.Bthrow;
					//	this.throwFAF = td.FAF.Bthrow;
					//	this.throwAnimationLength = td.AnimationLength.Bthrow;
					//	this.throwDataExceptions = td.Exceptions.Bthrow;
					//} else if (this.moveName == "Uthrow (Cargo)") {
					//	this.throwApplierFrame = td.ThrowApplierFrame.Uthrow;
					//	this.throwFAF = td.FAF.Uthrow;
					//	this.throwAnimationLength = td.AnimationLength.Uthrow;
					//	this.throwDataExceptions = td.Exceptions.Uthrow;
					//} else if (this.moveName == "Dthrow (Cargo)") {
					//	this.throwApplierFrame = td.ThrowApplierFrame.Dthrow;
					//	this.throwFAF = td.FAF.Dthrow;
					//	this.throwAnimationLength = td.AnimationLength.Dthrow;
					//	this.throwDataExceptions = td.Exceptions.Dthrow;
					//}
				}

				if (this.throwFAF == 0)
					this.throwFAF = this.throwAnimationLength;

				if (this.throwApplierFrame != null) {

					//Has throw data

					this.calculateThrowData = function (character, weight) {
						var targetGameName = gameNames[names.indexOf(character)];
						var result = {
							hitFrame: 0,
							faf: 0
						};
						if (this.weightDependent) {

							if (this.throwDataExceptions.indexOf(targetGameName) < 0) {

								result.hitFrame = WeightDependentThrowFrame(this.throwApplierFrame, weight, this.throwAnimationLength);
								result.faf = WeightDependentThrowFrame(this.throwFAF, weight, this.throwAnimationLength);

							}
							else {
								//R.O.B's Fthrow and Bthrow exceptions
								result.hitFrame = WeightDependentThrowFrame(this.throwApplierFrame, weight, this.throwFAF);
								result.faf = WeightDependentThrowFrame(this.throwFAF, weight, this.throwFAF);
							}

						}
						else {
							result.hitFrame = this.throwApplierFrame;
							result.faf = this.throwFAF;
						}

						return result;

					}
				}

				if (this.character == "Olimar" && this.name == "Dthrow (Purple)")
					this.throwApplierFrame = 25;
			}

			//Pikmin color and multipliers
			if (this.character == "Olimar") {
				if (this.name.includes("Fsmash") || this.name.includes("Dsmash") || this.name.includes("Usmash") || this.name.includes("Uair") || this.name.includes("Dair")
					|| this.name.includes("Fair") || this.name.includes("Bair") || this.name.includes("Uthrow")) {

					if (this.moveName == "Dsmash (Purple Pikmin, Late)") {
						this.pikminColor = "Purple";
					} else {
						switch (this.hitbox_no) {
							case 0:
								this.pikminColor = "Red";
								break;
							case 1:
								this.pikminColor = "Yellow";
								break;
							case 2:
								this.pikminColor = "Blue";
								break;
							case 3:
								this.pikminColor = "White";
								break;
							case 4:
								this.pikminColor = "Purple";
								break;
						}
					}
					//Apply damage multipliers
					switch (this.pikminColor) {
						case "Red":
							if (this.throw) {
								this.base_damage *= 0.8;
							} else {
								this.base_damage *= 1.4;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
						case "Yellow":

							break;
						case "Blue":
							if (this.throw) {
								this.base_damage *= 1.7;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
						case "White":
							if (!this.throw) {
								this.base_damage *= 0.8;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
						case "Purple":
							if (!this.throw) {
								this.base_damage *= 1.6;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
					}

					if (this.pikminColor != null) {
						this.name = this.moveName + " (" + this.pikminColor + ")";
					}
				}
			}

			//Smash attacks
			if (this.smash_attack) {
				if (this.character == "Bayonetta" || this.character == "Olimar") {
					this.maxSmashChargeMult = 1.2;
				}
				if (this.character == "Ness" && (this.name.includes("Usmash") || this.name.includes("Dsmash"))) {
					this.maxSmashChargeMult = 1.2;
				}
				if ((this.character == "Mega Man" || this.character == "Villager") && this.name.includes("Fsmash")) {
					this.maxSmashChargeMult = 1.2;
				}
			}

			return this;
		}


    }
};

function getMoveset(attacker, $scope) {
    $scope.moveset = [];
	var api_name = attacker.api_name.toLowerCase().replace("and", "").replace("&", "").split(".").join("").split(" ").join("");
	//if (attacker.name == "Piranha Plant") {
	//	api_name = attacker.api_name.toLowerCase();
	//}

	$scope.moveset_info = "";
	switch (attacker.display_name) {
		case "Dark Samus":
			api_name = "samus";
			$scope.moveset_info = "Using Samus moveset, ";
			break;
	}
	

	//KH Smash Ultimate API
	loadAsyncFunctionJSON("https://api.kuroganehammer.com/api/characters/name/" + api_name + "?game=ultimate", function (character) {
		if (character != null) {
			var id = character.OwnerId;
			loadAsyncFunctionJSON("https://api.kuroganehammer.com/api/characters/" + id + "/moves?expand=true&game=ultimate", function (moveset) {
				if (moveset != null) {
					var moves = [];
					var count = 1;
					for (var i = 0; i < moveset.length; i++) {
						var move = moveset[i];
						var parser = new MoveParser(move.InstanceId, move.Name, move.BaseDamage != null ? move.BaseDamage.Normal : null, move.Angle, move.BaseKnockBackSetKnockback, move.KnockbackGrowth, move.HitboxActive != null ? move.HitboxActive.Frames : null, move.FirstActionableFrame, move.LandingLag, move.AutoCancel, move.IsWeightDependent, false, move.HitboxActive, move.BaseDamage);
						for (var c = 0; c < parser.moves.length; c++) {
							var m = parser.moves[c];
							m.id = count;
							if (!m.grab && m.valid) {
								moves.push(m.addCharacter(attacker.display_name).updateMoveData());
								count++;
							}


							if (attacker.name == "Olimar" && m.name == "Dthrow") {
								//Add Purple Pikmin Dthrow
								var m2 = Object.assign({}, m);
								m2.id = count;
								m2.name = "Dthrow (Purple)";
								m2.moveName = "Dthrow (Purple)";
								moves.push(m2.addCharacter(attacker.name).updateMoveData());
								count++;
							}
						}
					}
					moves.unshift(new Move(0, -1, "Not selected", 0, 0, 0, 0, false, 0, 0, 0).invalidate());

					try {
						$scope.$apply(function () {
							if (moves.length > 1) {
								if ($scope.attackerName != moves[1].character) {
									//If this is a previous request ignore it and do not overwrite current move list
									return;
								}
							} else {
								//Get Smash 4 Data
								GetSmash4Data(attacker, $scope);
								return;
							}
							$scope.moveset_info = null;
							$scope.moveset = moves;
							$scope.detectAttack();

						});
					} catch (err) {
						if ($scope.attackerName != moves[0].character) {
							return;
						}
						$scope.moveset_info = null;
						$scope.moveset = moves;
						$scope.detectAttack();
					}
				} else {
					$scope.moveset = [new Move(-1, -1, "Couldn't get attacks", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
				}
			},
				function () {
					//$scope.moveset = [new Move(-1, "Loading...", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
				}, function () {
					$scope.moveset = [new Move(-1, -1, "Couldn't get attacks", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
				});
		} else {
			$scope.moveset = [new Move(-1, -1, "Couldn't access API", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];

			
			
		}
	}, function () {
		$scope.moveset = [new Move(-1, -1, "Loading...", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
	}, function () {
		//Ultimate data isn't available, use Smash 4
		GetSmash4Data(attacker, $scope);
	});
	
    
}

function GetSmash4Data(attacker, $scope) {
	$scope.moveset = [];
	var api_name = attacker.api_name.toLowerCase().replace("and", "").replace("&", "").split(".").join("").split(" ").join("");
	$scope.moveset_info = "";
	switch (attacker.display_name) {
		case "Chrom":
			api_name = "roy";
			$scope.moveset_info = "Using Roy moveset, ";
			break;
		case "Dark Samus":
			api_name = "samus";
			$scope.moveset_info = "Using Samus moveset, ";
			break;
	}
	loadAsyncFunctionJSON("https://api.kuroganehammer.com/api/characters/name/" + api_name, function (character) {
		if (character != null) {
			var id = character.OwnerId;
			loadAsyncFunctionJSON("https://api.kuroganehammer.com/api/characters/" + id + "/moves", function (moveset) {
				if (moveset != null) {
					var moves = [];
					var count = 1;
					for (var i = 0; i < moveset.length; i++) {
						var move = moveset[i];
						var parser = new MoveParser(move.InstanceId, move.Name, move.BaseDamage, move.Angle, move.BaseKnockBackSetKnockback, move.KnockbackGrowth, move.HitboxActive, move.FirstActionableFrame, move.LandingLag, move.AutoCancel, move.IsWeightDependent, false);
						for (var c = 0; c < parser.moves.length; c++) {
							var m = parser.moves[c];
							m.id = count;
							if (!m.grab && m.valid) {
								moves.push(m.addCharacter(attacker.display_name).updateMoveData());
								count++;
							}


							if (attacker.name == "Olimar" && m.name == "Dthrow") {
								//Add Purple Pikmin Dthrow
								var m2 = Object.assign({}, m);
								m2.id = count;
								m2.name = "Dthrow (Purple)";
								m2.moveName = "Dthrow (Purple)";
								moves.push(m2.addCharacter(attacker.name).updateMoveData());
								count++;
							}
						}
					}
					moves.unshift(new Move(0, -1, "Not selected", 0, 0, 0, 0, false, 0, 0, 0).invalidate());

					try {
						$scope.$apply(function () {
							if (moves.length > 1) {
								if ($scope.attackerName != moves[1].character) {
									//If this is a previous request ignore it and do not overwrite current move list
									return;
								}
								$scope.moveset_info += "Smash 4 move data, check scripts for Ultimate data";
								$scope.moveset = moves;
								$scope.detectAttack();
							} else {
								$scope.moveset_info = "";
								$scope.moveset = [new Move(0, -1, "Character data not available", 0, 0, 0, 0, false, 0, 0, 0).invalidate()];
								$scope.detectAttack();
							}

						});
					} catch (err) {
						if ($scope.attackerName != moves[0].character) {
							return;
						}
						$scope.moveset_info += "Smash 4 move data, check scripts for Ultimate data";
						$scope.moveset = moves;
						$scope.detectAttack();
					}
				} else {
					$scope.moveset = [new Move(-1, -1, "Couldn't get attacks", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
				}
			},
				function () {
					//$scope.moveset = [new Move(-1, "Loading...", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
				}, function () {
					$scope.moveset = [new Move(-1, -1, "Couldn't get attacks", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
				});
		} else {
			$scope.moveset = [new Move(-1, -1, "Couldn't access API", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
		}
	}, function () {
		$scope.moveset = [new Move(-1, -1, "Loading...", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
	}, function () {
		$scope.moveset = [new Move(-1, -1, "Character data not available", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
	});
}

function getUltimateCharactersId(names, $scope) {
	$scope.charactersId = [];
	loadAsyncFunctionJSON("https://api.kuroganehammer.com/api/characters?game=ultimate", function (character) {
		if (character != null) {
			var characters = [];
			for (var i = 0; i < character.length; i++) {
				var id = character[i].OwnerId;
				var name = character[i].Name;
				var color = character[i].ColorTheme;
				for (var n = 0; n < names.length; n++) {
					var api_name = names[n].toLowerCase().replace("&", "").replace("and", "").split(".").join("").split(" ").join("");
					if (name.toLowerCase() == api_name) {
						name = names[n];
						name = name.replace(/\&/gi, "and");
						characters.push(new CharacterId(name, id, color));
						break;
					}

				}
			}
			try {
				$scope.$apply(function () {
					$scope.charactersId = characters;
					$scope.ready();
				});
			} catch (err) {
				$scope.charactersId = characters;
				$scope.ready();
			}

		}
	}, null, function () {
		$scope.status = "Couldn't access API";
		$scope.ready(true);
	});
}

function getCharactersId(names, $scope) {
    $scope.charactersId = [];
	loadAsyncFunctionJSON("https://api.kuroganehammer.com/api/characters", function (character) {
        if (character != null) {
            var characters = [];
            for (var i = 0; i < character.length; i++) {
                var id = character[i].OwnerId;
                var name = character[i].Name;
                var color = character[i].ColorTheme;
				for (var n = 0; n < names.length; n++) {
					var api_name = names[n].toLowerCase().replace("&","").replace("and", "").split(".").join("").split(" ").join("");
                    if (name.toLowerCase() == api_name) {
                        name = names[n];
                        name = name.replace(/\&/gi,"and");
                        characters.push(new CharacterId(name, id, color));
                        break;
					}
					
                }
            }
            try {
                $scope.$apply(function () {
                    $scope.charactersId = characters;
                    $scope.ready();
                });
            } catch (err) {
                $scope.charactersId = characters;
                $scope.ready();
            }
            
        }
    }, null, function () {
        $scope.status = "Couldn't access API";
        $scope.ready(true);
    });
}

function getAllMoves($scope) {
    $scope.moves = [];
	loadAsyncFunctionJSON("https://api.kuroganehammer.com/api/moves", function (moveset) {
        if (moveset != null) {
            var moves = [];
            var count = 0;
            try{
                $scope.$apply(function () { $scope.status = "Parsing moves..."; });
            } catch (err) {
                $scope.status = "Parsing moves...";
			}

            for (var i = 0; i < moveset.length; i++) {
                var move = moveset[i];
                var parser = new MoveParser(move.InstanceId, move.Name, move.BaseDamage, move.Angle, move.BaseKnockBackSetKnockback, move.KnockbackGrowth, move.HitboxActive, move.FirstActionableFrame, move.LandingLag, move.AutoCancel, move.IsWeightDependent, false);
                for (var c = 0; c < parser.moves.length; c++) {
					var m = parser.moves[c];
					var characterName = $scope.charactersId[move.OwnerId - 1].name;
					m.characterData = $scope.charactersId[move.OwnerId - 1];
					m.id = count;
					moves.push(m.addCharacter(characterName).updateMoveData());
                    count++;
                }
            }
            try {
                $scope.$apply(function () {
                    $scope.moves = moves;
                    $scope.ready();
                });
            } catch (err) {
                $scope.moves = moves;
                $scope.ready();
            }
        }
    }, null, function () {
        $scope.status = "Couldn't access API";
        $scope.ready(true);
    });
}