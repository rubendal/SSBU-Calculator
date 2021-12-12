var headers = ["type", "attacker", "attacker_modifier", "attacker_name", "target", "target_modifier", "target_name", "attacker_percent", "rage", "target_percent",
	"move", "move_base_damage", "charge_frames", "base_damage", "damage", "ignore_staleness", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "staleness_multiplier", "aura", "stock_difference", "angle", "bkb", "fkb", "kbg",
	"kb_modifier", "kb_multiplier", "kb", "di_lsi_angle", "launch_angle", "hitstun", "tumble", "can_jab_lock", "lsi_multiplier", "horizontal_launch_speed", "vertical_launch_speed",
	"horizontal_distance", "vertical_distance", "KO"];

var tsv_rows = [];
var rows_update = [];

var worker;

function showSaveDialog(data){
    
    var filename = "data.tsv";
    if(window.navigator.msSaveBlob){
        //Edge
        var blob = new Blob([data],{type : 'text/tsv'});
        window.navigator.msSaveBlob(blob,filename);
    }else{
        //Firefox
        if(window.globalStorage){
            var a = document.createElement('a');
            a.style = "display: none";  
            a.download = filename;
            a.href = "data:application/octet-stream;base64," + btoa(data);
            document.body.appendChild(a);
            a.click();
            setTimeout(function(){
                a.remove();
            },200);
		} else {
			//Chrome and others
            var a = document.createElement('a');
            a.style = "display: none";  
            var blob = new Blob([data],{type : 'text/tsv'});
            var url = window.URL.createObjectURL(blob);
            a.download = filename;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            setTimeout(function(){
                a.remove();
                window.URL.revokeObjectURL(url);
            },200);
        }
            
    }
}

