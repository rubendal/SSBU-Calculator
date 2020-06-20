

class ChargeData {
	constructor(names, min, max, formula) {
		this.names = names;
		this.min = min;
		this.max = max;
		this.formula = formula;
	}

	static get(list, move_name) {
		for (var i = 0; i < list.length; i++) {
			for (var j = 0; j < list[i].names.length; j++) {
				if (move_name.includes(list[i].names[j])) {
					return list[i];
				}
			}
		}
		return null;
	}
};

class HitboxActiveFrames {
	constructor(start, end) {
		this.start = start;
		this.end = end;
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
		return [lerp(10, 18, frames, 30), 50, 100, 3];
	}),
	new ChargeData(["Dragon Fang Shot (Shot, No Charge)"], 0, 29, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(4, 9, frames, 30), lerp(20, 30, frames, 30), kbg, shieldDamage];
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
		return [lerp(3, 11, frames, 40), lerp(10, 20, frames, 40), lerp(45, 85, frames, 40), lerp(-1.5, -5.5, frames, 40)];
	}),
	new ChargeData(["Sun Salutation"], 0, 85, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(5, 21, frames, 85), 30, 63, lerp(-2.5, -5.3, frames, 85)];
	}),
	new ChargeData(["Shadow Ball"], 0, 119, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(2.5, 25, frames, 120), lerp(bkb, 30, frames, 120), lerp(kbg, 67, frames, 120), lerp(shieldDamage, -4, frames, 120)];
	})

];

