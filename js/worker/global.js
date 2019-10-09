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
		constant: 6
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

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie"];
var newCharacters = ["Inkling", "Daisy", "Ridley", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant"]; ///added on SSBU
var notInAPICharacters = ["Ice Climbers", "Pichu"]; ///added on SSBU and no local data
//April Fools 2017
//var names = ["Not top 5", "Green Mario", "UpB with 180 WBKB", "Uthrow-Uair", "Egg shield", "Luma", "Clown Kart", "Wah", "Expand", "Banana-Dtilt-Usmash", "Mr. Bucket & 9", "Good frame data/horrible aerials", "Lonk", "Link?", "Can't kill past 130%", "DISRESPECT", "Bomb-Fair", "Spamus", "Zero Skill Samus", "Hot spring maniac", "Top tier with customs", "Morth", "Slow Marth", "Magical Marth", "Dog & Duck", "Hi!", "Sakurai's voice", "Not Brawl", "Honest", "Revali", "Quick Attack", "Orange flying lizard", "Aura is Broken", "Never buffed", "Nerfed", "Beep Boop", "Okay", "Dthrow to knee is not true", "Killager", "Pikmin", "Feel the burn", "Commentator's nightmare", "Doc is In", "Edgy Pit", "Female Marth", "Useless grab", "Lemons", "Sanic", "Heavier than Charizard in Pokemon", "Zair/PK Fire spacing", "Boy Marth", "Utilt", "Genkai wo Koeru", "Instapin", "BANonetta", "Nonexistant Swordfighter", "Nonexistant Brawler", "Nonexistant Gunner"];
//April Fools 2018
//var names = ["Not top 5", "Green Mario", "Fair that deals 15%", "Pivot grabs from half stage", "Egg shield", "Luma", "Clown Kart", "Wah", "EXPAND DONG", "Hoo-Hah", "Mr. Bucket & 9", "Good frame data/horrible aerials", "Lonk", "Link?", "Can't kill past 130%", "DISRESPECT", "Bomb-Fair", "Spamus", "Rage Boost Kick", "Hot spring maniac", "Top tier with customs", "Morth", "Buffed Marth", "Magical Marth", "Dog & Duck", "Hi!", "Sakurai's idea of Perfection", "Not Brawl", "Honest", "Revali?", "Pichu?", "Orange flying lizard", "Aura + Rage is BROKEN", "Don't expect buffs on Switch", "Nerf Greninja", "50/50 reflector", "Ebola Back Throw", "Dthrow To Knee Is Not True", "Killager", "Just throw Pikmin", "Feel the burn", "I'm really feeling it", "The Doc is IN", "Edgy Pit", "Female Marth", "FAF 76 Grabs", "If life gives you lemons, shoot them", "Gotta go fast", "Fair with \"short range\"", "PK Fire/Zair spacing", "Fire Marth", "Utilts", "Genkai wo Koeru", "Dragon Marth", "Just SDI", "Nonexistant Swordfighter", "Nonexistant Brawler", "Nonexistant Gunner"];
var characterNames = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie"];
var KHcharacters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Ice Climbers", "Pichu", "Young Link", "Snake", "Squirtle", "Ivysaur", "Wolf", "Inkling", "Daisy", "Ridley", "Chrom", "Dark Samus", "Simon", "Richter", "King K. Rool", "Isabelle", "Ken", "Incineroar", "Piranha Plant", "Joker", "Hero", "Banjo-Kazooie"];
var gameNames = ["mario", "luigi", "peach", "koopa", "yoshi", "rosetta", "koopajr", "wario", "donkey", "diddy", "gamewatch", "littlemac", "link", "zelda", "sheik", "ganon", "toonlink", "samus", "szerosuit", "pit", "palutena", "marth", "ike", "reflet", "duckhunt", "kirby", "dedede", "metaknight", "fox", "falco", "pikachu", "plizardon", "lucario", "purin", "gekkouga", "robot", "ness", "captain", "murabito", "pikmin", "wiifit", "shulk", "mariod", "pitb", "lucina", "pacman", "rockman", "sonic", "mewtwo", "lucas", "roy", "ryu", "cloud", "kamui", "bayonetta", "miiswordsman", "miifighter", "miigunner", "popo", "pichu", "younglink", "snake", "pzenigame", "pfushigisou", "wolf", "inkling", "daisy", "ridley", "chrom", "samusd", "simon", "richter", "krool", "shizue", "ken", "gaogaen", "packun", "joker", "brave", "buddy"];

class Modifier {
	constructor(name, base_damage, damage_dealt, damage_taken, kb_dealt, kb_received, gravity, fall_speed, shield, air_friction, traction, shieldDamage, attackerShow, targetShow) {
		this.name = name;
		this.base_damage = base_damage;
		this.damage_dealt = damage_dealt;
		this.damage_taken = damage_taken;
		this.kb_dealt = kb_dealt;
		this.kb_received = kb_received;
		this.gravity = gravity;
		this.fall_speed = fall_speed;
		this.shield = shield;
		this.air_friction = air_friction;
		this.traction = traction;

		if (shieldDamage == undefined)
			this.shieldDamage = 1;
		else
			this.shieldDamage = shieldDamage;

		if (attackerShow == undefined)
			this.attackerShow = true;
		else
			this.attackerShow = attackerShow;

		if (targetShow == undefined)
			this.targetShow = true;
		else
			this.targetShow = targetShow;
	}
};

var monado = [
	new Modifier("Jump", 1, 1, 1.3, 1, 1, 1.4, 1.4, 1, 1, 1),
	new Modifier("Speed", 1, 0.7, 1, 1, 1, 1.2, 1, 1, 1, 1.5),
	new Modifier("Shield", 1, 0.5, 0.5, 0.8, 0.5, 1, 1, 1.5, 1, 1),
	new Modifier("Buster", 1, 1.4, 1.3, 0.65, 1, 1, 1, 1, 1, 1),
	new Modifier("Smash", 1, 0.3, 1, 1.25, 1.2, 1, 1, 1, 1, 1)
];

var heroRng = [
	new Modifier("Oomph", 1, 1.6, 1.2, 1.1, 1, 1, 1, 1, 1, 1),
	new Modifier("Psyche Up", 1, 1.2, 1, 1.2, 1, 1, 1, 1, 1, 1, 1.65),
	new Modifier("Acceleratle", 1, 1, 1, 1, 1.1, 1.25, 1.5, 1, 1, 2.1, 1, false),
	new Modifier("Oomph+Psyche Up", 1, 1.6 * 1.2, 1.2, 1.1 * 1.2, 1, 1, 1, 1, 1, 1, 1.65),
	new Modifier("Oomph+Acceleratle", 1, 1, 1.2, 1, 1.1, 1.25, 1.5, 1, 1, 2.1, 1, false)
];

class Character {
    constructor(n) {
        this.display_name = n;
		var name = characters[names.indexOf(n)];
		this.CharacterName = characterNames[names.indexOf(n)];
		this.GameName = gameNames[names.indexOf(n)];
        this.addModifier = function (modifier) {
            this.modifier = modifier;
        }
		this.modifier = new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false);
		this.modifiers = [];
		if (this.name == null) {
			this.name = name;
		}
		if (this.name == "Shulk") {
			this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.modifiers = this.modifiers.concat(monado);
		} else if (this.name == "Kirby") {
			this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.modifiers = this.modifiers.concat(monado);
		} else if (this.name == "Bowser Jr") {
			this.modifiers = [new Modifier("Clown Kart", 1, 1, 0.88, 1, 1, 1, 1, 1, 1, 1, 1, false), new Modifier("Body", 1, 1, 1.15, 1, 1, 1, 1, 1, 1, 1, 1, false)];
			this.modifier = this.modifiers[0];
		} else if (this.name == "Wii Fit Trainer") {
			this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), new Modifier("Fast Deep Breathing", 1.25, 1, 0.9, 1, 1, 1, 1, 1, 1, 1), new Modifier("Slow Deep Breathing", 1.16, 1, 0.9, 1, 1, 1, 1, 1, 1, 1)];

		} else if (this.name == "Cloud") {
			this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false), new Modifier("Limit Break", 1, 1, 1, 1, 1, 1.1, 1.1, 1, 1.15, 1.15, 1, false)];
		}
		else if (this.name == "King Dedede") {
			this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false), new Modifier("Character Inhaled", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false)];
		}
		else if (this.name == "Hero") {
			this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)];
			this.modifiers = this.modifiers.concat(heroRng);
		}
		else if (this.name == "Ice Climbers") {
			this.modifiers = [new Modifier("Popo", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false), new Modifier("Nana", 1, 1, 1.05, 1, 1.05, 1, 1, 1, 1, 1, 1, false)];
			this.modifier = this.modifiers[0];
		}

        this.getModifier = function (name) {
            if (this.modifiers.length == 0) {
				return new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false);
            }
            for(var i=0;i<this.modifiers.length;i++){
                if(this.modifiers[i].name == name){
                    return this.modifiers[i];
                }
            }
            return null;
		}

		this.filename = this.display_name.toLowerCase().replace(/\./g, "").replace("& ", "");
		this.class = this.display_name.toLowerCase().replace(/\./g, "").replace("& ", "and ").replace(/ /g, "-");

		this.updateIcon = function () {
			if (this.name == "Charizard" || this.name == "Squirtle" || this.name == "Ivysaur") {
				this.icon = "./img/stock_icons/pokemontrainer.png";
			} else if (this.name == "Game And Watch") {
				this.icon = "./img/stock_icons/gamewatch.png";
			} else if (this.name == "Mii Brawler" || this.name == "Mii Swordfighter" || this.name == "Mii Gunner") {
				this.icon = "./img/stock_icons/mii.png";
			} else if (this.name == "Rosalina And Luma") {
				this.icon = "./img/stock_icons/rosalina.png";
			} else {
				this.icon = "./img/stock_icons/" + this.name.toLowerCase().replace(/\./g, "").replace(/-/g, "").replace("&", "").replace(/ /g, "") + ".png";
			}
		}

		this.updateImage = function () {
			this.image = "./img/characters/" + this.filename + ".png";
		}
        
        this.api_name = this.name;
        if (name == "Game And Watch") {
            this.api_name = "Mrgamewatch";
		}

		//this.attributes = loadJSON(this.GameName);
		this.attributes = {};

		this.updateIcon();
		this.updateImage();
        
    }

};

