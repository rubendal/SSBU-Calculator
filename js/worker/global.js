var defaultParameters = {
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

var settings = {
	stick_color: "#000000",
	visualizer_colors: {
		upward: "#0000FF",
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
		camera: "#0000FF",
		blastzone: "#FF0000",
		ko: "#FF0000",
		diLine: "#000000",
		interpolatedLine: "#808080",
		background: "#FCFCFF",
		techable: "#53b953",
		techableOnlyCollision: "#af24b1",
		untechable: "#cb4d4d"
	}
};
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


//var Controllers = {
//	GC : 1,
//	//Pro: 2,
//	//Gamepad: 4,
//	//Classic: 8,
//	//Nunchuck: 16,
//	//Wiimote: 32,
//	//_3DS: 64,
//	AllControllers: 0xFFFFFFFF
//}

//var ControllerList = [
//	{ name: "GameCube/Other", value: Controllers.GC, gate: 35, r: 128 }//, //Others for now, I will add them to the list once I get the stick values
//	//{ name: "Wiimote", value: Controllers.Wiimote, gate: 0, r: 0 }
//];

//var StickPositions = [
//	new StickPosition("Neutral", 0, 0, Controllers.AllControllers),
//	new StickPosition("Up", 0, 127, Controllers.AllControllers),
//	new StickPosition("Down", 0, -127, Controllers.AllControllers),
//	new StickPosition("Left", -127, 0, Controllers.AllControllers),
//	new StickPosition("Right", 127, 0, Controllers.AllControllers),
//	//new StickPosition("Wiimote Up-Left", -127, 127, Controllers.Wiimote),
//	//new StickPosition("Wiimote Up-Right", 127, 127, Controllers.Wiimote),
//	//new StickPosition("Wiimote Down-Left", -127, -127, Controllers.Wiimote),
//	//new StickPosition("Wiimote Down-Right", 127, -127, Controllers.Wiimote)
//];

//function PercentColor(val) {
//	if (isNaN(val) || val < 0) {
//		val = 0;
//	}
//	if (val > 999) {
//		val = 999;
//	}
//	var hsl = {
//		h: 0,
//		s: 100,
//		l: colorLerp(100, 30, val, 50, 200)
//	};

//	return {
//		"-webkit-text-fill-color": `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
//	};
//}

var attacker;
var target;


var attacker_percent = 0;
var target_percent = 0;
var base_damage = 1.5;
var angle = 55;
var in_air = false;
var bkb = 45;
var wbkb = 0;
var kbg = 25;
var stale = [false, false, false, false, false, false, false, false, false];
var shieldStale = [false, false, false, false, false, false, false, false, false];
var hitlag = 1;

var charge_frames = 0;

var r = 1;


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