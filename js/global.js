///Ajax get json files functions
function LoadCharacterData(name, callback) {
	$.ajax({
		url: "./Data/" + name + "/data.json",
        success: function (data) {
            callback(data);
        }
	});
}

function LoadJsonFromPath(path, callback) {
    $.ajax({
        url: path,
        success: function (data) {
            callback(data);
        }
    });
}

function LoadJsonFromPathSync(path, callback) {
    $.ajax({
        url: path,
        async: false,
        success: function (data) {
            callback(data);
        }
    });
}

///URL Sharing

var defaultParameters = { ...parameters };
var settings = {
    stick_color: "#FFFFFF",
    visualizer_colors: {
        upward: "#2888d1",
        downward: "#FF0000",
        airdodge: "#00cccc",
        aerial: "#8B008B",
        hitstunEnd: "#A52A2A",
        actionable: "#FF8A00",
        attackerFAF: "#0066FF",
        stage: "#008000",
        platform: "#008000",
        noWallJump: "#800080",
        semitechable: "#FF0000",
        camera: "#2888d1",
        blastzone: "#FF0000",
        meteorBlastzone: "#800080",
        ko: "#FF0000",
        diLine: "#FFFFFF",
        interpolatedLine: "#808080",
        background: "#222222",
        techable: "#53b953",
        techableOnlyCollision: "#af24b1",
        untechable: "#cb4d4d",
        border: '#ffffff',
        grid: {
            line1: {
                color: '#FF0000',
                opacity: 0.6,
                lineWidth: 0.5
            },
            line2: {
                color: '#2888d1',
                opacity: 0.6,
                lineWidth: 0.2
            },
            unitLine: {
                color: '#FFFFFF',
                opacity: 0.4,
                lineWidth: 0.05,
                opacity10: 0.5,
                lineWidth10: 0.1
            }
        }
    }
};

function getWebProtocol() {
    var p = document.location.protocol;
    return p.replace(":", "");
}

var styleList = [];

LoadJsonFromPathSync("./css/themes.json", function (data) {
    styleList = data.filter(t => t.enabled);
});

var defaultStyle = styleList[0];

function changeStyle(style) {
    for(var i=0;i<styleList.length;i++){
        if (styleList[i].name == style) {
            $("#mainStyle").attr("href", styleList[i].main);
			if (styleList[i].visualSettings) {
				settings = styleList[i].visualSettings;
			}
			else {
				settings = defaultStyle.visualSettings;
			}
            return;
        }
    }
    
}

///Calculator data/functions
class Result {
    constructor(name, value, hide) {
        this.name = name;
        this.title = getTitle(name);
        this.value = value;
        this.hide = false;
        this.style = {};

        this.addStyle = function (style) {
            for (var property in style) {
                this.style[property] = style[property];
            }
            return this;
        }

		//this.hidetraining = true; //Remove training mode results

        if (hide != undefined) {
            this.hide = hide;
        }


        if (typeof value === "number" && isNaN(value)) {
            this.addStyle({ 'color': 'red' });
            this.value = "Invalid data";
        } else {
			if (name == "Hitstun" || name == "Hitstun with speed up" || name == "Attacker Hitlag" || name == "Target Hitlag" || name == "Shield stun" || name == "Shield Hitlag" || name == "Shield Hitlag (Training)" || name == "Shield Hitlag (VS)" || name == "Attacker Shield Hitlag" || name == "Shield Advantage" || name == "Parry Advantage" || name == "Parry Advantage (Training)" || name == "Parry Advantage (VS)" || name == "Hit Advantage" || name == "Paralysis time" || name == "Reeling hitstun" || name == "Luma hitstun"
				|| name == "Flower time" || name == "Buried time" || name == "Sleep time" || name == "Freeze time" || name == "Stun time" || name == "Disable time") {
                this.value = value + (value == 1 ? " frame" : " frames");
			} else if (name == "Airdodge hitstun cancel" || name == "Aerial hitstun cancel" || name == "First Actionable Frame" || name == "FAF" || name == "FAF with speed up" || name == "Reeling FAF") {
                this.value = "Frame " + value;
            } else {
                this.value = value;
            }
        }

        if (typeof (this.value) == "string") {
            this.value = this.value;
        } else {
            this.value = +this.value.toFixed(6);
        }

        if (name == "Hit Advantage" || name == "Shield Advantage" || name == "Parry Advantage") {
            this.addStyle({ 'font-weight': '500' });
		}


    }


};

class ResultRow {
    constructor(name, title, style, v1, h1) {
        this.name = name;
        this.title = title;
        this.value = v1;
        //this.val2 = v2;
        this.hide = h1;
        //this.h2 = h2;
        this.style = style;
        //this.onlyOne = v1 == v2 && !h1 && !h2;
        //this.valc = this.onlyOne ? this.val1 : "";
        //if (h1 || this.onlyOne) {
        //    this.val1 = "";
        //}
        //if (h2 || this.onlyOne) {
        //    this.val2 = "";
        //}

    }
};

class ResultList {
    constructor(resultList) {
        this.resultList = resultList;
        this.list = [];
        for (var i = 0; i < resultList.length; i++) {
            if (!resultList[i].hide) {
				this.list.push(new ResultRow(resultList[i].name, resultList[i].title, resultList[i].style, resultList[i].value, resultList[i].hide));
            }
        }
    }
};

function getTitle(attribute) {
    var titles = [
        { "attribute": "Damage", "title": "Damage dealt to the target" },
        { "attribute": "Attacker Hitlag", "title": "Amount of frames attacker is in hitlag" },
        { "attribute": "Target Hitlag", "title": "Amount of frames the target can SDI" },
        { "attribute": "Total KB", "title": "Total KB dealt" },
        { "attribute": "Angle", "title": "Angle target is launched without DI" },
        { "attribute": "Hitstun", "title": "Hitstun target gets while being launched" },
        { "attribute": "Reeling hitstun", "title": "Hitstun target gets if it gets launched with a reeling animation" },
        { "attribute": "Reeling FAF", "title": "Frame the target can do any action if it gets launched with a reeling animation" },
        { "attribute": "First Actionable Frame", "title": "Frame the target can do any action" },
        { "attribute": "Airdodge hitstun cancel", "title": "Frame target can cancel hitstun by airdodging" },
        { "attribute": "Aerial hitstun cancel", "title": "Frame target can cancel hitstun by using an aerial" },
        { "attribute": "LSI", "title": "Launch speed multiplier caused by LSI" },
        { "attribute": "Horizontal Launch Speed", "title": "Initial horizontal speed target will be launched" },
        { "attribute": "Vertical Launch Speed", "title": "Initial vertical speed target will be launched" },
        { "attribute": "Max Horizontal Distance", "title": "Horizontal distance travelled being launched after hitstun" },
        { "attribute": "Max Vertical Distance", "title": "Vertical distance travelled being launched after hitstun" },
        { "attribute": "Gravity boost", "title": "Vertical launch speed increase caused by gravity when KB causes tumble" },
        { "attribute": "KB modifier", "title": "KB multiplier used when target is crouching or charging a smash attack" },
        { "attribute": "Rage", "title": "KB multiplier used on total KB based on attacker's percent " },
        { "attribute": "Aura", "title": "Lucario aura damage increase based on his percent/stock difference" },
        { "attribute": "KB dealt", "title": "Additional KB multiplier mostly used by attacker Buster/Smash Monado Arts" },
        { "attribute": "KB received", "title": "Additional KB multiplier mostly used by target Shield/Smash Monado Arts" },
        { "attribute": "Charged Smash", "title": "Damage multiplier used when using a charged smash attack" },
		{ "attribute": "Damage taken", "title": "Additional damage multiplier target receives caused by the target, it only affects hurtboxes and doesn't affect hitbox base damage" },
		{ "attribute": "Damage dealt", "title": "Additional damage multiplier target receives caused by the attacker, most of them don't affect hitbox damage on KB calculation" },
		{ "attribute": "Base damage multiplier", "title": "Base damage multiplier" },
		{ "attribute": "1v1 Damage increase", "title": "Damage is increased by 20% on 1v1 battles on SSBU, this damage increase works like a damage taken multiplier and doesn't affect damage on KB calculation" },
		{ "attribute": "Short hop aerial", "title": "On SSBU aerials done after a short hop have their damage multiplier by 0.85, works like a damage dealt multiplier which doesn't affect move's base damage on the KB calculation" },
		{ "attribute": "Before launch damage", "title": "Throws can deal some damage during their animations like Pikachu's fthrow, this is added to the target percent before calculating KB" },
		{ "attribute": "Freshness bonus", "title": "Move damage is increased by 5% since it hasn't been on the last 9 used moves queue" },
        { "attribute": "Stale-move negation", "title": "Damage reduction caused when using an attack repeatedly, if the attack isn't in the queue it gets a freshness bonus and increases damage a little" },
        { "attribute": "Tumble", "title": "Target will enter tumble if KB > 80" },
        { "attribute": "Reeling", "title": "Special animation caused when KB > 80, angle isn't between 71 and 109 and target's percent is 100 or higher after the attack damage" },
        { "attribute": "Can Jab lock", "title": "If target is in the ground after tumble during the bounce animation the attack can jab lock if Y = 0 or for spikes KB <= 80 and is grounded" },
        { "attribute": "Angle with DI", "title": "Angle the target is launched affected by DI" },
        { "attribute": "Launch angle", "title": "Angle the target is launched with gravity boost" },
        { "attribute": "Luma KB", "title": "Luma KB is calculated with weight = 100 and an additional 15%" },
        { "attribute": "Luma launched", "title": "If Luma KB > 80 it will be launched" },
        { "attribute": "Shield Damage", "title": "Damage done to target shield, (damage + SD) * 1.19" },
        { "attribute": "Full HP shield", "title": "Maximum HP target shield has, can only be increased using Shield Monado Art" },
        { "attribute": "Shield Break", "title": "Yes will appear here if you can break the target shield at full HP in one hit" },
        { "attribute": "Shield stun", "title": "Amount of frames target cannot do any action after shielding an attack" },
        { "attribute": "Shield Hitlag", "title": "Amount of frames target suffers hitlag while shielding" },
        { "attribute": "Shield Advantage", "title": "" },
        { "attribute": "Unblockable attack", "title": "This attack cannot be blocked using shield" },
        { "attribute": "Hit Advantage", "title": "" },
        { "attribute": "Launch rate", "title": "KB multiplier set in the VS mode rules" },
        { "attribute": "Paralysis time", "title": "Amount of frames the target will be paralyzed" }];
    for (var i = 0; i < titles.length; i++) {
        if (attribute == titles[i].attribute) {
            return titles[i].title;
        }
    }
    return "";
};

