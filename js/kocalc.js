var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
	$scope.app = 'kocalculator';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;
    $scope.sharing_url = "";
    $scope.attacker_characters = names;
    $scope.characters = names;
    $scope.attackerValue = attacker.display_name;
    $scope.attackerName = attacker.display_name;
    $scope.attackerModifiers = attacker.modifiers;
    $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
    $scope.targetValue = target.display_name;
    $scope.targetModifiers = target.modifiers;
    $scope.attackerPercent = attacker_percent;
    $scope.targetPercent = target_percent;
    $scope.attacker_icon = attacker.icon;
	$scope.target_icon = target.icon;
	$scope.attacker_image = attacker.image;
	$scope.target_image = target.image;
	$scope.attacker_class = attacker.class;
	$scope.target_class = target.class;
    $scope.baseDamage = base_damage;
    $scope.angle = angle;
    $scope.in_air = in_air;
    $scope.bkb = bkb;
    $scope.kbg = kbg;
	$scope.stale = [false, false, false, false, false, false, false, false, false];
	$scope.shieldStale = [false, false, false, false, false, false, false, false, false];
    $scope.staleness_table = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.kb_modifier = "none";
    $scope.hitlag_modifier = "none";
    $scope.hitlag = hitlag;
    $scope.shield = "normal";
    $scope.hit_frame = hitframe;
    $scope.faf = faf;
    $scope.shieldDamage = 0;
	$scope.charging_frames_type = "Frames charged";
	$scope.shorthop_aerial = false;
	$scope.throw = false;

	$scope.attackerPercent_style = {};
	$scope.targetPercent_style = {};

	$scope.effects = effects;
	$scope.effect = effects[0].name;

    $scope.set_weight = false;

    $scope.hitbox_active_index = 0;

    $scope.preDamage = 0;
	$scope.stick = { X: 0, Y: 0 };
	$scope.stickAngle = 0;

    $scope.attackerMod = "Normal";
    $scope.targetMod = "Normal";
    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;

	$scope.attacker_mod = $scope.attackerModifiers.length > 0 ? {} : { 'display': 'none' };
	$scope.target_mod = $scope.targetModifiers.length > 0 ? {} : { 'display': 'none' };

    $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
    $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
    $scope.target_weight = target.attributes.weight;
	$scope.target_gravity = target.attributes.gravity;
	$scope.target_damageflytop_gravity = target.attributes.damageflytop_gravity;
    $scope.target_damage_taken = target.modifier.damage_taken;
    $scope.target_kb_received = target.modifier.kb_received;
    $scope.target_traction = target.attributes.traction;
	$scope.target_fall_speed = target.attributes.fall_speed;
	$scope.target_damageflytop_fall_speed = target.attributes.damageflytop_fall_speed;
	$scope.is_1v1 = true;

	$scope.is_smash = false;
	$scope.is_aerial_move = false;
	$scope.is_smash_visibility = $scope.is_smash ? {} : { 'display': 'none' };
    $scope.megaman_fsmash = false;
    $scope.witch_time_charge = false;
	$scope.is_megaman = attacker.name == "Mega Man" ? {} : { 'display': 'none' };
	$scope.is_bayonetta = attacker.name == "Bayonetta" ? {} : { 'display': 'none' };
	$scope.is_lucario = attacker.name == "Lucario" ? {} : { 'display': 'none' };
    $scope.is_aerial = { 'display': 'none' };
    $scope.prev_hf = { 'display': 'none' };
    $scope.next_hf = { 'display': 'none' };
    $scope.selected_move = null;
    $scope.smashCharge = 0;
    $scope.wbkb = wbkb;
    $scope.windbox = false;
    $scope.ignoreStale = false;

    $scope.use_landing_lag = "no";

    $scope.section_main = { 'background': 'rgba(0, 0, 255, 0.3)' };
    $scope.section_attributes = { 'background': 'transparent' };
    $scope.section_visualizer = { 'background': 'transparent' };
    $scope.counterStyle = { "display": "none" };
    $scope.counteredDamage = 0;
    $scope.counterMult = 0;
	$scope.unblockable = false;
	$scope.isFinishingTouch = false;

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.game_mode = game_mode;
    $scope.show_graph = false;

    $scope.inverseX = false;
    $scope.surface = false;
    $scope.position_x = 0;
    $scope.position_y = 0;
    $scope.extra_vis_frames = 0;

	$scope.stages = getStages();

    $scope.spawns = [];

    $scope.charge_min = 0;
    $scope.charge_max = 60;
    $scope.charge_special = false;
    $scope.charge_data = null;

    $scope.stock_dif = "0";
    $scope.stock_values = ["-2","-1","0","+1","+2"];
    $scope.formats = ["Singles", "Doubles"];
    $scope.format = "Singles";

	$scope.stage = $scope.stages[48];
	$scope.stageValue = "48";

	$scope.stageName = $scope.stage.stage;

	$scope.percent_ko = 0;
	$scope.di_step_percent = 1;

	$scope.spawns = ["Center"];
	for (var i = 0; i < $scope.stage.spawns.length; i++) {
		$scope.spawns.push(i + 1);
	}
	$scope.spawn = "Center";

	$scope.currentPlot = {};

	$scope.launch_rate = launch_rate;

	$scope.delayed_landing_lag = null;
	$scope.delayed_shorthop_aerial = null;

    $scope.params = parameters;

	$scope.visualizer_extra = [];

	$scope.di_step = 1;
	$scope.di_step_stage = 15;

	$scope.di_ignore_collisions = true;

	$scope.show_interpolation = true;

	$scope.moveset_info = "";

	$scope.visualizer = new Visualizer(document.getElementById("visualizerCanvas"));
	$scope.visualizer.SetBackground(settings.visualizer_colors.background);
	$scope.visualizer.SetSize(45);


	$scope.getStage = function () {
		for (var i = 0; i < $scope.stages.length; i++) {
			if ($scope.stages[i].stage == $scope.stageName) {
				$scope.stageValue = i + "";
				$scope.updateStage();
				return;
			}
		}
	}

	$scope.updateStage = function () {
		$scope.stage = $scope.stages[$scope.stageValue];
		$scope.stageName = $scope.stage.stage;
		if ($scope.stage.stage == "No stage") {
			$scope.stage = null;
			$scope.spawns = [];
			$scope.spawn = "";
			$scope.update();
			return;
		}
		if ($scope.stage.center != null) {
			$scope.position_x = $scope.stage.center[0];
			$scope.position_y = $scope.stage.center[1];
			$scope.spawns = ["Center"];
		} else {
			$scope.position_x = $scope.spawns[0];
			$scope.position_y = $scope.spawns[1];
			$scope.spawns = [];
		}
		for (var i = 0; i < $scope.stage.spawns.length; i++) {
			$scope.spawns.push(i + 1);
		}
		$scope.visualizer.Reset();
		$scope.spawn = "Center";
		$scope.update();
	}

	$scope.setPositionSpawn = function () {
		if ($scope.spawn != "Center") {
			var i = parseFloat($scope.spawn) - 1;
			$scope.position_x = $scope.stage.spawns[i][0];
			$scope.position_y = $scope.stage.spawns[i][1];
			$scope.update();
		} else {
			$scope.position_x = $scope.stage.center[0];
			$scope.position_y = $scope.stage.center[1];
			$scope.update();
		}
	}

	$scope.checkSmashVisibility = function () {
		$scope.is_smash_visibility = $scope.is_smash ? {} : { 'display': 'none' };
		$scope.is_megaman = attacker.name == "Mega Man" ? {} : { 'display': 'none' };
		$scope.is_bayonetta = attacker.name == "Bayonetta" ? {} : { 'display': 'none' };
	}

	$scope.checkCounterVisibility = function () {
		$scope.counterStyle = { "display": $scope.counterMult != 0 ? "block" : "none" };
	}

	$scope.updateEffect = function () {
		if ($scope.effect == "Paralyze")
			$scope.set_weight = true;
		$scope.update();
	}

    $scope.charging = function(){
        $scope.checkSmashVisibility();
        $scope.megaman_fsmash = false;
        $scope.witch_time_charge = false;
        $scope.smashCharge = 0;
        charge_frames = 0;

        $scope.updateAttackData();
    };

    $scope.check_move = function(){
        if($scope.selected_move == null){
			if ($scope.is_aerial_move) {
				$scope.is_aerial = {};
			} else {
				$scope.is_aerial = { 'display': 'none' };
			}
            $scope.prev_hf = { 'display': 'none' };
            $scope.next_hf = { 'display': 'none' };
            $scope.use_landing_lag = "no";
            $scope.charge_min = 0;
            $scope.charge_max = 60;
            $scope.charge_special = false;
            $scope.charging_frames_type = "Frames charged";
        }else{
            $scope.hitbox_active_index = 0;
            if ($scope.delayed_landing_lag != null) {
                $scope.use_landing_lag = $scope.delayed_landing_lag;
                setTimeout(function () {
                    $scope.delayed_landing_lag = null;
                    $scope.update_faf();
                    $scope.$apply();
                }, 10);
            } else {
                $scope.use_landing_lag = "no";
			}
			if ($scope.delayed_shorthop_aerial != null) {
				$scope.shorthop_aerial = $scope.delayed_shorthop_aerial;
				setTimeout(function () {
					$scope.delayed_shorthop_aerial = null;
					$scope.$apply();
				}, 10);
			}
			$scope.is_aerial_move = $scope.selected_move.aerial;
			$scope.is_aerial = $scope.selected_move.aerial ? {} : { 'display': 'none' };
			$scope.prev_hf = { 'display': 'none' };
			$scope.next_hf = { 'display': $scope.selected_move.hitboxActive.length > 1 ? 'inline' : 'none' };
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
					$scope.is_smash = $scope.selected_move.smash_attack;
					$scope.is_aerial_move = false;
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

    $scope.prev_hit_frame = function(){
        $scope.hitbox_active_index--;
        if (!isNaN($scope.selected_move.hitboxActive[$scope.hitbox_active_index].start)) {
            $scope.hit_frame = $scope.selected_move.hitboxActive[$scope.hitbox_active_index].start;
        } else {
            $scope.hit_frame = 0;
        }
		$scope.prev_hf = { 'display': $scope.hitbox_active_index != 0 ? 'inline' : 'none' };
		$scope.next_hf = { 'display': $scope.hitbox_active_index < $scope.selected_move.hitboxActive.length - 1 ? 'inline' : 'none' };
        $scope.update();
    }

    $scope.next_hit_frame = function(){
        $scope.hitbox_active_index++;
        if (!isNaN($scope.selected_move.hitboxActive[$scope.hitbox_active_index].start)) {
            $scope.hit_frame = $scope.selected_move.hitboxActive[$scope.hitbox_active_index].start;
        } else {
            $scope.hit_frame = 0;
        }
		$scope.prev_hf = { 'display': $scope.hitbox_active_index != 0 ? 'inline' : 'none' };
		$scope.next_hf = { 'display': $scope.hitbox_active_index < $scope.selected_move.hitboxActive.length - 1 ? 'inline' : 'none' };
        $scope.update();
    }

    $scope.update_faf = function(){
        landing_lag = 0;
        switch($scope.use_landing_lag){
            case "no":
                $scope.faf = $scope.selected_move.faf;
            break;
            case "yes":
                $scope.faf = $scope.hit_frame + 1;
                landing_lag = $scope.selected_move.landingLag;
            break;
            case "autocancel":
                var i = $scope.hit_frame;
                var h = $scope.hit_frame+50;
                var f = false;
                for(i = $scope.hit_frame;i<h;i++){
                    for(var x=0;x<$scope.selected_move.autoCancel.length;x++){
                        if($scope.selected_move.autoCancel[x].eval(i)){
                            f = true;
                            break;
                        }
                    }
                    if(f){
                        break;
                    }
                }
                if(f){
                    $scope.faf = i;
                }else{
                    $scope.faf = NaN;
                }
            break;
        }
        $scope.update();
	}

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
		$scope.shorthop_aerial = $scope.is_aerial_move ? $scope.shorthop_aerial : false;
		$scope.is_aerial = $scope.is_aerial_move ? {} : { 'display': 'none' };
    }

    $scope.updateAttr = function () {
        attacker.modifier.damage_dealt = parseFloat($scope.attacker_damage_dealt);
        attacker.modifier.kb_dealt = parseFloat($scope.attacker_kb_dealt);
        target.attributes.weight = parseFloat($scope.target_weight);
		target.attributes.gravity = parseFloat($scope.target_gravity);
		target.attributes.damageflytop_gravity = parseFloat($scope.target_damageflytop_gravity);
        target.modifier.damage_taken = parseFloat($scope.target_damage_taken);
        target.modifier.kb_received = parseFloat($scope.target_kb_received);
        target.attributes.traction = parseFloat($scope.target_traction);
		target.attributes.fall_speed = parseFloat($scope.target_fall_speed);
		target.attributes.damageflytop_fall_speed = parseFloat($scope.target_damageflytop_fall_speed);

        $scope.update();
    }

    $scope.updateAttacker = function(){
        attacker = new Character($scope.attackerValue);
        $scope.attackerName = attacker.display_name;
        $scope.attackerMod = "Normal";
		$scope.attackerModifiers = [];
		for (var i = 0; i < attacker.modifiers.length; i++) {
			if (attacker.modifiers[i].attackerShow)
				$scope.attackerModifiers.push(attacker.modifiers[i]);
		}
		$scope.attacker_icon = attacker.icon;
		$scope.attacker_image = attacker.image;
		$scope.attacker_class = attacker.class;
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
		$scope.hitbox_active_index = 0;
        $scope.check_move(null);
        $scope.checkCounterVisibility();
        $scope.selected_move = null;
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
			$scope.target_damageflytop_gravity = +(target.attributes.damageflytop_gravity).toFixed(6);
			$scope.target_damage_taken = target.modifier.damage_taken;
			$scope.target_kb_received = target.modifier.kb_received;
			$scope.target_fall_speed = +(target.attributes.fall_speed * target.modifier.fall_speed).toFixed(6);
			$scope.target_damageflytop_fall_speed = +(target.attributes.damageflytop_fall_speed).toFixed(6);
			$scope.target_traction = +(target.attributes.traction * target.modifier.traction).toFixed(6);
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
			$scope.isFinishingTouch = attack.isFinishingTouch;
            $scope.windbox = attack.windbox;
			$scope.shieldDamage = attack.shieldDamage;
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
            if(attack.name == "Fsmash" && attacker.name == "Mega Man"){
                $scope.megaman_fsmash = true;
            }else{
                $scope.megaman_fsmash = false;
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
            $scope.windbox == attack.windbox &&
            $scope.shieldDamage == attack.shieldDamage){
            } else {
                if (!$scope.detectAttack()) {
                    $scope.move = "0";
                    $scope.moveset[0].name = "Custom move";
                    $scope.preDamage = 0;
					$scope.unblockable = false;
					$scope.throw = false;
					$scope.isFinishingTouch = false;
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
				$scope.isFinishingTouch = false;
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
        
        $scope.check();
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
                    $scope.windbox == attack.windbox &&
                    $scope.shieldDamage == attack.shieldDamage) {
                        $scope.move = i.toString();
                        $scope.preDamage = attack.preDamage;
					$scope.counterMult = attack.counterMult;
					$scope.throw = attack.throw;
						$scope.unblockable = attack.unblockable;
						$scope.isFinishingTouch = attack.isFinishingTouch;
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
                        $scope.is_smash == (attack.smash_attack || attack.chargeable) &&
                        $scope.windbox == attack.windbox &&
                        parseInt($scope.shieldDamage) >= attack.shieldDamage &&
                        (attack.chargeable || attack.counterMult != 0)) {
                            $scope.preDamage = attack.preDamage;
						$scope.counterMult = attack.counterMult;
						$scope.throw = attack.throw;
                            $scope.unblockable = attack.unblockable;
                            $scope.move = i.toString();
                            $scope.selected_move = attack;
                            $scope.check_move();
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
		$scope.target_mod = $scope.targetModifiers.length > 0 ? {} : { 'display': 'none' };
		$scope.target_icon = target.icon;
		$scope.target_image = target.image;
		$scope.target_class = target.class;
        $scope.target_weight = target.attributes.weight;
		$scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
		$scope.target_damageflytop_gravity = target.attributes.damageflytop_gravity;
        $scope.target_damage_taken = target.modifier.damage_taken;
        $scope.target_kb_received = target.modifier.kb_received;
		$scope.target_fall_speed = target.attributes.fall_speed * target.modifier.fall_speed;
		$scope.target_damageflytop_fall_speed = target.attributes.damageflytop_fall_speed;
        $scope.target_traction = target.attributes.traction * target.modifier.traction;
        $scope.update();
	}

	$scope.getDistance = function (damage) {
		if (wbkb == 0) {
			//trainingkb = TrainingKB(target_percent + preDamage, base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled");
			vskb = VSKB(target_percent + preDamage, base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, r, stale, shieldStale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
			//trainingkb.addModifier(attacker.modifier.kb_dealt);
			vskb.addModifier(attacker.modifier.kb_dealt);
			//trainingkb.addModifier(target.modifier.kb_received);
			vskb.addModifier(target.modifier.kb_received);
		} else {
			//trainingkb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, damage, 0, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled");
			vskb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, r, target_percent, StaleDamage(damage, stale, shieldStale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
			//trainingkb.addModifier(target.modifier.kb_received);
			vskb.addModifier(target.modifier.kb_received);
		}

		var damageSpeedUpFrames = DamageSpeedUpFrames(FirstActionableFrame(vskb.base_kb, windbox, electric), vskb.angle);

		var distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.hitstun, damageSpeedUpFrames, vskb.angle, target.attributes.gravity * target.modifier.gravity, target.attributes.damageflytop_gravity, ($scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.damageflytop_fall_speed, target.attributes.traction * target.modifier.traction, isFinishingTouch, inverseX, onSurface, position, $scope.stage, false, 0);

		return distance;
	}

	$scope.search = function (damage, i, prev, n, pd) {
		var found = false;
		var distance = pd;
		var last;
		var prevDistance;
		for (var x = i; x >= i - prev; x -= n) {
			last = x;
			target_percent = x - n;
			prevDistance = distance;
			distance = $scope.getDistance(damage);
			if (!distance.KO) {
				return { last: last, distance: prevDistance };
			}
		}
		return null;
	};

	$scope.calc = function (damage) {
		var data = {};
		//Check if it can KO at 999% (if not just stop calculation)
		target_percent = 999;
		var distance = $scope.getDistance(damage);
		var last = 0;
		var found = false;
		if (distance.KO) {
			for (var i = 0; i <= 1000 && !found; i += 20) {
				if (i == 1000)
					i = 999;
				target_percent = i;
				distance = $scope.getDistance(damage);
				if (distance.KO) {
					if (i == 0) {
						data = { ko: true, ko_percent: 0, distance: distance };
						found = true;
						break;
					}
					else {
						var t = $scope.search(damage, i, 20, 5, distance);
						if (t != null) {
							t = $scope.search(damage, t.last, 5, 1, t.distance);
							if (t != null) {
								t = $scope.search(damage, t.last, 1, 0.5, t.distance);
								if (t != null) {
									t = $scope.search(damage, t.last, 0.5, 0.1, t.distance);
									if (t != null) {
										t = $scope.search(damage, t.last, 0.1, 0.02, t.distance);
										data = { ko: true, ko_percent: t.last, distance: t.distance };
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

	$scope.updatePercent = function () {
		$scope.attackerPercent_style = PercentColor(parseFloat($scope.attackerPercent));
		$scope.targetPercent_style = PercentColor(parseFloat($scope.targetPercent));
		$scope.update();
	}

	$scope.calculate = function () {
		$scope.update();
        if($scope.charge_data == null && $scope.is_smash){
			base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge, $scope.selected_move != null ? $scope.selected_move.maxSmashChargeMult : 1.4 );
        }
        if (attacker.name == "Lucario") {
            base_damage *= Aura(attacker_percent, stock_dif, game_format);
            preDamage *= Aura(attacker_percent, stock_dif, game_format);
		}

		base_damage *= attacker.modifier.base_damage;
		preDamage *= attacker.modifier.base_damage;

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

		var data = $scope.calc(damage);

		$scope.visualizer_extra = [];

		if (data.ko) {
			$scope.visualizer_extra.push(new Result("Target %", data.ko_percent, "", false, true));
			$scope.visualizer.SetStage($scope.stage);
			$scope.visualizer.SetLaunch(data.distance.launchData);
		}
		else {
			$scope.visualizer_extra.push(new Result("Can't KO", "Move doesn't KO at 999%", "", false, true));
		}

	};

	$scope.calculatePercentBasedDI = function () {
		$scope.update();
		if ($scope.charge_data == null && $scope.is_smash) {
			base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge, $scope.selected_move != null ? $scope.selected_move.maxSmashChargeMult : 1.4 );
		}
		if (attacker.name == "Lucario") {
			base_damage *= Aura(attacker_percent, stock_dif, game_format);
			preDamage *= Aura(attacker_percent, stock_dif, game_format);
		}

		base_damage *= attacker.modifier.base_damage;
		preDamage *= attacker.modifier.base_damage;

		var damage = base_damage;
		damage *= attacker.modifier.damage_dealt;
		damage *= target.modifier.damage_taken;
		preDamage *= attacker.modifier.damage_dealt;
		preDamage *= target.modifier.damage_taken;
		if ($scope.is_1v1) {
			damage *= 1.2;
			preDamage *= 1.2;
		}

		var step = parseFloat($scope.di_step);

		var data = $scope.calc(damage);

		$scope.visualizer_extra = [];

		var stickList = $scope.generateStickPositions(step);

		var list = [];

		if (data.ko) {
			for (var i = 0; i < stickList.length; i++) {
				stick = stickList[i];

				var data = $scope.calc(damage);

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

			//Compare ko percents with KO'd percent to check
			var p = null;
			var error = 1.4;

			var percent_ko = parseFloat($scope.percent_ko);

			if (list[0].percent + error < percent_ko) {
				$scope.visualizer_extra.push(new Result("Error", "Inputted % is higher than best DI KO %", "", false, true));
				return;
			}


			if (list[list.length-1].percent - error > percent_ko) {
				$scope.visualizer_extra.push(new Result("Error", "Inputted % is lower than worst DI KO %", "", false, true));
				return;
			}

			var using_error = false;

			//Check if it's between best/worst DI and error variable
			if (list[0].percent + error >= percent_ko && percent_ko >= list[0].percent) {
				p = list[0];
				using_error = true;
			}else if (list[list.length - 1].percent - error <= percent_ko && percent_ko <= list[list.length - 1].percent) {
				p = list[list.length - 1];
				using_error = true;
			}

			for (var i = 0; i < list.length - 1 && p == null; i++) {
				if (list[i].percent >= percent_ko && percent_ko >= list[i + 1].percent) {
					//It's between this percents so it should be the DI used
					var d1 = list[i].percent - percent_ko;
					var d2 = percent_ko - list[i + 1].percent;
					if (d1 <= d2) {
						p = list[i];
					} else {
						p = list[i + 1];
					}
					break;
				}
			}

			if (p == null) {
				$scope.visualizer_extra.push(new Result("Error", "Couldn't find DI", "", false, true));
				return;
			}

			$scope.visualizer_extra.push(new Result("Stick X", p.di.X * (inverseX ? -1 : 1), "", false, true));
			$scope.visualizer_extra.push(new Result("Stick Y", p.di.Y, "", false, true));
			$scope.visualizer_extra.push(new Result("Stick angle", Math.floor(GetAngle(p.di.X * (inverseX ? -1 : 1), p.di.Y)), "", false, true));
			$scope.visualizer_extra.push(new Result("Calculated Target %", +p.percent.toFixed(6).toString() + (using_error ? "*" : ""), "", false, false));
			
			$scope.visualizer.SetStage($scope.stage);
			$scope.visualizer.SetLaunch(data.distance.launchData);
			stick = $scope.stick;

		}
		else {
			$scope.visualizer_extra.push(new Result("Can't KO", "Move doesn't KO at 999%", "", false, true));
		}

	};

	$scope.calculateDI = function (param) {
		if (param == undefined)
			param = true;
		else
			param = false;

		$scope.update();
		if ($scope.charge_data == null && $scope.is_smash) {
			base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge, $scope.selected_move != null ? $scope.selected_move.maxSmashChargeMult : 1.4 );
		}
		if (attacker.name == "Lucario") {
			base_damage *= Aura(attacker_percent, stock_dif, game_format);
			preDamage *= Aura(attacker_percent, stock_dif, game_format);
		}

		base_damage *= attacker.modifier.base_damage;
		preDamage *= attacker.modifier.base_damage;

		var damage = base_damage;
		damage *= attacker.modifier.damage_dealt;
		damage *= target.modifier.damage_taken;
		preDamage *= attacker.modifier.damage_dealt;
		preDamage *= target.modifier.damage_taken;
		if ($scope.is_1v1) {
			damage *= 1.2;
			preDamage *= 1.2;
		}

		var step = parseFloat($scope.di_step);

		var data = $scope.calc(damage);

		$scope.visualizer_extra = [];

		var stickList = $scope.generateStickPositions(step);

		var list = [];

		if (data.ko) {
			for (var i = 0; i < stickList.length; i++) {
				stick = stickList[i];

				var data = $scope.calc(damage);

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

			//list[0].data.distance.doPlot();

			if (param) {

				$scope.visualizer_extra.push(new Result("Stick X", list[0].di.X * (inverseX ? -1 : 1), "", false, true));
				$scope.visualizer_extra.push(new Result("Stick Y", list[0].di.Y, "", false, true));
				$scope.visualizer_extra.push(new Result("Stick angle", Math.floor(GetAngle(list[0].di.X * (inverseX ? -1 : 1), list[0].di.Y)), "", false, true));
				$scope.visualizer_extra.push(new Result("Target % with best DI", list[0].percent, "", false, true));
				data = list[0].data;
			} else {
				$scope.visualizer_extra.push(new Result("Stick X", list[list.length - 1].di.X * (inverseX ? -1 : 1), "", false, true));
				$scope.visualizer_extra.push(new Result("Stick Y", list[list.length - 1].di.Y, "", false, true));
				$scope.visualizer_extra.push(new Result("Stick angle", Math.floor(GetAngle(list[list.length - 1].di.X * (inverseX ? -1 : 1), list[list.length - 1].di.Y)), "", false, true));
				$scope.visualizer_extra.push(new Result("Target % with worst DI", list[list.length - 1].percent, "", false, true));
				data = list[list.length - 1].data;
			}
			//$scope.visualizer_extra.push(new Result("KO", data.frame, "", false, true));
			//var max_x = list[0].data.distance.graph_x + 10;
			//var max_y = list[0].data.distance.graph_y + 10;
			//max_x = max_y = Math.max(max_x, max_y);
			//Plotly.newPlot('res_graph', list[0].data.distance.plot, { 'xaxis': { 'range': [-max_x, max_x], 'showgrid': false, 'zeroline': true, 'showline': false }, 'yaxis': { 'range': [-max_y, max_y], 'showgrid': false, 'zeroline': true, 'showline': false }, 'showlegend': false, 'margin': { 'l': 25, 'r': 0, 'b': 25, 't': 0, 'pad': 0 }, 'plot_bgcolor': settings.visualizer_colors.background, 'paper_bgcolor': settings.visualizer_colors.background }, { 'displayModeBar': false });

			$scope.visualizer.SetStage($scope.stage);
			$scope.visualizer.SetLaunch(data.distance.launchData);

			stick = $scope.stick;
			
		}
		else {
			$scope.visualizer_extra.push(new Result("Can't KO", "Move doesn't KO at 999%", "", false, true));
		}

	};

	$scope.checkPosition = function (position) {
		var left = 0;
		var right = 0;
		var top = 0;
		var bottom = 0
		for (var i = 0; i < $scope.stage.collisions.length; i++) {
			var left_line = [position, [$scope.stage.blast_zones[0], position[1]]];
			var left_intersections = IntersectionLines(left_line, $scope.stage.collisions[i].vertex);
			var right_line = [position, [$scope.stage.blast_zones[1], position[1]]];
			var right_intersections = IntersectionLines(right_line, $scope.stage.collisions[i].vertex);
			var top_line = [position, [position[0], $scope.stage.blast_zones[3]]];
			var top_intersections = IntersectionLines(top_line, $scope.stage.collisions[i].vertex);
			//var bottom_line = [position, [position[0], $scope.stage.blast_zones[4]]];
			//var bottom_intersections = IntersectionLines(bottom_line, $scope.stage.collisions[i].vertex);

			for (var j = 0; j < left_intersections.length; j++) {
				left_intersections[j].distance = LineDistance(position, left_intersections[j].line);
			}

			for (var j = 0; j < right_intersections.length; j++) {
				right_intersections[j].distance = LineDistance(position, right_intersections[j].line);
			}

			for (var j = 0; j < top_intersections.length; j++) {
				top_intersections[j].distance = LineDistance(position, top_intersections[j].line);
			}

			//for (var j = 0; j < bottom_intersections.length; j++) {
			//	bottom_intersections[j].distance = LineDistance(position, bottom_intersections[j].line);
			//}

			left_intersections.sort(function (a, b) {
				if (a.distance < b.distance) {
					return -1;
				} else if (a.distance > b.distance) {
					return 1;
				}
				return 0;
			});

			right_intersections.sort(function (a, b) {
				if (a.distance < b.distance) {
					return -1;
				} else if (a.distance > b.distance) {
					return 1;
				}
				return 0;
			});

			top_intersections.sort(function (a, b) {
				if (a.distance < b.distance) {
					return -1;
				} else if (a.distance > b.distance) {
					return 1;
				}
				return 0;
			});

			//bottom_intersections.sort(function (a, b) {
			//	if (a.distance < b.distance) {
			//		return -1;
			//	} else if (a.distance > b.distance) {
			//		return 1;
			//	}
			//	return 0;
			//});

			for (var x = 0; x < left_intersections.length && x < 1; x++) {
				var material = $scope.stage.collisions[i].materials[left_intersections[x].i];
				//Check if angle between current position and possible next position make collision with line
				if (LinePassthroughCollision(LineAngle(left_line), material.passthroughAngle))
					left++;
			}

			for (var x = 0; x < right_intersections.length && x < 1; x++) {
				var material = $scope.stage.collisions[i].materials[right_intersections[x].i];
				//Check if angle between current position and possible next position make collision with line
				if (LinePassthroughCollision(LineAngle(right_line), material.passthroughAngle))
					right++;
			}

			for (var x = 0; x < top_intersections.length && x < 1; x++) {
				var material = $scope.stage.collisions[i].materials[top_intersections[x].i];
				//Check if angle between current position and possible next position make collision with line
				if (LinePassthroughCollision(LineAngle(top_line), material.passthroughAngle))
					top++;
			}

			//for (var x = 0; x < bottom_intersections.length && x < 1; x++) {
			//	var material = $scope.stage.collisions[i].materials[bottom_intersections[x].i];
			//	//Check if angle between current position and possible next position make collision with line
			//	if (LinePassthroughCollision(LineAngle(bottom_line), material.passthroughAngle))
			//		bottom++;
			//}
		}

		//if (top > 0 && bottom > 0) {
		//	return false;
		//}

		//if (left > 0 && right > 0) {
		//	return false;
		//}

		if (top > 0 && left > 0 && right > 0) {
			return false;
		}

		return true;
	};

	$scope.interpolatedPositions = function (a, b) {
		if (a.possible && b.possible) {
			if (a.di != -1 && b.di != -1) {

				
				var i_position = { x: +((a.position[0] + b.position[0]) / 2).toFixed(6), y: +((a.position[1] + b.position[1]) / 2).toFixed(6) };

				if (!$scope.checkPosition([i_position.x, i_position.y]))
					return null;

				var i_di = InterpolatedAngle(a.di, b.di);

				if (i_di < 0)
					i_di += 360;


				return new DILine(i_position.x, i_position.y, i_di, true);
			}
		}


		return null;
	}

	$scope.calculateDIPositions = function () {
		$scope.update();
		if ($scope.charge_data == null && $scope.is_smash) {
			base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge, $scope.selected_move != null ? $scope.selected_move.maxSmashChargeMult : 1.4 );
		}
		if (attacker.name == "Lucario") {
			base_damage *= Aura(attacker_percent, stock_dif, game_format);
			preDamage *= Aura(attacker_percent, stock_dif, game_format);
		}

		base_damage *= attacker.modifier.base_damage;
		preDamage *= attacker.modifier.base_damage;

		var damage = base_damage;
		damage *= attacker.modifier.damage_dealt;
		damage *= target.modifier.damage_taken;
		preDamage *= attacker.modifier.damage_dealt;
		preDamage *= target.modifier.damage_taken;
		if ($scope.is_1v1) {
			damage *= 1.2;
			preDamage *= 1.2;
		}

		var step = parseFloat($scope.di_step_stage);

		var stickList = $scope.generateStickPositions(step);

		var list = [];
		var positions = [];

		var center = $scope.stage.center;

		var left_margin = $scope.stage.blast_zones[0]/4;
		var right_margin = $scope.stage.blast_zones[1]/4;
		var top_margin = $scope.stage.blast_zones[2]/4;
		var bottom_margin = $scope.stage.blast_zones[3]/2;


		for (var i = 2; i >= 0; i--) {
			positions.push([center[0] + (left_margin * (i + 1)), center[1] + bottom_margin]);
			positions.push([center[0] + (left_margin * (i+1)), center[1]]);
			positions.push([center[0] + (left_margin * (i + 1)), center[1] + top_margin]);
			positions.push([center[0] + (left_margin * (i + 1)), center[1] + (2 * top_margin)]);
			positions.push([center[0] + (left_margin * (i + 1)), center[1] + (3 * top_margin)]);
			
		}

		positions.push([center[0], center[1] + bottom_margin]);
		positions.push([center[0], center[1]]);
		positions.push([center[0], center[1] + top_margin]);
		positions.push([center[0], center[1] + (2 * top_margin)]);
		positions.push([center[0], center[1] + (3 * top_margin)]);
		

		for (var i = 0; i < 3; i++) {
			positions.push([center[0] + (right_margin * (i + 1)), center[1] + bottom_margin]);
			positions.push([center[0] + (right_margin * (i + 1)), center[1]]);
			positions.push([center[0] + (right_margin * (i + 1)), center[1] + top_margin]);
			positions.push([center[0] + (right_margin * (i + 1)), center[1] + (2 * top_margin)]);
			positions.push([center[0] + (right_margin * (i + 1)), center[1] + (3 * top_margin)]);
			
		}


		var possible_positions = [];


		for (var i = 0; i < positions.length; i++) {
			possible_positions.push({ position: positions[i], possible: $scope.checkPosition(positions[i]), di:-1 });
		}
		

		var distances = [];

		for (var p = 0; p < possible_positions.length; p++) {
			if (!possible_positions[p].possible) {
				continue;
			}
			position.x = possible_positions[p].position[0];
			position.y = possible_positions[p].position[1];
			var tempList = [];
			var anglesDone = [];
			list = [];
			var data = $scope.calc(damage);
			if (data.ko) {
				for (var i = 0; i < stickList.length; i++) {
					stick = stickList[i];

					var d = $scope.calc(damage);
					if (d.ko) {
						tempList.push({ di: Math.floor(GetAngle(stick.X * (inverseX ? -1 : 1), stick.Y)), stick: stick, percent: d.ko_percent, data: d });
					}
				}

				if (tempList.length == 0)
					continue;

				if ($scope.di_ignore_collisions) {
					for (var i = 0; i < tempList.length; i++) {
						if (tempList[i].data.distance.collisions == 0) {
							list.push(tempList[i]);
						}
					}
				} else {
					list = tempList;
				}


				list.sort(function (a, b) {
					if (a.percent > b.percent) {
						return -1;
					} else if (a.percent < b.percent) {
						return 1;
					}
					return 0;
				});

				if (list.length > 0) {

					if (list[0].percent != 0) {
						possible_positions[p].di = list[0].di;
						list[0].data.distance.doDILine(list[0].di, false);
						distances = distances.concat(list[0].data.distance.diLines);
					} else {
						
						possible_positions[p].di = -1;

						list[0].data.distance.doDILine(list[0].di, true);
						distances = distances.concat(list[0].data.distance.diLines);
					}
				}
				
			}
		}

		if ($scope.show_interpolation) {

			//Interpolation
			var interpolations = [];
			//Side interpolation
			for (var i = 0; i < possible_positions.length - 5; i++) {
				var interpolated = $scope.interpolatedPositions(possible_positions[i], possible_positions[i + 5]);
				if (interpolated != null) {
					distances.push(interpolated);
					interpolations.push({ position: [interpolated.position.x, interpolated.position.y], possible: true, di: interpolated.angle });
				} else {
					interpolations.push({ position: [0, 0], possible: false, di: -1 });
				}

			}

			//Vertical interpolation
			for (var i = 0; i < possible_positions.length - 1; i++) {
				if (i % 5 == 4) {
					continue;
				}
				var interpolated = $scope.interpolatedPositions(possible_positions[i], possible_positions[i + 1]);
				if (interpolated != null) {
					distances.push(interpolated);
				}

			}

			for (var i = 0; i < interpolations.length - 1; i++) {
				if (i % 5 == 4) {
					continue;
				}
				var interpolated = $scope.interpolatedPositions(interpolations[i], interpolations[i + 1]);
				if (interpolated != null) {
					distances.push(interpolated);
				}

			}

		}

		$scope.visualizer.SetStage($scope.stage);
		$scope.visualizer.SetLaunch(null);
		$scope.visualizer.SetDILines(distances);
		stick = $scope.stick;

		position = { x: parseFloat($scope.position_x), y: parseFloat($scope.position_y) };

	};


    $scope.updateCharge = function(){
        if($scope.charge_data != null){
			$scope.baseDamage = $scope.selected_move.charge_damage(parseFloat($scope.smashCharge));
			$scope.bkb = $scope.selected_move.charge_bkb(parseFloat($scope.smashCharge));
			$scope.kbg = $scope.selected_move.charge_kbg(parseFloat($scope.smashCharge));
			$scope.shieldDamage = $scope.selected_move.charge_shieldDamage(parseFloat($scope.smashCharge));
            $scope.hit_frame = $scope.selected_move.hitboxActive[$scope.hitbox_active_index].start + parseFloat($scope.smashCharge);
            $scope.faf = $scope.selected_move.faf + parseFloat($scope.smashCharge);
        }
        $scope.update();
	}

    $scope.update = function () {
        $scope.check();
        $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
		attacker_percent = parseFloat($scope.attackerPercent);

        preDamage = parseFloat($scope.preDamage);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
		stale = $scope.stale;
		shieldStale = $scope.shieldStale;
        hitlag = parseFloat($scope.hitlag);

        hitframe = parseFloat($scope.hit_frame);
        faf = parseFloat($scope.faf);
        charge_frames = parseFloat($scope.smashCharge);
        r = KBModifier($scope.kb_modifier);
        bounce = $scope.kb_modifier_bounce;
        ignoreStale = $scope.ignoreStale;
        perfectshield = $scope.shield == "perfect";
        is_projectile = $scope.is_projectile == true;

        megaman_fsmash = $scope.megaman_fsmash;
        witch_time_smash_charge = $scope.witch_time_charge;
        electric = $scope.effect == "Electric";
        crouch = $scope.kb_modifier;

        is_smash = $scope.is_smash;
        wbkb = parseFloat($scope.wbkb);
        windbox = $scope.windbox;

        game_mode = $scope.game_mode;
        inverseX = $scope.inverseX;
        onSurface = $scope.surface;

        stock_dif = $scope.stock_dif;
        game_format = $scope.format;

		stick = {
			X: $scope.stick.X,
			Y: $scope.stick.Y
		};

		if (inverseX)
			stick.X *= -1;

		unblockable = $scope.unblockable;
		isFinishingTouch = $scope.isFinishingTouch;

		if (isFinishingTouch)
			$scope.set_weight = true;

        shieldDamage = parseFloat($scope.shieldDamage);

        set_weight = $scope.set_weight;

        paralyzer = $scope.effect == "Paralyze";
        
		launch_rate = parseFloat($scope.launch_rate);

		position = { x: parseFloat($scope.position_x), y: parseFloat($scope.position_y) };

		$scope.visualizer.SetStage($scope.stage);
		$scope.visualizer.SetDILines(null);
		$scope.visualizer.SetLaunch(new LaunchData([{ x: position.x, y: position.y }], { x: position.x, y: position.y }, [], -1, -1, -1, -1, -1));

        $scope.sharing_url = buildURL($scope);
    };

    $scope.check_graph = function () {
        $scope.show_graph = !$scope.show_graph;
        if ($scope.show_graph) {
            $scope.update();
        }
    }

    $scope.collapse = function (id) {
        $("#" + id).collapse('toggle');
    }

    $scope.updateParameters = function () {
        parameters = $scope.params;
        parameters.hitstunCancel.frames.airdodge = Math.floor(parameters.hitstunCancel.frames.airdodge);
        parameters.hitstunCancel.frames.aerial = Math.floor(parameters.hitstunCancel.frames.aerial);
        parameters.tumble_threshold = Math.floor(parameters.tumble_threshold);
        $scope.update();
    }


	$scope.updateStickFromCanvas = function (stick) {
		$scope.stick = stick;
		$scope.$apply();

		$scope.detectStickPosition();

		$scope.updateDI();
	}

	$scope.stickDI = new StickWheel($scope.updateStickFromCanvas, 'stickCanvas', $scope.stick);

	$scope.updateDIInput = function () {
		$scope.detectStickPosition();

		$scope.updateDI();
	}

	$scope.updateDIAngle = function () {
		var c = JSON.parse($scope.game_controller);

		var p = AngleToStickPosition(c.r, parseFloat($scope.stickAngle));

		$scope.stick = p;

		$scope.detectStickPosition(true);

		$scope.updateDI();
	}

	$scope.updateDI = function () {
		$scope.stickDI.drawStick($scope.stick);

		$scope.update();
	}


	$scope.themes = styleList;
	$scope.theme = styleList[0].name;

	$scope.changeTheme = function () {
		changeStyle($scope.theme);
		$scope.visualizer.SetBackground(settings.visualizer_colors.background);
		$scope.updateDI();
	}


	$scope.controllers = ControllerList;
	$scope.game_controller = JSON.stringify($scope.controllers[0]);

	$scope.stickInputs = StickPositions;

	$scope.stickInput = JSON.stringify(StickPositions[0]);

	$scope.generateStickPositions = function (step) {

		if (step == undefined)
			step = 1;
		
		var controller = JSON.parse($scope.game_controller);

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
			for (var i = 0; i < 360; i+=step) {
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

	$scope.updateController = function () {
		var c = JSON.parse($scope.game_controller);

		var s = StickPositions;

		var list = [new StickPosition("Custom", 255, 255, Controllers.AllControllers)];

		var input = JSON.parse($scope.stickInput);
		var f = false;

		for (var i = 0; i < s.length; i++) {
			if ((s[i].controllers & c.value) == c.value) {
				list.push(s[i]);

				if (s[i].name == input.name)
					f = true;
			}
		}

		$scope.stickInputs = list;

		if (!f) {
			var n = list[0];
			delete n.$$hashKey; //BTW Why does angular add this? it just messes stuff
			$scope.stickInput = JSON.stringify(n);
		}

		$scope.stickDI.gate = c.gate;
		$scope.stickDI.controllerR = c.r;
		$scope.stickDI.controller = c.name;
		$scope.stickDI.drawStick($scope.stick);
	}

	$scope.updateStickInput = function () {
		var input = JSON.parse($scope.stickInput);

		if (input.name == "Custom")
			return;

		$scope.stick.X = input.X;
		$scope.stick.Y = input.Y;

		$scope.updateDI();
	}

	$scope.detectStickPosition = function (ignoreAngleCheck) {

		if (ignoreAngleCheck == undefined)
			ignoreAngleCheck = false;

		var input = null;

		for (var i = 0; i < $scope.stickInputs.length; i++) {
			if ($scope.stickInputs[i].X == $scope.stick.X && $scope.stickInputs[i].Y == $scope.stick.Y) {
				input = $scope.stickInputs[i];
				break;
			}
		}

		if (input != null) {
			delete input.$$hashKey;
			$scope.stickInput = JSON.stringify(input);
		} else {
			$scope.stickInput = JSON.stringify(new StickPosition("Custom", 255, 255, Controllers.AllControllers));
		}

		if (!ignoreAngleCheck)
			$scope.stickAngle = Math.floor(GetAngle($scope.stick.X, $scope.stick.Y));

	}

	$scope.updateController();

	mapParams($scope);

	$scope.attackerPercent_style = PercentColor(parseFloat($scope.attackerPercent));
	$scope.targetPercent_style = PercentColor(parseFloat($scope.targetPercent));

    if ($scope.paralyzer && !$scope.set_weight) {
        $scope.set_weight = true;
    }

    $scope.update();
});