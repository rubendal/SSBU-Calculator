var effects = [
	{ id: "none", name: "None/Other" },
	{ id: "collision_attr_elec", name: "Electric" },
	{ id: "collision_attr_ice", name: "Freeze" },
	{ id: "collision_attr_sleep", name: "Sleep" },
	{ id: "collision_attr_bury", name: "Bury" },
	{ id: "collision_attr_stun", name: "Stun" },
	{ id: "collision_attr_paralyze", name: "Paralyze" },
	{ id: "collision_attr_flower", name: "Flower" },
	{ id: "collision_attr_bind_extra", name: "Disable" }
];

var baseMove = {
	Name: "Custom move",
	Article: "",
	Script: "",
	Id: 0,
	IgnoreGrabbed: false,
	StartFrame: 5,
	EndFrame: 7,
	Part: 0,
	Bone: "top",
	Damage: 3,
	Angle: 361,
	KBG: 12,
	FKB: 0,
	BKB: 30,
	Size: 3,
	X: 0.5,
	Y: 0,
	Z: 1.5,
	X2: 0,
	Y2: 0,
	Z2: 0,
	Hitlag: 1,
	SDI: 1,
	ClangRebound: "ATTACK_SETOFF_KIND_ON",
	FacingRestrict: "ATTACK_LR_CHECK_F",
	SetWeight: false,
	ShieldDamage: 0,
	Trip: 0,
	Rehit: 0,
	Reflectable: false,
	Absorbable: false,
	Flinchless: false,
	DisableHitlag: false,
	DirectIndirect: true,
	GroundAir: "COLLISION_SITUATION_MASK_GA",
	Hitbits: "COLLISION_CATEGORY_MASK_ALL",
	CollisionPart: "COLLISION_PART_MASK_ALL",
	FriendlyFire: false,
	Effect: "collision_attr_none",
	SFXLevel: "ATTACK_SOUND_LEVEL_S",
	SFXType: "",
	Type: "",
	ShieldstunMultiplier: 1,
	AdditionalHitstun: 0,
	MoveRef: {
		NameId: "Custom move",
		Name: {
			EN: "Custom move",
			JP: ""
		},
		IsProjectile: false,
		IsProjectileAttached: false,
		IsItem: false,
		FAF: 26,
		LandingLag: null,
		LandingLagStartFrame: null,
		LandingLagEndFrame: null,
		Hitboxes: [],
		Grabs: [],
		Throws: [],
		Counter: null,
		Reflector: null,
		character: "",
		ChargeData: null,
		Type: "",
		InputType: "attack",
		IsSmashAttack: false,
		IsAerialAttack: false,
		maxSmashChargeMult: 1
	},
	preDamage: 0,
	MoveName: "Custom move",
	OptionClass: [],
	Index: "-1"
};

class ChargeData {
	constructor(names, min, max, formula, label) {
		this.names = names;
		this.min = min;
		this.max = max;
		this.formula = formula;
		this.label = null;

		if (label)
			this.label = label;
	}

	static get(list, move_name) {
		for (var i = 0; i < list.length; i++) {
			for (var j = 0; j < list[i].names.length; j++) {
				if (move_name == (list[i].names[j])) {
					return list[i];
				}
			}
		}
		return null;
	}
};

var smashAttackCharge = new ChargeData(["Usmash", "Fsmash", "Dsmash"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
	return [base_damage * (1 + (frames * 1.4 / 150)), bkb, kbg, shieldDamage];
});