var stageData = [];

LoadJsonFromPathSync("./Data/Stages/ssbustagedata.json", function (data) {
    stageData = data;
    stageData.unshift({ stage: "No stage" });
});

function getStages() {
    return stageData;
}

var appSelection = [
    { appName: "calculator", title: "Calculator", link: "./index.html" },
    { appName: "kocalculator", title: "KO Calculator", link: "./kocalc.html" },
    { appName: "kbcalculator", title: "Percentage Calculator", link: "./percentcalc.html" },
    { appName: "multicalc", title: "Multi Calculator", link: "./multicalc.html" }
];

//Character percent color change
function PercentColor(val) {
    if (isNaN(val) || val < 0) {
        val = 0;
    }
    if (val > 999) {
        val = 999;
    }
    var hsl = {
        h: 0,
        s: 100,
        l: colorLerp(100, 30, val, 50, 200)
    };

    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    //return {
    //    "-webkit-text-fill-color": `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    //};
}

function KBModifier(value) {
    switch (value) {
        case "crouch":
            return parameters.crouch_cancelling;
        case "grounded":
            return 1; //0.8 applied after hitstun
        case "charging":
            return parameters.interrupted_smash;
        case "buried":
            return parameters.buried_kb_mult;
        case "none":
            return 1;
    }
    return 1;
}

function HitlagCrouch(value) {
    switch (value) {
        case "crouch":
            return parameters.crouch_hitlag;
    }
    return 1;
}

class CharacterPercent {
    constructor(value) {
        if (!value)
            value = 0.0;
        this.Percent = value;
        this.Style = { '-webkit-text-fill-color': PercentColor(this.Percent) };

        this.Update = function () {
            this.Style = { '-webkit-text-fill-color': PercentColor(this.Percent) };
		}
	}
}

class Calculator {
    constructor($scope, updateCallback, visualizerCanvas = null) {
        this.app = $scope.app;
        this.AppLinks = appSelection.filter(app => app.appName != this.app);
        //this.CalculatorSettings = settings;

        this.CharacterList = displayNames;

        this.Attacker = new Character(displayNames[displayNames.indexOf("Mario")], this, $scope, true);
        this.Target = new Character(displayNames[displayNames.indexOf("Mario")], this, $scope);

        this.AttackerPercent = new CharacterPercent();
        this.TargetPercent = new CharacterPercent();

        this.LumaPercent = new CharacterPercent();

        this.SelectedMove = new Move(-1);
        this.GameVariables = new GameVariables();

        this.CounteredDamage = 0;
        this.MoveEffectsList = effects;

        this.VisualizerOptions = new VisualizerOptions();

        this.StageList = getStages();
        this.Stage = this.StageList.filter(s => s.stage == "Final Destination")[0];
        this.StageName = this.Stage.stage;

        if (this.Stage.center) {
            this.VisualizerOptions.Position.x = this.Stage.center[0];
            this.VisualizerOptions.Position.y = this.Stage.center[1];
        }
        else {
            this.VisualizerOptions.Position.x = this.Stage.spawns[0][0];
            this.VisualizerOptions.Position.y = this.Stage.spawns[0][1];
        }
        
        this.UpdateCallback = updateCallback;

        if (visualizerCanvas) {
            this.Visualizer = new Visualizer(visualizerCanvas);

            //Initialize visualizer
            this.Visualizer.SetBackground(settings.visualizer_colors.background);
            this.Visualizer.SetSize(visualizerCanvas.parentElement.clientWidth);

            this.VisualizerOptions = new VisualizerOptions();
        }

        this.SharingUrl = "";

        //Specific variables
        this.DisplayDetailedResults = false;

        //Percentage calculator
        this.KBInput = 30;


        //KO Calculator
        this.DIStepAngle = 1;
        this.VectorDIAngleStep = 15;
        this.KOPercentForDICheck = 100;
        this.IgnoreWithCollisions = true;
        this.ShowInterpolatedPositions = true;

        //Common functions
        this.UpdateStage = function () {
            this.Stage = getStages().filter(s => s.stage == this.StageName)[0];
            if (this.Visualizer) {
                this.VisualizerOptions.StageName = this.Stage.stage;
                if (this.Stage.stage == "No stage") {
                    this.VisualizerOptions.Spawns = [];
                    this.VisualizerOptions.Spawn = "";
                }
                else {
                    if (this.Stage.center) {
                        this.VisualizerOptions.Position.x = this.Stage.center[0];
                        this.VisualizerOptions.Position.y = this.Stage.center[1];
                        this.VisualizerOptions.Spawns = ["Center"];
                    }
                    else {
                        this.VisualizerOptions.Position.x = this.Stage.spawns[0][0];
                        this.VisualizerOptions.Position.y = this.Stage.spawns[0][1];
                        this.VisualizerOptions.Spawns = [];
                    }
                    for (var i = 0; i < this.Stage.spawns.length; i++) {
                        this.VisualizerOptions.Spawns.push(i + 1);
                    }

                }

                this.Visualizer.Reset();
                this.Visualizer.SetStage(this.Stage);
                if (this.VisualizerOptions.Spawns.length > 0)
                    this.VisualizerOptions.Spawn = this.VisualizerOptions.Spawns[0];
                else
                    this.VisualizerOptions.Spawn = "";

                this.Update();
            }
        }

        this.SetSpawnPosition = function () {
            if (this.VisualizerOptions.Spawn != "Center") {
                let i = parseInt(this.VisualizerOptions.Spawn) - 1;
                this.VisualizerOptions.Position.x = this.Stage.spawns[i][0];
                this.VisualizerOptions.Position.y = this.Stage.spawns[i][1];
            }
            else {
                this.VisualizerOptions.Position.x = this.Stage.center[0];
                this.VisualizerOptions.Position.y = this.Stage.center[1];
            }
            this.Update();
        }

        this.UpdateAllStaleQueue = function (value) {
            if (value == "0") {
                this.GameVariables.StaleQueue = [false, false, false, false, false, false, false, false, false];
            } else if (value == "1") {
                this.GameVariables.StaleQueue = [true, true, true, true, true, true, true, true, true];
            }
            this.Update();
        }

        this.UpdateAttacker = function () {
            this.SelectedMove = new Move(-1);
            this.Attacker = new Character(this.Attacker.CharacterName, this, $scope, true);
            this.Update();
        }

        this.UpdateTarget = function () {
            this.Target = new Character(this.Target.CharacterName, this, $scope);
            this.Update();
        }

        this.UpdateAttackerPercent = function () {
            this.AttackerPercent.Update();
            this.Update();
        }

        this.UpdateTargetPercent = function () {
            this.TargetPercent.Update();
            this.Update();
        }

        this.UpdateLumaPercent = function () {
            this.LumaPercent.Update();
            this.Update();
        }

        this.UpdateAttackerModifier = function (modifierIndex) {
            this.Attacker.Modifier = this.Attacker.Modifiers[modifierIndex];
            this.Attacker.ApplyModifier();

            this.Update();
        }

        this.UpdateTargetModifier = function (modifierIndex) {
            this.Target.Modifier = this.Target.Modifiers[modifierIndex];
            this.Target.ApplyModifier();

            this.Update();
        }

        this.UpdateAttack = function () {
            if (this.SelectedMove.Index) {
                let m = this.Attacker.Moves.filter(m => m.Index == this.SelectedMove.Index);
                if (m.length > 0) {
                    this.SelectedMove = { ...m[0] };
                }
                else {
                    this.SelectedMove = { ...this.Attacker.Moves[0] };
                }
            }
            else {
                this.SelectedMove = new Move(-1);
            }

            //Effects
            if (this.SelectedMove.Effect.includes("bury")) {
                this.SelectedMove.Effect = "collision_attr_bury";
            }
            else {
                let match = effects.filter(e => e.id == this.SelectedMove.Effect);
                if (match.length == 0) {
                    this.SelectedMove.Effect = "none";
                }
                else {
                    this.SelectedMove.Effect = match[0].id;
				}
            }

            this.GameVariables.ChargeFrames = 0;
            this.GameVariables.SmashChargeMaxFrames = 60;
            this.GameVariables.SmashChargeMaxDamageMultiplier = 1.4;
            this.GameVariables.SelectedHitframe = this.SelectedMove.StartFrame;
            this.GameVariables.SelectedFAF = this.SelectedMove.MoveRef.FAF;
            this.GameVariables.AerialFrameAdvantageType = AerialFrameAdvCalculation.Normal;
            this.GameVariables.LandingFrame = this.SelectedMove.MoveRef.LandingLagEndFrame;

            this.Update();
        }

        this.UpdateAerialFrameAdvantageCalculationType = function () {
            if (this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag) {
                this.GameVariables.LandingFrame = this.GameVariables.SelectedHitframe + 1;
            }
            else if (this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel) {
                this.GameVariables.LandingFrame = this.SelectedMove.MoveRef.LandingLagEndFrame;
            }

            this.Update();
		}

        this.UpdateSmashAttack = function () {
            this.GameVariables.ChargeFrames = 0;
            this.Update();
        }

        this.UpdateAerialAttack = function () {
            this.GameVariables.ShortHop = false;
            this.Update();
		}

        this.ApplySmashCharge = function () {
            //this.SelectedMove.ApplyCharge(chargeFrames);
            this.GameVariables.SelectedHitframe = this.SelectedMove.StartFrame + this.GameVariables.ChargeFrames;
            this.GameVariables.SelectedFAF = this.SelectedMove.MoveRef.FAF + this.GameVariables.ChargeFrames;

            this.Update();
        }

        this.ApplyChargeMoveFrames = function () {
            if (this.SelectedMove.MoveRef.ChargeData) {
                this.SelectedMove.Damage = this.SelectedMove.ChargeDamage(this.GameVariables.ChargeFrames);
                this.SelectedMove.BKB = this.SelectedMove.ChargeBKB(this.GameVariables.ChargeFrames);
                this.SelectedMove.KBG = this.SelectedMove.ChargeKBG(this.GameVariables.ChargeFrames);
                this.SelectedMove.ShieldDamage = this.SelectedMove.ChargeShieldDamage(this.GameVariables.ChargeFrames);

                this.GameVariables.SelectedHitframe = this.SelectedMove.StartFrame + this.GameVariables.ChargeFrames;
                this.GameVariables.SelectedFAF = this.SelectedMove.MoveRef.FAF + this.GameVariables.ChargeFrames;

                this.Update();
			}
        }

        this.UpdateDI = function () {
            this.GameVariables.UpdateDI();
            this.Update();
        }

        this.UpdateDIAngle = function () {
            this.GameVariables.UpdateDIAngle();
            this.Update();
        }

        this.UpdateStickInput = function () {
            this.GameVariables.UpdateStickInput();
            this.Update();
        }

        this.SetVisualizer = function (visualizerCanvas) {
            if (visualizerCanvas) {
                this.Visualizer = new Visualizer(visualizerCanvas);

                //Initialize visualizer
                this.Visualizer.SetBackground(settings.visualizer_colors.background);
                this.Visualizer.SetSize(visualizerCanvas.parentElement.clientWidth);
            }

            this.Update();
		}

        this.StoreLaunchOnVisualizer = function () {
            this.Visualizer.StoreLaunch();

            this.Update();
        }

        this.ClearStoredLaunchesOnVisualizer = function () {
            this.Visualizer.ClearStoredLaunches();

            this.Update();
        }

        this.SetStickCanvas = function (stickCanvasId) {
            this.GameVariables.StickVisualizer = new StickWheel(this, stickCanvasId, this.GameVariables.Stick);
        }

        this.UpdateStickFromCanvas = function (stick) {
            this.GameVariables.UpdateStick(stick);
            ScopeUpdate($scope);

            this.Update();
        }

        this.UpdateStaleness = function (value) {
            if (value == "0") {
                this.GameVariables.StaleQueue = [false, false, false, false, false, false, false, false, false];
            } else if (value == "1") {
                this.GameVariables.StaleQueue = [true, true, true, true, true, true, true, true, true];
            }
            this.Update();
        }

        this.Update = function () {
            if (this.UpdateCallback) {
                this.UpdateCallback();
            }
            this.GenerateUrlParams();
		}

        //Calculator
        this.Calculate = function () {
            
            var is1v1 = this.GameVariables.GameSettings.Players == "2";
            var electric = this.SelectedMove.Effect == "collision_attr_elec";
            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;
            var crouchHitlag = this.GameVariables.Crouching ? parameters.crouch_hitlag : 1;

            var paralyzer = this.SelectedMove.Effect == "collision_attr_paralyze";
            var staleMult = StaleNegation(this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled);

            var baseDamage = this.SelectedMove.Damage;
            var preDamage = this.SelectedMove.preDamage;

            var megamanFsmash = this.Attacker.Name == "Mega Man" && this.SelectedMove.MoveRef.NameId == "Fsmash";

            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                baseDamage = ChargeSmash(baseDamage, this.GameVariables.ChargeFrames,
                    megamanFsmash,
                    this.GameVariables.WitchTimeActive,
                    this.GameVariables.SmashChargeMaxDamageMultiplier)
            }

            if (this.Attacker.name == "Lucario") {
                let auraMult = Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.StockDifferenceOptions, this.GameVariables.GameSettings.Players);

                baseDamage *= auraMult;
                preDamage *= auraMult;
            }

