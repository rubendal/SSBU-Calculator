var parameters = {
	di: 0.17,
	lsi_max: 1.095,
	lsi_min: 0.92,
	decay: 0.051,
	gravity: {
		mult: 5,
		constant: 0.075
	},
	shorthop_aerial: 0.85,
	bounce: 0.8,
	crouch_cancelling: 0.85,
	crouch_hitlag: 0.67,
	interrupted_smash: 1, //Removed
	buried_kb_mult: 1, //Removed
	buried_kb_threshold: 90,
	hitstun: 0.4,
	launch_speed: 0.03,
	tumble_threshold: 32,
	hitlag: {
		mult: 0.65,
		constant: 6,
		parryConstant: 14,
		attachedParryConstant: 11,
		indirectHitboxConstant: 8,
		parryMax: 30
	},
	hitstunCancel: {
		frames: {
			aerial: 45,
			airdodge: 40
		},
		launchSpeed: {
			aerial: 2,
			airdodge: 2.5
		}
	},
	paralyzer: {
		constant: 1,
		mult: 1,
		max: 90
	},
	shield: {
		projectile: 0.29,
		perfectShield: 1,
		mult: 0.8,
		constant: 3,
		aerial: 0.33,
		grounded: 0.725
	}
};

function TrainingKB(percent, base_damage, damage, weight, kbg, bkb, gravity, fall_speed, r, angle, in_air, windbox, electric, set_weight, stick, dddinhale, launch_rate) {
	return new Knockback((((((((percent + damage) / 10) + (((percent + damage) * base_damage) / 20)) * (200 / (weight + 100)) * 1.4 * (dddinhale ? 0.25 : 1)) + 18) * (kbg / 100)) + bkb) * r, angle, gravity, fall_speed, in_air, windbox, electric, percent + damage, set_weight, stick, 1);
}

function Rage(percent) {
	if (percent <= 35) {
		return 1;
	}
	if (percent >= 150) {
		return 1.1;
	}
	return 1 + (percent - 35) * (1.1 - 1) / (150 - 35);
}

function Aura(percent, stock_dif, game_format) {
	if (stock_dif == undefined) {
		stock_dif = "0";
	}
	if (game_format == undefined) {
		game_format = "Singles";
	}
	var aura = 0;
	if (percent <= 65) {
		aura = (66 + ((34.0 / 65.0) * percent)) / 100;
	} else if (percent <= 190) {
		aura = (100 + ((67.0 / 125.0) * (percent - 65))) / 100;
	} else {
		aura = 1.67;
	}
	//1v1 Rank multipliers by Meshima: https://twitter.com/Meshima_/status/1146757439112355840
	var m = 1;
	var min = 0.6;
	var max = 1.67;
	if (stock_dif == "0") {
		return aura;
	}
	if (game_format == "Singles") {
		switch (stock_dif) {
			case "-2":
				m = 1.4;
				min = 0.924;
				max = 1.8;
				break;
			case "-1":
				m = 1.2;
				min = 0.792;
				max = 1.8;
				break;
			case "+1":
				m = 0.915;
				max = 1.5281;
				min = 0.6039;
				break;
			case "+2":
				m = 0.83;
				max = 1.3861;
				break;
		}
	} else {
		switch (stock_dif) {
			case "-2":
				m = 1.8;
				min = 1.32;
				max = 1.8;
				break;
			case "-1":
				m = 1.4;
				min = 0.88;
				max = 1.8;
				break;
			case "+1":
				m = 0.83;
				max = 1.3861;
				break;
			case "+2":
				m = 0.66;
				max = 1.1022;
				break;
		}
	}
	aura *= m;
	if (aura < min) {
		aura = min;
	} else if (aura > max) {
		aura = max;
	}
	return aura;
}

function StaleNegation(queue, shieldQueue, ignoreStale) {
	if (ignoreStale) {
		return 1;
	}
	var S = [0.09, 0.08545, 0.07635, 0.0679, 0.05945, 0.05035, 0.04255, 0.03345, 0.025];
	var s = 1;
	for (var i = 0; i < queue.length; i++) {
		if (queue[i]) {
			if (!shieldQueue[i])
				s -= S[i];
			else
				s -= S[i] * 0.85;
		}
	}
	if (s == 1) {
		return 1.05;
	}
	return s;
}

function TumbleFSM(kb) {
	var hitstun = (kb * parameters.hitstun);
	if (hitstun < 0) {
		return 0;
	}
	var fsm = Math.floor(hitstun / 10) - 2;
	if (fsm >= 2) {
		return fsm - 1;
	}
	return 0;
}

function Hitstun(kb, windbox, electric, ignoreReeling) {
	if (windbox) {
		return 0;
	}
	var hitstun = (kb * parameters.hitstun);
	if (hitstun < 0) {
		return 0;
	}

	//Electric moves deal +1 hitstun https://twitter.com/Meshima_/status/786780420817899521 (Not sure if they do on Ultimate but leaving this here for now)
	//if (electric) {
	//	hitstun++;
	//}

	if (hitstun < 5)
		hitstun = 5;

	return Math.floor(hitstun) - 1;
}

//Test function
function HitstunWithFSM(kb, windbox, electric) {
	if (windbox) {
		return 0;
	}
	var hitstun = (kb * parameters.hitstun);
	if (hitstun < 0) {
		return 0;
	}

	//var fsm = TumbleFSM(kb);
	//if (fsm >= 1) {
	//	hitstun -= 5 * fsm;
	//}

	////Electric moves deal +1 hitstun https://twitter.com/Meshima_/status/786780420817899521 (Not sure if they do on Ultimate but leaving this here for now)
	//if (electric) {
	//	hitstun++;
	//}

	return Math.floor(hitstun) - 1;
}