var chargeMoves = [
	new ChargeData(["Palutena Bow", "Palutena's Bow", "Palutena's Bow (No Charge)", "Palutena's Bow (No Charge, Aerial)"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [3.2 + (frames * 0.09), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Silver Bow", "Silver Bow (Grounded Sideways)", "Silver Bow (Grounded Upwards)", "Silver Bow (Aerial Sideways)", "Silver Bow (Aerial Upwards)"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [5.5 + (frames * 0.1417), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Flare Blade"], 0, 239, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [8 + (frames * 5 / 30), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Shield Breaker"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [base_damage * ((60 - frames) / 60 + (frames * 2.2 / 60)), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Eruption"], 0, 119, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [10 + (frames * 4 / 30), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Quickdraw (Attack)"], 0, 70, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [base_damage + (frames * 0.1), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Giant Punch (Uncharged"], 0, 9, function (base_damage, bkb, kbg, shieldDamage, frames) {
		if (frames == 1) {
			frames = 0;
		}
		return [base_damage + (2 * frames), bkb, kbg, shieldDamage];
	}, 'Arm swings'),
	new ChargeData(["Charge Shot", "Charge Shot (Grounded)", "Charge Shot (Aerial)"], 0, 112, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(5, 28, frames, 112), lerp(14, 46, frames, 112), lerp(42, 50, frames, 112), lerp(-2.5, -7, frames, 112)];
	}),
	new ChargeData(["Charge Blast (No Charge)"], 0, 119, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(base_damage, 22, frames, 120), lerp(bkb, 20, frames, 120), lerp(kbg, 64, frames, 120), shieldDamage];
	}),
	new ChargeData(["Hero's Bow (No Charge)"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [4 + (12 - 4) * (frames / 60), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Spin Attack (No Charge,"], 0, 60, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [base_damage * ((60 - frames) / 60 + (frames * 1.6 / 60)), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["PK Flash (No Charge)", "PK Trash (No Charge)"], 0, 105, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [5 + (((frames + 15) / 120) * .32 * 100), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Dragon Fang Shot (Bite, No Charge)"], 0, 30, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(10, 18, frames, 30), 50, 100, 3];
	}),
	new ChargeData(["Dragon Fang Shot (Shot, No Charge)"], 0, 29, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(4, 9, frames, 30), lerp(20, 30, frames, 30), kbg, shieldDamage];
	}),
	new ChargeData(["Aura Sphere (Release from Charge)"], 0, 89, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(10, 25, frames, 90) * 0.69, lerp(bkb, 35, frames, 90), lerp(kbg, 69, frames, 90), lerp(shieldDamage, 3, frames, 90)];
	}),
	new ChargeData(["Skull Bash"], 0, 90, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(base_damage, 21.4, frames, 90), bkb, kbg, shieldDamage];
	}),
	new ChargeData(["Rollout (Ground, Release)", "Rollout (Aerial, Release)"], 0, 6.5, function (base_damage, bkb, kbg, shieldDamage, frames) {
		if (frames < 2)
			return [7, bkb];
		return [Math.max(Math.floor(frames * 1.5 * 3.4), 1), bkb, kbg, shieldDamage];
	}, 'Current speed'),
	new ChargeData(["Water Shuriken (Uncharged)"], 0, 39, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(3, 11, frames, 40), lerp(10, 20, frames, 40), lerp(45, 85, frames, 40), lerp(-1.5, -5.5, frames, 40)];
	}),
	new ChargeData(["Sun Salutation"], 0, 85, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(5, 21, frames, 85), 30, 63, lerp(-2.5, -5.3, frames, 85)];
	}),
	new ChargeData(["Shadow Ball"], 0, 119, function (base_damage, bkb, kbg, shieldDamage, frames) {
		return [lerp(2.5, 25, frames, 120), lerp(bkb, 30, frames, 120), lerp(kbg, 67, frames, 120), lerp(shieldDamage, -4, frames, 120)];
	})

];

