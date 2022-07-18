///Characters

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie", "Terry", "Byleth", "Min Min", "Steve", "Sephiroth", "Pyra", "Mythra", "Kazuya", "Sora"];
var displayNames = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie", "Terry", "Byleth", "Min Min", "Steve", "Sephiroth", "Pyra", "Mythra", "Kazuya", "Sora"];
var KHcharacters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo-Kazooie", "Terry", "Byleth", "Min Min", "Steve", "Sephiroth", "Pyra", "Mythra", "Kazuya", "Sora"];
var gameNames = ["mario", "luigi", "peach", "koopa", "yoshi", "rosetta", "koopajr", "wario", "donkey", "diddy", "gamewatch", "littlemac", "link", "zelda", "sheik", "ganon", "toonlink", "samus", "szerosuit", "pit", "palutena", "marth", "ike", "reflet", "duckhunt", "kirby", "dedede", "metaknight", "fox", "falco", "pikachu", "plizardon", "lucario", "purin", "gekkouga", "robot", "ness", "captain", "murabito", "pikmin", "wiifit", "shulk", "mariod", "pitb", "lucina", "pacman", "rockman", "sonic", "mewtwo", "lucas", "roy", "ryu", "cloud", "kamui", "bayonetta", "miiswordsman", "miifighter", "miigunner", "popo", "pichu", "younglink", "snake", "pzenigame", "pfushigisou", "wolf", "inkling", "daisy", "ridley", "chrom", "samusd", "simon", "richter", "krool", "shizue", "ken", "gaogaen", "packun", "jack", "brave", "buddy", "dolly", "master", "tantan", "pickel", "edge", "eflame", "elight", "demon", "trail"];
var dataViewerNames = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Mr Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie", "Terry", "Byleth", "Min Min", "Steve", "Sephiroth", "Pyra", "Mythra", "Kazuya", "Sora"];
var ultHitboxesFilenames = ["01_mario", "09_luigi", "13_peach", "14_bowser", "05_yoshi", "48_rosalina-luma", "58_bowser-jr", "30_wario", "02_donkey-kong", "36_diddy-kong", "26_mr-game-watch", "49_little-mac", "03_link", "17_zelda", "16_sheik", "23_ganondorf", "43_toon-link", "04_samus", "29_zero-suit-samus", "28_pit", "54_palutena", "21_marth", "32_ike", "56_robin", "59_duck-hunt", "06_kirby", "39_king-dedede", "27_meta-knight", "07_fox", "20_falco", "08_pikachu", "35_charizard", "41_lucario", "12_jigglypuff", "50_greninja", "42_rob", "10_ness", "11_captain-falcon", "45_villager", "40_olimar", "47_wii-fit-trainer", "57_shulk", "18_dr-mario", "28e_dark-pit", "21e_lucina", "55_pac-man", "46_mega-man", "38_sonic", "24_mewtwo", "37_lucas", "25_roy", "60_ryu", "61_cloud", "62_corrin", "63_bayonetta", "52_mii-swordfighter", "51_mii-brawler", "53_mii-gunner", "15_ice-climbers", "19_pichu", "22_young-link", "31_snake", "33_squirtle", "34_ivysaur", "44_wolf", "64_inkling", "13e_daisy", "65_ridley", "25e_chrom", "04e_dark-samus", "66_simon", "66e_richter", "67_king-k-rool", "68_isabelle", "60e_ken", "69_incineroar", "70_piranha-plant", "71_joker", "72_hero", "73_banjo-kazooie", "74_terry", "75_byleth", "76_min-min", "77_steve", "78_sephiroth", "79_pyra", "80_mythra", "81_kazuya", "82_sora"];

class AttributeModifier {
	constructor(name, base_damage, damage_dealt, damage_taken, kb_dealt, kb_received, gravity, fall_speed, shield, air_friction, traction, shieldDamage) {
		this.name = name;
		this.BaseDamageMultiplier = base_damage;
		this.DamageDealtMultiplier = damage_dealt;
		this.DamageReceivedMultiplier = damage_taken;
		this.KBDealtMultiplier = kb_dealt;
		this.KBReceivedMultiplier = kb_received;
		this.GravityMultiplier = gravity;
		this.FallSpeedMultiplier = fall_speed;
		this.ShieldHPMultiplier = shield;
		this.AirFrictionMultiplier = air_friction;
		this.GroundFrictionMultiplier = traction;

		this.TargetListVisible = true;
		this.AttackerListVisible = true;

		if (shieldDamage == undefined)
			this.shieldDamage = 1;
		else
			this.shieldDamage = shieldDamage;

		if (this.name != "Normal" && !this.name.startsWith("Luma") && (this.BaseDamageMultiplier == 1 && this.DamageDealtMultiplier == 1 && this.KBDealtMultiplier == 1))
			this.AttackerListVisible = false;

		if (this.name != "Normal" && !this.name.startsWith("Luma") && (this.DamageReceivedMultiplier == 1 && this.KBReceivedMultiplier == 1 && this.GravityMultiplier == 1 && this.FallSpeedMultiplier == 1 && this.ShieldHPMultiplier == 1 && this.GroundFrictionMultiplier == 1))
			this.TargetListVisible = false;
	}
};