function S4Hitstun(kb, windbox, electric, ignoreReeling) {
	if (windbox) {
		return 0;
	}
	var hitstun = Math.floor(kb * parameters.hitstun) - 1;
	if (!ignoreReeling) {
		if (kb * parameters.hitstun >= parameters.tumble_threshold) {
			hitstun++;
		}
	}
	//Electric moves deal +1 hitstun https://twitter.com/Meshima_/status/786780420817899521
	if (electric) {
		hitstun++;
	}
	if (hitstun < 0) {
		return 0;
	}
	return hitstun;
}

function LumaHitstun(kb, windbox, electric) {
	if (windbox) {
		return 0;
	}
	var hitstun = Math.floor(kb * 0.27) - 1;
	//Electric moves deal +1 hitstun https://twitter.com/Meshima_/status/786780420817899521
	if (electric) {
		hitstun++;
	}
	if (hitstun < 0) {
		return 0;
	}
	return hitstun;
}

function SakuraiAngle(kb, aerial) {
	if (aerial) {
		return (0.663225 * 180 / Math.PI);
	}
	if (kb < 60) {
		return 0;
	}
	if (kb >= 88) {
		return 38;
	}
	return Math.min((kb - 60) / (88 - 60) * 38 + 1, 38); //https://twitter.com/BenArthur_7/status/956316733597503488
}

function VSKB(percent, base_damage, damage, weight, kbg, bkb, gravity, fall_speed, r, queue, shieldQueue, ignoreStale, attacker_percent, angle, in_air, windbox, electric, set_weight, stick, dddinhale, launch_rate) {
	var s = StaleNegation(queue, shieldQueue, ignoreStale);
	return new Knockback((((((((percent + damage * s) / 10 + (((percent + damage * s) * base_damage * (1 - (1 - s) * 0.3)) / 20)) * 1.4 * (dddinhale ? 0.25 : 1) * (200 / (weight + 100))) + 18) * (kbg / 100)) + bkb)) * (r * (!ignoreStale ? Rage(attacker_percent) : 1)), angle, gravity, fall_speed, in_air, windbox, electric, percent + (damage * s), set_weight, stick, launch_rate);
}

function WeightBasedKB(weight, bkb, wbkb, kbg, gravity, fall_speed, r, target_percent, damage, attacker_percent, angle, in_air, windbox, electric, set_weight, stick, dddinhale, launch_rate) {
	return new Knockback((((((1 + (wbkb / 2)) * (200 / (weight + 100)) * 1.4 * (dddinhale ? 0.25 : 1)) + 18) * (kbg / 100)) + bkb) * (r), angle, gravity, fall_speed, in_air, windbox, electric, target_percent + damage, set_weight, stick, launch_rate);
}

function StaleDamage(base_damage, queue, shieldQueue, ignoreStale) {
	return base_damage * StaleNegation(queue, shieldQueue, ignoreStale);
}

function FirstActionableFrame(kb, windbox, electric, ignoreReeling) {
	var hitstun = Hitstun(kb, windbox, electric, ignoreReeling);
	if (hitstun == 0) {
		return 0;
	}
	return hitstun + 1;
}

function HitstunCancel(kb, launch_speed_x, launch_speed_y, angle, windbox, electric, addHitstun) {
	var res = { 'airdodge': 0, 'aerial': 0 };
	if (windbox) {
		return res;
	}
	var hitstun = Math.max(0, Hitstun(kb, windbox, electric) + addHitstun);
	var res = { 'airdodge': hitstun + 1, 'aerial': hitstun + 1 };
	var airdodge = false;
	var aerial = false;
	var launch_speed = { 'x': Math.abs(launch_speed_x), 'y': Math.abs(launch_speed_y) };
	var decay = { 'x': Math.abs(parameters.decay * Math.cos(angle * Math.PI / 180)), 'y': Math.abs(parameters.decay * Math.sin(angle * Math.PI / 180)) };
	var ec = electric ? 1 : 0;
	for (var i = 0; i < hitstun; i++) {
		if (launch_speed.x != 0) {
			var x_dir = launch_speed.x / Math.abs(launch_speed.x);
			launch_speed.x -= decay.x;
			if (x_dir == -1 && launch_speed.x > 0) {
				launch_speed.x = 0;
			} else if (x_dir == 1 && launch_speed.x < 0) {
				launch_speed.x = 0;
			}
		}
		if (launch_speed.y != 0) {
			var y_dir = launch_speed.y / Math.abs(launch_speed.y);
			launch_speed.y -= decay.y;
			if (y_dir == -1 && launch_speed.y > 0) {
				launch_speed.y = 0;
			} else if (y_dir == 1 && launch_speed.y < 0) {
				launch_speed.y = 0;
			}
		}
		var lc = Math.sqrt(Math.pow(launch_speed.x, 2) + Math.pow(launch_speed.y, 2));
		if (lc < parameters.hitstunCancel.launchSpeed.airdodge && !airdodge) {
			airdodge = true;
			res.airdodge = Math.max(i + 2, parameters.hitstunCancel.frames.airdodge + 1 + ec);
		}
		if (lc < parameters.hitstunCancel.launchSpeed.aerial && !aerial) {
			aerial = true;
			res.aerial = Math.max(i + 2, parameters.hitstunCancel.frames.aerial + 1 + ec);
		}
	}

	if (res.airdodge > hitstun) {
		res.airdodge = hitstun + 1;
	}
	if (res.aerial > hitstun) {
		res.aerial = hitstun + 1;
	}

	return res;
}

