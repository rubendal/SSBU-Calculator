class UltHitboxMoveData {
	constructor(data) {

		
		this.IsSmashAttack = data.name.includes("Forward Smash") || data.name.includes("Up Smash") || data.name.includes("Down Smash");
		this.IsAerialAttack = data.name.includes("Neutral Air") ||data.name.includes("Forward Air") || data.name.includes("Back Air") || data.name.includes("Up Air") || data.name.includes("Down Air");

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
			FAF: data.faf,
			LandingLag: null,
			LandingLagStartFrame: null,
			LandingLagEndFrame: null,
			Hitboxes: [],
			Grabs: [],
			Throws: [],
			Counter: null,
			Reflector: null
		};

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
						EndFrame: hitbox.frames[hitbox.frames.length - 1],
						Bone: "",
						X2: 0.0,
						Y2: 0.0,
						Z2: 0.0,
						Part: hitbox.part,
						Bone: hitbox.bone,
						Damage: parseFloat(hitbox.damage),
						Angle: parseInt(hitbox.angle),
						KBG: parseFloat(hitbox.kbg),
						FKB: parseFloat(hitbox.fkb),
						BKB: parseFloat(hitbox.bkb),
						Size: parseFloat(hitbox.size),
						X: parseFloat(hitbox.x),
						Y: parseFloat(hitbox.y),
						Z: parseFloat(hitbox.z),
						Hitlag: parseFloat(hitbox.hitlag),
						SDI: parseFloat(hitbox.sdi),
						ClangRebound: hitbox.clang_rebound.toUpperCase(),
						FacingRestrict: hitbox.facingrestrict.toUpperCase(),
						SetWeight: hitbox.setweight,
						ShieldDamage: hitbox.shielddamage.includes("no") ? null : parseFloat(hitbox.shielddamage),
						Trip: parseFloat(hitbox.trip),
						Rehit: parseInt(hitbox.rehit),
						Reflectable: hitbox.reflectable == 'true',
						Absorbable: hitbox.absorbable == 'true',
						Flinchless: hitbox.flinchless == 'true',
						DisableHitlag: hitbox.disablehitlag == 'true',
						DirectIndirect: hitbox.direct_hitbox == 'true',
						GroundAir: hitbox.ground_or_air.toUpperCase(),
						Hitbits: hitbox.hitbits.toUpperCase(),
						CollisionPart: hitbox.collisionpart.toUpperCase(),
						FriendlyFire: hitbox.friendlyfire,
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
						Damage: parseFloat(_throw.damage),
						Angle: parseInt(_throw.angle),
						KBG: parseFloat(_throw.kbg),
						FKB: parseFloat(_throw.fkb),
						BKB: parseFloat(_throw.bkb),
						Hitlag: parseFloat(_throw.Hitlag),
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

		this.Moves.push(move);

		
	}
}