class Result {
	constructor(name, value, hide) {
		this.name = name;
		this.title = ""; //getTitle(name);
		this.value = value;
		this.hide = false;
		this.style = "";

		this.addStyle = function (style) {
			this.style = style;
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
			if (name == "Hitstun" || name == "Hitstun with speed up" || name == "Attacker Hitlag" || name == "Target Hitlag" || name == "Shield stun" || name == "Shield Hitlag" || name == "Shield Advantage" || name == "Hit Advantage" || name == "Paralysis time" || name == "Reeling hitstun" || name == "Luma hitstun"
				|| name == "Flower time" || name == "Buried time" || name == "Sleep time" || name == "Freeze time" || name == "Stun time" || name == "Disable time") {
				this.value = value + (value == 1 ? " frame" : " frames");
			} else if (name == "Airdodge hitstun cancel" || name == "Aerial hitstun cancel" || name == "First Actionable Frame" || name == "FAF with speed up" || name == "Reeling FAF") {
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


	}


};

//Bit Flagged state
var CharacterState = {
	LAUNCH_START: 1, //Start launch
	GROUNDED: 2, //Grounded
	SLIDING: 4, //Sliding
	AERIAL: 8, //In the air
	COLLIDING_FLOOR: 16, //Colliding with floor
	COLLIDING_WALL: 32, //Colliding with floor
	COLLIDING_CEILING: 64 //Colliding with floor
};

class Collision {
	constructor(frame, stage, position, next_position, momentum, state, tumble, launch_speed, angle) {
		this.frame = frame;
		this.collisionOccurred = false;
		this.collision_data = {
			next_position: next_position,
			resetGravity: false,
			launchSpeed: launch_speed,
			angle: angle,
			momentum: momentum,
			state: state,
			collision: null,
			intersection: null,
			lineType: null,
			slideDirection: 0, //0 none, -1 left, 1 right
			techable: true,
			totalLaunchSpeed: TotalLaunchSpeed(launch_speed.x, launch_speed.y)
		};

		this.updateLaunchSpeed = function (launch_speed) {
			if (Math.cos(this.collision_data.angle * Math.PI / 180) < 0) {
				launch_speed.x *= -1;
			}
			if (Math.sin(this.collision_data.angle * Math.PI / 180) < 0) {
				launch_speed.y *= -1;
			}

			this.collision_data.launchSpeed = launch_speed;
			this.collision_data.totalLaunchSpeed = TotalLaunchSpeed(launch_speed.x, launch_speed.y);

			this.collision_data.techable = this.collision_data.lineType != LineTypes.FLOOR ? TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 6 :
				TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 3;
		};

		this.applyDecaySpeedUp = function (decay, frames) {
			for (var i = 0; i < frames; i++) {
				if (this.collision_data.launchSpeed.x != 0) {
					var x_dir = this.collision_data.launchSpeed.x / Math.abs(this.collision_data.launchSpeed.x);
					this.collision_data.launchSpeed.x = +this.collision_data.launchSpeed.x.toFixed(6);
					if (x_dir == -1 && this.collision_data.launchSpeed.x > 0) {
						this.collision_data.launchSpeed.x = 0;
					} else if (x_dir == 1 && this.collision_data.launchSpeed.x < 0) {
						this.collision_data.launchSpeed.x = 0;
					}
				}
				if (this.collision_data.launchSpeed.y != 0) {
					var y_dir = this.collision_data.launchSpeed.y / Math.abs(this.collision_data.launchSpeed.y);
					this.collision_data.launchSpeed.y -= decay.y;
					this.collision_data.launchSpeed.y = +this.collision_data.launchSpeed.y.toFixed(6);
					if (y_dir == -1 && this.collision_data.launchSpeed.y > 0) {
						this.collision_data.launchSpeed.y = 0;
					} else if (y_dir == 1 && this.collision_data.launchSpeed.y < 0) {
						this.collision_data.launchSpeed.y = 0;
					}
				}
				
			}
			var lsr = 0.95;
			if (this.collision_data.lineType == LineTypes.FLOOR)
				lsr = 0.9;

			this.collision_data.launchSpeed.x *= lsr;
			this.collision_data.launchSpeed.y *= lsr;

			this.collision_data.totalLaunchSpeed = TotalLaunchSpeed(this.collision_data.launchSpeed.x, this.collision_data.launchSpeed.y);
			if (this.collision_data.lineType == LineTypes.FLOOR)
				this.collision_data.totalLaunchSpeed /= 0.9; //Ignore speed multiplier since floor techs cannot be done during collision
			this.collision_data.techable = this.collision_data.lineType != LineTypes.FLOOR ? TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 6 :
				TotalLaunchSpeed(launch_speed.x, launch_speed.y) / 0.9 <= 3; //Ignore speed multiplier since floor techs cannot be done during collision
		};

		if (stage == null)
			return;

		var launch_line = [position, next_position];
		var launch_angle = LineAngle(launch_line);

		var collisionFound = false;

		//Check stage collisions
		for (var i = 0; i < stage.collisions.length; i++) {

			var intersections = IntersectionLines(launch_line, stage.collisions[i].vertex);

			if (intersections.length == 0)
				continue; //No intersections found

			var material, normal;
			//Calculate distance for all stage lines intersections
			for (var j = 0; j < intersections.length; j++) {
				intersections[j].distance = LineDistance(position, intersections[j].line);
			}

			intersections.sort(function (a, b) {
				if (a.distance < b.distance) {
					return -1;
				} else if (a.distance > b.distance) {
					return 1;
				}
				return 0;
			});

			var intersection = intersections[0];

			//Get passthrough angle
			material = stage.collisions[i].materials[intersection.i];
			//Check if angle between current position and possible next position make collision with line
			if (!LineCollision(launch_angle, material.passthroughAngle))
				break;

			//Found collision
			collisionFound = true;

			//Prepare data
			var lineType = GetLineType(material);
			this.collision_data.next_position = intersection.point;
			this.collision_data.collision = stage.collisions[i];
			this.collision_data.intersection = intersection;
			this.collision_data.lineType = lineType;

			//Check if it bounces off the wall/floor/ceiling
			if (tumble && ((lineType == LineTypes.FLOOR && TotalLaunchSpeed(launch_speed.x, launch_speed.y) >= 0.8) ||
				(TotalLaunchSpeed(launch_speed.x, launch_speed.y) >= 1))) {
				//Collides and Bounces off
				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.COLLIDING_FLOOR;
				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_WALL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_CEILING;
				}
				this.collision_data.techable = lineType != LineTypes.FLOOR ? TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 6 :
					TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 3;
				//Calculate bounced off angle
				var rAngle = (2 * (material.passthroughAngle)) - 180 - launch_angle;
				//var lsr = 0.95;
				//if (lineType == LineTypes.FLOOR)
				//	lsr = 0.9;
				var lsr = 1;
				launch_speed.x = Math.abs(launch_speed.x * lsr);
				launch_speed.y = Math.abs(launch_speed.y * lsr);
				if (Math.cos(rAngle * Math.PI / 180) < 0) {
					launch_speed.x *= -1;
				}
				if (Math.sin(rAngle * Math.PI / 180) < 0) {
					launch_speed.y *= -1;
				}

				this.collision_data.angle = rAngle;
				this.collision_data.launchSpeed = launch_speed;

				////Check if it's techable with new launch speed
				//if (lineType != LineTypes.FLOOR) {
				//	this.collision_data.techable.onCollision = TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 6;
				//	this.collision_data.totalLaunchSpeed = TotalLaunchSpeed(launch_speed.x, launch_speed.y); //Only update launch speed with walls/ceiling, cannot tech during floor collision
				//} else {
				//	this.collision_data.techable.onCollision = false;
				//}

				if (frame == 1 && lineType == LineTypes.FLOOR) {
					this.collision_data.techable = false;
				}

				if (Math.sin(rAngle * Math.PI / 180) > 0) {
					momentum = 1;
				} else if (Math.sin(rAngle * Math.PI / 180) < 0) {
					momentum = -1;
				} else {
					momentum = 0;
				}

				this.collision_data.momentum = momentum;



			} else {
				//Doesn't collide/bounce off

				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.SLIDING;

					var sAngle = LineAngle(intersection.line);
					//Direction of the slope
					if (Math.cos(angle * Math.PI / 180) > 0) {
						this.collision_data.slideDirection = 1;
						if (Math.cos(sAngle * Math.PI / 180) < 0) {
							sAngle = ((sAngle - 180) + 360) % 360;
						}
					} else if (Math.cos(angle * Math.PI / 180) < 0) {
						this.collision_data.slideDirection = -1;
						if (Math.cos(sAngle * Math.PI / 180) > 0) {
							sAngle = (sAngle + 180) % 360;
						}
					}
					this.collision_data.angle = sAngle;

					if (this.collision_data.launchSpeed.x > 8.3) {
						this.collision_data.launchSpeed.x = 8.3;
					}
					this.collision_data.launchSpeed.y = 0;

					if (Math.sin(sAngle * Math.PI / 180) > 0) {
						momentum = 1;
					} else if (Math.sin(sAngle * Math.PI / 180) < 0) {
						momentum = -1;
					} else {
						momentum = 0;
					}

					var p = ClosestPointToLine(GetPointFromSlide(intersection.point, this.collision_data.launchSpeed, sAngle, intersection.line), intersection.line);
					this.collision_data.next_position = [p[0], p[1]];
				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}

				
				
			}

			if (collisionFound)
				break;
		}

		this.collisionOccurred = collisionFound;

		if (collisionFound)
			return;

		//Check platforms

		//If momentum isn't -1 (character is going down) don't check platform collisions
		if (momentum != -1)
			return;

		for (var i = 0; i < stage.platforms.length; i++) {
			var intersections = IntersectionLines(launch_line, stage.platforms[i].vertex);


			if (intersections.length == 0)
				continue; //No intersections found

			var material, normal;
			//Calculate distance for all stage lines intersections
			for (var j = 0; j < intersections.length; j++) {
				intersections[j].distance = LineDistance(position, intersections[j].line);
			}

			intersections.sort(function (a, b) {
				if (a.distance < b.distance) {
					return -1;
				} else if (a.distance > b.distance) {
					return 1;
				}
				return 0;
			});

			var intersection = intersections[0];

			//Get passthrough angle
			material = stage.platforms[i].materials[intersection.i];
			//Check if angle between current position and possible next position make collision with line
			if (!LineCollision(launch_angle, material.passthroughAngle))
				return;

			//Found collision
			collisionFound = true;

			//Prepare data
			var lineType = GetLineType(material);
			this.collision_data.next_position = intersection.point;
			this.collision_data.collision = stage.platforms[i];
			this.collision_data.intersection = intersection;
			this.collision_data.lineType = lineType;

			//Check if it bounces off the wall/floor/ceiling
			if (tumble && ((lineType == LineTypes.FLOOR && TotalLaunchSpeed(launch_speed.x, launch_speed.y) >= 0.8) ||
				(TotalLaunchSpeed(launch_speed.x, launch_speed.y) >= 1))) {
				//Collides and Bounces off
				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.COLLIDING_FLOOR;
				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_WALL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_CEILING;
				}
				this.collision_data.techable = lineType != LineTypes.FLOOR ? TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 6 :
					TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 3;
				//Calculate bounced off angle
				var rAngle = (2 * (material.passthroughAngle)) - 180 - launch_angle;
				//var lsr = 0.95;
				//if (lineType == LineTypes.FLOOR)
				//	lsr = 0.9;
				var lsr = 1;
				launch_speed.x = Math.abs(launch_speed.x * lsr);
				launch_speed.y = Math.abs(launch_speed.y * lsr);
				if (Math.cos(rAngle * Math.PI / 180) < 0) {
					launch_speed.x *= -1;
				}
				if (Math.sin(rAngle * Math.PI / 180) < 0) {
					launch_speed.y *= -1;
				}

				this.collision_data.angle = rAngle;
				this.collision_data.launchSpeed = launch_speed;

				////Check if it's techable with new launch speed
				//if (lineType != LineTypes.FLOOR) {
				//	this.collision_data.techable.onCollision = TotalLaunchSpeed(launch_speed.x, launch_speed.y) <= 6;
				//	this.collision_data.totalLaunchSpeed = TotalLaunchSpeed(launch_speed.x, launch_speed.y); //Only update launch speed with walls/ceiling, cannot tech during floor collision
				//} else {
				//	this.collision_data.techable.onCollision = false;
				//}

				if (Math.sin(rAngle * Math.PI / 180) > 0) {
					momentum = 1;
				} else if (Math.sin(rAngle * Math.PI / 180) < 0) {
					momentum = -1;
				} else {
					momentum = 0;
				}

				this.collision_data.momentum = momentum;



			} else {
				//Doesn't collide/bounce off

				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.SLIDING;

					var sAngle = LineAngle(intersection.line);
					//Direction of the slope
					if (Math.cos(angle * Math.PI / 180) > 0) {
						this.collision_data.slideDirection = 1;
						if (Math.cos(sAngle * Math.PI / 180) < 0) {
							sAngle = ((sAngle - 180) + 360) % 360;
						}
					} else if (Math.cos(angle * Math.PI / 180) < 0) {
						this.collision_data.slideDirection = -1;
						if (Math.cos(sAngle * Math.PI / 180) > 0) {
							sAngle = (sAngle + 180) % 360;
						}
					}
					this.collision_data.angle = sAngle;

					if (Math.sin(sAngle * Math.PI / 180) > 0) {
						momentum = 1;
					} else if (Math.sin(sAngle * Math.PI / 180) < 0) {
						momentum = -1;
					} else {
						momentum = 0;
					}

					if (this.collision_data.launchSpeed.x > 8.3) {
						this.collision_data.launchSpeed.x = 8.3;
					}
					this.collision_data.launchSpeed.y = 0;

					var p = ClosestPointToLine(GetPointFromSlide(intersection.point, this.collision_data.launchSpeed, sAngle, intersection.line), intersection.line);
					this.collision_data.next_position = [p[0],p[1]];

				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}



			}

