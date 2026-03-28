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

var allCharacters = [];

//Preload all characters in array for character iterators to avoid issues with async loading of attributes
for (var i = 0; i < displayNames.length; i++) {
	allCharacters.push(new Character(displayNames[i], null, null, false));
}

class MultiCalculator extends Calculator {
	constructor($scope, updateCallback, visualizerCanvas = null) {
		super($scope, updateCallback, visualizerCanvas);

		this.attacker_from = 35;
		this.attacker_to = 150;
		this.attacker_step = 0.5;
		this.target_from = 0;
		this.target_to = 150;
		this.target_step = 1;

		this.moveIterateDisable = false;
		this.diIterateDisable = false;
		this.moveIterateClass = '';
		this.diIterateClass = false;

		this.it_mode = "normal";
		this.it_normalStyle = {};
		this.generateStyle = {display: 'block'};
		this.cancelStyle = { display: 'none' };
		this.it_koStyle = { display: 'none' };
		this.it_ko_mode = 'ko';

		this.stored = 0;

		this.ko_table = [];

		let calcRef = this;

		this.createWorker = function () {
			worker = new Worker('./js/worker/multiworker.js');

			worker.onmessage = function (e) {
				var data = e.data;

				if (data.rows !== undefined) {
					tsv_rows = tsv_rows.concat(data.rows);

					calcRef.cancelStyle.display = 'none';
					calcRef.generateStyle.display= 'block';

					if (data.mode !== "normal") {
						calcRef.ko_table = [];
						if (data.ko_mode === "ko") {
							for (var i = 0; i < tsv_rows.length; i++) {
								if (tsv_rows[i][0] == "KO %") {
									calcRef.ko_table.push({
										character: tsv_rows[i][6],
										percent: tsv_rows[i][9]
									});
								}
							}
						}
						else if (data.ko_mode === "best_di") {
							for (var i = 0; i < tsv_rows.length; i++) {
								if (tsv_rows[i][0] == "Best DI KO %") {
									calcRef.ko_table.push({
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
					calcRef.stored = data.count + tsv_rows.length;
				else
					calcRef.stored = tsv_rows.length;

				ScopeUpdate($scope);

			}
		}


		this.generate = function () {

			this.Update();

			//worker.update(vars);

			var params = {
				attacker_percent: this.AttackerPercent.Percent,
				target_percent: this.TargetPercent.Percent,
				preDamage: this.SelectedMove.preDamage,
				base_damage: this.SelectedMove.Damage,
				angle: this.SelectedMove.Angle,
				in_air: this.GameVariables.OpponentInAir,
				bkb: this.SelectedMove.BKB,
				kbg: this.SelectedMove.KBG,
				stale: this.GameVariables.StaleQueue,
				shieldStale: this.GameVariables.ShieldStaleQueue,
				hitlag: this.SelectedMove.Hitlag,
				hitframe: this.GameVariables.SelectedHitframe,
				faf: this.GameVariables.SelectedFAF,
				charge_frames: this.GameVariables.ChargeFrames,
				r: this.GameVariables.Crouching ? parameters.crouch_cancelling : 1,
				//bounce: this.kb_modifier_bounce,
				ignoreStale: this.GameVariables.StalenessDisabled,
				perfectshield: this.GameVariables.ShieldState == ShieldStates.Perfect,
				is_projectile: this.SelectedMove.MoveRef.IsProjectile,

				megaman_fsmash: this.Attacker.Name == "Mega Man" && this.SelectedMove.MoveRef.NameId == "Fsmash",
				electric: this.SelectedMove.Effect == "collision_attr_elec",
				witch_time_smash_charge: this.GameVariables.WitchTimeActive,
				crouch: this.GameVariables.Crouching ? parameters.crouch_cancelling : 1,

				is_smash: this.SelectedMove.MoveRef.IsSmashAttack,
				is_aerial_move: this.SelectedMove.MoveRef.IsAerialAttack,
				//uses_aerial_shieldstun: this.uses_aerial_shieldstun,

				fkb: this.SelectedMove.FKB,
				windbox: this.SelectedMove.Flinchless,

				//game_mode: this.game_mode,
				stage: this.Stage,
				graph: true,
				//position: { "x": parseFloat(this.position_x), "y": parseFloat(this.position_y) },
				position: this.VisualizerOptions.Position,
				inverseX: this.VisualizerOptions.InvertX,
				onSurface: !this.GameVariables.OpponentInAir,

				stock_dif: this.GameVariables.GameSettings.AttackerStockDifference,
				game_format: this.GameVariables.GameSettings.Players,

				//stick: {
				//	X: this.stick.X,
				//	Y: this.stick.Y
				//},
				stick : this.GameVariables.Stick,
				luma_percent: this.LumaPercent.Percent,

				unblockable: this.SelectedMove.ShieldDamage == null,

				shieldDamage: this.SelectedMove.ShieldDamage,

				set_weight: this.SelectedMove.SetWeight,

				effect: this.SelectedMove.Effect,

				launch_rate: this.GameVariables.GameSettings.LaunchRate,

				shieldstunMult: this.SelectedMove.ShieldstunMultiplier,

				addHitstun: this.SelectedMove.AdditionalHitstun,
				ink: this.GameVariables.InkValue,
				charge_data: this.SelectedMove.MoveRef.ChargeData,
				is_1v1: this.GameVariables.GameSettings.Players == "2",
				shorthop_aerial: this.GameVariables.ShortHop,
				use_landing_lag: this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag,


				at_from: parseFloat(this.attacker_from),
				at_to: parseFloat(this.attacker_to),
				at_step: parseFloat(this.attacker_step),


				from: parseFloat(this.target_from),
				to: parseFloat(this.target_to),
				step: parseFloat(this.target_step),
				moves: this.Attacker.Moves,
				bd: this.SelectedMove.Damage,
				damage: this.SelectedMove.Damage,
				move: this.SelectedMove,
				hit_frame: this.GameVariables.SelectedHitframe,
				characters: [],

				iterators: {
					di: this.it_di,
					kb_modifiers: this.it_kb_mod,
					attacker_percent: this.it_rage,
					stock_dif: this.it_stock_dif,
					target_percent: this.it_percent,
					charge: this.it_charge,
					moves: this.it_moves,
					modifiers: this.inc_mod,
					targets: this.it_targets
				},

				attacker: this.Attacker,
				target: this.Target,

				mode: this.it_mode,
				ko_mode: this.it_ko_mode
			};


			if (params.at_step <= 0) {
				params.at_step = 0.1;
			}

			if (params.step <= 0) {
				params.step = 0.1;
			}

			if (params.inverseX)
				params.stick.X *= -1;


			if (this.it_targets || this.it_mode !== "normal") {
				params.characters = allCharacters;
			}

			//Remove functions
			params = JSON.parse(JSON.stringify(params, function (key, value) {
				if (["Hitboxes", "Throws"].includes(key)) {
					return null;
				}
				return value;
			}));


			worker.postMessage(params);

			this.generateStyle.display= 'none';
			this.cancelStyle.display= 'block';

		};

		this.cancel = function () {
			this.cancelStyle.display = 'none';
			this.generateStyle.display= 'block';
			worker.terminate();

			worker = undefined;

			this.createWorker();
		};

		this.clear = function () {
			tsv_rows = [];
			this.ko_table = [];
			this.stored = tsv_rows.length;
		}

		this.download = function () {
			if (tsv_rows.length > 0) {
				var tsv = "";
				for (var i = 1; i < headers.length; i++) {
					tsv += headers[i];
					if (i != headers.length - 1) {
						tsv += "\t";
					}
				}
				tsv += "\n";
				for (var i = 0; i < tsv_rows.length; i++) {
					var row = tsv_rows[i];
					for (var j = 1; j < row.length; j++) {
						tsv += row[j];
						if (j != row.length - 1) {
							tsv += "\t";
						}
					}
					tsv += "\n";
				}

				showSaveDialog(tsv);
			}
		}

		this.tsv_options = function () {

			if (this.it_mode === "normal") {
				this.it_normalStyle = { display: 'block' };
				this.it_koStyle = { display: 'none' };
			}
			else if (this.it_mode === "koCalc") {
				this.it_normalStyle = { display: 'none' };
				this.it_koStyle = { display: 'block' };

			}


			if (this.it_rage) {
				this.rage_step = 0.5;
			}
			if (this.it_percent) {
				this.target_from = 0;
				this.target_to = 150;
				this.target_step = 1;
			}
			this.itRage_style = { 'display': this.it_rage ? 'block' : 'none' };
			this.itTarget_style = { 'display': this.it_percent ? 'block' : 'none' };

			if (this.it_targets) {
				this.moveIterateDisable = true;
				this.moveIterateClass = 'disabled';
				this.it_moves = false;
			} else {
				this.moveIterateDisable = false;
				this.moveIterateClass = '';
			}


			this.Update();
		}











	}
	
}

var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
	$scope.app = 'multicalculator';

	//App list
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;

	//Initialize calculator
	$scope.Calculator = new MultiCalculator($scope, function () {
		//$scope.results = this.Calculate();|
	}, document.getElementById("visualizerCanvas"));
	//Set stick canvas
	$scope.Calculator.SetStickCanvas('stickCanvas');

	$scope.storedLaunches = [];

	$scope.collapse = function (id) {
		$("#" + id).collapse('toggle');
	}

	//Theme selection
	$scope.themes = styleList;
	$scope.theme = styleList[0].name;

	$scope.changeTheme = function () {
		changeStyle($scope.theme);
		$scope.Calculator.Visualizer.SetBackground(settings.visualizer_colors.background);
		$scope.Calculator.GameVariables.StickVisualizer.drawStick($scope.Calculator.GameVariables.Stick)
	}

	$('.character-image-cont').on('contextmenu', function (e) {
		e.preventDefault();
		let id = `#${$(this).data('character')}-data`;
		if ($(id).is(':visible')) {
			$(id).css('display', 'none');
		}
		else {
			$(id).css('display', 'block');
		}


	});

	$(document).on('click', function (e) {
		if ($('.character-data:visible').length > 0) {
			if ($(e.target).closest('.character-data:visible').length == 0) {
				$('.character-data:visible').css('display', 'none');
			}
		}
	});

	$scope.Calculator.createWorker();

	$scope.Calculator.Update();

	$scope.Calculator.LoadFromUrl();

	$scope.Calculator.tsv_options();

});