class MoveData {
	constructor(character, move) {

		for (var property in move) {
			this[property] = move[property];
		}
		this.character = character;
		this.ChargeData = null;

		

		this.Grabs = []; //Ignore grabs

		var charge = ChargeData.get(chargeMoves, this.Name.EN);
		if (charge) {
			this.ChargeData = charge;
			this.charge_damage = function (frames) {
				return +this.ChargeData.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[0].toFixed(4);
			}
			this.charge_bkb = function (frames) {
				return (this.ChargeData.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[1]);
			}
			this.charge_kbg = function (frames) {
				return (this.ChargeData.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[2]);
			}
			this.charge_shieldDamage = function (frames) {
				return (this.ChargeData.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[3]);
			}
		}

		this.maxSmashChargeMult = this.smash_attack ? 1.4 : 1;

		//Smash attacks
		if (this.IsSmashAttack) {
			if (this.character == "Bayonetta" || this.character == "Olimar") {
				this.maxSmashChargeMult = 1.2;
			}
			if (this.character == "Ness" && (this.name.includes("Usmash") || this.Name.EN.includes("Dsmash"))) {
				this.maxSmashChargeMult = 1.2;
			}
			if ((this.character == "Mega Man" || this.character == "Villager") && this.Name.EN.includes("Fsmash")) {
				this.maxSmashChargeMult = 1.2;
			}
		}

		var sameFrame = true;
		var frame = 0;
		var sameId = true;
		var hId = 0;

		if (this.Hitboxes.length > 1) {
			for (var i = 0; i < this.Hitboxes.length; i++) {
				if (i == 0) {
					frame = this.Hitboxes[0].StartFrame;
					hId = this.Hitboxes[0].Id;
				}
				else {
					if (frame !== this.Hitboxes[i].StartFrame) {
						sameFrame = false;
					}
					if (hId !== this.Hitboxes[i].Id) {
						sameId = false;
					}
				}
			}

		}

		for (var i = 0; i < this.Hitboxes.length; i++) {
			this.Hitboxes[i].MoveRef = this;
			this.Hitboxes[i].preDamage = 0;
			this.Hitboxes[i].MoveName = this.Name.EN;

			if (this.InputType == 'throw')
				this.Hitboxes[i].MoveName += ' (Collateral)';

			var id = this.Hitboxes[i].Id;

			if (!isNaN(this.Hitboxes[i].Id)) {
				id = (parseInt(this.Hitboxes[i].Id) + 1).toString();
			}

			if (this.Hitboxes.length > 1) {
				if (sameFrame) {
					this.Hitboxes[i].MoveName += ` (Hitbox ${id})`;
				}
				else {
					if (sameId) {
						this.Hitboxes[i].MoveName += ` (Frame ${this.Hitboxes[i].StartFrame})`;
					}
					else {
						this.Hitboxes[i].MoveName += ` (Frame ${this.Hitboxes[i].StartFrame} / Hitbox ${id})`;
					}
				}
			}

			this.Hitboxes[i].OptionClass = [];
			
			if (this.Hitboxes[i].GroundAir == "COLLISION_SITUATION_MASK_G") {
				this.Hitboxes[i].OptionClass.push("groundOnly");
			}
			else if (this.Hitboxes[i].GroundAir == "COLLISION_SITUATION_MASK_A") {
				this.Hitboxes[i].OptionClass.push("aerialOnly");
			}
				
		}

		var sameKind = true;
		var kind = '';

		if (this.Throws.length > 1) {
			for (var i = 0; i < this.Throws.length; i++) {
				if (i == 0) {
					kind = this.Throws[i].Kind;
				} else {
					if (kind != this.Throws[i].Kind) {
						sameKind = false;
						break;
					}
				}
			}
		}

		for (var i = 0; i < this.Throws.length; i++) {

			this.Throws[i].MoveRef = this;
			this.Throws[i].preDamage = 0;
			this.Throws[i].throw = true;

			this.Throws[i].StartFrame = this.Throws[i].AppliedFrame;
			this.Throws[i].EndFrame = this.Throws[i].AppliedFrame + 1;
			this.Throws[i].SetWeight = false;
			this.Throws[i].DisableHitlag = false;
			this.Throws[i].ShieldDamage = null;
			this.Throws[i].ShieldstunMultiplier = 1;
			this.Throws[i].AdditionalHitstun = 0;

			this.Throws[i].preDamage = 0;

			for (var h = 0; h < this.Hitboxes.length; h++) {
				if (!this.Hitboxes[h].IgnoreGrabbed) {
					if (this.Hitboxes[h].StartFrame < this.Throws[i].AppliedFrame) {
						this.Throws[i].preDamage += this.Hitboxes[h].Damage;
					}
				}
			}

			this.Throws[i].MoveName = this.Name.EN;

			if (sameKind && this.Throws.length > 1) {
				if (this.Hitboxes.length > 0) {
					this.Throws[i].MoveName += ` (Throw, Id ${(parseInt(this.Throws[i].Id) + 1).toString()})`;
				}
				else {
					this.Throws[i].MoveName += ` (Id ${(parseInt(this.Throws[i].Id) + 1).toString()})`;
				}
			}
			else {
				if (this.Hitboxes.length > 0) {
					this.Throws[i].MoveName += ` (Throw)`;
				}
				//this.Throws[i].MoveName += ` (${this.Throws[i].Kind})`;
			}

			this.Throws[i].OptionClasses = "";
		}


	}
}


function LoadMoves(character) {
	var moves = loadJSONPath("/Data/" + character + "/moves.json");

	if (moves) {

		var moveData = [];
		var characterName = moves.Name.EN;
		var internalName = moves.InternalName;

		var index = 0;

		for (var i = 0; i < moves.Moves.length; i++) {
			var move = new MoveData(characterName, moves.Moves[i]);
			for (var m = 0; m < move.Hitboxes.length; m++) {
				var hitbox = move.Hitboxes[m];

				if (hitbox.Effect == "collision_attr_search")
					continue;
				
				hitbox.index = index;
				moveData.push(hitbox);
				index++;
			}

			for (var m = 0; m < move.Throws.length; m++) {
				var t = move.Throws[m];

				//Remove grab releases, Byleth uses Kind FIGHTER_ATTACK_ABSOLUTE_KIND_CATCH for a throw on up B but uses id = 1
				if (t.Kind == 'FIGHTER_ATTACK_ABSOLUTE_KIND_CATCH' && t.Id == 0) 
					continue;

				t.index = index;
				moveData.push(t);
				index++;
			}
		}

		//console.log(moveData);

		return moveData;
	}
	return [];
}