			if (collisionFound) {
				this.collisionOccurred = true;
				return;
			}
		}
	}
}

class LaunchData {
	constructor(positions, finalPosition, collisions, hitstun, airdodgeCancel, aerialCancel, faf, KOFrame) {
		this.positions = positions;
		this.finalPosition = finalPosition;
		this.collisions = collisions;
		this.hitstun = hitstun;
		this.airdodgeCancel = airdodgeCancel;
		this.aerialCancel = aerialCancel;
		this.faf = faf;
		this.KOFrame = KOFrame;
	}
}

class DILine {
	constructor(x, y, angle, interpolated) {
		this.position = { x: x, y: y };
		this.angle = angle;
		this.interpolated = interpolated;
	}
}

class Distance{
	constructor(kb, x_launch_speed, y_launch_speed, tumble, hitstun, speedupFrames, isFKB, angle, gravity, damageflytop_gravity, faf, fall_speed, damageflytop_fall_speed, traction, isFinishingTouch, inverseX, onSurface, position, stage, doPlot, extraFrames, ssb4Launch) {
        this.kb = kb;
        this.x_launch_speed = x_launch_speed;
		this.y_launch_speed = y_launch_speed;
		this.tumble = tumble;
		this.hitstun = hitstun;
		this.isFKB = isFKB;
        this.angle = angle;
        this.gravity = gravity;
        this.fall_speed = fall_speed;
        this.traction = traction;
        this.max_x = 0;
        this.max_y = 0;
		this.isFinishingTouch = isFinishingTouch;
        this.inverseX = inverseX;
        this.onSurface = onSurface;
        this.position = {"x":0, "y":0};
        this.bounce = false;
        this.extraFrames = 20;
        this.finalPosition = position;
		this.extra = [];
		this.collisions = 0;
		this.speedupFrames = speedupFrames;
		this.faf = faf;
        if (extraFrames !== undefined) {
            this.extraFrames = extraFrames;
		}
		this.damageflytop_gravity = damageflytop_gravity;
		this.damageflytop_fall_speed = damageflytop_fall_speed;
        
        if(position !== undefined){
            this.position = position;
        }
        this.stage = null;
        if(stage !== undefined){
            this.stage = stage;
		}

        if(this.stage == null){
            if(this.position.y < 0 && this.onSurface){
                this.position.y = 0;
            }
		}


        this.max_x = this.position.x;
        this.max_y = this.position.y;

        var x_speed = +this.x_launch_speed.toFixed(6);
		var y_speed = +this.y_launch_speed.toFixed(6);

		this.KO = false;

        if(this.inverseX){
            angle = InvertXAngle(angle);
		}
		//var decay = { 'x': x_speed / hitstun, 'y': y_speed / hitstun };

		var s = (this.kb / 80);

		var decay = { 'x': parameters.decay * Math.cos(angle * Math.PI / 180), 'y': parameters.decay * Math.sin(angle * Math.PI / 180) };
        if(Math.cos(angle * Math.PI / 180) < 0){
			x_speed *= -1;
			//decay.x *= -1;
        }
        if(Math.sin(angle * Math.PI / 180) < 0){
			y_speed *= -1;
			//decay.y *= -1;
		}

		if (ssb4Launch) {
			decay = { 'x': 0.051 * Math.cos(angle * Math.PI / 180), 'y': 0.051 * Math.sin(angle * Math.PI / 180) };
		}

        this.x = [this.position.x];
		this.y = [this.position.y];
		
		var character_position = { 'x': this.position.x, 'y': this.position.y };
		var launch_speed = { 'x': x_speed, 'y': y_speed };
		var next_position = { 'x': 0, 'y': 0 };
        var character_speed = { 'x': 0, 'y': 0 };
        this.vertical_speed = [];
		var momentum = 1;
		var g = 0;
        var fg = 0;
        this.bounce_frame = -1;
		this.bounce_speed = 0;
		var state = CharacterState.LAUNCH_START;

		//if (aerial) {
		//	state |= CharacterState.AERIAL;
		//} else {
		//	state |= CharacterState.GROUNDED;
		//}

        this.launch_speeds = [];
		var limit = hitstun < 200 ? hitstun + this.extraFrames : 200;

		var previousCollisionIntersection = null;
		var previousCollision = null;

		var slidingDirection = 0;

		var hc = HitstunCancel(kb, x_launch_speed, y_launch_speed, angle, false, false, addHitstun);
		this.launchData = new LaunchData([{ x: this.position.x, y: this.position.y }], { x: 0, y: 0 }, [], hitstun, hc.airdodge, hc.aerial, faf, -1);

		var isDamageFlyTop = this.tumble && this.angle >= 70 && this.angle <= 110;

		//var tumbleFSM = TumbleFSM(this.kb);

		var frameCount = 0;
		var ignoreGravityAdd = false;
		var waitFramesCollisionSpeedUp = 0;

		/*Made these from comparisons and trying to make results match in-game positions... 
		it should something caused by DamageFlySpeedUp but it could be a thing too
		At least FAF position seems accurate with these
		*/
		var gravityMul = 1.75;
		var damageFlyTopGravityMul = 1.2;

		for (var i = 0; i < limit; i++){

            var next_x = character_position.x + launch_speed.x + character_speed.x;
			var next_y = character_position.y + launch_speed.y + character_speed.y;

			var prev_state = state;

			next_position.x = next_x;
			next_position.y = next_y;

            this.launch_speeds.push(Math.sqrt(Math.pow(launch_speed.x, 2) + Math.pow(launch_speed.y, 2)));

            this.vertical_speed.push((launch_speed.y));

            //Vertical direction
            if(next_y > character_position.y){
				momentum = 1;
            }else if(next_y < character_position.y){
				momentum = -1;
            }else{
                momentum = 0;
            }

			var countGravity = true;
			var collided = false;

            //Stage detection
			if (this.stage != null) {
				var c = new Collision(frameCount, this.stage, [character_position.x, character_position.y], [next_x, next_y], momentum, state, this.tumble, launch_speed, angle);

				if (c.collisionOccurred) {
					collided = true;
					
					this.collisions++;
					launch_speed = c.collision_data.launchSpeed;
					next_x = c.collision_data.next_position[0];
					next_y = c.collision_data.next_position[1];
					angle = c.collision_data.angle;
					momentum = c.collision_data.momentum;
					state = c.collision_data.state;
					previousCollision = c.collision_data.collision;
					previousCollisionIntersection = c.collision_data.intersection;
					slidingDirection = c.collision_data.slideDirection;
					
					//decay = { 'x': x_speed / hitstun, 'y': y_speed / hitstun };
					decay = { 'x': parameters.decay * Math.cos(angle * Math.PI / 180), 'y': parameters.decay * Math.sin(angle * Math.PI / 180) };
					if (ssb4Launch) {
						decay = { 'x': 0.051 * Math.cos(angle * Math.PI / 180), 'y': 0.051 * Math.sin(angle * Math.PI / 180) };
					}

					if (this.tumble && !this.isFKB) {
						waitFramesCollisionSpeedUp = GetNextFrameWithSpeedUp(speedupFrames, i);
						c.applyDecaySpeedUp(decay, GetNextFrameWithSpeedUp(speedupFrames, i));
					}
					this.launchData.collisions.push(c);
					//if (Math.cos(angle * Math.PI / 180) < 0) {
					//	decay.x *= -1;
					//}
					//if (Math.sin(angle * Math.PI / 180) < 0) {
					//	decay.y *= -1;
					//}

					if (c.collision_data.resetGravity) {
						g = 0;
						fg = 0;
						countGravity = false;
					}
				} else {
					if (((state & CharacterState.SLIDING) == CharacterState.SLIDING) && previousCollision != null) {
						countGravity = false;
						g = 0;
						fg = 0;
						character_speed.y = 0;
						if (!PointInLine([character_position.x, character_position.y], previousCollisionIntersection.line) && previousCollision.vertex.length > 2) {
							//Check if the next position is in the line next to the one that started the slide
							var prev_index = (previousCollisionIntersection.i - 1) % previousCollision.vertex.length;
							var next_index = (previousCollisionIntersection.i + 1) % previousCollision.vertex.length;
							var next_index2 = (previousCollisionIntersection.i + 2) % previousCollision.vertex.length;
							if (prev_index == -1) {
								prev_index = previousCollision.vertex.length-1;
							}
							//Get line that is on the direction of sliding direction
							var prev_line = [previousCollision.vertex[prev_index], previousCollision.vertex[previousCollisionIntersection.i]];
							var next_line = [previousCollision.vertex[next_index], previousCollision.vertex[next_index2]];
							var prev_line_floor = GetLineType(previousCollision.materials[prev_index]) == LineTypes.FLOOR;
							var next_line_floor = GetLineType(previousCollision.materials[next_index]) == LineTypes.FLOOR;
							var material = null;
							var selected_line = null;
							var selected_index = 0;
							if (slidingDirection == -1) {
								//Left
								if (prev_line[0][0] < previousCollisionIntersection.line[0][0] && prev_line_floor) {
									selected_line = prev_line;
									selected_index = prev_index;
									material = previousCollision.materials[prev_index];
								} else if (next_line[0][0] < previousCollisionIntersection.line[0][0] && next_line_floor) {
									selected_line = next_line;
									selected_index = next_index;
									material = previousCollision.material[next_index];
								}
							} else if (slidingDirection == 1) {
								//Right
								if (prev_line[0][0] > previousCollisionIntersection.line[0][0] && prev_line_floor) {
									selected_line = prev_line;
									selected_index = prev_index;
									material = previousCollision.materials[prev_index];
								} else if (next_line[0][0] > previousCollisionIntersection.line[0][0] && next_line_floor) {
									selected_line = next_line;
									selected_index = next_index;
									material = previousCollision.materials[next_index];
								}
							} else {
								//Landed on this point and doesn't have horizontal momentum, so we end here
								for (var ii = i; ii <= hitstun; i++) {
									//Fill the rest of the data until hitstun end
									this.x.push(+character_position.x.toFixed(6));
									this.y.push(+character_position.y.toFixed(6));
								}
								break;
							}

							if (selected_line != null) {

								//We have the next line the character will continue to slide, recalculate angle and get next point
								previousCollisionIntersection.line = selected_line;
								previousCollisionIntersection.i = selected_index;
								previousCollisionIntersection.point = p;

								var sAngle = LineAngle(selected_line);
								//Direction of the slope
								if (slidingDirection == 1) {
									if (Math.cos(sAngle * Math.PI / 180) < 0) {
										sAngle = ((sAngle - 180) + 360) % 360;
									}
								} else if (slidingDirection == -1) {
									if (Math.cos(sAngle * Math.PI / 180) > 0) {
										sAngle = (sAngle + 180) % 360;
									}
								}
								angle = sAngle;

								launch_speed.y = 0;

								if (Math.sin(sAngle * Math.PI / 180) > 0) {
									momentum = 1;
								} else if (Math.sin(sAngle * Math.PI / 180) < 0) {
									momentum = -1;
								} else {
									momentum = 0;
								}

								var p = ClosestPointToLine(GetPointFromSlide([character_position.x, character_position.y],launch_speed,angle,selected_line), selected_line);
								next_x = p[0];
								next_y = p[1];

							} else {
								state &= 0x9;
								state |= CharacterState.AERIAL;
								slidingDirection = 0;
							}
						} else {
							//Same line
							var p = ClosestPointToLine(GetPointFromSlide([character_position.x, character_position.y], launch_speed, angle, previousCollisionIntersection.line), previousCollisionIntersection.line);
							next_x = p[0];
							next_y = p[1];

						}
					} else {
						state &= 0x9;
						state |= CharacterState.AERIAL;
						slidingDirection = 0;
					}
				}
			} else {
				state &= 0x9;
				state |= CharacterState.AERIAL;
				slidingDirection = 0;
			}

			if (((state & CharacterState.SLIDING) == CharacterState.SLIDING)) {
				//Sliding on surface
				//Traction applied here
				if (launch_speed.x != 0) {
					var x_dir = launch_speed.x / Math.abs(launch_speed.x);
					if (launch_speed.x < 0) {
						launch_speed.x += traction;
					} else {
						launch_speed.x -= traction;
					}
					launch_speed.x = +launch_speed.x.toFixed(6);
					if (x_dir == -1 && launch_speed.x > 0) {
						launch_speed.x = 0;
					} else if (x_dir == 1 && launch_speed.x < 0) {
						launch_speed.x = 0;
					}
				}
				if (launch_speed.y != 0) {
					var y_dir = launch_speed.y / Math.abs(launch_speed.y);
					launch_speed.y -= decay.y;
					launch_speed.y = +launch_speed.y.toFixed(6);
					if (y_dir == -1 && launch_speed.y > 0) {
						launch_speed.y = 0;
					} else if (y_dir == 1 && launch_speed.y < 0) {
						launch_speed.y = 0;
					}
				}
				character_speed.y = 0;
				//launch_speed.y = 0;
				g = 0;
			} else if ((state & (CharacterState.COLLIDING_FLOOR - 1)) != 0) { //Not colliding
				//Apply decay
				if (launch_speed.x != 0) {
					var x_dir = launch_speed.x / Math.abs(launch_speed.x);
					launch_speed.x -= decay.x;
					launch_speed.x = +launch_speed.x.toFixed(6);
					if (x_dir == -1 && launch_speed.x > 0) {
						launch_speed.x = 0;
					} else if (x_dir == 1 && launch_speed.x < 0) {
						launch_speed.x = 0;
					}
				}
				if (launch_speed.y != 0) {
					var y_dir = launch_speed.y / Math.abs(launch_speed.y);
					launch_speed.y -= decay.y;
					launch_speed.y = +launch_speed.y.toFixed(6);
					if (y_dir == -1 && launch_speed.y > 0) {
						launch_speed.y = 0;
					} else if (y_dir == 1 && launch_speed.y < 0) {
						launch_speed.y = 0;
					}
				}
				//Gravity
				if (countGravity) {
					if (!ignoreGravityAdd) {
						if (!this.isFinishingTouch) {
							if (!isDamageFlyTop) {
								g -= gravity * gravityMul;
								fg = Math.max(g, -fall_speed);
								character_speed.y = fg;
								character_speed.y = +character_speed.y.toFixed(6);
							} else {
								//First 45 frames
								if (i < hitstun) {
									//Set DamageFlyTop values
									g -= damageflytop_gravity * damageFlyTopGravityMul;
									fg = Math.max(g, -damageflytop_fall_speed);
									character_speed.y = fg;
									character_speed.y = +character_speed.y.toFixed(6);
								} else {
									if (i == hitstun) {
										g = fg;
									}
									if (character_speed.y < -fall_speed) {
										//Current fall speed is higher than character normal fall speed, add gravity until it reduces to fall speed
										g += gravity * gravityMul;
										fg = Math.min(g, -fall_speed);
										character_speed.y = fg;
										character_speed.y = +character_speed.y.toFixed(6);
									} else {
										g -= gravity * gravityMul;
										fg = Math.max(g, -fall_speed);
										character_speed.y = fg;
										character_speed.y = +character_speed.y.toFixed(6);
									}
								}
							}
						} else {
							//First 22 frames
							if (i < 22) {
								//Set gravity to 0.087 and fall speed to 1.5
								g -= 0.087;
								fg = Math.max(g, -1.5);
								character_speed.y = fg;
								character_speed.y = +character_speed.y.toFixed(6);
							} else {
								if (i == 22) {
									g = fg;
								}
								if (character_speed.y < -fall_speed) {
									//Current fall speed is higher than character normal fall speed, add gravity until it reduces to fall speed
									g += gravity * gravityMul;
									fg = Math.min(g, -fall_speed);
									character_speed.y = fg;
									character_speed.y = +character_speed.y.toFixed(6);
								} else {
									g -= gravity * gravityMul;
									fg = Math.max(g, -fall_speed);
									character_speed.y = fg;
									character_speed.y = +character_speed.y.toFixed(6);
								}
							}
						}
					}
				} else {
					character_speed.y = 0;
				}
			}

            character_position.x = next_x;
            character_position.y = next_y;

			if (!collided) {
				if (waitFramesCollisionSpeedUp <= 0) {
					if (i + 1 < speedupFrames.length && this.tumble && !this.isFKB) {
						if (GetFrameWithSpeedUp(speedupFrames, i) == i) {
							this.launchData.positions.push({ x: +character_position.x.toFixed(6), y: +character_position.y.toFixed(6) });
							frameCount++;
							this.x.push(+character_position.x.toFixed(6));
							this.y.push(+character_position.y.toFixed(6));
						}
					} else {
						this.launchData.positions.push({ x: +character_position.x.toFixed(6), y: +character_position.y.toFixed(6) });
						this.x.push(+character_position.x.toFixed(6));
						this.y.push(+character_position.y.toFixed(6));
						frameCount++;
					}
				} else {
					waitFramesCollisionSpeedUp--;
					frameCount++;
				}
			} else {
				//Collided with stage
				this.launchData.positions.push({ x: +character_position.x.toFixed(6), y: +character_position.y.toFixed(6) });
				this.x.push(+character_position.x.toFixed(6));
				this.y.push(+character_position.y.toFixed(6));
				waitFramesCollisionSpeedUp--;
				frameCount++;
			}
	

            //Maximum position during hitstun
			if (i < hitstun) {
                if(Math.cos(angle*Math.PI / 180) < 0){
                    this.max_x = Math.min(this.max_x, character_position.x);
                }else{
                    this.max_x = Math.max(this.max_x, character_position.x);
				}
                if(Math.sin(angle * Math.PI / 180) < 0){
					this.max_y = Math.min(this.max_y, character_position.y);
                }else{
                    this.max_y = Math.max(this.max_y, character_position.y);
				}
            }

            if (i == hitstun-1) {
				this.finalPosition = { "x": character_position.x, "y": character_position.y };
				this.launchData.finalPosition = { x: character_position.x, y: character_position.y };
			}

			if (i == 0) {
				state &= 0xFE; //Clear launch start flag
			}


			//if (!ssb4Launch) {
				
			//}
		}

		if (this.tumble && !this.isFKB) {
			hitstun = speedupFrames[speedupFrames.length - 1];
		} else {
			hitstun = this.hitstun;
		}
		this.launchData.hitstun = hitstun;

		this.vertical_speed.push((launch_speed.y));

		//var fsmFactor = 1;

		//if (tumbleFSM >= 1) {
		//	for (var i = 0; i < tumbleFSM; i++) {
		//		this.x.splice(i + 1, fsmFactor);
		//		this.y.splice(i + 1, fsmFactor);
		//		this.vertical_speed.splice(i + 1, fsmFactor);
		//		this.launchData.positions.splice(i + 1, fsmFactor);
		//	}
		//}


		if (this.stage != null) {
			var ko = false;
			var crossed = false;
			var character_size = 0;

			//Calculate if KO in blast zones
			for (var i = 0; i <= hitstun && !ko; i++) {
				if (this.y[i] >= this.stage.blast_zones[2] + 30 || this.y[i] <= this.stage.blast_zones[3] - 30) {

					this.extra.push(new Result("KO", "Frame " + i, "", false, true));
					ko = true;
					this.launchData.KOFrame = i;
					break;
				}
				if (this.x[i] - character_size <= this.stage.blast_zones[0] || this.x[i] + character_size >= this.stage.blast_zones[1] || this.y[i] - character_size <= this.stage.blast_zones[3]) {

					this.extra.push(new Result("KO", "Frame " + i, "", false, true));
					ko = true;
					this.launchData.KOFrame = i;
					break;
				} else {
					if (this.y[i] + character_size >= this.stage.blast_zones[2]) {
						if (this.vertical_speed[i] >= 2.4) { //If it has lower launch speed it will pass the blast zone without a KO

							this.extra.push(new Result("KO", "Frame " + i, "", false, true));
							ko = true;
							this.launchData.KOFrame = i;
							break;
						} else {
							if (hitstun < (2.4 / 0.03) * 0.4) { //Hitstun frames is lower than 2.4 launch speed, this is used if the target is hit ON the blast zone

								this.extra.push(new Result("KO", "Frame " + i, "", false, true));
								ko = true;
								this.launchData.KOFrame = i;
								break;
							} else {
								//At least get launch speed the opponent had when crossing the blast zone
								if (!crossed) {
									crossed = true;
									this.extra.push(new Result("Vertical launch speed when crossing blast zone", this.vertical_speed[i], "", false, true));
									this.extra.push(new Result("Required vertical launch speed to KO", "2.4", "", false, true));
									this.extra.push(new Result("Frame crossing blast zone", "Frame " + i, "", false, true));
								}
							}
						}
					}
				}

			}

			this.KO = ko;
		}

		this.diLines = [];

		this.doDILine = function (di, koAtZero) {
			if (koAtZero) {
				//KO regardless of DI
				this.diLines.push(new DILine(this.position.x, this.position.y, -1, false));
				return;
			}

			if (this.kb >= 80)
				this.diLines.push(new DILine(this.position.x, this.position.y, di % 360, false));
			else
				this.diLines.push(new DILine(this.position.x, this.position.y, -2, false));

		}

    }
};

