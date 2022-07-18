class StickPosition {
	constructor(name, X, Y, controllers) {
		this.name = name;
		this.X = X;
		this.Y = Y;
		this.controllers = controllers;
	}

};

class Stick {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.angle = Math.floor(ToDegrees(Math.atan2(y, x)));

		this.CalculateStickAngle = function () {
			this.angle = Math.floor(ToDegrees(Math.atan2(y, x)));
			return this.angle;
		}
	}
}

var Controllers = {
	GC: 1,
	Pro: 2,
	Joycon: 4,
	AllControllers: 0xFFFFFFFF
}

var ControllerList = [
	{ name: "GameCube", value: Controllers.GC, gate: 35, r: 128 },
	{ name: "Pro Controller/Joycon", value: Controllers.GC, gate: 35, r: 125 }
];

var StickPositions = [
	new StickPosition("Neutral", 0, 0, Controllers.AllControllers),
	new StickPosition("Up", 0, 127, Controllers.AllControllers),
	new StickPosition("Down", 0, -127, Controllers.AllControllers),
	new StickPosition("Left", -127, 0, Controllers.AllControllers),
	new StickPosition("Right", 127, 0, Controllers.AllControllers)
];

var ShieldStates = {
	//None: "1",
	Normal: "2",
	Perfect: "3"
};

var AerialFrameAdvCalculation = {
	Normal: "1",
	LandingLag: "2",
	Autocancel: "3"
};

class GameVariables {
	constructor() {
		this.GameParameters = parameters;

		this.ChargeFrames = 0;
		this.SmashChargeMaxFrames = 60;
		this.SmashChargeMaxDamageMultiplier = 1.4;

		this.AerialFrameAdvantageType = AerialFrameAdvCalculation.Normal;
		

		this.OpponentInAir = false;

		this.StaleQueue = [false, false, false, false, false, false, false, false, false];
		this.ShieldStaleQueue = [false, false, false, false, false, false, false, false, false];

		this.SelectedHitframe = 9;
		this.SelectedFAF = 26;

		this.StalenessDisabled = false;

		//Bayonetta Witch Time
		this.WitchTimeActive = false;

		//Ink
		this.InkValue = 0;

		this.Controller = ControllerList[0];
		this.ControllerList = ControllerList;
		this.Stick = new Stick(0, 0);
		this.StickAngle = 0;
		this.StickVisualizer = null;
		
		this.ControllerInputList = [new StickPosition("Custom", 255, 255, Controllers.AllControllers)];
		this.ControllerInputList = this.ControllerInputList.concat(StickPositions.filter(s => s.controllers == Controllers.AllControllers || s.controllers == this.Controller.value));
		this.SelectedStickInput = { ...this.ControllerInputList[1] }; //Neutral

		this.LSIMultiplier = 1;

		this.LandingFrame = 0;
		this.DisplayAdvantageTypeList = false;

		this.AdvantageTypeCheckList = [
			{
				value: "faf", type: "Use move FAF",
			},
			{
				value: "landing_lag", type: "Use move landing lag"
			},
			{
				value: "autocancel", type: "Use move autocancel"
			}
		];

		this.Crouching = false;

		this.ShortHop = false;

		this.ShieldState = ShieldStates.Normal;
		this.Buried = false;

		this.GameSettings = new GameSettings();

		this.Is1v1 = function () {
			return this.GameSettings.Players == 2;
		}

		this.UpdateController = function () {
			this.Controller = this.ControllerList.filter(c => c.name == this.Controller.name)[0];

			this.ControllerInputList = [new StickPosition("Custom", 255, 255, Controllers.AllControllers)];
			this.ControllerInputList = this.ControllerInputList.concat(StickPositions.filter(s => s.controllers == Controllers.AllControllers || s.controllers == this.Controller.value));

			let newInput = this.ControllerInputList.filter(i => i.controllers.value == this.Controller.value && i.name == this.SelectedStickInput.name);

			if (newInput && newInput.length > 0)
				this.SelectedStickInput = { ...newInput[0] };

			this.StickVisualizer.gate = this.Controller.gate;
			this.StickVisualizer.controllerR = this.Controller.r;
			this.StickVisualizer.controller = this.Controller.name;
			this.StickVisualizer.drawStick(this.Stick);
		}

		this.UpdateStickInput = function () {
			let newInput = this.ControllerInputList.filter(input => input.name == this.SelectedStickInput.name)[0];

			this.SelectedStickInput = {...newInput};

			if (newInput.name == "Custom")
				return;

			this.Stick.x = newInput.X;
			this.Stick.y = newInput.Y;

			this.UpdateDI();
		}

		this.UpdateStick = function (stick) {
			this.Stick.x = stick.x;
			this.Stick.y = stick.y;

			this.DetectStickPosition();

			this.UpdateDI();
		}

		this.UpdateDIAngle = function () {
			let newStick = AngleToStickPosition(this.Controller.r, this.StickAngle);

			this.Stick.x = newStick.X;
			this.Stick.y = newStick.Y;

			this.DetectStickPosition(true);

			this.UpdateDI();
		}

		this.DetectStickPosition = function (ignoreAngleCheck) {
			let input = this.ControllerInputList.filter(i => this.Stick.x == i.X && this.Stick.y == i.Y);

			if (input && input.length > 0) {
				this.SelectedStickInput = { ...input[0] };
			}
			else {
				this.SelectedStickInput = { ...this.ControllerInputList[0] }; //Default: Custom
			}

			if (!ignoreAngleCheck) {
				this.StickAngle = Math.floor(GetAngle(this.Stick.x, this.Stick.y));
			}
		}

		this.UpdateDI = function () {
			this.StickAngle = Math.floor(GetAngle(this.Stick.x, this.Stick.y));

			this.StickVisualizer.drawStick(this.Stick);
		}

		this.CheckAdvantageTypeSituation = function (selectedMove) {
			this.DisplayAdvantageTypeList = selectedMove.MoveRef.IsAerialAttack;
			if (!this.DisplayAdvantageTypeList) {
				this.AdvantageTypeCheck = "faf";
			}
			else {
				this.LandingFrame = selectedMove.MoveRef.LandingLagEndFrame != null ? selectedMove.MoveRef.LandingLagEndFrame : selectedMove.MoveRef.FAF;
			}
		}

		this.GetStick = function (invertedX) {
			let s = new Stick(this.Stick.x, this.Stick.y);
			if (invertedX)
				s.x *= -1;
			return s;
        }
	}
}

class GameSettings {
	constructor() {
		this.Players = 2;

		this.LaunchRate = 1;

		this.AttackerStockDifference = "0";

		this.SpiritsEnabled = false;

		//this.GetAttackerStockDifference = function () {
		//	if (this.AttackerStockDifference > 0)
		//		return "+" + this.AttackerStockDifference;
		//	return this.GetAttackerStockDifference.toString();
		//}

		this.StockDifferenceOptions = [
			"-2",
			"-1",
			"0",
			"+1",
			"+2"
		]
	}
}