var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
	$scope.app = 'multicalc';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;
	$scope.sharing_url = "";
	$scope.attacker_characters = names;
	$scope.characters = names;
	$scope.attackerValue = attacker.display_name;
	$scope.attackerName = attacker.display_name;
	$scope.attackerModifiers = attacker.modifiers;
	$scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
	$scope.dataViewerAttackerValue = encodeURI(attacker.DataViewerName);
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
	$scope.inkValue = 0;

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
	$scope.target_damageflytop_gravity = target.attributes.damageflytop_gravity;
	$scope.target_damage_taken = target.modifier.damage_taken;
	$scope.target_kb_received = target.modifier.kb_received;
	$scope.target_traction = target.attributes.traction;
	$scope.target_fall_speed = target.attributes.fall_speed;
	$scope.target_damageflytop_fall_speed = target.attributes.damageflytop_fall_speed;
	$scope.is_1v1 = true;

	$scope.is_smash = false;
	$scope.is_aerial_move = false;
	$scope.uses_aerial_shieldstun = false;
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
	$scope.addHitstun = 0;

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
	$scope.stages.unshift({ "stage": "No stage" });
	$scope.stage = $scope.stages[50]; //FD
	$scope.stageValue = "50";

	$scope.spawns = [];

	$scope.charge_min = 0;
	$scope.charge_max = 60;
	$scope.charge_special = false;
	$scope.charge_data = null;

	$scope.stock_dif = "0";
	$scope.stock_values = ["-2", "-1", "0", "+1", "+2"];
	$scope.formats = ["Singles", "Doubles"];
	$scope.format = "Singles";

	$scope.stageName = "Final Destination";

	$scope.storedLaunches = [];

	$scope.launch_rate = launch_rate;

	$scope.delayed_landing_lag = null;

	$scope.params = parameters;

	$scope.visualizer_extra = [];

	$scope.moveset_info = "";

	$scope.compareSmash4 = false;

    $scope.iterations = 1;
    $scope.stored = 0;

    $scope.charging_frames_type = "Charging frames";

    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;
    $scope.luma_percent = 0;

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.attacker_from = 35;
    $scope.attacker_to = 150;
    $scope.attacker_step = 0.5;
    $scope.target_from = 0;
    $scope.target_to = 150;
    $scope.target_step = 1;

    $scope.charge_min = 0;
	$scope.charge_max = 60;

	$scope.moveIterateDisable = false;
	$scope.diIterateDisable = false;
	$scope.moveIterateClass = '';
	$scope.diIterateClass = false;

	$scope.visualizer = new Visualizer(document.getElementById("visualizerCanvas"));
	$scope.visualizer.SetBackground(settings.visualizer_colors.background);
	$scope.visualizer.SetSize(45);

	$scope.it_mode = "normal";
	$scope.it_normalStyle = {};
	$scope.generateStyle = {};
	$scope.cancelStyle = { display: 'none' };
	$scope.it_koStyle = { display: 'none' };
	$scope.it_ko_mode = 'ko';

	$scope.ko_table = [];

	$scope.createWorker = function() {
		worker = new Worker('./js_previousVersion/worker/multiworker.js');

		worker.onmessage = function (e) {
			var data = e.data;

			if (data.rows !== undefined) {
				tsv_rows = tsv_rows.concat(data.rows);


				$scope.cancelStyle = { display: 'none' };
				$scope.generateStyle = { display: 'block' };

				if (data.mode !== "normal") {
					$scope.ko_table = [];
					if (data.ko_mode === "ko") {
						for (var i = 0; i < tsv_rows.length; i++) {
							if (tsv_rows[i][0] == "KO %") {
								$scope.ko_table.push({
									character: tsv_rows[i][6],
									percent: tsv_rows[i][9]
								});
							}
						}
					}
					else if (data.ko_mode === "best_di") {
						for (var i = 0; i < tsv_rows.length; i++) {
							if (tsv_rows[i][0] == "Best DI KO %") {
								$scope.ko_table.push({
									character: tsv_rows[i][6],
									percent: tsv_rows[i][9],
									angle: tsv_rows[i][35]
								});
							}
						}
					}
				}
			}

			if (data.rows === undefined)
				$scope.stored = data.count + tsv_rows.length;
			else
				$scope.stored = tsv_rows.length;

			try {
				$scope.$apply();
			} catch (ex) {
				1;
			}
		}
	}

	$scope.createWorker();

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
		//console.log($scope.stageValue);
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
		if ($scope.effect == "Paralyze" || $scope.effect == "Bury" || $scope.effect == "Sleep" || $scope.effect == "Disable") // || $scope.effect == "Stun") Not sure about stun
			$scope.set_weight = true;
		$scope.update();
	}

	$scope.charging = function () {
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
			$scope.uses_aerial_shieldstun = $scope.selected_move.aerial_shieldstun;
			$scope.is_aerial = $scope.selected_move.aerial ? {} : { 'display': 'none' };
			if ($scope.selected_move.aerial && !isNaN($scope.selected_move.landingLag)) {
				$scope.use_landing_lag = "yes";
				$scope.update_faf();
			}
			$scope.prev_hf = { 'display': 'none' };
			$scope.next_hf = { 'display': $scope.selected_move.hitboxActive.length > 1 ? 'inline' : 'none' };
			if ($scope.selected_move.chargeable) {
				if ($scope.selected_move.charge != null) {
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
					$scope.uses_aerial_shieldstun = false;
					$scope.charging_frames_type = attacker.name == "Donkey Kong" ? "Arm swings" : (attacker.name == "Jigglypuff" ? "Speed" : "Frames charged");
					$scope.updateCharge();

				} else {
					$scope.charge_data = null;
					$scope.charge_min = 0;
					$scope.smashCharge = 0;
					$scope.charge_max = 60;
					$scope.charge_special = false;
					$scope.is_smash = $scope.selected_move.smash_attack;
					$scope.is_aerial_move = false;
					$scope.uses_aerial_shieldstun = false;
					$scope.charging_frames_type = "Frames charged";
				}
			} else {
				$scope.charge_data = null;
				$scope.charge_min = 0;
				//$scope.smashCharge = 0;
				$scope.charge_max = 60;
				$scope.charge_special = false;
				$scope.is_smash = $scope.selected_move.smash_attack;
				$scope.is_aerial_move = $scope.selected_move.aerial;
				$scope.uses_aerial_shieldstun = $scope.selected_move.aerial_shieldstun;
				$scope.charging_frames_type = "Frames charged";
			}
			$scope.checkSmashVisibility();
		}

	}

	$scope.prev_hit_frame = function () {
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

	$scope.next_hit_frame = function () {
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

	$scope.update_faf = function () {
		landing_lag = 0;
		switch ($scope.use_landing_lag) {
			case "no":
				$scope.faf = $scope.selected_move.faf;
				break;
			case "yes":
				$scope.faf = $scope.hit_frame + 1;
				landing_lag = $scope.selected_move.landingLag;
				break;
			case "autocancel":
				var i = $scope.hit_frame;
				var h = $scope.hit_frame + 50;
				var f = false;
				for (i = $scope.hit_frame; i < h; i++) {
					for (var x = 0; x < $scope.selected_move.autoCancel.length; x++) {
						if ($scope.selected_move.autoCancel[x].eval(i)) {
							f = true;
							break;
						}
					}
					if (f) {
						break;
					}
				}
				if (f) {
					$scope.faf = i;
				} else {
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

	$scope.updateAttacker = function () {
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
			$scope.target_damageflytop_fall_speed = +(target.attributes.fall_speed).toFixed(6);
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
			$scope.isFinishingTouch = false;
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
			if (attack.name == "Fsmash" && attacker.name == "Mega Man") {
				$scope.megaman_fsmash = true;
			} else {
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
			if ($scope.angle == attack.angle &&
				$scope.baseDamage == attack.base_damage &&
				$scope.bkb == attack.bkb &&
				$scope.kbg == attack.kbg &&
				$scope.wbkb == attack.wbkb &&
				$scope.is_smash == attack.smash_attack &&
				$scope.is_aerial_move == attack.aerial &&
				$scope.uses_aerial_shieldstun == attack.aerial_shieldstun &&
				$scope.windbox == attack.windbox &&
				$scope.shieldDamage == attack.shieldDamage) {
			} else {
				if (!$scope.detectAttack()) {
					$scope.move = "0";
					$scope.moveset[0].name = "Custom move";
					$scope.preDamage = 0;
					$scope.unblockable = false;
					$scope.throw = false;
					$scope.isFinishingTouch = false;
					$scope.selected_move = null;
					$scope.uses_aerial_shieldstun = $scope.is_aerial_move;
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
				$scope.uses_aerial_shieldstun = $scope.is_aerial_move;

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
					$scope.uses_aerial_shieldstun == attack.aerial_shieldstun &&
					$scope.windbox == attack.windbox &&
					$scope.shieldDamage == attack.shieldDamage) {
					$scope.move = i.toString();
					$scope.preDamage = attack.preDamage;
					$scope.counterMult = attack.counterMult;
					$scope.unblockable = attack.unblockable || attack.throw;
					$scope.throw = attack.throw;
					$scope.isFinishingTouch = false;
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
						$scope.uses_aerial_shieldstun == attack.aerial_shieldstun &&
						$scope.windbox == attack.windbox &&
						parseInt($scope.shieldDamage) >= attack.shieldDamage &&
						(attack.chargeable || attack.counterMult != 0)) {
						$scope.preDamage = attack.preDamage;
						$scope.counterMult = attack.counterMult;
						$scope.unblockable = attack.unblockable;
						$scope.throw = attack.throw;
						$scope.isFinishingTouch = false;
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
		if (target.name == "Ice Climbers") {
			$scope.targetMod = "Popo";
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
		$scope.lumaclass = target.name == "Rosalina And Luma" ? { "display": "block" } : { "display": "none" };
		$scope.lumaPercent = 0;
		$scope.update();
	}

	$scope.updatePercent = function () {
		$scope.attackerPercent_style = PercentColor(parseFloat($scope.attackerPercent));
		$scope.targetPercent_style = PercentColor(parseFloat($scope.targetPercent));
		$scope.update();
	}

	$scope.updateCharge = function () {
		if ($scope.charge_data != null) {
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
		$scope.dataViewerAttackerValue = encodeURI(attacker.DataViewerName);
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
		uses_aerial_shieldstun = $scope.uses_aerial_shieldstun;

		wbkb = parseFloat($scope.wbkb);
		windbox = $scope.windbox;

		game_mode = $scope.game_mode;
		stage = $scope.stage;
		graph = $scope.show_graph;
		position = { "x": parseFloat($scope.position_x), "y": parseFloat($scope.position_y) };
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

		shieldDamage = parseFloat($scope.shieldDamage);

		set_weight = $scope.set_weight;

		effect = $scope.effect

		launch_rate = parseFloat($scope.launch_rate);

		shieldstunMult = parseFloat($scope.shieldstunMult);

		addHitstun = parseFloat($scope.addHitstun);

		ink = parseFloat($scope.inkValue);

		position = { x: parseFloat($scope.position_x), y: parseFloat($scope.position_y) };

		$scope.sharing_url = buildURL($scope);

		$scope.visualizer.SetStage(stage);
		$scope.visualizer.SetLaunch(new LaunchData([{ x: position.x, y: position.y }], { x: position.x, y: position.y }, [], -1, -1, -1, -1, -1));
        
        //$scope.changeCharacters($scope.inc_mod, $scope.inc_cust);

  //      var at_from = parseFloat($scope.attacker_from);
  //      var at_to = parseFloat($scope.attacker_to);
  //      var at_step = parseFloat($scope.attacker_step);


  //      var from = parseFloat($scope.target_from);
  //      var to = parseFloat($scope.target_to);
  //      var step = parseFloat($scope.target_step);

  //      var m;
		//if ($scope.move == 0) {
		//	m = new Move(0, 0, "Custom", "Custom", base_damage, angle, bkb, kbg, wbkb, [], 0, -1, [], 0, 0, 0, shieldDamage);
  //          m.is_smash = is_smash;
  //      }else{ 
  //          m = $scope.moveset[$scope.move];
  //      }

  //      var smashcount = 0;
  //      $scope.moveset.forEach(function(v,i){
  //          if(v.smash_attack){
  //              smashcount++;
  //          }
  //      });


  //      smashcount = $scope.it_moves ? ($scope.it_charge ? smashcount : 0) : $scope.it_charge && is_smash ? 1 : 0;
  //      var imod = $scope.inc_mod && $scope.it_targets ? 23 : ($scope.inc_mod ? (target.modifiers.length > 0 ? target.modifiers.length - 1 : 0) : 0);
  //      //var istale = $scope.it_stale ? 10 : 1; Removed cause all queue iteraions = 9! (which is 362880)
  //      var istale = 1;
  //      var ikbmod = $scope.it_kb_mod ? 3 : 1;
  //      var imoves = $scope.it_moves ? ($scope.moveset.length > 1 ? $scope.moveset.length - 1 : 1) : 1;
  //      var itargets = $scope.it_targets ? names.length : 1;
  //      var ipercent = $scope.it_percent ? Math.floor(((to - from)/step)) + 1 : 1;
  //      var irage = $scope.it_rage ? Math.floor((at_to - at_from)/at_step) + 1 : 1;
  //      var istocks = $scope.it_stock_dif ? 5 : 1;
  //      var idi = $scope.it_di ? 361 : 1;
  //      var calculations = (istale * ikbmod * (imoves - smashcount) * (itargets + imod) * ipercent * irage * istocks * idi) + (smashcount * 61 * istale * ikbmod * (itargets + imod) * ipercent * irage * istocks * idi);

  //      $scope.calculations = calculations;

    };

    var bd = base_damage;
    var moves = $scope.moveset.slice();
    var damage = base_damage;
    var kb;
    var distance;
    var move;
    var faf;
    var hit_frame;

    $scope.generate = function(){

		$scope.update();

		$scope.ko_table = [];

		//worker.update(vars);

		var params = {
			attacker_percent: parseFloat($scope.attackerPercent),
			target_percent: parseFloat($scope.targetPercent),
			preDamage: parseFloat($scope.preDamage),
			base_damage: parseFloat($scope.baseDamage),
			angle: parseFloat($scope.angle),
			in_air: $scope.in_air,
			bkb: parseFloat($scope.bkb),
			kbg: parseFloat($scope.kbg),
			stale: $scope.stale,
			shieldStale: $scope.shieldStale,
			hitlag: parseFloat($scope.hitlag),
			hitframe: parseFloat($scope.hit_frame),
			faf: parseFloat($scope.faf),
			charge_frames: parseFloat($scope.smashCharge),
			r: KBModifier($scope.kb_modifier),
			bounce: $scope.kb_modifier_bounce,
			ignoreStale: $scope.ignoreStale,
			perfectshield: $scope.shield === "perfect",
			is_projectile: $scope.is_projectile === true,

			megaman_fsmash: $scope.megaman_fsmash,
			electric: $scope.effect === "Electric",
			witch_time_smash_charge: $scope.witch_time_charge,
			crouch: $scope.kb_modifier,

			is_smash: $scope.is_smash && !$scope.charge_special,
			is_aerial_move: $scope.is_aerial_move,
			uses_aerial_shieldstun: $scope.uses_aerial_shieldstun,

			wbkb: parseFloat($scope.wbkb),
			windbox: $scope.windbox,

			game_mode: $scope.game_mode,
			stage: $scope.stage,
			graph: $scope.show_graph,
			position: { "x": parseFloat($scope.position_x), "y": parseFloat($scope.position_y) },
			inverseX: $scope.inverseX,
			onSurface: $scope.surface,

			stock_dif: $scope.stock_dif,
			game_format: $scope.format,

			stick: {
				X: $scope.stick.X,
				Y: $scope.stick.Y
			},
			luma_percent: parseFloat($scope.lumaPercent),

			unblockable: $scope.unblockable,

			shieldDamage: parseFloat($scope.shieldDamage),

			set_weight: $scope.set_weight,

			effect: $scope.effect,

			launch_rate: parseFloat($scope.launch_rate),

			shieldstunMult: parseFloat($scope.shieldstunMult),

			addHitstun: parseFloat($scope.addHitstun),
			ink: parseFloat($scope.inkValue),
			charge_data: $scope.charge_data,
			is_1v1: $scope.is_1v1,
			shorthop_aerial: $scope.shorthop_aerial,
			use_landing_lag : $scope.use_landing_lag,


			at_from: parseFloat($scope.attacker_from),
			at_to: parseFloat($scope.attacker_to),
			at_step: parseFloat($scope.attacker_step),


			from: parseFloat($scope.target_from),
			to: parseFloat($scope.target_to),
			step: parseFloat($scope.target_step),
			moves: JSON.parse(JSON.stringify($scope.moveset.slice())),
			bd: base_damage,
			damage: base_damage,
			move: {},
			hit_frame: 0,
			characters: [],

			iterators: {
				di: $scope.it_di,
				kb_modifiers: $scope.it_kb_mod,
				attacker_percent: $scope.it_rage,
				stock_dif: $scope.it_stock_dif,
				target_percent: $scope.it_percent,
				charge: $scope.it_charge,
				moves: $scope.it_moves,
				modifiers: $scope.inc_mod,
				targets: $scope.it_targets
			},
			attacker: JSON.parse(JSON.stringify(attacker)),
			target: JSON.parse(JSON.stringify(target)),

			mode: $scope.it_mode,
			ko_mode: $scope.it_ko_mode
		};


        if(params.at_step <= 0){
            params.at_step = 0.1;
        }

        if(params.step <= 0){
            params.step = 0.1;
		}

		if (params.inverseX)
			params.stick.X *= -1;

        //var selectedChar = target;
        //var selectedMod = $scope.targetMod;
        //moves = $scope.moveset.slice();
        //bd = base_damage;
        //damage = base_damage;

        //if($scope.calculations > 100000){
        //    window.alert("Amount of calculations to be used exceed maximum");
        //    return;
        //}
        
		if ($scope.move == 0) {
			params.move = JSON.parse(JSON.stringify(new Move(0, "Custom", "Custom", base_damage, angle, bkb, kbg, wbkb, [], 0, -1, [], 0, 0, 0, 0)));
			params.move.is_smash = is_smash;
			params.hit_frame = NaN;
			params.faf = NaN;
		} else {
			params.move = JSON.parse(JSON.stringify($scope.moveset[$scope.move]));
			if (params.move.charge == null){
				params.move.base_damage = base_damage;
            }
			params.hit_frame = params.move.hitboxActive[0].start;
			params.faf = params.move.faf;
		}

		if ($scope.it_targets || $scope.it_mode !== "normal") {
			for (var i = 0; i < names.length; i++) {
				params.characters.push(new Character(names[i]));
			}
			params.characters = JSON.parse(JSON.stringify(params.characters));
		}

		worker.postMessage(params);

		$scope.generateStyle = { display: 'none' };
		$scope.cancelStyle = { display: 'block' };

		//target = selectedChar;

		//target.modifier = target.getModifier(selectedMod);
		//$scope.targetModifiers = target.modifiers;
		//$scope.targetMod = selectedMod;
		//$scope.stored = tsv_rows.length;
        
	};

	$scope.cancel = function () {
		$scope.cancelStyle = { display: 'none' };
		$scope.generateStyle = { display: 'block' };
		worker.terminate();

		worker = undefined;

		$scope.createWorker();
	};

    $scope.clear = function(){
		tsv_rows = [];
		$scope.ko_table = [];
        $scope.stored = tsv_rows.length;
    }

    $scope.download = function(){
        if(tsv_rows.length > 0){
            var tsv = "";
            for(var i=1;i<headers.length;i++){
                tsv += headers[i];
                if(i!=headers.length-1){
                    tsv+="\t";
                }
            }
            tsv+="\n";
            for(var i=0;i<tsv_rows.length;i++){
                var row = tsv_rows[i];
                for(var j=1;j<row.length;j++){
                    tsv += row[j];
                    if(j!=row.length-1){
                        tsv+="\t";
                    }
                }
                tsv+="\n";
            }
            
            showSaveDialog(tsv);
        }
    }

	$scope.tsv_options = function () {

		if ($scope.it_mode === "normal") {
			$scope.it_normalStyle = { display: 'block' };
			$scope.it_koStyle = { display: 'none' };
		}
		else if ($scope.it_mode === "koCalc") {
			$scope.it_normalStyle = { display: 'none' };
			$scope.it_koStyle = { display: 'block' };

		}


        if($scope.it_rage){
            $scope.rage_step = 0.5;
        }
        if($scope.it_percent){
            $scope.target_from = 0;
            $scope.target_to = 150;
            $scope.target_step = 1;
        }
        $scope.itRage_style = {'display' : $scope.it_rage ? 'block' : 'none'};
		$scope.itTarget_style = { 'display': $scope.it_percent ? 'block' : 'none' };

		if ($scope.it_targets) {
			$scope.moveIterateDisable = true;
			$scope.moveIterateClass = 'disabled';
			$scope.it_moves = false;
		} else {
			$scope.moveIterateDisable = false;
			$scope.moveIterateClass = '';
		}


        $scope.update();
    }

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

    $scope.tsv_options();
});