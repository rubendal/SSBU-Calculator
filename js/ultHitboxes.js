class UltHitboxMoveData {
	constructor(data, params) {

		data.name = data.name
			.replace("Forward Tilt", "Ftilt")
			.replace("Up Tilt", "Utilt")
			.replace("Down Tilt", "Dtilt")
			.replace("Forward Smash", "Fsmash")
			.replace("Up Smash", "Usmash")
			.replace("Down Smash", "Dsmash")
			.replace("Neutral Air", "Nair")
			.replace("Forward Air", "Fair")
			.replace("Back Air", "Bair")
			.replace("Up Air", "Uair")
			.replace("Down Air", "Dair");

		this.IsSmashAttack = data.name.includes("Fsmash") || data.name.includes("Usmash") || data.name.includes("Dsmash");
		this.IsAerialAttack = data.name.includes("Nair") ||data.name.includes("Fair") || data.name.includes("Bair") || data.name.includes("Uair") || data.name.includes("Dair");

		this.Type = "";
		this.NameId = data.name;
		this.InputType = "";


		this.Moves = [];

		var move = {
			NameId: data.name,
			Name: {
				EN: data.name,
				JP: ""
			},
			IsProjectile: false,
			IsProjectileAttached: false,
			IsItem: false,
			FAF: data.faf + 1,
			LandingLag: null,
			LandingLagStartFrame: null,
			LandingLagEndFrame: null,
			Hitboxes: [],
			Grabs: [],
			Throws: [],
			Counter: null,
			Reflector: null
		};

		if (data.name.includes("(Winged)") || data.name.includes(", Winged") || data.name.includes("(Interpolated)")) {
			this.Moves.push(move);
			return;
		}

		if (data.hitboxes) {
			for (var i = 0; i < data.hitboxes.length; i++) {
				let hitbox = data.hitboxes[i];
				if (hitbox.id && !hitbox.kind && !hitbox.status) {
					let h = {
						Name: data.name,
						Id: parseInt(hitbox.id),
						Article: "",
						Script: "",
						IgnoreGrabbed: false,
						StartFrame: hitbox.frames[0],
						EndFrame: hitbox.frames[hitbox.frames.length - 1] - 1,
						Bone: "",
						X2: 0.0,
						Y2: 0.0,
						Z2: 0.0,
						Part: hitbox.part,
						Bone: hitbox.bone,
						Damage: +parseFloat(hitbox.damage).toFixed(4),
						Angle: parseInt(hitbox.angle),
						KBG: +parseFloat(hitbox.kbg).toFixed(4),
						FKB: +parseFloat(hitbox.fkb).toFixed(4),
						BKB: +parseFloat(hitbox.bkb).toFixed(4),
						Size: +parseFloat(hitbox.size).toFixed(4),
						X: +parseFloat(hitbox.x).toFixed(4),
						Y: +parseFloat(hitbox.y).toFixed(4),
						Z: +parseFloat(hitbox.z).toFixed(4),
						Hitlag: +parseFloat(hitbox.hitlag).toFixed(4),
						SDI: +parseFloat(hitbox.sdi).toFixed(4),
						ClangRebound: hitbox.clang_rebound.toUpperCase(),
						FacingRestrict: hitbox.facingrestrict.toUpperCase(),
						SetWeight: hitbox.setweight == 'true',
						ShieldDamage: hitbox.shielddamage.includes("no") ? null : +parseFloat(hitbox.shielddamage).toFixed(4),
						Trip: +parseFloat(hitbox.trip).toFixed(4),
						Rehit: parseInt(hitbox.rehit),
						Reflectable: hitbox.reflectable == 'true',
						Absorbable: hitbox.absorbable == 'true',
						Flinchless: hitbox.flinchless == 'true',
						DisableHitlag: hitbox.disablehitlag == 'true',
						DirectIndirect: hitbox.direct_hitbox == 'true',
						GroundAir: hitbox.ground_or_air.toUpperCase(),
						Hitbits: hitbox.hitbits.toUpperCase(),
						CollisionPart: hitbox.collisionpart.toUpperCase(),
						FriendlyFire: hitbox.friendlyfire == 'true',
						Effect: hitbox.effect,
						SFXLevel: hitbox.sfxlevel,
						SFXType: hitbox.sfxtype,
						Type: hitbox.type,
						ShieldstunMultiplier: 1.0,
						AdditionalHitstun: 0
					};

					if (!h.StartFrame) {
						h.StartFrame = 1;
					}

					move.Hitboxes.push(h);
				}

			}
		}

		if (data.throws) {
			for (var i = 0; i < data.throws.length; i++) {
				let _throw = data.throws[i];
				if (!_throw.x) {
					let t = {
						Name: data.name,
						Article: "",
						Script: "",
						Kind: _throw.kind.toUpperCase(),
						Id: parseInt(_throw.id),
						AppliedFrame: parseInt(_throw.frames[0]),
						Damage: +parseFloat(_throw.damage).toFixed(4),
						Angle: parseInt(_throw.angle),
						KBG: +parseFloat(_throw.kbg).toFixed(4),
						FKB: +parseFloat(_throw.fkb).toFixed(4),
						BKB: +parseFloat(_throw.bkb).toFixed(4),
						Hitlag: +parseFloat(_throw.Hitlag).toFixed(4),
						Unk1: 1.0,
						Unk2: 0.0,
						Unk3: true,
						FacingRestrict: _throw.facingrestrict.toUpperCase(),
						Effect: _throw.effect,
						SFXLevel: _throw.sfxlevel,
						SFXType: _throw.sfxtype,
						Type: _throw.type

					};

					if (!t.AppliedFrame) {
						t.AppliedFrame = 1;
					}

					move.Throws.push(t);
				}
			}
		}

		if (params && (data.name.includes("Nair") || data.name.includes("Fair") || data.name.includes("Bair") || data.name.includes("Uair") || data.name.includes("Dair"))) {
			//Use landing lag values from character parameters

			if (data.name.includes("Nair")) {
				move.LandingLag = params.NairLandingLag;
			}
			else if (data.name.includes("Fair")) {
				move.LandingLag = params.FairLandingLag;
			}
			else if (data.name.includes("Bair")) {
				move.LandingLag = params.BairLandingLag;
			}
			else if (data.name.includes("Uair")) {
				move.LandingLag = params.UairLandingLag;
			}
			else if (data.name.includes("Dair")) {
				move.LandingLag = params.DairLandingLag;
			}
		}

		this.Moves.push(move);

		
	}
}