class Knockback {
    constructor(kb, angle, gravity, damageflytop_gravity, aerial, windbox, electric, percent, set_weight, stick, launch_rate) {
        this.base_kb = kb;
        if(this.base_kb > 2500){
            //this.base_kb = 2500;
		}
        this.kb = this.base_kb;
        this.original_angle = angle;
        this.base_angle = angle;
        this.angle_with_di = angle;
        this.angle = angle;
        this.gravity = gravity;
        this.aerial = aerial;
		this.windbox = windbox;
		this.set_weight = set_weight;
        this.tumble = false;
        this.can_jablock = false;
        this.di_able = false;
        this.add_gravity_speed = parameters.gravity.mult * (this.gravity - parameters.gravity.constant);
        this.percent = percent;
        this.reeling = false;
        this.spike = false;
        this.di_change = 0;
		this.launch_speed = LaunchSpeed(kb);
		this.total_launch_speed = this.launch_speed;
        this.lsi = 1;
        this.horizontal_launch_speed = 0;
        this.vertical_launch_speed = 0;
        this.launch_rate = launch_rate;
		this.electric = electric;
		this.damageflytop = this.tumble && this.angle >= 70 && this.angle <= 110;
		this.damageflytop_gravity = damageflytop_gravity;

        if (this.launch_rate == undefined) {
            this.launch_rate = 1;
        }
		this.hitstun = Hitstun(this.base_kb, this.windbox, this.electric);
		//this.hitstunFSM = HitstunWithFSM(this.base_kb, this.windbox, this.electric);
        if (stick !== undefined) {
            this.stick = stick;
        } else {
			this.stick = { X: 0, Y: 0 };
        }
		this.calculate = function () {
			var groundedZeroAngle = false;
            this.kb = this.base_kb * this.launch_rate;
            if (this.original_angle == 361) {
				this.base_angle = SakuraiAngle(this.kb, this.aerial);
			}
			if (!this.aerial && this.base_angle == 0) {
				groundedZeroAngle = true;
			}
            this.angle = this.base_angle;
            if (this.base_angle != 0 && this.base_angle != 180) {
				this.tumble = Hitstun(this.kb, windbox, false, true) + 1 >= parameters.tumble_threshold  && !windbox;
            }
            if ((this.base_angle == 0 || this.base_angle == 180) && this.aerial) {
				this.tumble = Hitstun(this.kb, windbox, false, true) + 1 >= parameters.tumble_threshold && !windbox;
			}
			if ((this.angle == 0 || this.angle == 180) && this.kb >= 120) {
				groundedZeroAngle = false;
				this.angle = 32;
				this.tumble = Hitstun(this.kb, windbox, false, true) + 1 >= parameters.tumble_threshold && !windbox;
			}

			var gravity = this.gravity;

			this.damageflytop = this.tumble && this.angle >= 70 && this.angle <= 110;

			if (this.damageflytop)
				gravity = this.damageflytop_gravity;
			else
				gravity = this.gravity;

			this.add_gravity_speed = parameters.gravity.mult * (gravity - parameters.gravity.constant);
			if (!this.tumble || this.set_weight) {
				this.add_gravity_speed = 0;
			}

			this.x = Math.cos(this.angle * Math.PI / 180) * this.kb;
			this.y = Math.sin(this.angle * Math.PI / 180) * this.kb;
			this.launch_speed = LaunchSpeed(this.kb);
			this.horizontal_launch_speed = this.launch_speed * Math.cos(this.angle * Math.PI / 180);
			this.vertical_launch_speed = (this.launch_speed * Math.sin(this.angle * Math.PI / 180)) + this.add_gravity_speed;

			if ((this.base_angle == 0 || this.base_angle == 180) && !this.aerial) {
				//this.horizontal_launch_speed = HorizontalGroundedSpeedLimit(this.horizontal_launch_speed);
			} else {
				//this.horizontal_launch_speed = HorizontalSpeedLimit(this.horizontal_launch_speed);
				this.angle = GetAngle(this.horizontal_launch_speed, this.vertical_launch_speed);
			}

			//this.vertical_launch_speed = VerticalSpeedLimit(this.vertical_launch_speed);

			if (this.windbox && !this.aerial)
				this.vertical_launch_speed = 0;

			this.di_able = this.tumble && Math.abs(Math.atan2(this.vertical_launch_speed, this.horizontal_launch_speed)) >= parameters.di;

			if (this.di_able && (this.stick.X != 0 || this.stick.Y != 0)) {

				this.launch_speed = Math.sqrt(Math.pow(this.horizontal_launch_speed, 2) + Math.pow(this.vertical_launch_speed, 2)); //Include gravity boost to the new launch speed (yes this only happens when stick isn't on neutral)

				this.angle = DI(this.stick, { X: this.horizontal_launch_speed, Y: this.vertical_launch_speed }, this.launch_speed);

				this.angle_with_di = this.angle;

				if (this.damageflytop)
					gravity = this.damageflytop_gravity;
				else
					gravity = this.gravity;

				this.lsi = LSI(this.stick.Y, this.angle);
				
				this.launch_speed *= this.lsi;

				this.horizontal_launch_speed = this.launch_speed * Math.cos(this.angle * Math.PI / 180);
				this.vertical_launch_speed = (this.launch_speed * Math.sin(this.angle * Math.PI / 180));

				//this.horizontal_launch_speed = HorizontalSpeedLimit(this.horizontal_launch_speed);
				//this.vertical_launch_speed = VerticalSpeedLimit(this.vertical_launch_speed);
				
			}

			this.x = Math.abs(Math.cos(this.angle * Math.PI / 180) * this.kb);
			this.y = Math.abs(Math.sin(this.angle * Math.PI / 180) * this.kb);

			this.horizontal_launch_speed = Math.abs(this.horizontal_launch_speed);
			this.vertical_launch_speed = Math.abs(this.vertical_launch_speed);

			this.total_launch_speed = TotalLaunchSpeed(this.horizontal_launch_speed, this.vertical_launch_speed);

			if (groundedZeroAngle) {
				this.total_launch_speed *= 0.8;
				this.horizontal_launch_speed *= 0.8;
				this.vertical_launch_speed *= 0.8;
			}

            this.can_jablock = false;
            if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                if (this.kb != 0 && !this.windbox && !this.aerial) {
                    this.can_jablock = true;
                }
            }
            this.spike = this.angle >= 230 && this.angle <= 310;
            if (this.spike) {
                if (this.kb != 0 && !this.windbox && !this.aerial) {
                    this.can_jablock = !this.tumble;
                }
            }

            if (this.angle <= 70 || this.angle >= 110) {
                this.reeling = this.tumble && !this.windbox && this.percent >= 100;
            }

			this.hitstun = Hitstun(this.base_kb, this.windbox, this.electric);
			//this.hitstunFSM = HitstunWithFSM(this.base_kb, this.windbox, this.electric);
        };
        this.addModifier = function (modifier) {
            this.base_kb *= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                this.vertical_launch_speed *= parameters.bounce;
                this.horizontal_launch_speed *= parameters.bounce;
            }
        }
        this.calculate();
    }

    

};