            baseDamage *= this.Attacker.Modifier.BaseDamageMultiplier;
            preDamage *= this.Attacker.Modifier.BaseDamageMultiplier;

            var damage = baseDamage;

            damage *= this.Target.Modifier.DamageReceivedMultiplier;
            preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            preDamage *= this.Target.Modifier.DamageReceivedMultiplier;

            preDamage *= InkDamageMult(this.GameVariables.InkValue);

            if (is1v1) {
                preDamage *= 1.2;
            }

            if (this.GameVariables.ShortHop) {
                damage *= parameters.shorthop_aerial;
                preDamage *= parameters.shorthop_aerial;
            }

            if (this.Attacker.Modifier.name == "Winged Mode" || this.Attacker.Modifier.name == "Rage") {
                //Winged Mode affects KB like short hop multiplier
                damage *= this.Attacker.Modifier.DamageDealtMultiplier;
                preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            }

            var vskb;

            if (this.SelectedMove.FKB == 0) {
                vskb = VSKB(this.TargetPercent.Percent + (preDamage * staleMult), baseDamage, damage, this.SelectedMove.SetWeight ? 100 : this.Target.Attributes.Weight,
                    this.SelectedMove.KBG, this.SelectedMove.BKB, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, r, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled,
                    this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.SelectedMove.SetWeight, this.GameVariables.GetStick(this.VisualizerOptions.InvertX), this.Target.Modifier.name == "Character Inhaled", this.GameVariables.GameSettings.LaunchRate);
                vskb.addModifier(this.Attacker.Modifier.KBDealtMultiplier);
                vskb.addModifier(this.Target.Modifier.KBReceivedMultiplier);
            }
            else {
                vskb = WeightBasedKB(this.SelectedMove.SetWeight ? 100 : this.Target.Attributes.Weight, this.SelectedMove.BKB, this.SelectedMove.FKB, this.SelectedMove.KBG, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, r, this.TargetPercent.Percent,
                    StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, this.SelectedMove.Effect == "collision_attr_elec", this.SelectedMove.SetWeight, this.GameVariables.GetStick(this.VisualizerOptions.InvertX), this.Target.Modifier.name == "Character Inhaled", 1);
            }

            var damageSpeedUpFrames = [];

            if (vskb.tumble && this.SelectedMove.FKB == 0) {
                damageSpeedUpFrames = DamageSpeedUpFrames(Math.max(0, FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun), vskb.angle);
            }