function Hitlag(base_damage, hitlag_mult, electric, crouch, is_projectile, players) {
	var electric_mult = 1;
	if (electric) {
		electric_mult = 1.5;
	}
	var player_mult = 1;
	if (players) {
		var p = [1, 0.925, 0.862, 0.8116, 0.77464, 0.752464, 0.75];
		player_mult = p[players - 2];
	}
	var h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant ) * electric_mult) * hitlag_mult) * crouch);// - 1;
	if (h > 30) {
		return 30;
	}
	if (h < 0) {
		return 0;
	}
	return h;
}

function ParryHitlag(base_damage, hitlag_mult, electric, is_projectile, attached, direct, players) {
	var electric_mult = 1;
	if (electric) {
		electric_mult = 1.5;
	}
	var player_mult = 1;
	if (players) {
		var p = [1, 0.925, 0.862, 0.8116, 0.77464, 0.752464, 0.75];
		player_mult = p[players - 2];
	}
	var h = 0;
	if (!is_projectile && direct)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.parryConstant);// - 1;
	else if (!is_projectile && !direct)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult));// - 1;
	else if (is_projectile && !direct && !attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult));
	else if (is_projectile && !direct && attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult));// - 1;
	else if (is_projectile && direct && !attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.directWeaponConstant);// - 1;
	else if (is_projectile && direct && attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.directWeaponConstant);// - 1;

	if (h > parameters.hitlag.parryMax + 2) {
		return parameters.hitlag.parryMax + 2;
	}
	if (h < 0) {
		return 0;
	}


	return h;
}

function VSParryHitlag(base_damage, hitlag_mult, electric, is_projectile, attached, direct, players) {
	var electric_mult = 1;
	if (electric) {
		electric_mult = 1.5;
	}
	var player_mult = 1;
	if (players) {
		var p = [1, 0.925, 0.862, 0.8116, 0.77464, 0.752464, 0.75];
		player_mult = p[players - 2];
	}
	var h = 0;
	if (!is_projectile && direct)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.parryConstant);// - 1;
	else if (!is_projectile && !direct)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult));// - 1;
	else if (is_projectile && !direct && !attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult)) + 3;
	else if (is_projectile && !direct && attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult));// - 1;
	else if (is_projectile && direct && !attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.directWeaponConstant);// - 1;
	else if (is_projectile && direct && attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.directWeaponConstant);// - 1;

	if (h > parameters.hitlag.parryMax + 2) {
		return parameters.hitlag.parryMax + 2;
	}
	if (h < 0) {
		return 0;
	}


	return h;
}

function AttackerParryHitlag(base_damage, hitlag_mult, electric, is_projectile, attached, direct, players) {
	var electric_mult = 1;
	if (electric) {
		electric_mult = 1.5;
	}
	var player_mult = 1;
	if (players) {
		var p = [1, 0.925, 0.862, 0.8116, 0.77464, 0.752464, 0.75];
		player_mult = p[players - 2];
	}
	var h = 0;
	if (!is_projectile && direct)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.parryConstant);// - 1;
	else if (!is_projectile && !direct)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult));// - 1;
	else if (is_projectile && !direct && !attached)
		h = 0;
	else if (is_projectile && !direct && attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult));// - 1;
	else if (is_projectile && direct && !attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.directWeaponConstant);// - 1;
	else if (is_projectile && direct && attached)
		h = Math.floor((((base_damage * parameters.hitlag.mult * player_mult + parameters.hitlag.constant) * electric_mult) * hitlag_mult * 0.6) + parameters.hitlag.directWeaponConstant);// - 1;

	if (h > parameters.hitlag.parryMax + 2) {
		return parameters.hitlag.parryMax + 2;
	}
	if (h <= 0) {
		return 0;
	}
	return h + 3;
}

function ChargeSmash(base_damage, frames, megaman_fsmash, witch_time, maxSmashChargeMult) {
	var mult = maxSmashChargeMult == 1.4 ? 1 : 0.5;
	if (megaman_fsmash) {
		return base_damage * (1 + (frames * mult / 86));
	}
	if (witch_time) {
		return base_damage * (1 + (frames * mult * 0.5 / 150));
	}
	return base_damage * (1 + (frames * mult / 150));
}

function ChargeSmashMultiplier(frames, megaman_fsmash, witch_time, maxSmashChargeMult) {
	var mult = maxSmashChargeMult == 1.4 ? 1 : 0.5;
	if (megaman_fsmash) {
		return (1 + (frames * mult / 86));
	}
	if (witch_time) {
		return (1 + (frames * mult * 0.5 / 150));
	}
	return (1 + (frames * mult / 150));
}

function ShieldStunMultiplier(multiplier, is_projectile, is_smash, is_aerial) {
	var projectileMult = is_projectile ? parameters.shield.projectile : 1;
	var groundedMult = is_smash ? parameters.shield.grounded : 1;
	var aerialMult = is_aerial ? parameters.shield.aerial : 1;
	var mult = 1;
	if (is_projectile)
		mult = projectileMult;
	else if (is_aerial)
		mult = aerialMult;
	else if (is_smash)
		mult = groundedMult;
	mult *= multiplier;

	return mult;
}

function ShieldStun(damage, multiplier, is_projectile, perfectShield, is_smash, is_aerial) {
	if (damage == 0)
		return 0;


	var projectileMult = is_projectile ? parameters.shield.projectile : 1;
	var groundedMult = is_smash ? parameters.shield.grounded : 1;
	var perfectshieldMult = perfectShield ? parameters.shield.perfectShield : 1;
	var aerialMult = is_aerial ? parameters.shield.aerial : 1;
	var mult = 1;
	if (is_projectile)
		mult = projectileMult;
	else if (is_aerial)
		mult = aerialMult;
	else if (is_smash)
		mult = groundedMult;
	mult *= multiplier;
	return Math.floor((damage * parameters.shield.mult * mult) + parameters.shield.constant) - 1;
}