class PercentFromKnockback{
    constructor(kb, type, base_damage, damage, preDamage, angle, weight, gravity, fall_speed, aerial, bkb, kbg, wbkb, attacker_percent, r, queue, shieldQueue, ignoreStale, windbox, electric, dddinhale, launch_rate){
        this.base_kb = kb;
        if(this.base_kb > 2500){
            //this.base_kb = 2500;
        }
        this.type = type;
        this.original_angle = angle;
        this.base_angle = angle;
        this.base_damage = base_damage;
        this.preDamage = preDamage;
        this.damage = damage;
        this.angle = angle;
        this.gravity = gravity;
        this.fall_speed = fall_speed;
        this.aerial = aerial;
        this.bkb = bkb;
        this.kbg = kbg;
		this.wbkb = wbkb;
		this.r = r;
		this.dddinhale = dddinhale;
        this.windbox = windbox;
        this.weight = weight;
        this.attacker_percent = attacker_percent;
        this.rage = Rage(attacker_percent);
        this.tumble = false;
        this.can_jablock = false;
        this.di_able = false;
        this.add_gravity_speed = 5 * (this.gravity - 0.075);
        this.add_gravity_kb = this.add_gravity_speed / 0.03;
        this.reeling = false;
        this.training_percent = 0;
        this.vs_percent = 0;
		this.queue = queue;
		this.shieldQueue = shieldQueue;
        this.ignoreStale = ignoreStale;
        this.wbkb_kb = -1;
        this.wbkb_modifier = 1;
        this.electric = electric;
        
        this.launch_rate = launch_rate;
        if (this.launch_rate == undefined) {
            this.launch_rate = 1;
        }

        this.training_formula = function(kb, base_damage, damage, weight, kbg, bkb, r, dddinhale){
			var s = 1;
			return ((500 * (dddinhale ? 4 : 1)) * kb * (weight + 100) - (r * (kbg * (7 * damage * s * (3 * base_damage * s + 7 * base_damage + 20) + (90 * (dddinhale ? 4 : 1)) * (weight + 100)) + (500 * (dddinhale ? 4 : 1)) * bkb * (weight + 100)))) / (7 * kbg * r * (base_damage * (3 * s + 7) + 20)) - preDamage;
		}

		this.vs_formula = function (kb, base_damage, damage, weight, kbg, bkb, r, dddinhale, attacker_percent, queue, shieldQueue, ignoreStale){
            var s = StaleNegation(queue, shieldQueue, ignoreStale);
            r = r * Rage(attacker_percent) * this.launch_rate;
			return ((500 * (dddinhale ? 4 : 1)) * kb * (weight + 100) - (r * (kbg * (7 * damage * s * (3 * base_damage * s + 7 * base_damage + 20) + (90 * (dddinhale ? 4 : 1)) * (weight + 100)) + (500 * (dddinhale ? 4 : 1)) * bkb * (weight + 100)))) / (7 * kbg * r * (base_damage * (3 * s + 7) + 20)) - preDamage;
        }

        if(this.wbkb == 0){
            if(this.type == "total"){
                this.kb = kb;
            }
            if(this.type == "x"){
                this.x = kb;
            }
            if(this.type == "y"){
                this.y = kb;
            }
        }


        if (this.wbkb == 0) {
            this.calculate = function () {


                if (this.original_angle == 361) {
                    this.base_angle = SakuraiAngle(this.kb, this.aerial);
                }
                this.angle = this.base_angle;

                if (this.original_angle == 361 && !this.aerial && type != "total") {
                    //Find the original kb and get the angle
                    var angle_found = false;
                    for (var temp_kb = 59.999; temp_kb < 88; temp_kb += 0.001) {
                        var temp_angle = SakuraiAngle(temp_kb, this.aerial);
                        var temp_var = 0;
                        if (this.type == "x") {
                            temp_var = Math.abs(temp_kb * Math.cos(temp_angle * Math.PI / 180));
                            if (temp_var >= this.x) {
                                this.angle = temp_angle;
                                angle_found = true;
                                break;
                            }
                        }
                        if (this.type == "y") {
                            temp_var = Math.abs(temp_kb * Math.sin(temp_angle * Math.PI / 180));
                            if (temp_var >= this.y) {
                                this.angle = temp_angle;
                                angle_found = true;
                                break;
                            }
                        }
                    }
                    if (!angle_found) {
                        this.angle = SakuraiAngle(88, this.aerial);
                    }
                }

                if (this.wbkb!=0) {
                    if (this.type == "x") {
                        this.kb = Math.abs(this.x / Math.cos(this.angle * Math.PI / 180));
                    }
                    if (this.type == "y") {
                        this.kb = Math.abs(this.y / Math.sin(this.angle * Math.PI / 180));
                    }
                }


                this.hitstun = Hitstun(this.kb, this.windbox, this.electric);

                if (this.base_angle != 0 && this.base_angle != 180) {
                    this.tumble = this.kb >= 80 && !windbox;
                    this.di_able = this.tumble;
                }


                /*if (this.angle == 0 || this.angle == 180  || (this.angle >= 181 && this.angle < 360)) {
                    this.add_gravity_kb = 0;
                }*/
                if (this.kb > 80 && (this.angle != 0 && this.angle != 180)) {
                    //this.y *= this.gravity_mult;
                    if (this.type == "y") {
                        this.kb = Math.abs(this.y / Math.sin(this.angle * Math.PI / 180));
                    }
                }

                this.can_jablock = false;
                if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                    if (this.kb != 0 && !this.windbox) {
                        this.can_jablock = true;
                    }
                }
                if (this.angle >= 240 && this.angle <= 300) {
                    if (this.kb != 0 && !this.windbox) {
                        this.can_jablock = !this.tumble;
                    }
                }
                if (this.angle <= 70 || this.angle >= 110) {
                    this.reeling = this.tumble && !this.windbox && this.percent >= 100;

                }

				this.training_percent = this.training_formula(this.kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.dddinhale);
				this.vs_percent = this.vs_formula(this.kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.dddinhale, this.attacker_percent, this.queue, this.shieldQueue, this.ignoreStale);


                if (this.training_percent < 0) {
                    this.training_percent = 0;
                }
                if (this.training_percent > 999 || isNaN(this.training_percent)) {
                    this.training_percent = -1;
                }
                if (this.vs_percent < 0) {
                    this.vs_percent = 0;
                }
                if (this.vs_percent > 999 || isNaN(this.vs_percent)) {
                    this.vs_percent = -1;
                }

            };
        } else {
            this.calculate = function () {
				this.kb = this.base_kb * this.wbkb_modifier;
                this.rage_needed = -1;
                this.vs_percent = 0;
				var wbkb = WeightBasedKB(this.weight, this.bkb, this.wbkb, this.kbg, this.gravity, this.fall_speed, this.r, 0, this.damage, 0, this.angle, this.aerial, this.windbox, -1, this.lsi);
				wbkb.addModifier(this.wbkb_modifier);
				this.wbkb_kb = wbkb.kb;
                if (this.kb <= this.wbkb_kb) {
                    this.training_percent = 0;
                }
                if (this.kb > this.wbkb_kb) {
                    this.training_percent = -1;
                }
                var rage = this.kb / this.wbkb_kb;
                if (rage >= 1 && rage <= 1.15) {
                    this.vs_percent = (5 / 3) * ((460 * rage) - 439);
                    this.vs_percent = +this.vs_percent.toFixed(6);
                    this.rage_needed = +rage.toFixed(6);
                } else {
                    if (this.kb <= this.wbkb_kb) {
                        this.vs_percent = 0;
                    }
                    if (this.kb > this.wbkb_kb) {
                        this.vs_percent = -1;
                    }
                }
            }
        }
        this.addModifier = function (modifier) {
            this.kb /= modifier;
            this.base_kb /= modifier;
            this.add_gravity_kb /= modifier;
            this.wbkb_modifier *= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                //this.kb /= 0.8;
                this.calculate();
            }
        }
        this.calculate();
    }
};

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