            var distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.tumble, Math.max(0, vskb.hitstun + this.SelectedMove.AdditionalHitstun), damageSpeedUpFrames, this.SelectedMove.FKB != 0, vskb.angle, vskb.damageflytop, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, (this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.GameVariables.SelectedFAF) - this.GameVariables.SelectedHitframe, this.Target.Attributes.FallSpeed * this.Target.Modifier.FallSpeedMultiplier, this.Target.Attributes.DamageFlyTopFallSpeed, this.Target.Attributes.GroundFriction * this.Target.Modifier.GroundFrictionMultiplier, this.VisualizerOptions.InvertX, !this.GameVariables.OpponentInAir, this.VisualizerOptions.Position, this.Stage, true, parseFloat(this.VisualizerOptions.AdditionalFramesAfterHitstun));

            var damageWithout1v1 = damage;

            var lumaDamage = damage;
            if (is1v1) {
                damage *= 1.2;
            }

            //Luma
            if (this.Attacker.Modifier.name == "Luma (Free)") {
                if (this.SelectedMove.Article == "rosetta_tico" && this.SelectedMove.MoveRef.NameId != "Luma Shot") {
                    damage *= 1.5;
                }
            }

            damage *= this.Attacker.Modifier.DamageDealtMultiplier
            damage *= InkDamageMult(this.GameVariables.InkValue);

            var v_hc = HitstunCancel(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.angle, this.SelectedMove.Flinchless, electric, this.SelectedMove.AdditionalHitstun);

            var damageList = [];
            var kbList = [];
            var shieldList = [];

            //Calculation results

            //Damage
            if (!this.GameVariables.StalenessDisabled) {
                if (staleMult > 1) {
                    damageList.push(new Result("Freshness bonus", "x" + staleMult));
                } else {
                    damageList.push(new Result("Stale-move negation", "x" + staleMult));
                }

            }
            if (this.DisplayDetailedResults) {
                if (this.Target.Modifier.DamageReceivedMultiplier != 1) {
                    damageList.push(new Result("Damage taken", "x" + +this.Target.Modifier.DamageReceivedMultiplier.toFixed(6)));
                }
                if (this.Attacker.Modifier.DamageDealtMultiplier != 1) {
                    damageList.push(new Result("Damage dealt", "x" + +this.Attacker.Modifier.DamageDealtMultiplier.toFixed(6)));
                }
                if (is1v1) {
                    damageList.push(new Result("1v1 Damage increase", "x1.2"));
                }
                if (this.GameVariables.ShortHop) {
                    damageList.push(new Result("Short hop aerial", "x0.85"));
                }
            }
            if (this.GameVariables.InkValue) {
                damageList.push(new Result("Ink damage multiplier", "x" + +InkDamageMult(this.GameVariables.InkValue).toFixed(4)));
            }
            if (this.Attacker.name == "Lucario") {
                damageList.push(new Result("Aura", "x" + +Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.AttackerStockDifference, this.GameVariables.GameSettings.Players).toFixed(6)));
            }
            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                damageList.push(new Result("Charged Smash", "x" + +ChargeSmashMultiplier(this.GameVariables.ChargeFrames, megamanFsmash, this.GameVariables.WitchTimeActive, this.GameVariables.SmashChargeMaxDamageMultiplier).toFixed(6)));
            }
            if (this.DisplayDetailedResults) {
                if (this.Attacker.Modifier.BaseDamageMultiplier != 1) {
                    damageList.push(new Result("Base damage multiplier", "x" + +this.Attacker.Modifier.BaseDamageMultiplier.toFixed(6)));
                }
            }
            if (preDamage != 0) {
                damageList.push(new Result("Before launch damage", "+" + +(preDamage * staleMult).toFixed(6) + "%"));
            }
            damageList.push(new Result("Damage", +StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled).toFixed(6) + "%"));
            damageList.push(new Result("Target's %", +(this.TargetPercent.Percent + (preDamage * staleMult) + StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled)).toFixed(6) + "%"));
            if (!paralyzer) {
                damageList.push(new Result("Attacker Hitlag", Hitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.MoveRef.IsProjectile && !this.SelectedMove.MoveRef.IsProjectileAttached ? 0 : this.SelectedMove.Hitlag, electric, 1, this.SelectedMove.MoveRef.IsProjectile, this.GameVariables.GameSettings.Players, this.GameVariables.GameSettings.SpiritsEnabled)));
                damageList.push(new Result("Target Hitlag", Hitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, crouchHitlag, this.SelectedMove.MoveRef.IsProjectile, this.GameVariables.GameSettings.Players, this.GameVariables.GameSettings.SpiritsEnabled)));
            } else {
                damageList.push(new Result("Attacker Hitlag", ParalyzerHitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.MoveRef.IsProjectile ? 0 : this.SelectedMove.Hitlag, 1)));
            }

            //Knockback
            if (this.DisplayDetailedResults) {
                if (r != 1) {
                    kbList.push(new Result("KB modifier", "x" + +r.toFixed(6)));
                }
                if (this.GameVariables.GameSettings.LaunchRate != 1) {
                    kbList.push(new Result("Launch rate", "x" + +this.GameVariables.GameSettings.LaunchRate.toFixed(6), true));
                }
                if (this.Target.Modifier.KBReceivedMultiplier != 1) {
                    kbList.push(new Result("KB received", "x" + +this.Target.Modifier.KBReceivedMultiplier.toFixed(6)));
                }
                if (this.Attacker.Modifier.KBDealtMultiplier != 1) {
                    kbList.push(new Result("KB dealt", "x" + +this.Attacker.Modifier.KBDealtMultiplier.toFixed(6)));
                }
            }
            if (!this.GameVariables.StalenessDisabled && Rage(this.AttackerPercent.Percent) > 1)
                kbList.push(new Result("Rage", "x" + +Rage(this.AttackerPercent.Percent).toFixed(6)));
            kbList.push(new Result("Total KB", +vskb.kb.toFixed(6)));
            if (this.DisplayDetailedResults) {
                if (this.GameVariables.Buried) {
                    kbList.push(new Result("Buried removed", vskb.kb >= parameters.buried_kb_threshold ? "Yes" : "No"));
                }
            }
            kbList.push(new Result("Launch angle", +vskb.angle.toFixed(6)));
            if (paralyzer) {
                kbList.push(new Result("Paralysis time", ParalysisTime(vskb.kb, damage, this.SelectedMove.Hitlag, crouchHitlag)));
            }
            if (this.SelectedMove.Effect == "collision_attr_flower") {
                kbList.push(new Result("Flower time", FlowerTime(StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled))));
            }
            if (this.SelectedMove.Effect == "collision_attr_bury") {
                kbList.push(new Result("Buried time", BuriedTime(this.TargetPercent.Percent + StaleDamage(preDamage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb, this.GameVariables.GameSettings.AttackerStockDifference)));
            }
            if (this.SelectedMove.Effect == "collision_attr_sleep") {
                kbList.push(new Result("Sleep time", SleepTime(this.TargetPercent.Percent + StaleDamage(preDamage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb, this.GameVariables.GameSettings.AttackerStockDifference)));
            }
            if (this.SelectedMove.Effect == "collision_attr_ice") {
                kbList.push(new Result("Freeze time", FreezeTime(StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb)));
            }
            if (this.SelectedMove.Effect == "collision_attr_bind") {
                kbList.push(new Result("Stun time", StunTime(vskb.kb)));
            }
            if (this.SelectedMove.Effect == "collision_attr_bind_extra") {
                kbList.push(new Result("Disable time", DisableTime(this.TargetPercent.Percent + StaleDamage(preDamage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb, this.GameVariables.GameSettings.AttackerStockDifference)));
            }

            var hitstun = Math.max(0, vskb.hitstun + this.SelectedMove.AdditionalHitstun);

            if (FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) >= 32 && this.SelectedMove.FKB == 0 && vskb.tumble) {
                var speedUpFAF = damageSpeedUpFrames[damageSpeedUpFrames.length - 1];

                hitstun = speedUpFAF - 1;

                kbList.push(new Result("Hitstun", speedUpFAF - 1));
                kbList.push(new Result("FAF", speedUpFAF));

                //kbList.push(new Result("Using launch speed up", "Yes"));
            }
            else {
                kbList.push(new Result("Hitstun", Math.max(0, Hitstun(vskb.base_kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun)));

                kbList.push(new Result("FAF", Math.max(0, FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun)));
            }

            if (FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) >= 32) {

                //Frame hitstun cancel is possible isn't affected by speed up

                var suv_hc = SpeedUpHitstunCancel(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.angle, this.SelectedMove.Flinchless, electric, damageSpeedUpFrames, this.SelectedMove.AdditionalHitstun);

                kbList.push(new Result("Airdodge hitstun cancel", suv_hc.airdodge, (Hitstun(vskb.base_kb, this.SelectedMove.Flinchless, electric) == 0 || damageSpeedUpFrames[damageSpeedUpFrames.length - 1] <= suv_hc.airdodge)));
                kbList.push(new Result("Aerial hitstun cancel", suv_hc.aerial, (Hitstun(vskb.base_kb, this.SelectedMove.Flinchless, electric) == 0 || damageSpeedUpFrames[damageSpeedUpFrames.length - 1] <= suv_hc.aerial)));
            }

            if (this.GameVariables.SelectedFAF > 0) {
                kbList.push(new Result("Hit Advantage", HitAdvantage(hitstun, this.SelectedMove.MoveRef.IsProjectile ? this.GameVariables.SelectedHitframe + Hitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, crouchHitlag) - 1 : this.GameVariables.SelectedHitframe,
                    this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.GameVariables.SelectedFAF, paralyzer ? ParalysisTime(vskb.kb, damage, this.SelectedMove.Hitlag, crouchHitlag) : 0)));
            }

            kbList.push(new Result("Tumble", vskb.tumble ? "Yes" : "No"));

            kbList.push(new Result("Reeling", vskb.reeling ? "30%" : "0%", !vskb.reeling));

            if (!this.GameVariables.OpponentInAir) {
                kbList.push(new Result("Can Jab lock", vskb.can_jablock ? "Yes" : "No"));
            }

            kbList.push(new Result("LSI", +vskb.lsi.toFixed(6), vskb.lsi == 1));
            if (this.DisplayDetailedResults) {
                kbList.push(new Result("Horizontal Launch Speed", +vskb.horizontal_launch_speed.toFixed(6)));
                kbList.push(new Result("Gravity boost", +vskb.add_gravity_speed.toFixed(6), vskb.add_gravity_speed == 0));
                kbList.push(new Result("Vertical Launch Speed", vskb.vertical_launch_speed));
                kbList.push(new Result("Launch Speed", +vskb.total_launch_speed.toFixed(6)));
            }
            
            if (this.Target.name == "Rosalina And Luma") {

                var lumaBasePercent = 15;
                if (this.Target.Modifier.name == "Luma (Following)")
                    lumaBasePercent = 30;

                if (this.SelectedMove.FKB == 0) {
                    var luma_vskb = VSKB(lumaBasePercent + this.LumaPercent.Percent, baseDamage, lumaDamage, 100, this.SelectedMove.KBG, this.SelectedMove.BKB, this.Target.Attributes.Gravity, this.Target.Attributes.FallSpeed, r, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled, this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.GameVariables.GetStick(this.VisualizerOptions.InvertX));
                    luma_vskb.addModifier(this.Attacker.Modifier.KBDealtMultiplier);
                    luma_vskb.addModifier(this.Target.Modifier.KBReceivedMultiplier);
                    kbList.push(new Result("Luma KB", +luma_vskb.kb.toFixed(6)));
                    kbList.push(new Result("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
                    kbList.push(new Result("Luma hitstun", LumaHitstun(luma_vskb.kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun, luma_vskb.tumble));
                } else {
                    var luma_vskb = WeightBasedKB(100, this.SelectedMove.BKB, this.SelectedMove.FKB, this.SelectedMove.KBG, this.Target.Attributes.Gravity, this.Target.Attributes.FallSpeed, r, lumaBasePercent + this.LumaPercent.Percent, StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.GameVariables.GetStick(this.VisualizerOptions.InvertX));
                    luma_vskb.addModifier(this.Target.Modifier.KBReceivedMultiplier);
                    kbList.push(new Result("Luma KB", +luma_vskb.kb.toFixed(6)));
                    kbList.push(new Result("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
                    kbList.push(new Result("Luma hitstun", Math.max(0, LumaHitstun(luma_vskb.kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun), luma_vskb.tumble));
                }
            }

            if (this.SelectedMove.ShieldDamage != null) {
                var damageOnShield = baseDamage * this.Attacker.Modifier.DamageDealtMultiplier;
                if (this.GameVariables.ShortHop) {
                    damageOnShield *= parameters.shorthop_aerial;
                }
                //Luma
                if (this.Attacker.Modifier.name == "Luma (Free)") {
                    if (this.SelectedMove.Article == "rosetta_tico" && this.SelectedMove.MoveRef.NameId != "Luma Shot") {
                        damageOnShield *= 1.5;
                    }
                }
                var s = (damageOnShield * 1.19) + (this.SelectedMove.ShieldDamage * 1.19);
                var sv = (StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled) * 1.19) + (this.SelectedMove.ShieldDamage * 1.19);
                if (this.GameVariables.ShieldState != ShieldStates.Perfect) {
                    shieldList.push(new Result("Shield Damage", +sv.toFixed(6)));
                    //shieldList.push(new Result("Full HP shield", +(50 * target.modifier.shield).toFixed(6), +(50 * target.modifier.shield).toFixed(6)));
                    shieldList.push(new Result("Shield Break", sv >= 50 * this.Target.Modifier.ShieldHPMultiplier ? "Yes" : "No"));
                }

                var shieldHitlag = ShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect);
                var attackerShieldHitlag = AttackerShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect);


                shieldList.push(new Result("Attacker Shield Hitlag", attackerShieldHitlag, attackerShieldHitlag == shieldHitlag));

                shieldList.push(new Result("Shield Hitlag", shieldHitlag));
                shieldList.push(new Result("Shield stun multiplier", "x" + ShieldStunMultiplier(this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack), ShieldStunMultiplier(this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack) == 1));
                shieldList.push(new Result("Shield stun", ShieldStun(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)));

                if (this.GameVariables.SelectedFAF > 0) {
                    if (this.GameVariables.ShieldState == ShieldStates.Perfect && this.SelectedMove.MoveRef.IsProjectile) {
                        shieldList.push(new Result("Parry Advantage", ShieldAdvantage(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.Hitlag, this.GameVariables.SelectedHitframe, this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.GameVariables.SelectedFAF, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)));
                    }
                    else {
                        shieldList.push(new Result((this.GameVariables.ShieldState == ShieldStates.Perfect ? "Parry Advantage" : "Shield Advantage"), ShieldAdvantage(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.Hitlag, this.GameVariables.SelectedHitframe, this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.GameVariables.SelectedFAF, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)));
                    }
                }
                if (this.DisplayDetailedResults) {
                    if (!this.SelectedMove.Flinchless) {
                        if (!this.SelectedMove.MoveRef.IsProjectile)
                            shieldList.push(new Result("Attacker shield pushback", +AttackerShieldPushback(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled)).toFixed(6)));

                        shieldList.push(new Result("Target shield pushback", +(ShieldPushback(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.MoveRef.IsProjectile, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)).toFixed(6), sv >= 50 * this.Target.Modifier.ShieldHPMultiplier));
                    }
                }
            } else {
                shieldList.push(new Result("Unblockable attack", "Yes"));
            }


            //this.Visualizer.SetStage(this.Stage);
            this.Visualizer.SetLaunch(distance.launchData);
            
            return {
                damage: new ResultList(damageList),
                kb: new ResultList(kbList),
                shield: new ResultList(shieldList),
                extra: distance.extra
            };

        }

        //Percentage Calculator
        this.CalculatePercent = function () {
            var is1v1 = this.GameVariables.GameSettings.Players == "2";
            var electric = this.SelectedMove.Effect == "collision_attr_elec";
            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;
            var crouchHitlag = this.GameVariables.Crouching ? parameters.crouch_hitlag : 1;

            var paralyzer = this.SelectedMove.Effect == "collision_attr_paralyze";
            var staleMult = StaleNegation(this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled);

            var baseDamage = this.SelectedMove.Damage;
            var preDamage = this.SelectedMove.preDamage;

            var megamanFsmash = this.Attacker.Name == "Mega Man" && this.SelectedMove.MoveRef.NameId == "Fsmash";

            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                baseDamage = ChargeSmash(baseDamage, this.GameVariables.ChargeFrames,
                    megamanFsmash,
                    this.GameVariables.WitchTimeActive,
                    this.GameVariables.SmashChargeMaxDamageMultiplier)
            }

            if (this.Attacker.name == "Lucario") {
                let auraMult = Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.StockDifferenceOptions, this.GameVariables.GameSettings.Players);

                baseDamage *= auraMult;
                preDamage *= auraMult;
            }

            baseDamage *= this.Attacker.Modifier.BaseDamageMultiplier;
            preDamage *= this.Attacker.Modifier.BaseDamageMultiplier;

            var damage = baseDamage;

            damage *= this.Target.Modifier.DamageReceivedMultiplier;
            preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            preDamage *= this.Target.Modifier.DamageReceivedMultiplier;

            preDamage *= InkDamageMult(this.GameVariables.InkValue);

            if (is1v1) {
                preDamage *= 1.2;
            }

            if (this.GameVariables.ShortHop) {
                damage *= parameters.shorthop_aerial;
                preDamage *= parameters.shorthop_aerial;
            }

            if (this.Attacker.Modifier.name == "Winged Mode" || this.Attacker.Modifier.name == "Rage") {
                //Winged Mode affects KB like short hop multiplier
                damage *= this.Attacker.Modifier.DamageDealtMultiplier;
                preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            }


            let kb = new PercentFromKnockback(this.KBInput, 'total', baseDamage, damage, preDamage, this.SelectedMove.Angle, this.Target.Attributes.Weight, this.Target.Attributes.Gravity, this.Target.Attributes.FallSpeed, this.GameVariables.OpponentInAir, this.SelectedMove.BKB, this.SelectedMove.KBG, this.SelectedMove.FKB, this.AttackerPercent.Percent, r, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled, this.SelectedMove.Flinchless, electric, (this.Target.Modifier.name == "Character Inhaled"), this.GameVariables.GameSettings.LaunchRate);
            
            let results = [];

            if (kb.fkb == 0) {

                results.push(new Result("Required Percent", kb.vs_percent != -1 ? +kb.vs_percent.toFixed(4) : "Impossible"));

            }
            else {
                //FKB calculation, rage doesn't affect FKB in Ultimate
                results.push(new Result("Fixed KB", `KB is fixed to ${kb.fkb_kb}`));
			}


            return new ResultList(results);
        }

        //KO Calculator
        this.CalculateKOPercent = function () {
            var is1v1 = this.GameVariables.GameSettings.Players == "2";
            
            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;
            var staleMult = StaleNegation(this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled);

            var baseDamage = this.SelectedMove.Damage;
            var preDamage = this.SelectedMove.preDamage;

            var megamanFsmash = this.Attacker.Name == "Mega Man" && this.SelectedMove.MoveRef.NameId == "Fsmash";

            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                baseDamage = ChargeSmash(baseDamage, this.GameVariables.ChargeFrames,
                    megamanFsmash,
                    this.GameVariables.WitchTimeActive,
                    this.GameVariables.SmashChargeMaxDamageMultiplier)
            }

            if (this.Attacker.name == "Lucario") {
                let auraMult = Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.StockDifferenceOptions, this.GameVariables.GameSettings.Players);

                baseDamage *= auraMult;
                preDamage *= auraMult;
            }

            baseDamage *= this.Attacker.Modifier.BaseDamageMultiplier;
            preDamage *= this.Attacker.Modifier.BaseDamageMultiplier;

            var damage = baseDamage;

            damage *= this.Target.Modifier.DamageReceivedMultiplier;
            preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            preDamage *= this.Target.Modifier.DamageReceivedMultiplier;

            preDamage *= InkDamageMult(this.GameVariables.InkValue);

            if (is1v1) {
                preDamage *= 1.2;
            }

            if (this.GameVariables.ShortHop) {
                damage *= parameters.shorthop_aerial;
                preDamage *= parameters.shorthop_aerial;
            }

            if (this.Attacker.Modifier.name == "Winged Mode" || this.Attacker.Modifier.name == "Rage") {
                //Winged Mode affects KB like short hop multiplier
                damage *= this.Attacker.Modifier.DamageDealtMultiplier;
                preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            }

            var data = this.FindKOPercent(baseDamage, damage, preDamage, r);
            var results = [];

            this.Visualizer.SetStage(this.Stage);
            if (data.ko) {
                results.push(new Result("Target %", data.KOPercent, false));
                this.Visualizer.SetLaunch(data.distance.launchData);
                this.Visualizer.SetDILines(null);
            }
            else {
                results.push(new Result("Can't KO", "Move doesn't KO at 999%", false));
                this.Visualizer.SetLaunch(null);
                this.Visualizer.SetDILines(null);
            }

            return new ResultList(results);
        }

        this.CalculateKOPercentBasedDI = function () {
            var is1v1 = this.GameVariables.GameSettings.Players == "2";

            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;

            var baseDamage = this.SelectedMove.Damage;
            var preDamage = this.SelectedMove.preDamage;

            var megamanFsmash = this.Attacker.Name == "Mega Man" && this.SelectedMove.MoveRef.NameId == "Fsmash";

            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                baseDamage = ChargeSmash(baseDamage, this.GameVariables.ChargeFrames,
                    megamanFsmash,
                    this.GameVariables.WitchTimeActive,
                    this.GameVariables.SmashChargeMaxDamageMultiplier)
            }

            if (this.Attacker.name == "Lucario") {
                let auraMult = Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.StockDifferenceOptions, this.GameVariables.GameSettings.Players);

                baseDamage *= auraMult;
                preDamage *= auraMult;
            }

            baseDamage *= this.Attacker.Modifier.BaseDamageMultiplier;
            preDamage *= this.Attacker.Modifier.BaseDamageMultiplier;

            var damage = baseDamage;

            damage *= this.Target.Modifier.DamageReceivedMultiplier;
            preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            preDamage *= this.Target.Modifier.DamageReceivedMultiplier;

            preDamage *= InkDamageMult(this.GameVariables.InkValue);

            if (is1v1) {
                preDamage *= 1.2;
            }

            if (this.GameVariables.ShortHop) {
                damage *= parameters.shorthop_aerial;
                preDamage *= parameters.shorthop_aerial;
            }

            if (this.Attacker.Modifier.name == "Winged Mode" || this.Attacker.Modifier.name == "Rage") {
                //Winged Mode affects KB like short hop multiplier
                damage *= this.Attacker.Modifier.DamageDealtMultiplier;
                preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            }

            let stickList = this.GenerateStickPositions(this.DIStepAngle);

            let list = [];

            var data = this.FindKOPercent(baseDamage, damage, preDamage, r);

            var results = [];

            var prevStick = this.GameVariables.Stick;

            if (data.ko) {
                for (var i = 0; i < stickList.length; i++) {
                    this.GameVariables.Stick = stickList[i];

                    data = this.FindKOPercent(baseDamage, damage, preDamage, r);

                    list.push({ di: this.GameVariables.Stick, percent: data.KOPercent, data });
                }

                list.sort(function (a, b) {
                    if (a.percent > b.percent) {
                        return -1;
                    } else if (a.percent < b.percent) {
                        return 1;
                    }
                    return 0;
                });

                this.GameVariables.Stick = prevStick;

                //Compare KO percents with KO'd percent to check
                let p = null;
                let error = 1.4;

                if (list[0].percent + error < this.KOPercentForDICheck) {
                    results.push(new Result("Error", "Inputted % is higher than best DI KO %", false));
                    this.Visualizer.SetStage(this.Stage);
                    this.Visualizer.SetLaunch(null);
                    this.Visualizer.SetDILines(null);
                    return new ResultList(results);
                }

                if (list[list.length - 1].percent - error > this.KOPercentForDICheck) {
                    results.push(new Result("Error", "Inputted % is higher than best DI KO %", false));
                    this.Visualizer.SetStage(this.Stage);
                    this.Visualizer.SetLaunch(null);
                    this.Visualizer.SetDILines(null);
                    return new ResultList(results);
                }

                let usingError = false;

                //Check if it's between best/worst DI and error variable
                if (list[0].percent + error >= this.KOPercentForDICheck && this.KOPercentForDICheck >= list[0].percent) {
                    p = list[0];
                    usingError = true;
                } else if (list[list.length - 1].percent - error <= this.KOPercentForDICheck && this.KOPercentForDICheck <= list[list.length - 1].percent) {
                    p = list[list.length - 1];
                    usingError = true;
                }

                for (var i = 0; i < list.length - 1 && p == null; i++) {
                    if (list[i].percent >= this.KOPercentForDICheck && this.KOPercentForDICheck >= list[i + 1].percent) {
                        //It's between this percents so it should be the DI used
                        var d1 = list[i].percent - this.KOPercentForDICheck;
                        var d2 = this.KOPercentForDICheck - list[i + 1].percent;
                        if (d1 <= d2) {
                            p = list[i];
                        } else {
                            p = list[i + 1];
                        }
                        break;
                    }
                }

                if (p == null) {
                    results.push(new Result("Error", "Couldn't find DI", false));
                    this.Visualizer.SetStage(this.Stage);
                    this.Visualizer.SetLaunch(null);
                    this.Visualizer.SetDILines(null);
                    return new ResultList(results);
                }

                results.push(new Result("Stick X", p.di.x * (this.VisualizerOptions.InvertX ? -1 : 1), false));
                results.push(new Result("Stick Y", p.di.y, false));
                results.push(new Result("Stick angle", Math.floor(GetAngle(p.di.x * (this.VisualizerOptions.InvertX ? -1 : 1), p.di.y)), false));
                results.push(new Result("Calculated Target %", +p.percent.toFixed(6).toString() + (usingError ? "*" : ""), false));
                this.Visualizer.SetStage(this.Stage);
                this.Visualizer.SetLaunch(data.distance.launchData);
                this.Visualizer.SetDILines(null);
            }
            else {
                results.push(new Result("Can't KO", "Move doesn't KO at 999%", false));
                this.Visualizer.SetStage(this.Stage);
                this.Visualizer.SetLaunch(null);
                this.Visualizer.SetDILines(null);
			}

            return new ResultList(results);

        }

        this.CalculateKOPercentForBestWorstDI = function (bestDI)
        {
            if (bestDI == undefined)
                bestDI = true;

            var is1v1 = this.GameVariables.GameSettings.Players == "2";

            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;

            var baseDamage = this.SelectedMove.Damage;
            var preDamage = this.SelectedMove.preDamage;

            var megamanFsmash = this.Attacker.Name == "Mega Man" && this.SelectedMove.MoveRef.NameId == "Fsmash";

            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                baseDamage = ChargeSmash(baseDamage, this.GameVariables.ChargeFrames,
                    megamanFsmash,
                    this.GameVariables.WitchTimeActive,
                    this.GameVariables.SmashChargeMaxDamageMultiplier)
            }

            if (this.Attacker.name == "Lucario") {
                let auraMult = Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.StockDifferenceOptions, this.GameVariables.GameSettings.Players);

                baseDamage *= auraMult;
                preDamage *= auraMult;
            }

            baseDamage *= this.Attacker.Modifier.BaseDamageMultiplier;
            preDamage *= this.Attacker.Modifier.BaseDamageMultiplier;

            var damage = baseDamage;

            damage *= this.Target.Modifier.DamageReceivedMultiplier;
            preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            preDamage *= this.Target.Modifier.DamageReceivedMultiplier;

            preDamage *= InkDamageMult(this.GameVariables.InkValue);

            if (is1v1) {
                preDamage *= 1.2;
            }

            if (this.GameVariables.ShortHop) {
                damage *= parameters.shorthop_aerial;
                preDamage *= parameters.shorthop_aerial;
            }

            if (this.Attacker.Modifier.name == "Winged Mode" || this.Attacker.Modifier.name == "Rage") {
                //Winged Mode affects KB like short hop multiplier
                damage *= this.Attacker.Modifier.DamageDealtMultiplier;
                preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            }

            let stickList = this.GenerateStickPositions(this.DIStepAngle);

            var data = this.FindKOPercent(baseDamage, damage, preDamage, r);

            var results = [];
            let list = [];

            var prevStick = this.GameVariables.Stick;


            if (data.ko) {

                for (var i = 0; i < stickList.length; i++) {
                    this.GameVariables.Stick = stickList[i];

                    data = this.FindKOPercent(baseDamage, damage, preDamage, r);

                    list.push({ di: this.GameVariables.Stick, percent: data.KOPercent, data });
                }

                list.sort(function (a, b) {
                    if (a.percent > b.percent) {
                        return -1;
                    } else if (a.percent < b.percent) {
                        return 1;
                    }
                    return 0;
                });

                this.GameVariables.Stick = prevStick;


                if (bestDI) {
                    results.push(new Result("Stick X", list[0].di.x * (this.VisualizerOptions.InvertX ? -1 : 1), false));
                    results.push(new Result("Stick Y", list[0].di.y, false));
                    results.push(new Result("Stick angle", Math.floor(GetAngle(list[0].di.x * (this.VisualizerOptions.InvertX ? -1 : 1), list[0].di.y)), false));
                    results.push(new Result("Target % with best DI", +list[0].percent.toFixed(6).toString(), false));
                    data = list[0].data;
                }
                else {
                    results.push(new Result("Stick X", list[list.length - 1].di.x * (this.VisualizerOptions.InvertX ? -1 : 1), false));
                    results.push(new Result("Stick Y", list[list.length - 1].di.y, false));
                    results.push(new Result("Stick angle", Math.floor(GetAngle(list[list.length - 1].di.x * (this.VisualizerOptions.InvertX ? -1 : 1), list[list.length - 1].di.y)), false));
                    results.push(new Result("Target % with worst DI", +list[list.length - 1].percent.toFixed(6).toString(), false));
                    data = list[list.length - 1].data;
				}
                this.Visualizer.SetStage(this.Stage);
                this.Visualizer.SetLaunch(data.distance.launchData);
                this.Visualizer.SetDILines(null);

            }
            else {
                results.push(new Result("Can't KO", "Move doesn't KO at 999%", false));
                this.Visualizer.SetStage(this.Stage);
                this.Visualizer.SetLaunch(null);
                this.Visualizer.SetDILines(null);
            }

            return new ResultList(results);
        }

        this.CalculateDIVectorField = function () {
            var is1v1 = this.GameVariables.GameSettings.Players == "2";

            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;
            var staleMult = StaleNegation(this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled);

            var baseDamage = this.SelectedMove.Damage;
            var preDamage = this.SelectedMove.preDamage;

            var megamanFsmash = this.Attacker.Name == "Mega Man" && this.SelectedMove.MoveRef.NameId == "Fsmash";

            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                baseDamage = ChargeSmash(baseDamage, this.GameVariables.ChargeFrames,
                    megamanFsmash,
                    this.GameVariables.WitchTimeActive,
                    this.GameVariables.SmashChargeMaxDamageMultiplier)
            }

            if (this.Attacker.name == "Lucario") {
                let auraMult = Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.StockDifferenceOptions, this.GameVariables.GameSettings.Players);

                baseDamage *= auraMult;
                preDamage *= auraMult;
            }

            baseDamage *= this.Attacker.Modifier.BaseDamageMultiplier;
            preDamage *= this.Attacker.Modifier.BaseDamageMultiplier;

            var damage = baseDamage;

            damage *= this.Target.Modifier.DamageReceivedMultiplier;
            preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            preDamage *= this.Target.Modifier.DamageReceivedMultiplier;

            preDamage *= InkDamageMult(this.GameVariables.InkValue);

            if (is1v1) {
                preDamage *= 1.2;
            }

            if (this.GameVariables.ShortHop) {
                damage *= parameters.shorthop_aerial;
                preDamage *= parameters.shorthop_aerial;
            }

            if (this.Attacker.Modifier.name == "Winged Mode" || this.Attacker.Modifier.name == "Rage") {
                //Winged Mode affects KB like short hop multiplier
                damage *= this.Attacker.Modifier.DamageDealtMultiplier;
                preDamage *= this.Attacker.Modifier.DamageDealtMultiplier;
            }

            var results = [];

            let stickList = this.GenerateStickPositions(this.VectorDIAngleStep);

            let list = [];
            let positions = [];

            let center = this.Stage.center;

            let left_margin = this.Stage.blast_zones[0] / 4;
            let right_margin = this.Stage.blast_zones[1] / 4;
            let top_margin = this.Stage.blast_zones[2] / 4;
            let bottom_margin = this.Stage.blast_zones[3] / 2;

            let prevStick = this.GameVariables.Stick;
            let prevPosition = this.VisualizerOptions.Position;


            for (var i = 2; i >= 0; i--) {
                positions.push([center[0] + (left_margin * (i + 1)), center[1] + bottom_margin]);
                positions.push([center[0] + (left_margin * (i + 1)), center[1]]);
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

            let possible_positions = [];

            for (var i = 0; i < positions.length; i++) {
                possible_positions.push({ position: positions[i], possible: this.CheckPositionForStageIntersections(positions[i]), di: -1 });
            }

            var distances = [];

            for (var p = 0; p < possible_positions.length; p++) {
                if (!possible_positions[p].possible) {
                    continue;
                }
                this.VisualizerOptions.Position = { x: possible_positions[p].position[0], y: possible_positions[p].position[1] };
                let tempList = [];
                let anglesDone = [];
                list = [];
                var data = this.FindKOPercent(baseDamage, damage, preDamage, r);
                if (data.ko) {
                    for (var i = 0; i < stickList.length; i++) {
                        this.GameVariables.Stick = stickList[i];

                        var d = this.FindKOPercent(baseDamage, damage, preDamage, r);
                        if (d.ko) {
                            tempList.push({ di: Math.floor(GetAngle(this.GameVariables.Stick.x * (this.VisualizerOptions.InvertX ? -1 : 1), this.GameVariables.Stick.y)), stick: this.GameVariables.Stick, percent: d.KOPercent, data: d });
                        }
                    }
                    
                    if (tempList.length == 0)
                        continue;

                    if (this.IgnoreWithCollisions) {
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

            this.GameVariables.Stick = prevStick;
            this.VisualizerOptions.Position = prevPosition;

            if (this.ShowInterpolatedPositions) {

                //Interpolation
                var interpolations = [];
                //Side interpolation
                for (var i = 0; i < possible_positions.length - 5; i++) {
                    var interpolated = this.InterpolatedPositions(possible_positions[i], possible_positions[i + 5]);
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
                    var interpolated = this.InterpolatedPositions(possible_positions[i], possible_positions[i + 1]);
                    if (interpolated != null) {
                        distances.push(interpolated);
                    }

                }

                for (var i = 0; i < interpolations.length - 1; i++) {
                    if (i % 5 == 4) {
                        continue;
                    }
                    var interpolated = this.InterpolatedPositions(interpolations[i], interpolations[i + 1]);
                    if (interpolated != null) {
                        distances.push(interpolated);
                    }

                }

            }


            this.Visualizer.SetStage(this.Stage);
            this.Visualizer.SetLaunch(null);
            this.Visualizer.SetDILines(distances);


        }

        this.CheckPositionForStageIntersections = function (position) {
            let left = 0, right = 0, top = 0, bottom = 0;

            for (var i = 0; i < this.Stage.collisions.length; i++) {
                var left_line = [position, [this.Stage.blast_zones[0], position[1]]];
                var left_intersections = IntersectionLines(left_line, this.Stage.collisions[i].vertex);
                var right_line = [position, [this.Stage.blast_zones[1], position[1]]];
                var right_intersections = IntersectionLines(right_line, this.Stage.collisions[i].vertex);
                var top_line = [position, [position[0], this.Stage.blast_zones[3]]];
                var top_intersections = IntersectionLines(top_line, this.Stage.collisions[i].vertex);

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
                    var material = this.Stage.collisions[i].materials[left_intersections[x].i];
                    //Check if angle between current position and possible next position make collision with line
                    if (LinePassthroughCollision(LineAngle(left_line), material.passthroughAngle))
                        left++;
                }

                for (var x = 0; x < right_intersections.length && x < 1; x++) {
                    var material = this.Stage.collisions[i].materials[right_intersections[x].i];
                    //Check if angle between current position and possible next position make collision with line
                    if (LinePassthroughCollision(LineAngle(right_line), material.passthroughAngle))
                        right++;
                }

                for (var x = 0; x < top_intersections.length && x < 1; x++) {
                    var material = this.Stage.collisions[i].materials[top_intersections[x].i];
                    //Check if angle between current position and possible next position make collision with line
                    if (LinePassthroughCollision(LineAngle(top_line), material.passthroughAngle))
                        top++;
                }

			    //for (var x = 0; x < bottom_intersections.length && x < 1; x++) {
			    //	var material = this.Stage.collisions[i].materials[bottom_intersections[x].i];
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
        }

        this.InterpolatedPositions = function (a, b) {
            if (a.possible && b.possible) {
                if (a.di != -1 && b.di != -1) {

                    var i_position = { x: +((a.position[0] + b.position[0]) / 2).toFixed(6), y: +((a.position[1] + b.position[1]) / 2).toFixed(6) };

                    if (!this.CheckPositionForStageIntersections([i_position.x, i_position.y]))
                        return null;

                    var i_di = InterpolatedAngle(a.di, b.di);

                    if (i_di < 0)
                        i_di += 360;


                    return new DILine(i_position.x, i_position.y, i_di, true);
                }
            }


            return null;
		}

        this.SearchKOPercent = function (baseDamage, damage, preDamage, r, i, prev, n, pd) {
            let found = false;
            let distance = pd;
            let last;
            let prevDistance;
            for (var x = i; x >= i - prev; x -= n) {
                last = x;
                this.TargetPercent.Percent = x - n;
                prevDistance = distance;
                distance = this.GetDistance(baseDamage, damage, preDamage, r);
                if (!distance.KO) {
                    return {
                        last,
                        distance: prevDistance
                    };
				}
            }

            return null;

		}

        this.FindKOPercent = function (baseDamage, damage, preDamage, r) {
            let data = {};
            this.TargetPercent.Percent = 999;
            let distance = this.GetDistance(baseDamage, damage, preDamage, r);
            let found = false;
            if (distance.KO) {
                //KO at 999% is possible

                for (var i = 0; i <= 1000 && !found; i += 20) {
                    if (i == 1000)
                        i = 999;
                    this.TargetPercent.Percent = i;
                    distance = this.GetDistance(baseDamage, damage, preDamage, r);

                    if (distance.KO) {
                        if (i == 0) {
                            data = {
                                ko: true,
                                KOPercent: 0,
                                distance
                            };
                            found = true;
                            break;
                        }
                        else {
                            let t = this.SearchKOPercent(baseDamage, damage, preDamage, r, i, 20, 5, distance);
                            if (t != null) {
                                t = this.SearchKOPercent(baseDamage, damage, preDamage, r, t.last, 5, 1, t.distance);
                                if (t != null) {
                                    t = this.SearchKOPercent(baseDamage, damage, preDamage, r, t.last, 1, 0.5, t.distance);
                                    if (t != null) {
                                        t = this.SearchKOPercent(baseDamage, damage, preDamage, r, t.last, 0.5, 0.1, t.distance);
                                        if (t != null) {
                                            t = this.SearchKOPercent(baseDamage, damage, preDamage, r, t.last, 0.1, 0.02, t.distance);
                                            data = {
                                                ko: true,
                                                KOPercent: t.last,
                                                distance: t.distance
                                            };
                                            break;
                                        }
                                    }
                                }
                            }
                            
						}
					}
                }
            }
            else {
                data = {
                    ko: false
                };
            }
            return data;
        }

        this.GetDistance = function (baseDamage, damage, preDamage, r) {
            let vskb;
            var staleMult = StaleNegation(this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled);
            var electric = this.SelectedMove.Effect == "collision_attr_elec";
            if (this.SelectedMove.FKB == 0) {
                vskb = VSKB(this.TargetPercent.Percent + (preDamage * staleMult), baseDamage, damage, this.SelectedMove.SetWeight ? 100 : this.Target.Attributes.Weight,
                    this.SelectedMove.KBG, this.SelectedMove.BKB, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, r, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled,
                    this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.SelectedMove.SetWeight, this.GameVariables.GetStick(this.VisualizerOptions.InvertX), this.Target.Modifier.name == "Character Inhaled", this.GameVariables.GameSettings.LaunchRate);
                vskb.addModifier(this.Attacker.Modifier.KBDealtMultiplier);
                vskb.addModifier(this.Target.Modifier.KBReceivedMultiplier);
            }
            else {
                vskb = WeightBasedKB(this.SelectedMove.SetWeight ? 100 : this.Target.Attributes.Weight, this.SelectedMove.BKB, this.SelectedMove.FKB, this.SelectedMove.KBG, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, r, this.TargetPercent.Percent,
                    StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, this.SelectedMove.Effect == "collision_attr_elec", this.SelectedMove.SetWeight, this.GameVariables.GetStick(this.VisualizerOptions.InvertX), this.Target.Modifier.name == "Character Inhaled", 1);
            }

            let damageSpeedUpFrames = [];
            if (vskb.tumble && this.SelectedMove.FKB == 0) {
                damageSpeedUpFrames = DamageSpeedUpFrames(Math.max(0, FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun), vskb.angle);
            }

            let distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.tumble, Math.max(0, vskb.hitstun + this.SelectedMove.AdditionalHitstun), damageSpeedUpFrames, this.SelectedMove.FKB != 0, vskb.angle, vskb.damageflytop, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, (this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.GameVariables.SelectedFAF) - this.GameVariables.SelectedHitframe, this.Target.Attributes.FallSpeed * this.Target.Modifier.FallSpeedMultiplier, this.Target.Attributes.DamageFlyTopFallSpeed, this.Target.Attributes.GroundFriction * this.Target.Modifier.GroundFrictionMultiplier, this.VisualizerOptions.InvertX, !this.GameVariables.OpponentInAir, this.VisualizerOptions.Position, this.Stage, true, parseFloat(this.VisualizerOptions.AdditionalFramesAfterHitstun), false);

            return distance;
		}

        this.GenerateStickPositions = function (step) {
            if (step == undefined)
                step = 1;

            let controller = this.GameVariables.Controller;

            let list = [];

            if (controller.name == "Wiimote") {
                list.push({ x: 0, y: 0 });
                list.push({ x: 128, y: 0 });
                list.push({ x: -127, y: 0 });
                list.push({ x: 0, y: 128 });
                list.push({ x: 0, y: -127 });
                list.push({ x: 128, y: 128 });
                list.push({ x: 128, y: -127 });
                list.push({ x: -127, y: 128 });
                list.push({ x: -127, y: 127 });
            } else {
                for (var i = 0; i < 360; i += step) {
                    var x = Math.floor(controller.r * Math.cos(i * PI / 180));
                    var y = Math.floor(controller.r * Math.sin(i * PI / 180));

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

                    list.push({ x, y });
                }
            }

            return list;
        }

        //Url Sharing
        this.GenerateUrlParams = function () {
            let params = {
                Attacker: {
                    CharacterName: this.Attacker.CharacterName,
                    ModifierIndex: this.Attacker.ModifierIndex
                },
                Target: {
                    CharacterName: this.Target.CharacterName,
                    ModifierIndex: this.Target.ModifierIndex
                },
                AttackerPercent: this.AttackerPercent.Percent,
                TargetPercent: this.TargetPercent.Percent,
                SelectedMove: {
                    Name: this.SelectedMove.Name,
                    StartFrame: this.SelectedMove.StartFrame,
                    EndFrame: this.SelectedMove.EndFrame,
                    Damage: this.SelectedMove.Damage,
                    Angle: this.SelectedMove.Angle,
                    KBG: this.SelectedMove.KBG,
                    FKB: this.SelectedMove.FKB,
                    BKB: this.SelectedMove.BKB,
                    Hitlag: this.SelectedMove.Hitlag,
                    SetWeight: this.SelectedMove.SetWeight,
                    Rehit: this.SelectedMove.Rehit,
                    ShieldDamage: this.SelectedMove.ShieldDamage,
                    Flinchless: this.SelectedMove.Flinchless,
                    DisableHitlag: this.SelectedMove.DisableHitlag,
                    DirectIndirect: this.SelectedMove.DirectIndirect,
                    Effect: this.SelectedMove.Effect,
                    ShieldstunMultiplier: this.SelectedMove.ShieldstunMultiplier,
                    AdditionalHitstun: this.SelectedMove.AdditionalHitstun,
                    MoveRef: {
                        NameId: this.SelectedMove.MoveRef.NameId,
                        IsProjectile: this.SelectedMove.MoveRef.IsProjectile,
                        IsProjectileAttached: this.SelectedMove.MoveRef.IsProjectileAttached,
                        IsItem: this.SelectedMove.MoveRef.IsItem,
                        FAF: this.SelectedMove.MoveRef.FAF,
                        LandingLag: this.SelectedMove.MoveRef.LandingLag,
                        LandingLagStartFrame: this.SelectedMove.MoveRef.LandingLagStartFrame,
                        LandingLagEndFrame: this.SelectedMove.MoveRef.LandingLagEndFrame,
                        IsSmashAttack: this.SelectedMove.MoveRef.IsSmashAttack,
                        IsAerialAttack: this.SelectedMove.MoveRef.IsAerialAttack
                    },
                    preDamage: this.SelectedMove.preDamage,
                    MoveName: this.SelectedMove.MoveName,
                    Index: "-2"
                },
                GameVariables: {
                    ChargeFrames: this.GameVariables.ChargeFrames,
                    SmashChargeMaxFrames: this.GameVariables.SmashChargeMaxFrames,
                    SmashChargeMaxDamageMultiplier: this.GameVariables.SmashChargeMaxDamageMultiplier,
                    AerialFrameAdvantageType: this.GameVariables.AerialFrameAdvantageType,
                    OpponentInAir: this.GameVariables.OpponentInAir,
                    StaleQueue: this.GameVariables.StaleQueue,
                    ShieldStaleQueue: this.GameVariables.ShieldStaleQueue,
                    SelectedHitframe: this.GameVariables.SelectedHitframe,
                    SelectedFAF: this.GameVariables.SelectedFAF,
                    StalenessDisabled: this.GameVariables.StalenessDisabled,
                    WitchTimeActive: this.GameVariables.WitchTimeActive,
                    InkValue: this.GameVariables.InkValue,
                    Controller: this.GameVariables.Controller,
                    Stick: this.GameVariables.Stick,
                    StickAngle: this.GameVariables.StickAngle,
                    LandingFrame: this.GameVariables.LandingFrame,
                    DisplayAdvantageTypeList: this.GameVariables.DisplayAdvantageTypeList,
                    Crouching: this.GameVariables.Crouching,
                    ShortHop: this.GameVariables.ShortHop,
                    ShieldState: this.GameVariables.ShieldState,
                    Buried: this.GameVariables.Buried,
                    GameSettings: {
                        Players: this.GameVariables.GameSettings.Players,
                        LaunchRate: this.GameVariables.GameSettings.LaunchRate,
                        AttackerStockDifference: this.GameVariables.GameSettings.AttackerStockDifference,
                        SpiritsEnabled: this.GameVariables.GameSettings.SpiritsEnabled
                    }
                },
                VisualizerOptions: {
                    StageName: this.VisualizerOptions.StageName,
                    InvertX: this.VisualizerOptions.InvertX,
                    AdditionalFramesAfterHitstun: this.VisualizerOptions.AdditionalFramesAfterHitstun,
                    Spawn: this.VisualizerOptions.Spawn,
                    Position: this.VisualizerOptions.Position
                }
            };

            let url = window.location.href;
            url = url.replace(window.location.search, "") + "?data=";

            this.SharingUrl = url + encodeURI(LZString.compressToBase64(JSON.stringify(params)));
        }

        this.LoadFromUrl = function () {
            try {

                let getParams = window.location.search;
                let data = null;
                getParams.replace(/([^?=&]+)(=([^&]*))?/gi, function (a, b, c, d) {
                    if (b.toLowerCase() == 'data') {
                        data = decodeURI(d);
                    }
                });

                if (data) {

                    let params = JSON.parse(LZString.decompressFromBase64(data));

                    params.SelectedMove.Shared = true;
                    params.SelectedMove.MoveRef.NameId += " (Shared)";

                    this.SelectedMove = params.SelectedMove;

                    this.Attacker.CharacterName = params.Attacker.CharacterName;
                    this.Attacker = new Character(this.Attacker.CharacterName, this, $scope, true);
                    
                    this.Attacker.ModifierIndex = params.Attacker.ModifierIndex;
                    this.Attacker.ApplyModifier();

                    this.Target.CharacterName = params.Target.CharacterName;
                    this.UpdateTarget();
                    this.Target.ModifierIndex = params.Target.ModifierIndex;
                    this.Target.ApplyModifier();

                    this.LumaPercent = new CharacterPercent();

                    this.AttackerPercent.Percent = params.AttackerPercent;
                    this.TargetPercent.Percent = params.TargetPercent;
                    this.UpdateAttackerPercent();
                    this.UpdateTargetPercent();

                    this.UpdateLumaPercent();

                    this.GameVariables.ChargeFrames = params.GameVariables.ChargeFrames;
                    this.GameVariables.SmashChargeMaxFrames = params.GameVariables.SmashChargeMaxFrames;
                    this.GameVariables.SmashChargeMaxDamageMultiplier = params.GameVariables.SmashChargeMaxDamageMultiplier;
                    this.GameVariables.AerialFrameAdvantageType = params.GameVariables.AerialFrameAdvantageType;
                    this.GameVariables.OpponentInAir = params.GameVariables.OpponentInAir;
                    this.GameVariables.StaleQueue = params.GameVariables.StaleQueue;
                    this.GameVariables.ShieldStaleQueue = params.GameVariables.ShieldStaleQueue;
                    this.GameVariables.SelectedHitframe = params.GameVariables.SelectedHitframe;
                    this.GameVariables.SelectedFAF = params.GameVariables.SelectedFAF;
                    this.GameVariables.StalenessDisabled = params.GameVariables.StalenessDisabled;
                    this.GameVariables.WitchTimeActive = params.GameVariables.WitchTimeActive;
                    this.GameVariables.InkValue = params.GameVariables.InkValue;
                    this.GameVariables.Controller = params.GameVariables.Controller;
                    this.GameVariables.Stick = params.GameVariables.Stick;
                    this.GameVariables.StickAngle = params.GameVariables.StickAngle;
                    this.GameVariables.LandingFrame = params.GameVariables.LandingFrame;
                    this.GameVariables.DisplayAdvantageTypeList = params.GameVariables.DisplayAdvantageTypeList;
                    this.GameVariables.Crouching = params.GameVariables.Crouching;
                    this.GameVariables.ShortHop = params.GameVariables.ShortHop;
                    this.GameVariables.ShieldState = params.GameVariables.ShieldState;
                    this.GameVariables.Buried = params.GameVariables.Buried;

                    this.GameVariables.GameSettings.Players = params.GameVariables.GameSettings.Players;
                    this.GameVariables.GameSettings.LaunchRate = params.GameVariables.GameSettings.LaunchRate;
                    this.GameVariables.GameSettings.AttackerStockDifference = params.GameVariables.GameSettings.AttackerStockDifference;
                    this.GameVariables.GameSettings.SpiritsEnabled = params.GameVariables.GameSettings.SpiritsEnabled;

                    this.VisualizerOptions.StageName = params.VisualizerOptions.StageName;
                    this.StageName = params.VisualizerOptions.StageName;
                    this.VisualizerOptions.InvertX = params.VisualizerOptions.InvertX;
                    this.VisualizerOptions.AdditionalFramesAfterHitstun = params.VisualizerOptions.AdditionalFramesAfterHitstun;
                    this.VisualizerOptions.Spawn = params.VisualizerOptions.Spawn;

                    this.UpdateStage();

                    this.VisualizerOptions.Position = params.VisualizerOptions.Position;

                    this.GameVariables.UpdateDI();

                    this.Update();

                }
            }
            catch (e) {
                console.log(e);
            }

		}

        this.UpdateAttack();

        if (this.Visualizer) {
            this.UpdateStage();
            this.Visualizer.SetStage(this.Stage);
            
        }
	}
}