function ShieldHitlag(damage, hitlag, electric, perfectShield, is_projectile, attached, direct) {
	if (hitlag < 1)
		hitlag = 1;
	hitlag *= 0.67;
	if (damage == 0)
		return 0;
	if (perfectShield)
		return ParryHitlag(damage, hitlag, electric, is_projectile, attached, direct) - 1;
	return Hitlag(damage, hitlag, electric, 1, is_projectile);
}

function VSShieldHitlag(damage, hitlag, electric, perfectShield, is_projectile, attached, direct) {
	if (hitlag < 1)
		hitlag = 1;
	hitlag *= 0.67;
	if (damage == 0)
		return 0;
	if (perfectShield)
		return VSParryHitlag(damage, hitlag, electric, is_projectile, attached, direct) - 1;
	return Hitlag(damage, hitlag, electric, 1, is_projectile);
}

function AttackerShieldHitlag(damage, hitlag, electric, perfectShield, is_projectile, attached, direct) {
	if (is_projectile && !attached)
		return 0;

	if (hitlag < 1)
		hitlag = 1;
	hitlag *= 0.67;
	if (damage == 0)
		return 0;
	if (perfectShield)
		return AttackerParryHitlag(damage, hitlag, electric, is_projectile, attached, direct) - 1;
	return Hitlag(damage, hitlag, electric, 1, is_projectile);
}

function ShieldAdvantage(damage, shieldstunMult, hitlag, hitframe, FAF, is_projectile, attached, direct, electric, perfectshield, is_smash, is_aerial) {
	return hitframe - (FAF - 1) + ShieldStun(damage, shieldstunMult, is_projectile, perfectshield, is_smash, is_aerial) + ShieldHitlag(damage, hitlag, electric, perfectshield, is_projectile, attached, direct) - (is_projectile && perfectshield ? 2 : (is_projectile ? 1 : AttackerShieldHitlag(damage, hitlag, electric, perfectshield, is_projectile, attached, direct)));
}

function VSShieldAdvantage(damage, shieldstunMult, hitlag, hitframe, FAF, is_projectile, attached, direct, electric, perfectshield, is_smash, is_aerial) {
	return hitframe - (FAF - 1) + ShieldStun(damage, shieldstunMult, is_projectile, perfectshield, is_smash, is_aerial) + VSShieldHitlag(damage, hitlag, electric, perfectshield, is_projectile, attached, direct) - (is_projectile && perfectshield ? 2 : (is_projectile ? 1 : AttackerShieldHitlag(damage, hitlag, electric, perfectshield, is_projectile, attached, direct)));
}

//Formula by Arthur https://twitter.com/BenArthur_7/status/926918804466225152
function ShieldPushback(damage, projectile, perfectShield, is_smash, is_aerial) {
	var projectileMult = projectile ? parameters.shield.projectile : 1;
	var perfectshieldMult = perfectShield ? parameters.shield.perfectShield : 1;
	var aerialMult = is_aerial ? parameters.shield.aerial : 1;
	var groundedMult = is_smash ? parameters.shield.grounded : 1;
	var perfectshieldMult2 = perfectShield ? 0.15 : 1;

	var pushback = ((damage * parameters.shield.mult * projectileMult * perfectshieldMult * groundedMult * aerialMult) + parameters.shield.constant) * 0.09 * perfectshieldMult2;
	if (pushback > 1.3)
		pushback = 1.3;

	return pushback;
}

function AttackerShieldPushback(damage, projectile = false) {
	if (projectile)
		return 0;

	return (damage * 0.04) + 0.025;
}

function DIAngleDeadzones(angle) {
	var deadzone = 11;
	if (angle <= deadzone || angle >= 360 - deadzone)
		angle = 0;
	else if (angle <= 90 + deadzone && angle >= 90 - deadzone)
		angle = 90;
	else if (angle <= 180 + deadzone && angle >= 180 - deadzone)
		angle = 180;
	else if (angle <= 270 + deadzone && angle >= 270 - deadzone)
		angle = 270;
	return angle;
}

function StickSensibilityPosition(value) {
	if (value < 24 && value > -24)
		return 0;
	if (value > 128)
		return 1;
	if (value < -128)
		return -1;
	return value / 128;
}

function StickSensibility(value) {
	if (value < 24 && value > -24)
		return 0;
	if (value > 120)
		return 1;
	if (value < -120)
		return -1;
	return value / 120;
}

function DI(stick, launchSpeed, totalLaunchSpeed) {
	if (totalLaunchSpeed < 0.00001) //There is an if on MSC but it shouldn't happen since it requires tumble for DI to work
		return Math.atan2(launchSpeed.Y, launchSpeed.X) * 180 / Math.PI;

	if (Math.abs(Math.atan2(launchSpeed.Y, launchSpeed.X)) < parameters.di) //Cannot DI if launch angle is less than DI angle change param
		return Math.atan2(launchSpeed.Y, launchSpeed.X) * 180 / Math.PI;

	var X = StickSensibility(stick.X);
	var Y = StickSensibility(stick.Y);

	var check = Y * launchSpeed.X - X * launchSpeed.Y < 0;

	var variation = Math.abs(X * launchSpeed.Y - Y * launchSpeed.X) / totalLaunchSpeed;

	var di = parameters.di * variation;

	var angle = 0;

	if (check)
		angle = (Math.atan2(launchSpeed.Y, launchSpeed.X) - di) * 180 / Math.PI;
	else
		angle = (Math.atan2(launchSpeed.Y, launchSpeed.X) + di) * 180 / Math.PI;

	if (angle < 0)
		angle += 360;

	return angle;
}