function KBModifier(value) {
    switch (value) {
        case "crouch":
            return parameters.crouch_cancelling;
        case "grounded":
            return 1;
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

var hitframe = 9;
var faf = 26;

var bounce = false;
var ignoreStale = false;

var perfectshield = false;
var is_projectile = false;

var megaman_fsmash = false;
var witch_time_smash_charge = false;
var electric = false;
var crouch = "none";
var is_smash = false;

var windbox = false;
var stick = { X: 0, Y: 0 };
var luma_percent = 0;

var shieldDamage = 0;

var unblockable = false;
var isFinishingTouch = false;

var game_mode = "vs";
var graph = false;

var position = {"x":0, "y":0};
var inverseX = false;
var onSurface = false;

var lsi = 0;

var landing_lag = 0;
var stock_dif = "0";

var set_weight = false;
var paralyzer = false;
var effect = "None/Other";
var launch_rate = 1;

var shieldstunMult = 1;
var is_aerial_move = false;
var uses_aerial_shieldstun = false;

var addHitstun = 0;

var effects = [
	{ id: 0, name: "None/Other" },
	{ id: 3, name: "Electric" },
	{ id: 4, name: "Freeze" },
	{ id: 9, name: "Sleep" },
	{ id: 11, name: "Bury" },
	{ id: 12, name: "Stun" },
	{ id: 20, name: "Paralyze" },
	{ id: 14, name: "Flower" },
	{ id: 31, name: "Disable" }
];


class StickPosition {
	constructor(name, X, Y, controllers) {
		this.name = name;
		this.X = X;
		this.Y = Y;
		this.controllers = controllers;
	}

};

var Controllers = {
	GC : 1,
	//Pro: 2,
	//Gamepad: 4,
	//Classic: 8,
	//Nunchuck: 16,
	//Wiimote: 32,
	//_3DS: 64,
	AllControllers: 0xFFFFFFFF
}

var ControllerList = [
	{ name: "GameCube/Other", value: Controllers.GC, gate: 35, r: 128 }//, //Others for now, I will add them to the list once I get the stick values
	//{ name: "Wiimote", value: Controllers.Wiimote, gate: 0, r: 0 }
];

var StickPositions = [
	new StickPosition("Neutral", 0, 0, Controllers.AllControllers),
	new StickPosition("Up", 0, 127, Controllers.AllControllers),
	new StickPosition("Down", 0, -127, Controllers.AllControllers),
	new StickPosition("Left", -127, 0, Controllers.AllControllers),
	new StickPosition("Right", 127, 0, Controllers.AllControllers),
	//new StickPosition("Wiimote Up-Left", -127, 127, Controllers.Wiimote),
	//new StickPosition("Wiimote Up-Right", 127, 127, Controllers.Wiimote),
	//new StickPosition("Wiimote Down-Left", -127, -127, Controllers.Wiimote),
	//new StickPosition("Wiimote Down-Right", 127, -127, Controllers.Wiimote)
];

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

	return {
		"-webkit-text-fill-color": `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
	};
}


// KH API
class Move {
	constructor(api_id, hitbox_no, name, moveName, base_damage, angle, bkb, kbg, wbkb, hitboxActive, faf, landingLag, autoCancel, preDamage, counterMult, rehitRate, shieldDamage, setweight, shieldstun) {
		this.api_id = api_id;
		this.id = 0;
		this.hitbox_no = hitbox_no;
		this.name = name;
		this.moveName = moveName;
		this.base_damage = base_damage;
		this.angle = angle;
		this.bkb = bkb;
		this.kbg = kbg;
		this.wbkb = wbkb;
		this.hitboxActive = hitboxActive;
		this.faf = faf;
		this.landingLag = landingLag;
		this.autoCancel = autoCancel;
		this.preDamage = preDamage;
		this.counterMult = counterMult;
		this.rehitRate = rehitRate;
		this.shieldDamage = shieldDamage;
		this.setweight = setweight;
		this.shieldstun = shieldstun;
		this.weightDependent = false;

		this.eval_autoCancel = function (value) {
			for (var i = 0; i < this.autoCancel.length; i++) {
				if (this.autoCancel[i].eval(value)) {
					return true;
				}
			}
			return false;
		}

		this.compareById = function (other) {
			if (this.api_id < other.api_id) {
				return -1;
			}
			if (this.api_id > other.api_id) {
				return 1;
			}
			if (this.hitbox_no < other.hitbox_no) {
				return -1;
			}
			if (this.hitbox_no > other.hitbox_no) {
				return 1;
			}
			return 0;
		}

		this.valid = true;
		this.smash_attack = name.includes("Fsmash") || name.includes("Usmash") || name.includes("Dsmash");
		this.throw = name.includes("Fthrow") || name.includes("Bthrow") || name.includes("Uthrow") || name.includes("Dthrow");
		this.chargeable = name.includes("No Charge") || name.includes("Uncharged") || (name.includes("Eruption") && !name.includes("Fully Charged")) || name == "Charge Shot" || name == "Quickdraw (Attack)" || name == "Aura Sphere (Release from Charge)" || name == "Shadow Ball (Uncharged)" || name == "Skull Bash" || name.includes("Rollout (") || name == "Water Shuriken (Uncharged)" || name == "Sun Salutation" || name == "Palutena Bow" || name == "Silver Bow";
		this.grab = this.name == "Standing Grab" || this.name == "Dash Grab" || this.name == "Pivot Grab";
		this.tilt = this.name.includes("Utilt") || this.name.includes("Ftilt") || this.name.includes("Dtilt");
		this.jab = this.name.includes("Jab");
		this.aerial = this.name.includes("Uair") || this.name.includes("Fair") || this.name.includes("Bair") || this.name.includes("Dair") || this.name.includes("Nair"); // || this.name.includes("Zair"); Zair not really considered as an aerial in-game
		this.aerial_shieldstun = this.aerial && !this.name.includes("Landing");
		this.taunt = this.name.includes("Taunt");
		this.dashAttack = this.name.includes("Dash Attack");
		this.counter = this.counterMult != 0 || this.name.includes("Counter (Attack)") || this.name.includes("Substitute (Attack") || this.name.includes("Toad (Attack") || this.name.includes("Witch Time");
		this.commandGrab = !this.grab && (this.name.includes("Grab") || this.name.includes("Confusion") || (this.name.includes("Inhale") && !this.name.includes("Spit")) || (this.name.includes("Chomp") && !this.name.includes("Food") && !this.name.includes("Eating")) || this.name.includes("Egg Lay") || this.name.includes("Flame Choke")) && !this.name.includes("Attack") && !this.name.includes("(Hitbox)");
		this.unblockable = this.grab || this.throw || this.commandGrab || this.name.includes("Witch Time") || this.name.includes("KO Punch") || this.name == "Focus Attack (Stage 3)" || this.name == "Reflect Barrier";
		this.windbox = this.name.includes("Windbox") || this.name.includes("Flinchless") || this.name == "Hydro Pump" || this.name == "F.L.U.D.D (Attack)";
		this.multihit = /(Hit [0-9]+)/gi.test(this.name) || /(Hits [0-9]+\-[0-9]+)/gi.test(this.name) || this.name.includes("Final Hit") || this.rehitRate != 0;
		this.spike = this.angle >= 230 && this.angle <= 310;
		this.isFinishingTouch = false; // this.name.includes("Finishing Touch") && !this.name.includes("Windbox");

		this.maxSmashChargeMult = this.smash_attack ? 1.4 : 1;

		this.charge = null;
		if (this.chargeable) {
			this.charge = ChargeData.get(chargeMoves, this.name);
			this.charge_damage = function (frames) {
				return +this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[0].toFixed(4);
			}
			this.charge_bkb = function (frames) {
				return Math.floor(this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[1]);
			}
			this.charge_kbg = function (frames) {
				return Math.floor(this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[2]);
			}
			this.charge_shieldDamage = function (frames) {
				return Math.floor(this.charge.formula(this.base_damage, this.bkb, this.kbg, this.shieldDamage, frames)[3]);
			}
		}

		this.invalidate = function () {
			this.valid = false;
			return this;
		}

		this.check = function () {
			if (isNaN(this.base_damage) && isNaN(this.angle) && isNaN(this.bkb) && isNaN(this.kbg))
				this.valid = false;

			return this;
		}

		this.addCharacter = function (character) {
			this.character = character;
			return this;
		}

		this.type = this.smash_attack ? "Smash" :
			this.throw ? "Throw" :
				this.grab ? "Grab" :
					this.tilt ? "Tilt" :
						this.jab ? "Jab" :
							this.aerial ? "Aerial" :
								this.taunt ? "Taunt" :
									this.dashAttack ? "DashAttack" :
										"Special";

		this.isGroundedAttack = this.smash_attack || this.tilt || this.jab || this.dashAttack;

		if (this.counter) {
			this.type += ",Counter";
		}

		if (this.commandGrab) {
			this.type += ",CommandGrab";
		}

		if (this.unblockable && !this.throw && !this.grab && !this.commandGrab) {
			this.type += ",Unblockable";
		}

		if (this.windbox) {
			this.type += ",Windbox";
		}

		if (this.multihit) {
			this.type += ",Multihit";
		}

		if (this.shieldDamage != 0) {
			this.type += ",ExtraShieldDamage";
		}

		if (this.spike) {
			this.type += ",Spike";
		}

		if (this.name.includes("True")) {
			this.type += ",RyuTrue";
		}

		if ((this.name.includes("Limit") && !this.name.includes("Limit Break")) || this.name.includes("Finishing Touch")) {
			this.type += ",LimitBreak";
		}

		if (this.weightDependent) {
			this.type += ",WeightDependent";
		}

		//Check if move can be used in the calculator
		if (isNaN(this.base_damage) && isNaN(this.angle) && isNaN(this.bkb) && isNaN(this.kbg))
			this.valid = false;

		//New data
		this.pikminColor = null;

		//Throws stuff
		this.throwApplierFrame = null;
		this.throwFAF = null;
		this.throwAnimationLength = null;
		this.calculateThrowData = null;
		this.throwDataExceptions = null;

		this.updateMoveData = function () {

			//Pikmin color and multipliers
			if (this.character == "Olimar") {
				if (this.name.includes("Fsmash") || this.name.includes("Dsmash") || this.name.includes("Usmash") || this.name.includes("Uair") || this.name.includes("Dair")
					|| this.name.includes("Fair") || this.name.includes("Bair") || this.name.includes("Uthrow")) {

					if (this.moveName == "Dsmash (Purple Pikmin, Late)") {
						this.pikminColor = "Purple";
					} else {
						switch (this.hitbox_no) {
							case 0:
								this.pikminColor = "Red";
								break;
							case 1:
								this.pikminColor = "Yellow";
								break;
							case 2:
								this.pikminColor = "Blue";
								break;
							case 3:
								this.pikminColor = "White";
								break;
							case 4:
								this.pikminColor = "Purple";
								break;
						}
					}
					//Apply damage multipliers
					switch (this.pikminColor) {
						case "Red":
							if (this.throw) {
								this.base_damage *= 0.8;
							} else {
								this.base_damage *= 1.4;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
						case "Yellow":

							break;
						case "Blue":
							if (this.throw) {
								this.base_damage *= 1.7;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
						case "White":
							if (!this.throw) {
								this.base_damage *= 0.8;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
						case "Purple":
							if (!this.throw) {
								this.base_damage *= 1.6;
							}
							this.base_damage = +this.base_damage.toFixed(1);
							break;
					}

					if (this.pikminColor != null) {
						this.name = this.moveName + " (" + this.pikminColor + ")";
					}
				}
			}

			//Smash attacks
			if (this.smash_attack) {
				if (this.character == "Bayonetta" || this.character == "Olimar") {
					this.maxSmashChargeMult = 1.2;
				}
				if (this.character == "Ness" && (this.name.includes("Usmash") || this.name.includes("Dsmash"))) {
					this.maxSmashChargeMult = 1.2;
				}
				if ((this.character == "Mega Man" || this.character == "Villager") && this.name.includes("Fsmash")) {
					this.maxSmashChargeMult = 1.2;
				}
			}

			return this;
		}


	}
};