function ScopeUpdate($scope) {
    try {
        $scope.$apply();
    }
    catch (e) {

	}
}

function GetApps(current) {
	var list = [];
	for (var i = 0; i < appSelection.length; i++) {
		if (appSelection[i].appName != current)
			list.push(appSelection[i]);
	}
	return list;
}

/// JS/CSS functions

function ToggleDisplay() {
    let id = $(this).data('target');
    $(id).collapse('toggle');

    $(this).toggleClass("collapsed");
}


$(document).ready(function () {
    $('.group-header').on('click', ToggleDisplay);
});

///Mobile devices

//var currentDisplay = "inputs";

//var displays = ["inputs", "results"];

//var windowInput = {
//	start: {on: false, x:0, y:0},
//	move: {x:0, y:0}
//};

//var isTouch = false;

//window.onresize = function (event) {
//	if (window.innerWidth > 800) {
//		document.getElementById("main").style.display = "block";
//		document.getElementById("results").style.display = "block";
//		document.getElementById("swipeRight").style.display = "none";
//		document.getElementById("swipeLeft").style.display = "none";
//	} else {
//		if (isTouch) {
//			if (currentDisplay === "inputs") {
//				document.getElementById("results").style.display = "none";
//				document.getElementById("results").style.marginTop = "0";
//				document.getElementById("swipeRight").style.display = "block";
//			}
//			else if (currentDisplay === "results") {
//				document.getElementById("main").style.display = "none";
//				document.getElementById("swipeLeft").style.display = "block";
//			}
//		} else {
//			document.getElementById("swipeRight").style.display = "none";
//			document.getElementById("swipeLeft").style.display = "none";
//		}
//	}
//};