function LSI(stickY, launch_angle) {
	if (launch_angle > 65 && launch_angle < 115)
		return 1;
	if (launch_angle > 245 && launch_angle < 295)
		return 1;

	var Y = StickSensibility(stickY);
	if (Y >= 0)
		return 1 + (parameters.lsi_max - 1) * Y;
	return 1 - (1 - parameters.lsi_min) * -Y;
}

function LaunchSpeed(kb) {
	return kb * parameters.launch_speed;
}

function TotalLaunchSpeed(x_speed, y_speed) {
	return Math.sqrt(Math.pow(x_speed, 2) + Math.pow(y_speed, 2));
}

function HorizontalSpeedLimit(speed) {
	return Math.max(-100, Math.min(speed, 100));
}

function HorizontalGroundedSpeedLimit(speed) {
	return Math.max(-17, Math.min(speed, 17));
}

function VerticalSpeedLimit(speed) {
	return Math.max(-100, Math.min(speed, 10));
}

function HitAdvantage(hitstun, hitframe, faf, paralysis) {
	return hitstun - (faf - (hitframe + 1)) + paralysis;
}

//Formula by Arthur https://docs.google.com/spreadsheets/d/1E3kEQUOZy1C-kSzcoOSKay5gDqpo-ZZgq-8G511Bmw4/edit#gid=1810400970
function WeightDependentThrowFrame(frame, weight, animationLength) {
	return Math.ceil((frame - 1) * (1 + (26 / (animationLength - 1)) * (weight * 0.01 - 1)) + 1);
}

//Effect formulas
function ParalyzerHitlag(base_damage, hitlag_mult, crouch) {
	var h = Math.floor(((base_damage * parameters.hitlag.mult + parameters.hitlag.constant)) * hitlag_mult * crouch);
	if (h < 0) {
		return 0;
	}
	return h;
}

function ParalysisTime(kb, base_damage, hitlag_mult, crouch) {
	//var p = Math.floor((((base_damage * parameters.hitlag.mult * parameters.paralyzer.mult + parameters.hitlag.constant)) * hitlag_mult) * crouch * kb);
	var p = Math.floor(kb * hitlag_mult * parameters.paralyzer.mult) + parameters.paralyzer.constant;

	if (p > parameters.paralyzer.max) {
		return parameters.paralyzer.max;
	}
	if (p < 0) {
		return 0;
	}

	return p;
}

function FlowerTime(damage) {
	return Math.min(Math.floor(20 + (damage * 40)), 3000);
}

function BuriedTime(percent, damage, kb, stock_dif) {
	if (kb == 0)
		return 0;

	if (stock_dif === undefined)
		stock_dif = '0';
	var rank = 0;
	var handi = 0;
	switch (stock_dif) {
		case "-2":
			handi = 0.375;
			break;
		case "-1":
			handi = 0.25;
			break;
		case "+1":
			rank = 1.5;
			break;
		case "+2":
			rank = 1.8;
			break;
	}

	return Math.ceil(10 + (30 * handi) + (15 * (3 - rank)) + (Math.min(percent + damage, 999) * 0.5) + (kb * 1.5));
}

//Sleep time formula by Meshima https://twitter.com/Meshima_/status/908375931101650945
function SleepTime(percent, damage, kb, stock_dif) {
	if (kb == 0)
		return 0;

	if (stock_dif === undefined)
		stock_dif = '0';
	var rank = 0;
	var handi = 1;
	switch (stock_dif) {
		case "-2":
			handi = 1.45;
			break;
		case "-1":
			handi = 1.225;
			break;
		case "+1":
			handi = 0.5;
			rank = 0.32;
			break;
		case "+2":
			handi = 0.25;
			rank = 0.4;
			break;
	}

	return Math.ceil(10 + (30 * handi) + (10 * (3 - rank)) + (Math.min(percent + damage, 999) * 1) + (kb * 25));
}

//Freeze time formula by Meshima https://twitter.com/Meshima_/status/908383003675471872
function FreezeTime(damage, kb) {
	if (kb < 52.5)
		return 0;
	return Math.ceil(damage * 12);
}

//Stun time formula by Meshima https://twitter.com/Meshima_/status/908383383486578688
function StunTime(kb) {
	return Math.ceil(121 + kb);
}

//Disable time formula by Meshima https://twitter.com/Meshima_/status/908383535265804288
function DisableTime(percent, damage, kb, stock_dif) {
	if (kb == 0)
		return 0;

	if (stock_dif === undefined)
		stock_dif = '0';
	var rank = 0;
	var handi = 0;
	switch (stock_dif) {
		case "-2":
			handi = 0.45;
			break;
		case "-1":
			handi = 0.2;
			break;
		case "+1":
			rank = 1.2;
			break;
		case "+2":
			rank = 1.4;
			break;
	}

	return Math.ceil((16 * handi) + (16 * (3 - rank)) + kb + (Math.min(percent + damage, 999) * 1.3));
}

function PinnedTime(percent) {
	return Math.ceil(280 + (percent * 1.5));
}

//Stick gate formulas

function InsideStickGate(r, X, Y) {
	var d = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
	return d <= r;
}

function GetAngle(X, Y) {
	var angle = Math.atan2(Y, X) * 180 / Math.PI;
	if (angle < 0)
		angle += 360;

	return angle;
}