var monado = [
	new AttributeModifier("Jump", 1, 1, 1.3, 1, 1, 1.4, 1.4, 1, 1, 1),
	new AttributeModifier("Speed", 1, 0.7, 1, 1, 1, 1.2, 1, 1, 1, 1.5),
	new AttributeModifier("Shield", 1, 0.5, 0.5, 0.8, 0.6, 1, 1, 1.5, 1, 1),
	new AttributeModifier("Buster", 1, 1.4, 1.3, 0.65, 1, 1, 1, 1, 1, 1),
	new AttributeModifier("Smash", 1, 0.3, 1, 1.25, 1.2, 1, 1, 1, 1, 1)
];

var heroRng = [
	new AttributeModifier("Oomph", 1, 1.6, 1.2, 1.1, 1, 1, 1, 1, 1, 1),
	new AttributeModifier("Psyche Up", 1, 1.2, 1, 1.2, 1, 1, 1, 1, 1, 1, 1.65),
	new AttributeModifier("Acceleratle", 1, 1, 1, 1, 1.1, 1.25, 1.5, 1, 1, 2.1, 1),
	new AttributeModifier("Oomph+Psyche Up", 1, 1.6 * 1.2, 1.2, 1.1 * 1.2, 1, 1, 1, 1, 1, 1, 1.65),
	new AttributeModifier("Oomph+Acceleratle", 1, 1, 1.2, 1, 1.1, 1.25, 1.5, 1, 1, 2.1, 1)
];

var baseParams = {
	WalkSpeed: 1.575,
	WalkAddAcceleration: 0.189,
	WalkBaseAcceleration: 0.0,
	GroundFriction: 0.114,
	DashInitialSpeed: 2.255,
	RunAddAcceleration: 0.0902,
	RunBaseAcceleration: 0.044,
	RunSpeed: 1.964,
	Jumpsquat: 3,
	JumpInitialSpeed: 18.513,
	JumpHeight: 33.66,
	HopHeight: 16.26,
	AirJumpHeight: 33.66,
	AerialAddAcceleration: 0.07,
	AerialBaseAcceleration: 0.01,
	AirSpeed: 1.071,
	AirFriction: 0.00375,
	Gravity: 0.075,
	FallSpeed: 1.58,
	DamageFlyTopGravity: 0.07224,
	DamageFlyTopFallSpeed: 1.8,
	FastFallSpeed: 2.528,
	Weight: 90.0,
	NairLandingLag: 7,
	FairLandingLag: 10,
	BairLandingLag: 10,
	UairLandingLag: 8,
	DairLandingLag: 14,
	SoftLandingLag: 1,
	HardLandingLag: 3,
	FallingFrameToUseHardLandingLag: 4,
	CharacterSizeMultiplier: 0.95,
	ShieldSize: 11.9,
	ShieldBreakHeight: 38.0,
	GuardSpeedLimit: 1.3,
	JostleFront: 1.3,
	JostleBack: 0.5,
	JostleWeight: 5.0,
	LedgeJumpHSpeed: 0.6,
	LedgeJumpHeight: 36.83,
	Jab1ToJab2EndFrame: 30,
	Jab2ToJab3EndFrame: 0,
	Ftilt1ToFtilt2EndFrame: 0,
	Ftilt2ToFtilt3EndFrame: 0,
	Fsmash1ToFsmash2EndFrame: 0,
	HasRapidJab: false,
	AttackInputsForRapidJab: 0,
	RapidJabReboundDistance: 35.0,
	RapidJabReboundCount: 5.0,
	DtiltReboundDistance: 45.0,
	DtiltReboundCount: 3.0,
	FsmashMaxDamageMultiplier: 1.4,
	UsmashMaxDamageMultiplier: 1.4,
	DsmashMaxDamageMultiplier: 1.4,
	FsmashMaxChargeFrames: 60,
	UsmashMaxChargeFrames: 60,
	DsmashMaxChargeFrames: 60,
	FsmashMaxChargeHeldFrames: 120,
	UsmashMaxChargeHeldFrames: 120,
	DsmashMaxChargeHeldFrames: 120,
	JumpCount: 2,
	HasCrawl: false,
	HasWallJump: false,
	HasWallCling: false,
	HasZair: false,
	FootstoolJumpSpeedMultiplier: 1.3,
	FootstoolHopSpeedMultiplier: 0.7,
	AirborneFootstoolEndlag: 36,
	WallJumpHSpeed: 1.3,
	WallJumpVSpeed: 2.4,
	FinalSmashMeterDamageMultiplier: 0.7,
	FinalSmashMeterKBMultiplier: 0.3
};