//window.ontouchstart = function (event) {
//	if (window.innerWidth <= 800) {

//		if (!isTouch) {
//			document.getElementById("results").style.display = "none";
//			document.getElementById("results").style.marginTop = "0";
//			document.getElementById("swipeRight").style.display = "block";
//			isTouch = true;
//		}

//		if (event.touches.length === 1 && event.touches[0].identifier === 0) {
//			windowInput.on = true;
//			windowInput.start.x = event.touches[0].pageX;
//			windowInput.start.y = event.touches[0].pageY;
//		}

//	}
//};

//window.ontouchmove = function (event) {
//	if (window.innerWidth <= 800) {
		
//		if (event.touches.length === 1 && windowInput.on) {

//			windowInput.move.x = event.touches[0].pageX;
//			windowInput.move.y = event.touches[0].pageY;

//			var direction = windowInput.move.x - windowInput.start.x > 0;

//			var distance = windowInput.move.x - windowInput.start.x;

//			if (Math.abs(distance) > window.innerWidth / 4.5) {
//				//Change display using X direction
//				if (currentDisplay === "inputs") {
//					if (!direction) {
//						document.getElementById("main").style.display = "none";
//						document.getElementById("results").style.display = "block";

//						document.getElementById("swipeRight").style.display = "none";
//						document.getElementById("swipeLeft").style.display = "block";