class MoveData {
	constructor(character, move, moveType, ultHitboxes = false) {

		for (var property in move) {
			this[property] = move[property];
		}
		this.character = character;
		this.ChargeData = null;

		this.Type = moveType.Type;
		this.InputType = moveType.InputType;
		this.IsSmashAttack = moveType.IsSmashAttack;
		this.IsAerialAttack = moveType.IsAerialAttack;

		this.IsFromUltimateHitboxes = ultHitboxes;

		this.Grabs = []; //Ignore grabs

		var charge = ChargeData.get(chargeMoves, this.Name.EN);

		if (charge) {
			this.ChargeData = charge;
		}

		this.maxSmashChargeMult = this.smash_attack ? 1.4 : 1;
		//Smash attacks
		if (this.IsSmashAttack) {
			if (this.character == "Bayonetta" || this.character == "Olimar") {
				this.maxSmashChargeMult = 1.2;
			}
			if (this.character == "Ness" && (this.Name.EN.includes("Usmash") || this.Name.EN.includes("Dsmash"))) {
				this.maxSmashChargeMult = 1.2;
			}
			if ((this.character == "Mega Man" || this.character == "Villager") && this.Name.EN.includes("Fsmash")) {
				this.maxSmashChargeMult = 1.2;
			}
		}

		var sameFrame = true;
		var frame = 0;
		var sameId = true;
		var hId = 0;

		if (this.Hitboxes.length > 1) {
			for (var i = 0; i < this.Hitboxes.length; i++) {
				if (i == 0) {
					frame = this.Hitboxes[0].StartFrame;
					hId = this.Hitboxes[0].Id;
				}
				else {
					if (frame !== this.Hitboxes[i].StartFrame) {
						sameFrame = false;
					}
					if (hId !== this.Hitboxes[i].Id) {
						sameId = false;
					}
				}
			}

		}

		for (var i = 0; i < this.Hitboxes.length; i++) {
			this.Hitboxes[i].MoveRef = this;
			this.Hitboxes[i].preDamage = 0;
			this.Hitboxes[i].MoveName = this.Name.EN;

			this.Hitboxes[i]._Damage = this.Hitboxes[i].Damage;
			this.Hitboxes[i]._BKB = this.Hitboxes[i].BKB;
			this.Hitboxes[i]._KBG = this.Hitboxes[i].KBG;
			this.Hitboxes[i]._ShieldDamage = this.Hitboxes[i].ShieldDamage;

			if (this.InputType == 'throw')
				this.Hitboxes[i].MoveName += ' (Collateral)';

			var id = this.Hitboxes[i].Id;

			if (!isNaN(this.Hitboxes[i].Id)) {
				id = (parseInt(this.Hitboxes[i].Id) + 1).toString();
			}

			if (this.Hitboxes.length > 1) {
				if (sameFrame) {
					this.Hitboxes[i].MoveName += ` (Hitbox ${id})`;
				}
				else {
					if (sameId) {
						this.Hitboxes[i].MoveName += ` (Frame ${this.Hitboxes[i].StartFrame})`;
					}
					else {
						this.Hitboxes[i].MoveName += ` (Frame ${this.Hitboxes[i].StartFrame} / Hitbox ${id})`;
					}
				}
			}

			this.Hitboxes[i].OptionClass = [];

			if (this.Hitboxes[i].GroundAir == "COLLISION_SITUATION_MASK_G") {
				this.Hitboxes[i].OptionClass.push("groundOnly");
			}
			else if (this.Hitboxes[i].GroundAir == "COLLISION_SITUATION_MASK_A") {
				this.Hitboxes[i].OptionClass.push("aerialOnly");
			}

			if (this.ChargeData != null) {
				this.Hitboxes[i].ChargeData = this.ChargeData;
				this.Hitboxes[i].ChargeDamage = function (frames) {
					return +this.ChargeData.formula(this._Damage, this._BKB, this._KBG, this._ShieldDamage, frames)[0].toFixed(4);
				}
				this.Hitboxes[i].ChargeBKB = function (frames) {
					return (this.ChargeData.formula(this._Damage, this._BKB, this._KBG, this._ShieldDamage, frames)[1]);
				}
				this.Hitboxes[i].ChargeKBG = function (frames) {
					return (this.ChargeData.formula(this._Damage, this._BKB, this._KBG, this._ShieldDamage, frames)[2]);
				}
				this.Hitboxes[i].ChargeShieldDamage = function (frames) {
					return (this.ChargeData.formula(this._Damage, this._BKB, this._KBG, this._ShieldDamage, frames)[3]);
				}
			}

		}

		var sameKind = true;
		var kind = '';

		if (this.Throws.length > 1) {
			for (var i = 0; i < this.Throws.length; i++) {
				if (i == 0) {
					kind = this.Throws[i].Kind;
				} else {
					if (kind != this.Throws[i].Kind) {
						sameKind = false;
						break;
					}
				}
			}
		}

		for (var i = 0; i < this.Throws.length; i++) {

			this.Throws[i].MoveRef = this;
			this.Throws[i].preDamage = 0;
			this.Throws[i].throw = true;

			this.Throws[i].StartFrame = this.Throws[i].AppliedFrame;
			this.Throws[i].EndFrame = this.Throws[i].AppliedFrame + 1;
			this.Throws[i].SetWeight = false;
			this.Throws[i].DisableHitlag = false;
			this.Throws[i].ShieldDamage = null;
			this.Throws[i].ShieldstunMultiplier = 1;
			this.Throws[i].AdditionalHitstun = 0;

			this.Throws[i].preDamage = 0;

			for (var h = 0; h < this.Hitboxes.length; h++) {
				if (!this.Hitboxes[h].IgnoreGrabbed && !ultHitboxes) {
					if (this.Hitboxes[h].StartFrame < this.Throws[i].AppliedFrame && this.Hitboxes[h].Id == 0) {
						this.Throws[i].preDamage += this.Hitboxes[h].Damage;
					}
				}
			}

			this.Throws[i].MoveName = this.Name.EN;

			if (sameKind && this.Throws.length > 1) {
				if (this.Hitboxes.length > 0) {
					this.Throws[i].MoveName += ` (Throw, Id ${(parseInt(this.Throws[i].Id) + 1).toString()})`;
				}
				else {
					this.Throws[i].MoveName += ` (Id ${(parseInt(this.Throws[i].Id) + 1).toString()})`;
				}
			}
			else {
				if (this.Hitboxes.length > 0) {
					this.Throws[i].MoveName += ` (Throw)`;
				}
				//this.Throws[i].MoveName += ` (${this.Throws[i].Kind})`;
			}

			this.Throws[i].OptionClasses = "";
		}


		this.GetHitboxes = function () {
			return this.Hitboxes.filter(h => h.Effect != "collision_attr_search");
		}

		this.GetThrows = function () {
			return this.Throws.filter(t => t.Kind != "FIGHTER_ATTACK_ABSOLUTE_KIND_CATCH" || t.Id != 0);
		}

	}
}


class Move{
    constructor(index, data = null) {
        let d = data;
        if (!data)
            d = baseMove;
        for (var property in d) {
            this[property] = d[property];
		}

		this.Index = index.toString();

		this.ApplyCharge = function (chargeFrames, witchTimeActive = false) {
			if (this.ChargeData != null) {
				this.Damage = this.charge_damage(chargeFrames);
				this.BKB = this.charge_bkb(chargeFrames);
				this.KBG = this.charge_kbg(chargeFrames);
				this.ShieldDamage = this.charge_shieldDamage(chargeFrames);
			}
			if (this.MoveRef.smash_attack) {
				this.Damage = ChargeSmash(this._Damage, chargeFrames, (this.MoveRef.character == "Mega Man" && this.MoveRef.NameId == "Fsmash"), this.MoveRef.character == "Bayonetta" ? witchTimeActive : false, this.MoveRef.maxSmashChargeMult)
			}
		}
	}
}