function AngleToStickPosition(r, angle) {
	if (r != 0) {
		var x = Math.floor(r * Math.cos(angle * Math.PI / 180));
		var y = Math.floor(r * Math.sin(angle * Math.PI / 180));

		if (x < -127)
			x = -127;
		if (y < -127)
			y = -127;
		if (x > 128)
			x = 128;
		if (y > 128)
			y = 128;

		return { X: x, Y: y };
	} else {

		var x = Math.floor(128 * Math.cos(angle * Math.PI / 180));
		var y = Math.floor(128 * Math.sin(angle * Math.PI / 180));

		if (x < -24)
			x = -127;
		else if (x > 24)
			x = 128;
		else
			x = 0;

		if (y < -24)
			y = -127;
		else if (y > 24)
			y = 128;
		else
			y = 0;
		return { X: x, Y: y };
	}

}

function Lerp(x, x2, y) {
	return x + ((x2 - x) * y);
}

function lerp(min, max, x, xMax) {
	return (1 - (x / xMax)) * min + (x / xMax) * max;
}

function InkDamageMult(ink) {
	if (ink <= 0)
		return 1;

	if (ink >= 180)
		ink = 180;

	return lerp(1, 1.5, ink, 180);
}

//Launch visualizer formulas

function InvertXAngle(angle) {
	if (angle < 180) {
		return 180 - angle;
	} else {
		return 360 - (angle - 180);
	}
}

function InvertYAngle(angle) {
	if (angle < 180) {
		return (180 - angle) + 180;
	} else {
		return 180 - (angle - 180);
	}
}

function InterpolatedAngle(a, b) {
	var t = Math.max(a, b) - Math.min(a, b) % 360;
	return Math.floor(Math.min(a, b) + ((((2 * t) % 360) - t) * 0.5));

}

