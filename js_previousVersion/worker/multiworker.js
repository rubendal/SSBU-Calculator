var headers = ["type", "attacker", "attacker_modifier", "attacker_name", "target", "target_modifier", "target_name", "attacker_percent", "rage", "target_percent",
	"move", "move_base_damage", "charge_frames", "base_damage", "damage", "ignore_staleness", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "staleness_multiplier", "aura", "stock_difference", "angle", "bkb", "fkb", "kbg",
	"kb_modifier", "kb_multiplier", "kb", "di_lsi_angle", "launch_angle", "hitstun", "tumble", "can_jab_lock", "lsi_multiplier", "horizontal_launch_speed", "vertical_launch_speed",
	"horizontal_distance", "vertical_distance", "KO"];

class Row {
	constructor(mode, attacker, target, attacker_percent, target_percent, move, base_damage, charge_frames, damage, staleness, stalequeue, aura, stock_dif, kb_multiplier, kb, wbkb, hit_frame, hitstun, faf, distance) {
		this.mode = mode;
		this.attacker = attacker;
		this.target = target;
		this.attacker_percent = attacker_percent;
		this.attackerMod = this.attacker.modifier.name;
		this.targetMod = this.target.modifier.name;
		this.attacker_display = this.attacker.display_name;
		this.target_display = this.target.display_name;
		if (this.attackerMod == "Normal" || this.attackerMod == "") {
			this.attackerMod = "";
		} else {
			this.attacker_display = this.attacker.display_name + " (" + this.attackerMod + ")";
		}
		if (this.targetMod == "Normal" || this.targetMod == "") {
			this.targetMod = "";
		} else {
			this.target_display = this.target.display_name + " (" + this.targetMod + ")";
		}
		this.target_percent = target_percent;
		this.move = move;
		this.base_damage = base_damage;
		this.charge_frames = charge_frames;
		this.damage = damage;
		this.staleness = staleness;
		this.stalequeue = stalequeue;
		this.aura = aura;
		this.stock_dif = stock_dif;
		if (this.attacker.name != "Lucario") {
			this.aura = "";
			this.stock_dif = "";
		}
		this.staleMult = StaleNegation(this.stalequeue, this.staleness);
		this.kb_multiplier = kb_multiplier;
		this.kb_modifier = this.kb_multiplier == 0.8 ? "Crouch Cancel" : "None";

		this.hit_frame = hit_frame;
		if (isNaN(hit_frame) || hit_frame === undefined) {
			this.hit_frame = 1;
		}
		this.faf = faf;
		if (isNaN(faf)) {
			this.faf = 0;
		}
		this.wbkb = wbkb;
		this.kb = kb;
		this.kb.calculate();
		this.distance = distance;
		if (this.kb.angle > 361) {
			this.distance.max_x = "";
			this.distance.max_y = "";
			this.h_pos = "";
			this.v_pos = "";
		}
		this.rage = Rage(attacker_percent);
		this.v_pos = distance.finalPosition.y;
		this.h_pos = distance.finalPosition.x;
		this.lsi = this.kb.lsi;
		this.hitstun = hitstun;
		this.di = Math.floor(GetAngle(kb.stick.X, kb.stick.Y));

		this.tsv = function () {
			return [this.mode, this.attacker.display_name, this.attackerMod, this.attacker_display, this.target.display_name, this.targetMod, this.target_display,
			this.attacker_percent, this.rage, this.target_percent,
				this.move.name, this.move.base_damage, this.charge_frames, this.base_damage, this.damage, this.staleness, this.stalequeue[0], this.stalequeue[1], this.stalequeue[2], this.stalequeue[3], this.stalequeue[4], this.stalequeue[5], this.stalequeue[6], this.stalequeue[7], this.stalequeue[8], this.staleMult, this.aura, this.stock_dif, this.move.angle, this.move.bkb, this.move.wbkb, this.move.kbg,
				this.kb_modifier, this.kb_multiplier, this.kb.kb, this.di, this.kb.angle, this.hitstun, this.kb.tumble, this.kb.can_jablock, this.lsi, this.kb.horizontal_launch_speed, this.kb.vertical_launch_speed,
				this.distance.max_x, this.distance.max_y, this.distance.KO];
		}
	}
};

importScripts('./global.js', '../formulas.js');

var characterList = [];

var bd = base_damage;
var moves = [];
var damage = base_damage;
var kb;
var distance;
var move;
var faf;
var hit_frame;
var characters = [];
var charge_data = null;
var is_1v1 = true;
var shorthop_aerial = false;
var use_landing_lag = "no";
var mode = "normal";
var ko_mode = "ko";
var diStep = 15;
var preDamageCalc = 0;

