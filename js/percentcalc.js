var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
	$scope.app = 'kbcalculator';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;
    $scope.sharing_url = "";
    //$scope.usingHttp = inhttp;
    $scope.attacker_characters = names;
    $scope.characters = names;
    $scope.attackerValue = attacker.display_name;
    $scope.attacker_icon = attacker.icon;
	$scope.target_icon = target.icon;
	$scope.attacker_image = attacker.image;
	$scope.target_image = target.image;
	$scope.attackerName = attacker.display_name;
	$scope.attacker_class = attacker.class;
	$scope.target_class = target.class;
    $scope.attackerModifiers = attacker.modifiers;
    $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
    $scope.dataViewerAttackerValue = encodeURI(attacker.DataViewerName);
    $scope.targetValue = target.display_name;
    $scope.targetModifiers = target.modifiers;
    $scope.attackerPercent = attacker_percent;
    $scope.targetPercent = target_percent;
    $scope.baseDamage = base_damage;
    $scope.angle = angle;
    $scope.in_air = in_air;
    $scope.bkb = bkb;
    $scope.kbg = kbg;
	$scope.stale = [false, false, false, false, false, false, false, false, false];
	$scope.shieldStale = [false, false, false, false, false, false, false, false, false];
    $scope.staleness_table = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.kb_modifier = "none";
    //$scope.training = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    //$scope.vs = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.kb = 0;
	$scope.kbType = "total";
	$scope.shorthop_aerial = false;

	$scope.attackerPercent_style = {};
	$scope.targetPercent_style = {};

    $scope.preDamage = 0;

    $scope.set_weight = false;

    $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
    $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
    $scope.target_weight = target.attributes.weight;
    $scope.target_gravity = target.attributes.gravity;
    $scope.target_damage_taken = target.modifier.damage_taken;
	$scope.target_kb_received = target.modifier.kb_received;
	$scope.is_1v1 = true;
	$scope.inkValue = 0;

	$scope.attacker_mod = $scope.attackerModifiers.length > 0 ? {} : { 'display': 'none' };
	$scope.target_mod = $scope.targetModifiers.length > 0 ? {} : { 'display': 'none' };

    $scope.is_smash = false;
	$scope.is_smash_visibility = $scope.is_smash ? {} : { 'display': 'none' };
    $scope.megaman_fsmash = false;
	$scope.witch_time_charge = false;
	$scope.is_aerial = { 'display': 'none' };
	$scope.is_megaman = attacker.name == "Mega Man" ? {} : { 'display': 'none' };
	$scope.is_bayonetta = attacker.name == "Bayonetta" ? {} : { 'display': 'none' };
	$scope.is_lucario = attacker.name == "Lucario" ? {} : { 'display': 'none' };
    $scope.smashCharge = 0;
    $scope.wbkb = wbkb;
	$scope.windbox = false;
	$scope.is_aerial_move = false;

    $scope.ignoreStale = false;

    $scope.section_main = { 'background': 'rgba(0, 0, 255, 0.3)' };
    $scope.section_attributes = { 'background': 'transparent' };
    $scope.counterStyle = { "display": "none" };
    $scope.counteredDamage = 0;
    $scope.counterMult = 0;
	$scope.unblockable = false;
	$scope.throw = false,

    $scope.charge_min = 0;
    $scope.charge_max = 60;
    $scope.charge_special = false;
    $scope.charge_data = null;
    $scope.selected_move = null;

    $scope.st_jab_lock = { "display": "none" };

    $scope.stock_dif = "0";
    $scope.stock_values = ["-2","-1","0","+1","+2"];
    $scope.formats = ["Singles", "Doubles"];
    $scope.format = "Singles";

    $scope.attackerMod = "Normal";
    $scope.targetMod = "Normal";
    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;
	$scope.luma_percent = 0;

	$scope.moveset_info = "";

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.charging_frames_type = "Frames charged";

	$scope.launch_rate = launch_rate;

	$scope.delayed_shorthop_aerial = null;

	$scope.checkSmashVisibility = function () {
		$scope.is_smash_visibility = $scope.is_smash ? {} : { 'display': 'none' };
		$scope.is_megaman = attacker.name == "Mega Man" ? {} : { 'display': 'none' };
		$scope.is_bayonetta = attacker.name == "Bayonetta" ? {} : { 'display': 'none' };
	}

	$scope.checkCounterVisibility = function () {
		$scope.counterStyle = { "display": $scope.counterMult != 0 ? "block" : "none" };
	}

    $scope.charging = function(){
        $scope.checkSmashVisibility();
        $scope.megaman_fsmash = false;
        $scope.witch_time_charge = false;
        $scope.smashCharge = 0;
        charge_frames = 0;

        $scope.updateAttackData();
	};

	$scope.updateStaleness = function (value) {
		if (value == "0") {
			$scope.stale = [false, false, false, false, false, false, false, false, false];
		} else if (value == "1") {
			$scope.stale = [true, true, true, true, true, true, true, true, true];
		}
		$scope.update();
	};

    $scope.check = function () {
		$scope.is_megaman = attacker.name == "Mega Man" ? { 'display': 'block' } : { 'display': 'none' };
		if (attacker.name != "Mega Man") {
			$scope.megaman_fsmash = false;
		}
		$scope.is_bayonetta = attacker.name == "Bayonetta" ? { 'display': 'block' } : { 'display': 'none' };
		if (attacker.name != "Bayonetta") {
			$scope.witch_time_charge = false;
		}
        var a = parseFloat($scope.angle);
		$scope.st_jab_lock = (a == 361 || (a >= 230 && a <= 310)) ? {} : { "display": 'none' };

		$scope.shorthop_aerial = $scope.is_aerial_move ? $scope.shorthop_aerial : false;
		$scope.is_aerial = $scope.is_aerial_move ? {} : { 'display': 'none' };
    }

    $scope.check_move = function(){
		if ($scope.selected_move == null) {
			if ($scope.is_aerial_move) {
				$scope.is_aerial = {};
			} else {
				$scope.is_aerial = { 'display': 'none' };
			}
            $scope.charge_min = 0;
            $scope.charge_max = 60;
            $scope.charge_special = false;
            $scope.charging_frames_type = "Frames charged";
		} else {
			if ($scope.delayed_shorthop_aerial != null) {
				$scope.shorthop_aerial = $scope.delayed_shorthop_aerial;
				setTimeout(function () {
					$scope.delayed_shorthop_aerial = null;
					$scope.$apply();
				}, 10);
			}
			$scope.is_aerial_move = $scope.selected_move.aerial;
			$scope.is_aerial = $scope.selected_move.aerial ? {} : { 'display': 'none' };
            if($scope.selected_move.chargeable){
                if($scope.selected_move.charge != null){
                    $scope.charge_data = $scope.selected_move.charge;
                    $scope.charge_min = $scope.charge_data.min;
                    $scope.charge_max = $scope.charge_data.max;
                    if ($scope.smashCharge < $scope.charge_data.min) {
                        $scope.smashCharge = $scope.charge_data.min;
                    } else if ($scope.smashCharge > $scope.charge_data.max) {
                        $scope.smashCharge = $scope.charge_data.max;
                    }
                    $scope.charge_special = true;
					$scope.is_smash = true;
					$scope.is_aerial_move = false;
					$scope.charging_frames_type = attacker.name == "Donkey Kong" ? "Arm swings" : (attacker.name == "Jigglypuff" ? "Speed" : "Frames charged");
                    $scope.updateCharge();
                    
                }else{
                    $scope.charge_data = null;
                    $scope.charge_min = 0;
                    $scope.smashCharge = 0;
                    $scope.charge_max = 60;
					$scope.charge_special = false;
					$scope.is_aerial_move = false;
                    $scope.is_smash = $scope.selected_move.smash_attack;
                    $scope.charging_frames_type = "Frames charged";
                }
            }else{
                $scope.charge_data = null;
                $scope.charge_min = 0;
                //$scope.smashCharge = 0;
                $scope.charge_max = 60;
                $scope.charge_special = false;
				$scope.is_smash = $scope.selected_move.smash_attack;
				$scope.is_aerial_move = $scope.selected_move.aerial;
                $scope.charging_frames_type = "Frames charged";
            }
            $scope.checkSmashVisibility();
        }
        
    }

    $scope.updateAttr = function () {
        attacker.modifier.damage_dealt = parseFloat($scope.attacker_damage_dealt);
        attacker.modifier.kb_dealt = parseFloat($scope.attacker_kb_dealt);
        target.attributes.weight = parseFloat($scope.target_weight);
        target.attributes.gravity = parseFloat($scope.target_gravity);
        target.modifier.damage_taken = parseFloat($scope.target_damage_taken);
        target.modifier.kb_received = parseFloat($scope.target_kb_received);

        $scope.update();
    }

    $scope.show = function (section) {
        $scope.main_style = { 'display': section == "main" ? 'block' : 'none' };
        $scope.attributes_style = { 'display': section == "attributes" ? 'block' : 'none' };
        $scope.section_main = { 'background': section == "main" ? 'rgba(0, 0, 255, 0.3)': 'transparent' };
        $scope.section_attributes = { 'background': section == "attributes" ? 'rgba(0, 0, 255, 0.3)' : 'transparent' };
    }

    $scope.updateAttacker = function(){
        attacker = new Character($scope.attackerValue);
        $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
        $scope.dataViewerAttackerValue = encodeURI(attacker.DataViewerName);
		$scope.attacker_icon = attacker.icon;
		$scope.attacker_image = attacker.image;
		$scope.attacker_class = attacker.class;
        $scope.attackerName = attacker.display_name;
        $scope.attackerMod = "Normal";
		$scope.attackerModifiers = [];
		for (var i = 0; i < attacker.modifiers.length; i++) {
			if (attacker.modifiers[i].attackerShow)
				$scope.attackerModifiers.push(attacker.modifiers[i]);
		}
		$scope.attacker_mod = $scope.attackerModifiers.length > 0 ? {} : { 'display': 'none' };
		if (notInAPICharacters.indexOf(attacker.display_name) == -1) {
			getMoveset(attacker, $scope);
		}
		else {
			$scope.moveset_info = null;
			$scope.moveset = [new Move(-1, -1, "Character data not available", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
		}
        $scope.move = "0";
        $scope.preDamage = 0;
        $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
        $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
        $scope.counterMult = 0;
        $scope.counteredDamage = 0;
		$scope.unblockable = false;
        $scope.selected_move = null;
        $scope.checkCounterVisibility();
		$scope.is_lucario = attacker.name == "Lucario" ? {} : { 'display': 'none' };
        $scope.stock_dif = "0";
        $scope.update();
    }

    $scope.updateAttackerMod = function () {
        var mod = attacker.getModifier($scope.attackerMod);
        if (mod != null) {
            attacker.modifier = mod;
			attacker.updateIcon();
			attacker.updateImage();
			$scope.attacker_icon = attacker.icon;
			$scope.attacker_image = attacker.image;
			$scope.attacker_class = attacker.class;
            $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
            $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
            $scope.update();
        }
    }

    $scope.updateTargetMod = function () {
        var mod = target.getModifier($scope.targetMod);
        if (mod != null) {
            target.modifier = mod;
			target.updateIcon();
			target.updateImage();
			$scope.target_icon = target.icon;
			$scope.target_image = target.image;
			$scope.target_class = target.class;
			$scope.target_weight = target.attributes.weight;
			$scope.target_gravity = +(target.attributes.gravity * target.modifier.gravity).toFixed(6);
			$scope.target_damage_taken = target.modifier.damage_taken;
			$scope.target_kb_received = target.modifier.kb_received;
			$scope.update();
        }
    }

    $scope.updateAttack = function () {
        var attack = $scope.moveset[$scope.move];
        if (attack.valid) {
            if (attack.counterMult == 0) {
                $scope.counteredDamage = 0;
            }
            $scope.angle = attack.angle;
            $scope.baseDamage = attack.base_damage;
            $scope.bkb = attack.bkb;
            $scope.kbg = attack.kbg;
            $scope.wbkb = attack.wbkb;
            $scope.is_smash = attack.smash_attack;
            $scope.preDamage = attack.preDamage;
            $scope.counterMult = attack.counterMult;
			$scope.unblockable = attack.unblockable;
			$scope.throw = attack.throw;
			$scope.windbox = attack.windbox;
			$scope.set_weight = attack.setweight;
            if (!isNaN(attack.hitboxActive[0].start)) {
                $scope.hit_frame = attack.hitboxActive[0].start;
            } else {
                $scope.hit_frame = 0;
            }
            $scope.faf = attack.faf;
            if (!$scope.is_smash) {
                $scope.smashCharge = 0;
                charge_frames = 0;
            }
            $scope.checkSmashVisibility();
            $scope.checkCounterVisibility();
            if ($scope.counterMult != 0) {
                $scope.counterDamage();
            }
            $scope.selected_move = attack;
            $scope.check_move();
        } else {
            //console.debug(attack.name + " not valid");
        }
        $scope.update();
    }

    $scope.updateAttackData = function () {
        var attack = $scope.moveset[$scope.move];
        if (attack.valid) {
            if($scope.angle == attack.angle &&
            $scope.baseDamage == attack.base_damage &&
            $scope.bkb == attack.bkb &&
            $scope.kbg == attack.kbg &&
            $scope.wbkb == attack.wbkb &&
			$scope.is_smash == attack.smash_attack &&
			$scope.is_aerial_move == attack.aerial &&
            $scope.windbox == attack.windbox){
            } else {
                if (!$scope.detectAttack()) {
                    $scope.move = "0";
                    $scope.moveset[0].name = "Custom move";
                    $scope.preDamage = 0;
					$scope.unblockable = false;
					$scope.throw = false;
                    $scope.selected_move = null;
                }
            }
        } else {
            if (!$scope.detectAttack()) {
                $scope.move = "0";
                $scope.moveset[0].name = "Custom move";
                $scope.preDamage = 0;
				$scope.unblockable = false;
				$scope.throw = false;
				$scope.selected_move = null;
				//Check if url has short hop aerial multiplier (Possible aerial with hitbox data modified)
				if ($scope.delayed_shorthop_aerial != null) {

					$scope.is_aerial = {};
					$scope.shorthop_aerial = $scope.delayed_shorthop_aerial;

					setTimeout(function () {
						$scope.delayed_shorthop_aerial = null;
						$scope.$apply();
					}, 10);
				}
            }
        }
        $scope.update();
    }

    $scope.counterDamage = function () {
        var attack = $scope.moveset[$scope.move];
        var damage = +(parseFloat($scope.counteredDamage) * attack.counterMult).toFixed(4);
        if (damage > 50) {
            damage = 50;
        }
        if (attack.base_damage < damage) {
            $scope.baseDamage = damage;
        } else {
            $scope.baseDamage = attack.base_damage;
        }
        $scope.update();
    }

    $scope.detectAttack = function () {
        var detected = false;
        for (var i = 1; i < $scope.moveset.length; i++) {
            attack = $scope.moveset[i];
            if (attack.character != $scope.attackerValue) {
                //Using another character moveset
                return false;
            }
            if (attack.valid) {
                if ($scope.angle == attack.angle &&
                    $scope.baseDamage == attack.base_damage &&
                    $scope.bkb == attack.bkb &&
                    $scope.kbg == attack.kbg &&
                    $scope.wbkb == attack.wbkb &&
                    $scope.is_smash == attack.smash_attack &&
                    $scope.windbox == attack.windbox) {
                        $scope.move = i.toString();
                        $scope.preDamage = attack.preDamage;
                        $scope.counterMult = attack.counterMult;
					$scope.unblockable = attack.unblockable;
					$scope.throw = attack.throw;
                        $scope.selected_move = attack;
                        $scope.check_move();
                        detected = true;
                        return true;
                } else {

                }
            }
        }
        if (!detected) {
            //Chargeable attacks
            for (var i = 1; i < $scope.moveset.length; i++) {
                attack = $scope.moveset[i];
                if (attack.valid) {
                    if ($scope.angle == attack.angle &&
                        parseFloat($scope.baseDamage) >= parseFloat(attack.base_damage) &&
						parseInt($scope.bkb) >= attack.bkb &&
						parseInt($scope.kbg) >= attack.kbg &&
						parseInt($scope.wbkb) >= attack.wbkb &&
                        $scope.is_smash == attack.smash_attack &&
                        $scope.windbox == attack.windbox &&
                        (attack.chargeable || attack.counterMult != 0)) {
                            $scope.preDamage = attack.preDamage;
                            $scope.counterMult = attack.counterMult;
						$scope.unblockable = attack.unblockable;
						$scope.throw = attack.throw;
                            $scope.selected_move = attack;
                            $scope.check_move();
                            $scope.move = i.toString();
                            return true;
                    } else {

                    }
                }
            }
        }
        return false;
    }

    $scope.updateTarget = function () {
        target = new Character($scope.targetValue);
        $scope.targetMod = "Normal";
		$scope.targetModifiers = [];

		for (var i = 0; i < target.modifiers.length; i++) {
			if (target.modifiers[i].targetShow)
				$scope.targetModifiers.push(target.modifiers[i]);
		}
		if (target.name == "Bowser Jr") {
			$scope.targetMod = "Clown Kart";
		}
		if (target.name == "Ice Climbers") {
			$scope.targetMod = "Popo";
		}
		$scope.target_mod = $scope.targetModifiers.length > 0 ? {} : { 'display': 'none' };
		$scope.target_icon = target.icon;
		$scope.target_image = target.image;
		$scope.target_class = target.class;
        $scope.target_weight = target.attributes.weight;
        $scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
        $scope.target_damage_taken = target.modifier.damage_taken;
        $scope.target_kb_received = target.modifier.kb_received;
        $scope.update();
    }

    $scope.updateCharge = function(){
        if($scope.charge_data != null){
			$scope.baseDamage = $scope.selected_move.charge_damage(parseFloat($scope.smashCharge));
			$scope.bkb = $scope.selected_move.charge_bkb(parseFloat($scope.smashCharge));
			$scope.kbg = $scope.selected_move.charge_kbg(parseFloat($scope.smashCharge));
        }
        $scope.update();
    }

    $scope.update = function () {
        $scope.check();
        attacker_percent = parseFloat($scope.attackerPercent);
        
        preDamage = parseFloat($scope.preDamage);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
		stale = $scope.stale;
		shieldStale = $scope.shieldStale;

        charge_frames = parseFloat($scope.smashCharge);
        r = KBModifier($scope.kb_modifier);
        bounce = $scope.kb_modifier_bounce;
        ignoreStale = $scope.ignoreStale;

        megaman_fsmash = $scope.megaman_fsmash;
        witch_time_smash_charge = $scope.witch_time_charge;
        electric = false;
        crouch = $scope.kb_modifier;

        is_smash = $scope.is_smash;
        wbkb = parseFloat($scope.wbkb);
        windbox = $scope.windbox;

        stock_dif = $scope.stock_dif;
        game_format = $scope.format;

		launch_rate = parseFloat($scope.launch_rate);
		ink = parseFloat($scope.inkValue);

        if($scope.charge_data == null && $scope.is_smash){
			base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge, $scope.selected_move != null ? $scope.selected_move.maxSmashChargeMult : 1.4 );
        }
        if (attacker.name == "Lucario") {
            base_damage *= Aura(attacker_percent, stock_dif, game_format);
            preDamage *= Aura(attacker_percent, stock_dif, game_format);
		}

		base_damage *= attacker.modifier.base_damage;
		preDamage *= attacker.modifier.base_damage;
		
		preDamage *= InkDamageMult(ink);

        var damage = base_damage;
        
		if (!$scope.throw) {
			damage *= attacker.modifier.damage_dealt;
		}
        damage *= target.modifier.damage_taken;
        preDamage *= attacker.modifier.damage_dealt;
		preDamage *= target.modifier.damage_taken;
		if ($scope.is_1v1) {
			preDamage *= 1.2;
		}
		if ($scope.shorthop_aerial) {
			damage *= parameters.shorthop_aerial;
			preDamage *= parameters.shorthop_aerial;
		}

        set_weight = $scope.set_weight;

        var kb = parseFloat($scope.kb);
        var type = $scope.kbType;

        if (wbkb == 0)
            launch_rate = 1;

		var kb = new PercentFromKnockback(kb, type, base_damage, damage, preDamage, angle, set_weight ? 100 : target.attributes.weight, target.attributes.gravity, target.attributes.fall_speed, in_air, bkb, kbg, wbkb, attacker_percent, r, stale, shieldStale, ignoreStale, windbox, electric, target.modifier.name == "Character Inhaled", launch_rate);
        if (kb.wbkb == 0) {
            kb.addModifier(attacker.modifier.kb_dealt);
            kb.addModifier(target.modifier.kb_received);
        }
        
        kb.bounce(bounce);
        var resultsList = [];
        if(kb.wbkb != 0){
            if (kb.rage_needed != -1) {
                resultsList.push(new Result("Rage multiplier", kb.rage_needed));
                resultsList.push(new Result("Attacker percent", kb.vs_percent));
            } else {
                if (kb.vs_percent == -1) {
                    resultsList.push(new Result("Cannot reach KB higher than", (kb.wbkb_kb * 1.15).toFixed(4)));
                } else {
                    resultsList.push(new Result("WBKB KB is higher than ", +kb.wbkb_kb.toFixed(4)));
                }
            }
        }else{

            resultsList.push(new Result("Required Percent", kb.vs_percent != -1 ? +kb.vs_percent.toFixed(4) : "Impossible"));
        }
        


        $scope.results = new ResultList(resultsList);

		$scope.sharing_url = buildURL($scope);
	};

	$scope.updatePercent = function () {
		$scope.attackerPercent_style = PercentColor(parseFloat($scope.attackerPercent));
		$scope.targetPercent_style = PercentColor(parseFloat($scope.targetPercent));
		$scope.update();
	}

    $scope.get_jablock = function(){
        var a = parseFloat($scope.angle);
        if(a==361){
            $scope.kb = 59.9999;
        }else{
            $scope.kb = 80;
        }
        $scope.update();
    };

    $scope.get_tumble = function(){
        $scope.kb = 80;
        $scope.update();
    };

    $scope.collapse = function (id) {
        $("#" + id).collapse('toggle');
    }

	$scope.themes = styleList;
	$scope.theme = styleList[0].name;

    $scope.changeTheme = function () {
        changeStyle($scope.theme);
    }

	mapParams($scope);

	$scope.attackerPercent_style = PercentColor(parseFloat($scope.attackerPercent));
	$scope.targetPercent_style = PercentColor(parseFloat($scope.targetPercent));

    $scope.update();
});