//						currentDisplay = "results";

//						windowInput.start.x = event.touches[0].pageX;
//						windowInput.start.y = event.touches[0].pageY;
//					}
//				}
//				else if (currentDisplay === "results") {
//					if (direction) {
//						document.getElementById("main").style.display = "block";
//						document.getElementById("results").style.display = "none";
//						document.getElementById("swipeLeft").style.display = "none";
//						document.getElementById("swipeRight").style.display = "block";

//						windowInput.start.x = event.touches[0].pageX;
//						windowInput.start.y = event.touches[0].pageY;

//						currentDisplay = "inputs";
//					}
//				}
//			}
//		}

//	}
//};

//window.ontouchend = function (event) {
//	if (window.innerWidth <= 800) {

//		windowInput.on = false;

//		//Test
//		//var distance = touchInput.move.x - touchInput.start.x;

//		//alert("Width:" + window.innerWidth + "\nDistance: " + distance);

//	}
//};

//window.onmousedown = function (event) {
//	if (isTouch && window.innerWidth > 800) {
//		isTouch = false;

//		document.getElementById("main").style.display = "block";
//		document.getElementById("results").style.display = "block";

//		document.getElementById("swipeLeft").style.display = "none";
//		document.getElementById("swipeRight").style.display = "none";
		
//	}
//}

const serializeWithoutCircularRefsAndNullValues = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        if(value != null)
            return value;
    };
};