var rowMode = "Calculation";

var tsv_rows = [];

function generateStickPositions(step) {

	if (step == undefined)
		step = 1;

	var controller = ControllerList[0];

	var list = [];

	if (controller.name == "Wiimote") {
		list.push({ X: 0, Y: 0 });
		list.push({ X: 128, Y: 0 });
		list.push({ X: -127, Y: 0 });
		list.push({ X: 0, Y: 128 });
		list.push({ X: 0, Y: -127 });
		list.push({ X: 128, Y: 128 });
		list.push({ X: 128, Y: -127 });
		list.push({ X: -127, Y: 128 });
		list.push({ X: -127, Y: 127 });
	} else {
		for (var i = 0; i < 360; i += step) {
			var x = Math.floor(controller.r * Math.cos(i * Math.PI / 180));
			var y = Math.floor(controller.r * Math.sin(i * Math.PI / 180));

			if (x < -127)
				x = -127;
			if (y < -127)
				y = -127;
			if (x > 128)
				x = 128;
			if (y > 128)
				y = 128;

			//Ignore deadzone stick positions

			if (x != 0 && x > -24 && x < 24)
				continue;

			if (y != 0 && y > -24 && y < 24)
				continue;

			list.push({ X: x, Y: y });
		}
	}

	return list;
}

function calcDamage() {
	preDamageCalc = preDamage;
	if (move.charge == null) {
		bd = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge);
	} else {
		bd = move.charge_damage(charge_frames);
	}

	if (charge_data == null && is_smash) {
		bd = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge, move != null ? move.maxSmashChargeMult : 1.4);
	}
	if (attacker.name == "Lucario") {
		bd *= Aura(attacker_percent, stock_dif, game_format);
		preDamageCalc *= Aura(attacker_percent, stock_dif, game_format);
	}

	bd *= attacker.modifier.base_damage;
	preDamageCalc *= attacker.modifier.base_damage;

	damage = bd;
	damage *= target.modifier.damage_taken;
	preDamageCalc *= attacker.modifier.damage_dealt;
	preDamageCalc *= target.modifier.damage_taken;

	preDamageCalc *= InkDamageMult(ink);

	//if (!move.throw) {
	//	damage *= attacker.modifier.damage_dealt;
	//}
	damage *= target.modifier.damage_taken;
	preDamageCalc *= attacker.modifier.damage_dealt;
	preDamageCalc *= target.modifier.damage_taken;

	if (is_1v1) {
		preDamageCalc *= 1.2;
	}

	if (shorthop_aerial) {
		damage *= parameters.shorthop_aerial;
		preDamageCalc *= parameters.shorthop_aerial;
	}

	if (attacker.modifier.name == "Winged Mode") {
		//Winged Mode affects KB like short hop multiplier
		damage *= attacker.modifier.damage_dealt;
		preDamage *= attacker.modifier.damage_dealt;
	}
}

