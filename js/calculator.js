var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
	$scope.app = 'calculator';
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
	$scope.delayed_shorthop_aerial = null;
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

    $scope.lumaPercent = 0;
    $scope.lumaclass = { 'display': 'none' };

    $scope.attackerMod = "Normal";
    $scope.targetMod = "Normal";
    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;
    $scope.luma_percent = 0;

	$scope.attacker_mod = $scope.attackerModifiers.length > 0 ? {} : { 'display': 'none' };
	$scope.target_mod = $scope.targetModifiers.length > 0 ? {} : { 'display': 'none' };

    $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
    $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
    $scope.target_weight = target.attributes.weight;
    $scope.target_gravity = target.attributes.gravity;
    $scope.target_damage_taken = target.modifier.damage_taken;
    $scope.target_kb_received = target.modifier.kb_received;
    $scope.target_traction = target.attributes.traction;
	$scope.target_fall_speed = target.attributes.fall_speed;
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
	$scope.landing_lag = 0;

	$scope.shieldstunMult = 1;

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
    $scope.extra_vis_frames = 20;

    $scope.stages = getStages();
    $scope.stages.unshift({"stage":"No stage"});
    $scope.stage = $scope.stages[44]; //FD
	$scope.stageValue = "44";

    $scope.spawns = [];

    $scope.charge_min = 0;
    $scope.charge_max = 60;
    $scope.charge_special = false;
    $scope.charge_data = null;

    $scope.stock_dif = "0";
    $scope.stock_values = ["-2","-1","0","+1","+2"];
    $scope.formats = ["Singles", "Doubles"];
    $scope.format = "Singles";

	$scope.stageName = "Final Destination";

    $scope.storedLaunches = [];

    $scope.launch_rate = launch_rate;

    $scope.delayed_landing_lag = null;

    $scope.params = parameters;

	$scope.visualizer_extra = [];

	$scope.moveset_info = "";

	$scope.visualizer = new Visualizer(document.getElementById("visualizerCanvas"));
	$scope.visualizer.SetBackground(settings.visualizer_colors.background);
	$scope.visualizer.SetSize(45);

	$scope.compareSmash4 = false;

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
        if($scope.stage.stage == "No stage"){
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
        for(var i=0;i<$scope.stage.spawns.length;i++){
            $scope.spawns.push(i+1);
		}
		$scope.visualizer.Reset();
		$scope.spawn = "Center";
		//console.log($scope.stageValue);
        $scope.update();
    }

    $scope.setPositionSpawn = function(){
        if($scope.spawn != "Center"){
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
		if ($scope.effect == "Paralyze" || $scope.effect == "Bury" || $scope.effect == "Sleep" || $scope.effect == "Disable") // || $scope.effect == "Stun") Not sure about stun
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

	$scope.check_move = function () {
		if ($scope.selected_move == null) {
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
		} else {
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
			if ($scope.selected_move.aerial && !isNaN($scope.selected_move.landingLag)) {
				$scope.use_landing_lag = "yes";
				$scope.update_faf();
			}
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
        $scope.next_hf = { 'display': $scope.hitbox_active_index < $scope.selected_move.hitboxActive.length-1 ? 'inline' : 'none' };
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
        $scope.next_hf = { 'display': $scope.hitbox_active_index < $scope.selected_move.hitboxActive.length-1 ? 'inline' : 'none' };
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

	$scope.update_landing_lag = function () {
		landing_lag = parseFloat($scope.landing_lag);

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
		$scope.is_megaman = attacker.name == "Mega Man" ? { 'display': 'block' } : { 'display':  'none' };
        if (attacker.name != "Mega Man") {
            $scope.megaman_fsmash = false;
        }
		$scope.is_bayonetta = attacker.name == "Bayonetta" ? {'display' : 'block'} : { 'display': 'none' };
        if(attacker.name != "Bayonetta"){
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
        target.modifier.damage_taken = parseFloat($scope.target_damage_taken);
        target.modifier.kb_received = parseFloat($scope.target_kb_received);
        target.attributes.traction = parseFloat($scope.target_traction);
        target.attributes.fall_speed = parseFloat($scope.target_fall_speed);

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
            $scope.target_damage_taken = target.modifier.damage_taken;
            $scope.target_kb_received = target.modifier.kb_received;
			$scope.target_fall_speed = +(target.attributes.fall_speed * target.modifier.fall_speed).toFixed(6);
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
			$scope.unblockable = attack.unblockable || attack.throw;
			$scope.throw = attack.throw;
			$scope.isFinishingTouch = attack.isFinishingTouch;
            $scope.windbox = attack.windbox;
			$scope.shieldDamage = attack.shieldDamage;
			$scope.shieldstunMult = attack.shieldstun;
			$scope.set_weight = attack.setweight;
            if (!isNaN(attack.hitboxActive[0].start)) {
                $scope.hit_frame = attack.hitboxActive[0].start;
            } else {
                $scope.hit_frame = 0;
            }
			$scope.faf = attack.faf;
			$scope.landing_lag = attack.landingLag;
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
        var damage = +(parseFloat($scope.counteredDamage) * attack.counterMult).toFixed(6);
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
					$scope.is_aerial_move == attack.aerial &&
                    $scope.windbox == attack.windbox &&
                    $scope.shieldDamage == attack.shieldDamage) {
                        $scope.move = i.toString();
                        $scope.preDamage = attack.preDamage;
                        $scope.counterMult = attack.counterMult;
					$scope.unblockable = attack.unblockable || attack.throw;
					$scope.throw = attack.throw;
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
						$scope.is_aerial_move == attack.aerial &&
                        $scope.windbox == attack.windbox &&
						parseInt($scope.shieldDamage) >= attack.shieldDamage &&
                        (attack.chargeable || attack.counterMult != 0)) {
                            $scope.preDamage = attack.preDamage;
                            $scope.counterMult = attack.counterMult;
						$scope.unblockable = attack.unblockable;
						$scope.throw = attack.throw;
							$scope.isFinishingTouch = attack.isFinishingTouch;
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
		$scope.target_mod = $scope.targetModifiers.length > 0 ? {} : { 'display' : 'none' };
		$scope.target_icon = target.icon;
		$scope.target_image = target.image;
		$scope.target_class = target.class;
        $scope.target_weight = target.attributes.weight;
        $scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
        $scope.target_damage_taken = target.modifier.damage_taken;
        $scope.target_kb_received = target.modifier.kb_received;
        $scope.target_fall_speed = target.attributes.fall_speed * target.modifier.fall_speed;
        $scope.target_traction = target.attributes.traction * target.modifier.traction;
		$scope.lumaclass = target.name == "Rosalina And Luma" ? {"display" : "block"} : { "display":  "none" };
        $scope.lumaPercent = 0;
        $scope.update();
	}

	$scope.updatePercent = function () {
		$scope.attackerPercent_style = PercentColor(parseFloat($scope.attackerPercent));
		$scope.targetPercent_style = PercentColor(parseFloat($scope.targetPercent));
		$scope.update();
	}

	$scope.calculate = function () {
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

        if (wbkb == 0) {
			vskb = VSKB(target_percent + (preDamage * StaleNegation(stale, shieldStale, ignoreStale)), base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, stale, shieldStale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
            vskb.addModifier(attacker.modifier.kb_dealt);
            vskb.addModifier(target.modifier.kb_received);
        } else {
			vskb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, StaleDamage(damage, stale, shieldStale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
            vskb.addModifier(target.modifier.kb_received);
        }

        var distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.hitstun, vskb.hitstunFSM, vskb.angle, target.attributes.gravity * target.modifier.gravity, ($scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.traction * target.modifier.traction, isFinishingTouch, inverseX, onSurface, position, stage, graph, parseFloat($scope.extra_vis_frames));

		if ($scope.is_1v1) {
			damage *= 1.2;
		}
		if ($scope.throw) {
			damage *= attacker.modifier.damage_dealt;
		}

        //if(stage != null){
        //    if(distance.bounce_speed >= 1){
        //        //$scope.kb_modifier_bounce = distance.bounce;
        //        //bounce = distance.bounce;
        //    }
        //}
		
		//var vsDistance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.hitstun, vskb.hitstunFSM, vskb.angle, target.attributes.gravity * target.modifier.gravity, ($scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.traction * target.modifier.traction, isFinishingTouch, inverseX, onSurface, position, stage, !graph, parseFloat($scope.extra_vis_frames));
        vskb.bounce(bounce);
        var v_hc = HitstunCancel(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.angle, windbox, electric);

		//Results categories
		var resultList = [];
		var damageList = [];
		var kbList = [];
		var shieldList = [];

		paralyzer = effect == "Paralyze";

		if (!ignoreStale) {
			if (StaleNegation(stale, shieldStale, ignoreStale) > 1) {
				damageList.push(new Result("Freshness bonus", "x" + +StaleNegation(stale, shieldStale, ignoreStale).toFixed(6)));
			} else {
				damageList.push(new Result("Stale-move negation", "x" + +StaleNegation(stale, shieldStale, ignoreStale).toFixed(6)));
			}
			
		}
		if (target.modifier.damage_taken != 1) {
			damageList.push(new Result("Damage taken", "x" + +target.modifier.damage_taken.toFixed(6)));
		}
		if (attacker.modifier.damage_dealt != 1) {
			damageList.push(new Result("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(6)));
		}
		if ($scope.is_1v1) {
			damageList.push(new Result("1v1 Damage increase", "x1.2"));
		}
		if ($scope.shorthop_aerial) {
			damageList.push(new Result("Short hop aerial", "x0.85"));
		}
		if (attacker.name == "Lucario") {
			damageList.push(new Result("Aura", "x" + +Aura(attacker_percent, stock_dif, game_format).toFixed(6)));
		}
		if (is_smash && $scope.charge_data == null) {
			damageList.push(new Result("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames, megaman_fsmash, witch_time_smash_charge, $scope.selected_move != null ? $scope.selected_move.maxSmashChargeMult : 1.4 ).toFixed(6)));
		}
		if (attacker.modifier.base_damage != 1) {
			damageList.push(new Result("Base damage multiplier", "x" + +attacker.modifier.base_damage.toFixed(6)));
		}
		if (preDamage != 0) {
			damageList.push(new Result("Before launch damage", "+" + +(preDamage * StaleNegation(stale, shieldStale, ignoreStale)).toFixed(6) + "%"));
		}
		damageList.push(new Result("Damage", +StaleDamage(damage, stale, shieldStale, ignoreStale).toFixed(6) + "%"));
		damageList.push(new Result("Target's %", +(target_percent + (preDamage * StaleNegation(stale, shieldStale, ignoreStale)) + StaleDamage(damage, stale, shieldStale, ignoreStale)).toFixed(6) + "%"));
        if (!paralyzer) {
			damageList.push(new Result("Attacker Hitlag", Hitlag(StaleDamage(damage, stale, shieldStale, ignoreStale), is_projectile ? 0 : hitlag, electric, 1)));
			damageList.push(new Result("Target Hitlag", Hitlag(StaleDamage(damage, stale, shieldStale, ignoreStale), hitlag, electric, HitlagCrouch(crouch))));
        } else {
			damageList.push(new Result("Attacker Hitlag", ParalyzerHitlag(StaleDamage(damage, shieldStale, stale, ignoreStale), is_projectile ? 0 : hitlag, 1)));
		}
		if (r != 1) {
			kbList.push(new Result("KB modifier", "x" + +r.toFixed(6)));
		}
		if (launch_rate != 1) {
			kbList.push(new Result("Launch rate", "x" + +launch_rate.toFixed(6), true));
		}
		if (target.modifier.kb_received != 1) {
			kbList.push(new Result("KB received", "x" + +target.modifier.kb_received.toFixed(6)));
		}
		if (attacker.modifier.kb_dealt != 1) {
			kbList.push(new Result("KB dealt", "x" + +attacker.modifier.kb_dealt.toFixed(6)));
		}
		if (!ignoreStale)
			kbList.push(new Result("Rage","x" + +Rage(attacker_percent).toFixed(6)));
		kbList.push(new Result("Total KB", +vskb.kb.toFixed(6)));
		if ($scope.kb_modifier == "buried") {
			kbList.push(new Result("Buried removed", vskb.kb >= parameters.buried_kb_threshold ? "Yes" : "No"));
		}
		
        kbList.push(new Result("Launch angle", +vskb.angle.toFixed(6)));
		if (effect == "Paralyze") {
            kbList.push(new Result("Paralysis time", ParalysisTime(vskb.kb, damage, hitlag, HitlagCrouch(crouch))));
		}
		if (effect == "Flower") {
			kbList.push(new Result("Flower time", FlowerTime(StaleDamage(damage, stale, shieldStale, ignoreStale))));
		}
		if (effect == "Bury") {
			kbList.push(new Result("Buried time", BuriedTime(target_percent + StaleDamage(preDamage, stale, shieldStale, ignoreStale), StaleDamage(damage, stale, shieldStale, ignoreStale), vskb.kb)));
		}
		if (effect == "Sleep") {
			kbList.push(new Result("Sleep time", SleepTime(target_percent + StaleDamage(preDamage, stale, shieldStale, ignoreStale), StaleDamage(damage, stale, shieldStale, ignoreStale), vskb.kb)));
		}
		if (effect == "Freeze") {
			kbList.push(new Result("Freeze time", FreezeTime(StaleDamage(damage, stale, shieldStale, ignoreStale), vskb.kb)));
		}
		if (effect == "Stun") {
			kbList.push(new Result("Stun time", StunTime(vskb.kb)));
		}
		if (effect == "Disable") {
			kbList.push(new Result("Disable time", DisableTime(target_percent + StaleDamage(preDamage, stale, shieldStale, ignoreStale), StaleDamage(damage, stale, shieldStale, ignoreStale), vskb.kb)));
		}
		kbList.push(new Result("Hitstun", Hitstun(vskb.base_kb, windbox, electric)));
		//kbList.push(new Result("Hitstun", HitstunWithFSM(vskb.base_kb, windbox, electric), Hitstun(vskb.base_kb, windbox, electric) == HitstunWithFSM(vskb.base_kb, windbox, electric)));
		//kbList.push(new Result("Hitstun with FSM", HitstunWithFSM(vskb.base_kb, windbox, electric)));

        kbList.push(new Result("First Actionable Frame", FirstActionableFrame(vskb.base_kb, windbox, electric)));
        kbList.push(new Result("Airdodge hitstun cancel", v_hc.airdodge, (Hitstun(vskb.base_kb, windbox, electric) == 0 || Hitstun(vskb.base_kb, windbox, electric) + 1 == v_hc.airdodge)));
        kbList.push(new Result("Aerial hitstun cancel", v_hc.aerial, (Hitstun(vskb.base_kb, windbox, electric) == 0 || Hitstun(vskb.base_kb, windbox, electric) + 1 == v_hc.aerial)));

        kbList.push(new Result("Tumble", vskb.tumble ? "Yes" : "No"));

        kbList.push(new Result("Reeling", vskb.reeling ? "30%" : "0%", !vskb.reeling));
        //kbList.push(new Result("Reeling hitstun", trainingkb.reeling ? Hitstun(trainingkb.base_kb, windbox, electric, true) : Hitstun(trainingkb.base_kb, windbox, electric), vskb.reeling ? Hitstun(vskb.base_kb, windbox, electric, true) : Hitstun(vskb.base_kb, windbox, electric), !trainingkb.reeling, !vskb.reeling));
        //kbList.push(new Result("Reeling FAF", FirstActionableFrame(trainingkb.base_kb, windbox, electric, true), FirstActionableFrame(vskb.base_kb, windbox, electric, true), !trainingkb.reeling, !vskb.reeling));

        kbList.push(new Result("Can Jab lock", vskb.can_jablock ? "Yes" : "No"));

        kbList.push(new Result("LSI", +vskb.lsi.toFixed(6), vskb.lsi == 1));
        kbList.push(new Result("Horizontal Launch Speed", +vskb.horizontal_launch_speed.toFixed(6)));
        kbList.push(new Result("Gravity boost", +vskb.add_gravity_speed.toFixed(6), vskb.add_gravity_speed == 0));
		kbList.push(new Result("Vertical Launch Speed", vskb.vertical_launch_speed));
		kbList.push(new Result("Launch Speed", +vskb.total_launch_speed.toFixed(6)));
        //kbList.push(new Result("Max Horizontal Distance", +vsDistance.max_x.toFixed(6)));
        //kbList.push(new Result("Max Vertical Distance", +vsDistance.max_y.toFixed(6)));


		kbList.push(new Result("Hit Advantage", HitAdvantage(vskb.hitstun, is_projectile ? hitframe + Hitlag(StaleDamage(damage, stale, shieldStale, ignoreStale), hitlag, electric, HitlagCrouch(crouch)) : hitframe, $scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf, effect == "Paralyze" ? ParalysisTime(vskb.kb, damage, hitlag, HitlagCrouch(crouch)) : 0)));

        if (target.name == "Rosalina And Luma") {
            if (!wbkb) {
				var luma_vskb = VSKB(15 + luma_percent, base_damage, damage, 100, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, stale, shieldStale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, stick);
                luma_vskb.addModifier(attacker.modifier.kb_dealt);
                luma_vskb.addModifier(target.modifier.kb_received);
				kbList.push(new Result("Luma KB", +luma_vskb.kb.toFixed(6)));
				kbList.push(new Result("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
				kbList.push(new Result("Luma hitstun", LumaHitstun(luma_vskb.kb, windbox, electric), luma_vskb.tumble));
            } else {
				var luma_vskb = WeightBasedKB(100, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, 15 + luma_percent, StaleDamage(damage, stale, shieldStale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, stick);
                luma_vskb.addModifier(target.modifier.kb_received);
                luma_vskb.addModifier(target.modifier.kb_received);
                kbList.push(new Result("Luma KB", +luma_vskb.kb.toFixed(6)));
				kbList.push(new Result("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
				kbList.push(new Result("Luma hitstun", LumaHitstun(luma_vskb.kb, windbox, electric), luma_vskb.tumble));
            }
        }

		if (!unblockable) {
			var damageOnShield = base_damage * attacker.modifier.damage_dealt;
			if ($scope.shorthop_aerial) {
				damageOnShield *= parameters.shorthop_aerial;
			}
			var s = (damageOnShield * 1.19) + (shieldDamage * 1.19);
			var sv = (StaleDamage(damageOnShield, stale, shieldStale, ignoreStale) * 1.19) + (shieldDamage * 1.19);
            if (!perfectshield) {
                shieldList.push(new Result("Shield Damage", +sv.toFixed(6)));
                //shieldList.push(new Result("Full HP shield", +(50 * target.modifier.shield).toFixed(6), +(50 * target.modifier.shield).toFixed(6)));
				shieldList.push(new Result("Shield Break", sv >= 50 * target.modifier.shield ? "Yes" : "No"));
			}

			shieldList.push(new Result("Shield Hitlag", ShieldHitlag(StaleDamage(damageOnShield, stale, shieldStale, ignoreStale), hitlag, electric)));
			shieldList.push(new Result("Shield stun multiplier", "x" + ShieldStunMultiplier(shieldstunMult, is_projectile, is_smash, is_aerial_move), ShieldStunMultiplier(shieldstunMult, is_projectile, is_smash, is_aerial_move) == 1));
			shieldList.push(new Result("Shield stun", ShieldStun(StaleDamage(damageOnShield, stale, shieldStale, ignoreStale), shieldstunMult, is_projectile, perfectshield, is_smash, is_aerial_move)));
			shieldList.push(new Result("Shield Advantage", ShieldAdvantage(StaleDamage(damageOnShield, stale, shieldStale, ignoreStale), shieldstunMult, hitlag, hitframe, $scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf, is_projectile, electric, perfectshield, is_smash, is_aerial_move)));

			if (!windbox) {
				if (!is_projectile)
					shieldList.push(new Result("Attacker shield pushback", +AttackerShieldPushback(StaleDamage(damageOnShield, stale, shieldStale, ignoreStale)).toFixed(6)));

				shieldList.push(new Result("Target shield pushback", +(ShieldPushback(StaleDamage(damageOnShield, stale, shieldStale, ignoreStale), is_projectile, perfectshield, is_smash, is_aerial_move)).toFixed(6), sv >= 50 * target.modifier.shield));
			}
        } else {
            shieldList.push(new Result("Unblockable attack", "Yes"));
        }

        
		if (graph) {
			$scope.visualizer.SetStage(stage);
			$scope.visualizer.SetLaunch(distance.launchData);

			//if ($scope.compareSmash4) {
			//	var lsm = parameters.launch_speed;
			//	parameters.launch_speed = 0.03;

			//	damage = base_damage;
			//	damage *= attacker.modifier.damage_dealt;
			//	damage *= target.modifier.damage_taken;
			//	preDamage *= attacker.modifier.damage_dealt;
			//	preDamage *= target.modifier.damage_taken;

			//	var smash4kb;
			//	if (wbkb == 0) {
			//		smash4kb = VSKB(target_percent + (preDamage * StaleNegation(stale, shieldStale, ignoreStale)), base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
			//		smash4kb.addModifier(attacker.modifier.kb_dealt);
			//		smash4kb.addModifier(target.modifier.kb_received);
			//	} else {
			//		smash4kb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, set_weight, stick, target.modifier.name == "Character Inhaled", launch_rate);
			//		smash4kb.addModifier(target.modifier.kb_received);
			//	}

			//	parameters.launch_speed = lsm;

			//	var smash4Distance = new Distance(smash4kb.kb, smash4kb.horizontal_launch_speed, smash4kb.vertical_launch_speed, S4Hitstun(smash4kb.kb, smash4kb.windbox, smash4kb.electric, true), smash4kb.angle, target.attributes.gravity * target.modifier.gravity, ($scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.traction * target.modifier.traction, isFinishingTouch, inverseX, onSurface, position, stage, graph, parseFloat($scope.extra_vis_frames), true);
			//	$scope.visualizer.SetSmash4Launch(smash4Distance.launchData);
			//} else {
			//	$scope.visualizer.SetSmash4Launch(null);
			//}

			$scope.visualizer_extra = distance.extra;
		} else {
			$scope.visualizer_extra = [];
		}

		return {
			damage: new ResultList(damageList),
			kb: new ResultList(kbList),
			shield: new ResultList(shieldList)
		};
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
        target_percent = parseFloat($scope.targetPercent);
        preDamage = parseFloat($scope.preDamage);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
		stale = $scope.stale;
		shieldStale = $scope.shieldStale;
		hitlag = parseFloat($scope.hitlag);

		if ($scope.selected_move != null) {
			if ($scope.selected_move.calculateThrowData != null) {
				var throwData = $scope.selected_move.calculateThrowData(target.name, target.attributes.weight);
				$scope.hit_frame = throwData.hitFrame;
				$scope.faf = throwData.faf;
			}
		}

        hitframe = parseFloat($scope.hit_frame);
        faf = parseFloat($scope.faf);
        charge_frames = parseFloat($scope.smashCharge);
        r = KBModifier($scope.kb_modifier);
        bounce = $scope.kb_modifier_bounce;
        ignoreStale = $scope.ignoreStale;
        perfectshield = $scope.shield == "perfect";
        is_projectile = $scope.is_projectile == true;

		megaman_fsmash = $scope.megaman_fsmash;
		electric = $scope.effect == "Electric";
        witch_time_smash_charge = $scope.witch_time_charge;
        crouch = $scope.kb_modifier;

		is_smash = $scope.is_smash && !$scope.charge_special;
		is_aerial_move = $scope.is_aerial_move;
        wbkb = parseFloat($scope.wbkb);
        windbox = $scope.windbox;

        game_mode = $scope.game_mode;
        stage = $scope.stage;
        graph = $scope.show_graph;
        position = {"x":parseFloat($scope.position_x), "y":parseFloat($scope.position_y)};
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

        luma_percent = parseFloat($scope.lumaPercent);

		unblockable = $scope.unblockable;
		isFinishingTouch = $scope.isFinishingTouch;

		if (isFinishingTouch)
			$scope.set_weight = true;

        shieldDamage = parseFloat($scope.shieldDamage);

        set_weight = $scope.set_weight;

		effect = $scope.effect
        
		launch_rate = parseFloat($scope.launch_rate);

		shieldstunMult = parseFloat($scope.shieldstunMult);

        $scope.results = $scope.calculate();


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

	$scope.storeDistanceCalculation = function () {
		$scope.visualizer.StoreLaunch();
    }

	$scope.clearVisualizerList = function () {
		$scope.visualizer.ClearStoredLaunches();
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

	$scope.updateStage();

	mapParams($scope);

	$scope.attackerPercent_style = PercentColor(parseFloat($scope.attackerPercent));
	$scope.targetPercent_style = PercentColor(parseFloat($scope.targetPercent));

	if ($scope.effect == "Paralyze" || $scope.effect == "Bury" || $scope.effect == "Sleep" || $scope.effect == "Disable") // || $scope.effect == "Stun") Not sure about stun
		$scope.set_weight = true;

	$scope.update();
});