var MoveSources = {
	None: "",
	Calculator: "Using Script data",
	UltimateHitboxes: "Using Ultimate Hitboxes data",
	KuroganeHammer: "Using Kurogane Hammer data"
};

class Character {
	constructor(displayName, calculatorRef, $scope, loadMoveData = false) {
		this.display_name = displayName;

		let index = displayNames.indexOf(displayName);

		var name = characters[index];
		this.CharacterName = displayName;
		this.GameName = gameNames[index];
		this.DataViewerName = dataViewerNames[index];
		this.UltHitboxesFilename = ultHitboxesFilenames[index];

		this.UltHitboxesName = this.UltHitboxesFilename.substring(this.UltHitboxesFilename.indexOf("_") + 1);

		this.Modifier = new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
		this.Modifiers = [];
		this.ModifierIndex = "0";
		this.Params = baseParams;
		this.Attributes = {...this.Params};

		for (var property in this.Params) {
			this.Attributes[property] = this.Params[property];
		}

		if (this.name == null) {
			this.name = name;
		}
		if (this.name == "Shulk") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.Modifiers = this.Modifiers.concat(monado);
		} else if (this.name == "Kirby") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.Modifiers = this.Modifiers.concat(monado);
		} else if (this.name == "Bowser Jr") {
			this.Modifiers = [new AttributeModifier("Clown Kart", 1, 1, 0.88, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Body", 1, 1, 1.15, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.Modifier = this.Modifiers[0];
		} else if (this.name == "Rosalina And Luma") {
			this.Modifiers = [new AttributeModifier("Luma (Following)", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Luma (Free)", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.Modifier = this.Modifiers[0];
		} else if (this.name == "Wii Fit Trainer") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Fast Deep Breathing", 1.25, 1, 0.9, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Slow Deep Breathing", 1.16, 1, 0.9, 1, 1, 1, 1, 1, 1, 1)];

		} else if (this.name == "Cloud") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Limit Break", 1, 1, 1, 1, 1, 1.1, 1.1, 1, 1.15, 1.15, 1)];
		}
		else if (this.name == "King Dedede") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Character Inhaled", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
		}
		else if (this.name == "Hero") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.Modifiers = this.Modifiers.concat(heroRng);
		}
		else if (this.name == "Ice Climbers") {
			this.Modifiers = [new AttributeModifier("Popo", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Nana", 1, 1, 1.02, 1, 1.02, 1, 1, 1, 1, 1, 1)];
			this.Modifier = this.Modifiers[0];
		}
		else if (this.name == "Sephiroth") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Winged Mode", 1, 1.3, 1, 1, 1, 1.03, 1.05, 1, 1.05, 1.3, 1)];
		}
		else if (this.name == "Kazuya") {
			this.Modifiers = [new AttributeModifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new AttributeModifier("Rage", 1, 1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
		}

		this.filename = this.display_name.toLowerCase().replace(/\./g, "").replace("& ", "");
		this.class = this.display_name.toLowerCase().replace(/\./g, "").replace("& ", "and ").replace(/ /g, "-");

		this.updateImage = function () {
			this.image = "./img/characters/" + this.filename + ".png";
		}

		this.api_name = this.name;
		if (name == "Game And Watch") {
			this.api_name = "Mrgamewatch";
		}

		this.api_name = this.api_name.toLowerCase().replace("and", "").replace("&", "").split(".").join("").split(" ").join("");

		this.Moves = [new Move(-1)];
		this.Moveset = [];
		this.MoveSource = MoveSources.None;

		var ref = this;
		LoadCharacterData(this.GameName, function (data) {
			ref.data = data;
			ref.Params = data.Params;
			ref.Attributes = { ...data.Params };
			if (data.Modifiers) {
				for (var i = 0; i < data.Modifiers.length; i++) {
					
				}
			}
			ref.Moves = [new Move(-1)];
			if (loadMoveData) {
				if (data.MoveTypes && data.MoveTypes.length > 0) {
					//Local move data
					var attacks = [];
					for (var i = 0; i < data.MoveTypes.length; i++) {
						let moveType = data.MoveTypes[i];
						for (var j = 0; j < moveType.Moves.length; j++) {
							let move = new MoveData(ref.name, moveType.Moves[j], moveType);
							attacks = attacks.concat(move.GetHitboxes());
							attacks = attacks.concat(move.GetThrows());
						}
					}
					for (var i = 0; i < attacks.length; i++) {
						ref.Moves.push(new Move(i, attacks[i]));
					}
					ref.MoveSource = MoveSources.Calculator;
					ref.Moveset = ref.MapMovesByName(ref.Moves);

					if ($scope.Calculator.SelectedMove.Shared) {
						ref.Moveset.unshift({
							Name: $scope.Calculator.SelectedMove.MoveRef.NameId,
							Moves: [
								$scope.Calculator.SelectedMove
							]
						});
					}

					ScopeUpdate($scope);
				}
				else {

					//Use Ultimate hitboxes data (https://www.ultimate-hitboxes.com/ , Files: https://github.com/RSN-Bran/ultimate-hitboxes/tree/master/server/data)
					LoadJsonFromPath(`./Data/ulthitboxes/${ref.UltHitboxesFilename}.json`, function (ultHitboxData) {

						var attacks = [];
						let moveTypes = [];

						for (var i = 0; i < ultHitboxData.moves.length; i++) {
							let u = ultHitboxData.moves[i];
							moveTypes.push(new UltHitboxMoveData(u, ref.Params));
						}

						for (var i = 0; i < moveTypes.length; i++) {
							let moveType = moveTypes[i];
							for (var j = 0; j < moveType.Moves.length; j++) {
								let move = new MoveData(ref.name, moveType.Moves[j], moveType, true);
								attacks = attacks.concat(move.GetHitboxes());
								attacks = attacks.concat(move.GetThrows());
							}
						}
						for (var i = 0; i < attacks.length; i++) {
							ref.Moves.push(new Move(i, attacks[i]));
						}
						ref.MoveSource = MoveSources.UltimateHitboxes;
						ref.Moveset = ref.MapMovesByName(ref.Moves);

						if ($scope.Calculator.SelectedMove.Shared) {
							ref.Moveset.unshift({
								Name: $scope.Calculator.SelectedMove.MoveRef.NameId,
								Moves: [
									$scope.Calculator.SelectedMove
								]
							});
						}

						ScopeUpdate($scope);
					});
				}

			}
			else {
				ScopeUpdate($scope);
			}
			
		});

		//this.updateIcon();
		this.updateImage();

		//Functions
		this.ApplyModifier = function () {
			this.Attributes = { ...this.Params };

			if (this.ModifierIndex && this.Modifiers.length > 0) {

				this.Modifier = this.Modifiers[this.ModifierIndex];			
				this.Attributes.Gravity *= this.Modifier.GravityMultiplier;
				this.Attributes.FallSpeed *= this.Modifier.FallSpeedMultiplier;
				this.Attributes.GroundFriction *= this.Modifier.GroundFrictionMultiplier;
				this.Attributes.AirFriction *= this.Modifier.AirFrictionMultiplier;
			}

			calculatorRef.Update();
		}

		this.AttackerShowsModifierList = function () {
			return this.Modifiers.filter(m => m.AttackerListVisible).length > 1;
		}

		this.TargetShowsModifierList = function () {
			return this.Modifiers.filter(m => m.TargetListVisible).length > 1;
		}

		this.MapMovesByName = function (moves) {
			return moves.reduce((a, e) => {
				var index = -1;
				for (var i = 0; i < a.length; i++) {
					if (a[i].Name == e.MoveRef.NameId) {
						index = i;
						break;
					}
				}
				if (index == -1) {
					a.push({
						Name: e.MoveRef.NameId,
						Moves: [
							e
						]
					});
				}
				else {
					a[index].Moves.push(e);
				}

				return a;
			}, []);
		}
	}

};




function sorted_characters() {
	var list = [];
	for (var i = 0; i < characters.length; i++) {
		list.push({ character: characters[i], name: displayNames[i], game: gameNames[i], dataViewer: dataViewerNames[i], ultHitboxes: ultHitboxesFilenames[i] });
	}
	
	list.sort(function (a, b) {
		return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
	});

	for (var i = 0; i < list.length; i++) {
		characters[i] = list[i].character;
		displayNames[i] = list[i].name;
		gameNames[i] = list[i].game;
		dataViewerNames[i] = list[i].dataViewer;
		ultHitboxesFilenames[i] = list[i].ultHitboxes;
	}

}

//Sort character data
sorted_characters();