function addRow() {
	calcDamage();
	if (wbkb == 0) {
		kb = VSKB(target_percent + (preDamage * StaleNegation(stale, shieldStale, ignoreStale)), base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, r, stale, shieldStale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
		kb.addModifier(attacker.modifier.kb_dealt);
		kb.addModifier(target.modifier.kb_received);
	} else {
		kb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, r, target_percent, StaleDamage(damage, stale, shieldStale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", 1);
	}
	//kb.bounce(bounce);
	var damageSpeedUpFrames = [];

	if (kb.tumble && wbkb == 0) {
		damageSpeedUpFrames = DamageSpeedUpFrames(Math.max(0, FirstActionableFrame(kb.base_kb, windbox, electric) + addHitstun), kb.angle);
	}

	var distance = new Distance(kb.kb, kb.horizontal_launch_speed, kb.vertical_launch_speed, kb.tumble, Math.max(0, kb.hitstun + addHitstun), damageSpeedUpFrames, wbkb != 0, kb.angle, kb.damageflytop, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, (use_landing_lag == "yes" ? faf + landing_lag : use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.damageflytop_fall_speed, target.attributes.traction * target.modifier.traction, isFinishingTouch, inverseX, onSurface, position, stage, graph, 0);

	if (is_1v1) {
		damage *= 1.2;
	}
	damage *= attacker.modifier.damage_dealt;

	if (FirstActionableFrame(kb.base_kb, windbox, electric) >= 32 && wbkb == 0) {
		var speedUpFAF = damageSpeedUpFrames[damageSpeedUpFrames.length - 1];

		var hitstun = speedUpFAF - 1;

		tsv_rows.push(new Row(rowMode, attacker, target, attacker_percent, target_percent, move, bd, charge_frames, StaleDamage(damage, stale, ignoreStale), ignoreStale, stale, Aura(attacker_percent, stock_dif), stock_dif, r, kb, wbkb, hit_frame, hitstun, speedUpFAF, distance).tsv());
	}
	else {
		tsv_rows.push(new Row(rowMode, attacker, target, attacker_percent, target_percent, move, bd, charge_frames, StaleDamage(damage, stale, ignoreStale), ignoreStale, stale, Aura(attacker_percent, stock_dif), stock_dif, r, kb, wbkb, hit_frame, Hitstun(kb.base_kb, windbox, electric) + addHitstun, FirstActionableFrame(kb.base_kb, windbox, electric) + addHitstun, distance).tsv());
	}



}

function addKORow() {
	calcDamage();
	var data = calc(damage);
	if(data.ko)
		tsv_rows.push(new Row(rowMode, attacker, target, attacker_percent, +data.ko_percent.toFixed(6), move, bd, charge_frames, StaleDamage(damage, stale, ignoreStale), ignoreStale, stale, Aura(attacker_percent, stock_dif), stock_dif, r, data.kb, wbkb, hit_frame, data.faf - 1, data.faf, data.distance).tsv());
	//console.log(tsv_rows);



}

function addKOBestDIRow() {
	calcDamage();

	var stickList = generateStickPositions(diStep);

	var list = [];

	for (var i = 0; i < stickList.length; i++) {
		stick = stickList[i];

		var data = calc(damage);

		list.push({ di: stick, percent: data.ko_percent, data: data });

	}

	list.sort(function (a, b) {
		if (a.percent > b.percent) {
			return -1;
		} else if (a.percent < b.percent) {
			return 1;
		}
		return 0;
	});

	var d = list[0];
	if (d.data.ko) {
		var k = d.data.kb;
		k.stick = d.di;
		if (inverseX)
			k.stick.X *= -1;

		tsv_rows.push(new Row(rowMode, attacker, target, attacker_percent, +d.percent.toFixed(6), move, bd, charge_frames, StaleDamage(damage, stale, ignoreStale), ignoreStale, stale, Aura(attacker_percent, stock_dif), stock_dif, r, k, wbkb, hit_frame, d.data.faf - 1, d.data.faf, d.data.distance).tsv());
	}
	//console.log(tsv_rows);



}

function getDistance(damage) {
	if (wbkb == 0) {
		//trainingkb = TrainingKB(target_percent + preDamage, base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled");
		kb = VSKB(target_percent + preDamage, base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, r, stale, shieldStale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
		//trainingkb.addModifier(attacker.modifier.kb_dealt);
		kb.addModifier(attacker.modifier.kb_dealt);
		//trainingkb.addModifier(target.modifier.kb_received);
		kb.addModifier(target.modifier.kb_received);
	} else {
		//trainingkb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, damage, 0, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled");
		kb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, r, target_percent, StaleDamage(damage, stale, shieldStale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
		//trainingkb.addModifier(target.modifier.kb_received);
		kb.addModifier(target.modifier.kb_received);
	}

	var damageSpeedUpFrames = [];
	var f = kb.hitstun + 1;

	if (kb.tumble && wbkb == 0) {
		damageSpeedUpFrames = DamageSpeedUpFrames(Math.max(0, FirstActionableFrame(kb.base_kb, windbox, electric) + addHitstun), kb.angle);
		f = damageSpeedUpFrames[damageSpeedUpFrames.length - 1];
	}

	var distance = new Distance(kb.kb, kb.horizontal_launch_speed, kb.vertical_launch_speed, kb.tumble, Math.max(0, kb.hitstun + addHitstun), damageSpeedUpFrames, wbkb != 0, kb.angle, kb.damageflytop, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, (use_landing_lag == "yes" ? faf + landing_lag : use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.damageflytop_fall_speed, target.attributes.traction * target.modifier.traction, isFinishingTouch, inverseX, onSurface, position, stage, false, 0);

	return {
		distance: distance, kb: kb, faf: f
	};
}

function search(damage, i, prev, n, pd) {
	var found = false;
	var distance = pd;
	var last;
	var prevDistance;
	for (var x = i; x >= i - prev; x -= n) {
		last = x;
		target_percent = x - n;
		prevDistance = distance;
		var dd = getDistance(damage);
		distance = dd.distance;
		if (!distance.KO) {
			return { last: last, distance: prevDistance, kb: dd.kb, faf: dd.faf };
		}
	}
	return null;
};

function calc(damage) {
	var data = {};
	//Check if it can KO at 999% (if not just stop calculation)
	target_percent = 999;
	var dd = getDistance(damage);
	distance = dd.distance;
	var kb = dd.kb;
	var last = 0;
	var found = false;
	if (distance.KO) {
		for (var i = 0; i <= 1000 && !found; i += 20) {
			if (i == 1000)
				i = 999;
			target_percent = i;
			dd = getDistance(damage);
			distance = dd.distance;
			kb = dd.kb;
			if (distance.KO) {
				if (i == 0) {
					data = { ko: true, ko_percent: 0, distance: distance, kb: kb, faf: dd.faf };
					found = true;
					break;
				}
				else {
					var t = search(damage, i, 20, 5, distance);
					if (t != null) {
						t = search(damage, t.last, 5, 1, t.distance);
						if (t != null) {
							t = search(damage, t.last, 1, 0.5, t.distance);
							if (t != null) {
								t = search(damage, t.last, 0.5, 0.1, t.distance);
								if (t != null) {
									t = search(damage, t.last, 0.1, 0.02, t.distance);
									data = { ko: true, ko_percent: t.last, distance: t.distance, kb: t.kb, faf: dd.faf };
									break;
								}
							}
						}
					}

				}
			}
		}
	} else {
		data = { ko: false };
	}
	return data;
}

update = function (vars) {
	attacker = vars.attacker;
	target = vars.target;
	attacker_percent = vars.attacker_percent;
	target_percent = vars.target_percent;
	preDamage = vars.preDamage;
	base_damage = vars.base_damage;
	angle = vars.angle;
	in_air = vars.in_air;
	bkb = vars.bkb;
	kbg = vars.kbg;
	stale = vars.stale;
	shieldStale = vars.shieldStale;
	hitlag = vars.hitlag;

	hitframe = vars.hitframe;
	faf = vars.faf;
	charge_frames = vars.charge_frames;
	r = vars.r;
	bounce = vars.bounce;
	ignoreStale = vars.ignoreStale;
	perfectshield = vars.prefectshield;
	is_projectile = vars.is_projectile;

	megaman_fsmash = vars.megaman_fsmash;
	electric = vars.electric;
	witch_time_smash_charge = vars.witch_time_charge;
	crouch = vars.kb_modifier;

	is_smash = vars.is_smash;
	is_aerial_move = vars.is_aerial_move;
	uses_aerial_shieldstun = vars.uses_aerial_shieldstun;

	wbkb = vars.wbkb;
	windbox = vars.windbox;

	game_mode = vars.game_mode;
	stage = vars.stage;
	graph = vars.graph;
	position = vars.position;
	inverseX = vars.inverseX;
	onSurface = vars.onSurface;

	stock_dif = vars.stock_dif;
	game_format = vars.game_format;

	stick = vars.stick;

	luma_percent = vars.luma_percent;

	unblockable = vars.unblockable;

	shieldDamage = vars.shieldDamage;

	set_weight = vars.set_weight;

	effect = vars.effect

	launch_rate = vars.launch_rate;

	shieldstunMult = vars.shieldstunMult;

	addHitstun = vars.addHitstun;

	ink = vars.ink;

	position = vars.position;
	charge_data = vars.charge_data;
	is_1v1 = vars.is_1v1;
	shorthop_aerial = vars.shorthop_aerial;
	use_landing_lag = vars.use_landing_lag;
};

onmessage = function (e) {

	tsv_rows = [];

	var params = e.data;

	update(params);

	var at_from = params.at_from;
	var at_to = params.at_to;
	var at_step = at_step;


	var from = params.from;
	var to = params.to;
	var step = params.step;

	var iterators = params.iterators;

	moves = params.moves;
	move = params.move;
	characters = params.characters;
	bd = params.bd;
	damage = params.damage;
	hit_frame = params.hit_frame;
	faf = params.faf;
	mode = params.mode;
	ko_mode = params.ko_mode;

	var funlist = [];
	var index = 0;
	var ref = this;

	if (mode === "normal") {
		rowMode = "Calculation";

		funlist.push(function (f) {
			addRow();
			ref.postMessage({
				count: tsv_rows.length
			});
		});

		if (iterators.di) {
			funlist.push(function (f) {
				for (var i = -1; i < 360; i++) {
					if (i === -1) {
						stick = {
							X: 0,
							Y: 0
						};
					}
					else {
						stick = AngleToStickPosition(ControllerList[0].r, i);
					}

					funlist[f - 1](f - 1);
				}
			});
		}

		if (iterators.kb_modifiers) {
			funlist.push(function (f) {
				r = 1;
				funlist[f - 1](f - 1);
				r = 0.85;
				funlist[f - 1](f - 1);
				r = 1.2;
				funlist[f - 1](f - 1);
			});
		}

		if (iterators.attacker_percent) {
			funlist.push(function (f) {
				for (attacker_percent = at_from; attacker_percent <= at_to; attacker_percent += at_step) {
					funlist[f - 1](f - 1);
				}
			});
		}

		//if (iterators.stock_dif) {
		//	funlist.push(function (f) {
		//		for (var i = 0; i < $scope.stock_values.length; i++) {
		//			stock_dif = $scope.stock_values[i];
		//			funlist[f - 1](f - 1);
		//		}
		//	});
		//}

		if (iterators.target_percent) {
			funlist.push(function (f) {
				for (target_percent = from; target_percent <= to; target_percent += step) {
					funlist[f - 1](f - 1);
				}
			});
		}

		if (iterators.charge) {
			funlist.push(function (f) {
				if (move.charge != null) {
					for (var i = move.charge.min; i <= move.charge.max; i++) {
						charge_frames = i;
						funlist[f - 1](f - 1);
					}
				} else {
					if (is_smash) {
						for (var i = 0; i <= 60; i++) {
							charge_frames = i;
							funlist[f - 1](f - 1);
						}
					} else {
						funlist[f - 1](f - 1);
					}
				}
			});
		}

		if (iterators.moves) {
			funlist.push(function (f) {
				for (var i = 1; i < moves.length; i++) {
					move = moves[i];
					if (move.wbkb > 0 && move.bkb == 0)
						continue; //Ignore if it's only FKB
					base_damage = move.base_damage;
					bkb = move.bkb;
					kbg = move.kbg;
					wbkb = move.wbkb;
					angle = move.angle;
					is_smash = move.smash_attack;
					preDamage = move.preDamage;
					counterMult = move.counterMult;
					unblockable = move.unblockable;
					windbox = move.windbox;
					shieldDamage = move.shieldDamage;
					hit_frame = move.hitboxActive[0].start;
					faf = move.faf;
					charge_frames = 0;
					charge_data = move.charge;
					if (attacker.name == "Mega Man" && move.name == "Fsmash") {
						megaman_fsmash = true;
					} else {
						megaman_fsmash = false;
					}
					funlist[f - 1](f - 1);
				}
			});
		}

		if (iterators.modifiers) {
			funlist.push(function (f) {
				if (target.modifiers.length > 0) {
					for (var i = 0; i < target.modifiers.length; i++) {
						target.modifier = target.modifiers[i];
						funlist[f - 1](f - 1);
					}
				} else {
					funlist[f - 1](f - 1);
				}
			});
		}

		if (iterators.targets) {
			funlist.push(function (f) {
				for (var i = 0; i < characters.length; i++) {
					target = characters[i];
					funlist[f - 1](f - 1);
				}
			});
		}
	}
	else if (mode === "koCalc") {
		if (ko_mode == "ko") {
			rowMode = "KO %";
			funlist.push(function (f) {
				addKORow();
				ref.postMessage({
					count: tsv_rows.length
				});
			});
		} else if (ko_mode == "best_di") {
			rowMode = "Best DI KO %";
			funlist.push(function (f) {
				addKOBestDIRow();
				ref.postMessage({
					count: tsv_rows.length
				});
			});
		}

		if (iterators.modifiers) {
			funlist.push(function (f) {
				if (target.modifiers.length > 0) {
					for (var i = 0; i < target.modifiers.length; i++) {
						target.modifier = target.modifiers[i];
						funlist[f - 1](f - 1);
					}
				} else {
					funlist[f - 1](f - 1);
				}
			});
		}

		if (iterators.targets) {
			funlist.push(function (f) {
				for (var i = 0; i < characters.length; i++) {
					target = characters[i];
					funlist[f - 1](f - 1);
				}
			});
		}
	
	}

	
	var next = funlist.length - 1;
	if (next != -1) {
		funlist[next](next);
	}

	this.postMessage({
		mode: mode,
		ko_mode: ko_mode,
		count: tsv_rows.length,
		rows: tsv_rows
	});
}