function Magnitude(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

//Get the distance between a point and a line
function LineDistance(point, line) {
	return Math.abs(((line[1][1] - line[0][1]) * point[0]) - ((line[1][0] - line[0][0]) * point[1]) + (line[1][0] * line[0][1]) - (line[1][1] * line[0][0])) / Math.sqrt(Math.pow(line[1][1] - line[0][1], 2) + Math.pow(line[1][0] - line[0][0], 2));
}

//Get the closest line from a point
function closestLine(point, surface) {
	var x = point[0];
	var y = point[1];

	var line = { i: -1, line: [] };
	var min_distance = null;

	for (var i = 0; i < surface.length - 1; i++) {
		var x1 = surface[i][0];
		var x2 = surface[i + 1][0];
		var y1 = surface[i][1];
		var y2 = surface[i + 1][1];
		var distance = Math.abs(((y2 - y1) * x) - ((x2 - x1) * y) + (x2 * y1) - (y2 * x1)) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
		if (min_distance == null) {
			line.i = i;
			min_distance = distance;
			line.line = [[x1, y1], [x2, y2]];
		} else {
			if (distance < min_distance) {
				min_distance = distance;
				line.i = i;
				line.line = [[x1, y1], [x2, y2]];
			}
		}
	}
	return line;
}

function LineMidPoint(p1, p2) {
	return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function LineLength(p1, p2) {
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

var LineTypes = {
	FLOOR: 1,
	WALL: 2,
	CEILING: 3
};

//Get if line is floor, wall or ceiling
function GetLineType(material) {

	if (!material.ceiling && !material.wall) {
		return LineTypes.FLOOR;
	}
	if (material.wall) {
		return LineTypes.WALL;
	}
	return LineTypes.CEILING;
}

//Find the point where two lines intersect when they expand through infinity
function IntersectionPoint(line_a, line_b) {
	var x1 = line_a[0][0];
	var x2 = line_a[1][0];
	var y1 = line_a[0][1];
	var y2 = line_a[1][1];
	var x3 = line_b[0][0];
	var x4 = line_b[1][0];
	var y3 = line_b[0][1];
	var y4 = line_b[1][1];
	var d = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
	var x = (((x1 * y2) - (y1 * x2)) * (x3 - x4)) - ((x1 - x2) * ((x3 * y4) - (y3 * x4)));
	var y = (((x1 * y2) - (y1 * x2)) * (y3 - y4)) - ((y1 - y2) * ((x3 * y4) - (y3 * x4)));
	if (d != 0) {
		var xd = x / d;
		var yd = y / d;
		if (xd == -0)
			xd = 0;
		if (yd == -0)
			yd = 0;
		return [+xd.toFixed(6), +yd.toFixed(6)];
	}
	return null;
}

//Get if a point is on a line segment given by two points
function PointInLine(point, line) {
	var x = point[0];
	var y = point[1];
	var x1 = line[0][0];
	var x2 = line[1][0];
	var y1 = line[0][1];
	var y2 = line[1][1];

	var hx = Math.max(x1, x2);
	var lx = Math.min(x1, x2);
	var hy = Math.max(y1, y2);
	var ly = Math.min(y1, y2);

	var distance = Math.abs(((y2 - y1) * x) - ((x2 - x1) * y) + (x2 * y1) - (y2 * x1)) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
	if (distance < 0.001) {
		//lx,ly - 0.001, hx,hy + 0.001 for precision loss cases
		return (lx - 0.001) <= x && x <= (hx + 0.001) && (ly - 0.001) <= y && y <= (hy + 0.001);
	}
	return false;
}

function GetPointFromSlide(point, speed, angle, line) {
	var x = point[0] + (Math.abs(speed.x) * Math.cos(angle * Math.PI / 180));
	var y = point[1] + (Math.abs(speed.y) * Math.sin(angle * Math.PI / 180));
	return [x, y];

}

//Used in sliding, to prevent float precision errors or random js stuff get the closest point of a line near to another point
function ClosestPointToLine(point, line) {
	var a = line[0];
	var b = line[1];

	var ap = [point[0] - a[0], point[1] - a[1]];
	var ab = [b[0] - a[0], b[1] - a[1]];

	var p = (ap[0] * ab[0]) + (ap[1] * ab[1]);
	var m = (Math.pow(ab[0], 2) + Math.pow(ab[1], 2));

	var distance = p / m;

	if (distance == -0) {
		distance = 0;
	}

	return [a[0] + (ab[0] * distance), a[1] + (ab[1] * distance)];

	//if (distance < 0)
	//	return a;
	//else if (distance > 1)
	//	return b;
	//else
	//	return [a[0] + (ab[0] * distance), a[1] + (ab[1] * distance)];
}

//Check if launch angle goes to the opposite direction of the line normal vector angle, returns false when the line is on the same direction or parallel
function LineCollision(launch_angle, line_angle) {
	var a = Math.cos(Math.abs(line_angle - launch_angle) * Math.PI / 180);
	if (a > 0) {
		return false;
	}
	return true;
}

//Check if launch angle goes to the same direction of the line normal vector angle
function LinePassthroughCollision(launch_angle, line_angle) {
	var a = Math.cos(Math.abs(line_angle - launch_angle) * Math.PI / 180);
	if (a <= 0) {
		return false;
	}
	return true;
}

//Get all lines that intersect with a line
function IntersectionLines(line, vertex) {
	var l = [];

	for (var i = 0; i < vertex.length - 1; i++) {
		var stageLine = [vertex[i], vertex[i + 1]];
		var p = IntersectionPoint(line, stageLine);
		if (p != null) {
			var f = PointInLine(p, line) && PointInLine(p, stageLine);
			if (f) {
				l.push({ "i": i, "point": p, "line": stageLine });
			}
		}
	}

	return l;
}

//Get line angle given by two points
function LineAngle(line) {
	return ((Math.atan2(line[1][1] - line[0][1], line[1][0] - line[0][0]) * 180 / Math.PI) + 360) % 360;
}

function colorLerp(min, max, x, xMin, xMax) {
	if (x <= xMin)
		return min;
	if (x >= xMax)
		return max;
	return (1 - ((x - xMin) / (xMax - xMin))) * min + ((x - xMin) / (xMax - xMin)) * max;
}

//Damage speed up
//Thanks to Arthur for passing the lua2cpp::L2CFighterCommon::FighterStatusDamage_init_damage_speed_up function into code
//https://gist.github.com/BenHall-7/fb584467c316739f123cd32994b61336
function GetSpeedUpFAF(faf, angle) {
	var damage_reaction_frame = faf;
	var damage_reaction_frame_last = faf;
	if (angle > 180)
		angle -= 360;

	var val = InitDamageSpeedUp(damage_reaction_frame_last, Math.abs(angle), true);

	return ReactionFrameMulSpeedUp(damage_reaction_frame, damage_reaction_frame_last, val.damage_speed_up_max_mag, val.damage_speed_up);
}

function InitDamageSpeedUp(reaction_frame_last, angle, arg3) {
	var damage_fly_speed_up_reaction_frame_min = 30;
	var damage_fly_speed_up_reaction_frame_max = 80;

	var damage_fly_speed_up_max_mag = 6;
	var damage_fly_speed_up_angle_base = 90;
	var damage_fly_speed_up_min_max_angle = 45;
	var damage_fly_speed_up_angle_rate = 100;

	var damage_speed_up_max_mag = 0;
	var damage_speed_up = false;

	if (CheckDamageSpeedUp(reaction_frame_last) || arg3) { //arg3 is probably "is not FKB" since it doesn't use it on hitboxes with FKB
		var reaction_frame_min = damage_fly_speed_up_reaction_frame_min;
		var reaction_frame_max = damage_fly_speed_up_reaction_frame_max;

		var mag_ratio = (reaction_frame_last - reaction_frame_min) / (reaction_frame_max - reaction_frame_min);

		if (mag_ratio < 0)
			mag_ratio = 0;
		else if (mag_ratio > 1)
			mag_ratio = 1;
		//0x000cde08
		var mag = Lerp(1, damage_fly_speed_up_max_mag, mag_ratio);

		var angle_base = damage_fly_speed_up_angle_base;
		var angle_lw = angle_base - damage_fly_speed_up_min_max_angle;
		var angle_hi = angle_base + damage_fly_speed_up_min_max_angle;

		var angle_ratio;

		if (angle > angle_lw && angle <= angle_base) {
			//0x000ce024
			angle_ratio = (angle - angle_lw) / (angle_base - angle_lw);
			if (angle_ratio < 0)
				angle_ratio = 0;
			else if (angle_ratio > 1)
				angle_ratio = 1;
			//0x000ce184
			mag *= Lerp(1, damage_fly_speed_up_angle_rate * 0.01, angle_ratio);
		}
		else if (angle > angle_base && angle <= angle_hi) {
			//0x000ce0ac
			angle_ratio = 1 - (angle - angle_base) / (angle_hi - angle_base);
			if (angle_ratio < 0)
				angle_ratio = 0;
			else if (angle_ratio > 1)
				angle_ratio = 1;
			//0x000ce2d0
			mag *= Lerp(1, damage_fly_speed_up_angle_rate * 0.01, angle_ratio);
		}
		damage_speed_up = true;
		damage_speed_up_max_mag = mag + 0;
	}
	else {
		//0x000cdd6c
		damage_speed_up = false;
		damage_speed_up_max_mag = 0;
	}

	return {
		damage_speed_up_max_mag: damage_speed_up_max_mag,
		damage_speed_up: damage_speed_up
	};
}

function CheckDamageSpeedUp(reaction_frame_last) {
	return true;
}

function ReactionFrameMulSpeedUp(damage_reaction_frame, damage_reaction_frame_last, damage_speed_up_max_mag, damage_speed_up) {
	var damage_fly_speed_up_end_rate = 70;

	var frame = damage_reaction_frame;
	if (damage_speed_up != false) {
		var max_mag = damage_speed_up_max_mag;
		var mag = max_mag;
		var frame_last = damage_reaction_frame_last;
		var unk0 = 1 - damage_fly_speed_up_end_rate / 100;
		var i = 0;
		while (mag > 1) {
			var ratio = (frame_last * unk0 - frame) / (frame_last * unk0 - frame_last);
			ratio = Math.min(Math.max(ratio, 0), 1);
			mag = ratio * max_mag;
			if (mag < 1)
				frame--;
			else
				frame -= mag;
			i++;
		}
		return i + Math.ceil(frame);
	}
	return frame;
}

//List of frames for visualizer

function DamageSpeedUpFrames(faf, angle) {
	var damage_reaction_frame_last = faf;
	if (angle > 180)
		angle -= 360;

	var list = [];

	var i = 0;

	var val = InitDamageSpeedUp(damage_reaction_frame_last, Math.abs(angle), true);

	for (var damage_reaction_frame = faf; damage_reaction_frame >= 0; damage_reaction_frame--) {
		list.push(ReactionFrameMulSpeedUp(damage_reaction_frame, damage_reaction_frame_last, val.damage_speed_up_max_mag, val.damage_speed_up));
		i++;
	}

	var value = list[0];
	for (i = 0; i < list.length; i++) {
		list[i] = (list[i] - value) * -1;
		if (list[i] == -0) {
			list[i] = 0;
		}
	}

	return list;
}

function GetFrameWithSpeedUp(list, frame) {
	if (frame == 0)
		frame++;
	var value = list[frame];
	for (var i = frame + 1; i < list.length; i++) {
		if (list[i] > value) {
			return i - 1;
		}
	}
	return -2; //Not found
}

function GetNextFrameWithSpeedUp(list, frame) {
	if (frame == 0)
		frame++;
	var value = list[frame];
	for (var i = frame + 1; i < list.length; i++) {
		if (list[i] > value) {
			return i - 1 - frame;
		}
	}
	return 0;
}

function SpeedUpHitstunCancel(kb, launch_speed_x, launch_speed_y, angle, windbox, electric, speedupFrames, addHitstun) {
	var res = { 'airdodge': 0, 'aerial': 0 };
	if (windbox) {
		return res;
	}
	var hitstun = Math.max(0, Hitstun(kb, windbox, electric) + addHitstun);
	var hitstunSpeedUp = speedupFrames[speedupFrames.length - 1];

	var res = { 'airdodge': hitstun + 1, 'aerial': hitstun + 1 };
	var airdodge = false;
	var aerial = false;
	var launch_speed = { 'x': Math.abs(launch_speed_x), 'y': Math.abs(launch_speed_y) };
	var decay = { 'x': Math.abs(parameters.decay * Math.cos(angle * Math.PI / 180)), 'y': Math.abs(parameters.decay * Math.sin(angle * Math.PI / 180)) };
	var frameCount = 0;
	var ec = electric ? 0 : 0;
	for (var i = 0; i < hitstun; i++) {
		if (launch_speed.x != 0) {
			var x_dir = launch_speed.x / Math.abs(launch_speed.x);
			launch_speed.x -= decay.x;
			if (x_dir == -1 && launch_speed.x > 0) {
				launch_speed.x = 0;
			} else if (x_dir == 1 && launch_speed.x < 0) {
				launch_speed.x = 0;
			}
		}
		if (launch_speed.y != 0) {
			var y_dir = launch_speed.y / Math.abs(launch_speed.y);
			launch_speed.y -= decay.y;
			if (y_dir == -1 && launch_speed.y > 0) {
				launch_speed.y = 0;
			} else if (y_dir == 1 && launch_speed.y < 0) {
				launch_speed.y = 0;
			}
		}
		if (i + 1 < speedupFrames.length) {
			if (GetFrameWithSpeedUp(speedupFrames, i) == i) {
				var lc = Math.sqrt(Math.pow(launch_speed.x, 2) + Math.pow(launch_speed.y, 2));
				if (lc < parameters.hitstunCancel.launchSpeed.airdodge && !airdodge) {
					airdodge = true;
					res.airdodge = Math.max(frameCount + 2, parameters.hitstunCancel.frames.airdodge + 1 + ec);
				}
				if (lc < parameters.hitstunCancel.launchSpeed.aerial && !aerial) {
					aerial = true;
					res.aerial = Math.max(frameCount + 2, parameters.hitstunCancel.frames.aerial + 1 + ec);
				}
				frameCount++;
			}
		} else {
			var lc = Math.sqrt(Math.pow(launch_speed.x, 2) + Math.pow(launch_speed.y, 2));
			if (lc < parameters.hitstunCancel.launchSpeed.airdodge && !airdodge) {
				airdodge = true;
				res.airdodge = Math.max(frameCount + 2, parameters.hitstunCancel.frames.airdodge + 1 + ec);
			}
			if (lc < parameters.hitstunCancel.launchSpeed.aerial && !aerial) {
				aerial = true;
				res.aerial = Math.max(frameCount + 2, parameters.hitstunCancel.frames.aerial + 1 + ec);
			}
			frameCount++;
		}

	}

	if (res.airdodge > hitstunSpeedUp) {
		res.airdodge = hitstunSpeedUp + 1;
	}
	if (res.aerial > hitstunSpeedUp) {
		res.aerial = hitstunSpeedUp + 1;
	}

	return res;
}

function ToDegrees(rad) {
	return rad * 180 / Math.PI;
}