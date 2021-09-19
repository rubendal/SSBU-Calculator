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

class Parameter {
    constructor(param, value) {
        this.param = param;
        this.value = value;
    }

    static get(list,p) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].param == p) {
                return list[i].value;
            }
        }
        return undefined;
    }
};

function getParameters() {
    var params = window.location.search;
    var list = [];
    params.replace(/([^?=&]+)(=([^&]*))?/gi, function (a, b, c, d) {
        list.push(new Parameter(b, decodeURI(d.replace("%26","&"))));
    });
    return list;
    
}

//Parameters and default values
var paramsList = [
    new Parameter("attacker", null),
    new Parameter("attackerModifier", "Normal"),
    new Parameter("attackerPercent", "0"),
    new Parameter("target", null),
    new Parameter("targetModifier", "Normal"),
    new Parameter("targetPercent", "0"),
    new Parameter("lumaPercent", "0"),
    new Parameter("baseDamage", "1.5"),
    new Parameter("angle", "55"),
    new Parameter("aerial", "0"),
    new Parameter("bkb", "45"),
    new Parameter("kbg", "25"),
    new Parameter("wbkb", "0"),
    new Parameter("smashAttack", "0"),
    new Parameter("windbox", "0"),
    new Parameter("shieldDamage", "0"),
    new Parameter("hitlag", "1"),
    new Parameter("staleness", ""),
    new Parameter("preDamage", "0"),
    new Parameter("chargeFrames", "0"),
    new Parameter("hitFrame", "9"),
    new Parameter("faf", "26"),
    new Parameter("kbModifier", "none"),
    new Parameter("effect", "None/Other"),
    new Parameter("lsi", "none"),
    new Parameter("bounce", "0"),
    new Parameter("projectile", "0"),
    new Parameter("witchTime", "0"),
    new Parameter("megamanFsmash", "0"),
    new Parameter("shield", "normal"),
    new Parameter("stickX", "0"),
    new Parameter("stickY", "0"),
    new Parameter("unblockable", "0"),
    new Parameter("counteredDamage", "0"),
    new Parameter("counterMult", "0"),
    new Parameter("stockDif", "0"),
    new Parameter("gameMode", "Singles"),
    new Parameter("stage", "Final Destination"),
    new Parameter("positionX", "0"),
    new Parameter("positionY", "0"),
    new Parameter("visInverse", "0"),
    new Parameter("visSurface", "0"),
    new Parameter("visGameMode","vs"),
    new Parameter("KB", "0"),
    new Parameter("chargeable", "0"),
    new Parameter("pDI", defaultParameters.di.toString()),
    new Parameter("pMinLSI", defaultParameters.lsi_min.toString()),
    new Parameter("pMaxLSI", defaultParameters.lsi_max.toString()),
    new Parameter("pHitstun", defaultParameters.hitstun),
    new Parameter("pDecay", defaultParameters.decay),
    new Parameter("pLaunchSpeed", defaultParameters.launch_speed),
    new Parameter("pGMult", defaultParameters.gravity.mult),
    new Parameter("pGConst", defaultParameters.gravity.constant),
    new Parameter("pHitlagMult", defaultParameters.hitlag.mult),
    new Parameter("pHitlagConst", defaultParameters.hitlag.constant),
    new Parameter("pHCdodgef", defaultParameters.hitstunCancel.frames.airdodge),
    new Parameter("pHCdodgem", defaultParameters.hitstunCancel.launchSpeed.airdodge),
    new Parameter("pHCaerialf", defaultParameters.hitstunCancel.frames.aerial),
    new Parameter("pHCaerialm", defaultParameters.hitstunCancel.launchSpeed.aerial),
    new Parameter("damageDealt", "1"),
    new Parameter("kbDealt", "1"),
    new Parameter("weight", "84"),
    new Parameter("gravity", "0.12"),
    new Parameter("fallSpeed", "1.77"),
    new Parameter("damageReceived", "1"),
    new Parameter("kbReceived", "1"),
    new Parameter("traction", "0.055"),
    new Parameter("setWeight", "0"),
    new Parameter("theme", "Ultimate"),
    new Parameter("launchRate", "1"),
    new Parameter("pParalConst", defaultParameters.paralyzer.constant),
    new Parameter("pParalMult", defaultParameters.paralyzer.mult),
	new Parameter("useLandingLag", "no"),
	new Parameter("isFinishingTouch", "0"),
	new Parameter("1v1", "1"),
	new Parameter("shorthop", "0"),
	new Parameter("isAerial", "0"),
	new Parameter("ignoreStale", "0"),
	new Parameter("addHitstun", "0")
];

function checkUndefined(value) {
    return value == undefined;
};

function boolToString(value) {
    return value ? "1" : "0";
}

function boolArrayToString(value) {
    //Prints string with position+1 separated by , when true
    var str = "";
    for (var i = 0; i < value.length; i++) {
        if (value[i]) {
            str += (i + 1) + ",";
        }
    }
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
}

function buildParams($scope) {
	var params = [];
	if (displayNames[displayNames.indexOf(paramsList[0].value)] != displayNames[displayNames.indexOf($scope.attackerValue)]) {
		params.push(new Parameter(paramsList[0].param, displayNames[displayNames.indexOf($scope.attackerValue)]));
    }
    if (paramsList[1].value != $scope.attackerMod) {
        params.push(new Parameter(paramsList[1].param, $scope.attackerMod));
    }
    if (paramsList[2].value != $scope.attackerPercent) {
        params.push(new Parameter(paramsList[2].param, $scope.attackerPercent));
    }
	if (displayNames[displayNames.indexOf(paramsList[3].value)] != displayNames[displayNames.indexOf($scope.targetValue)]) {
		params.push(new Parameter(paramsList[3].param, displayNames[displayNames.indexOf($scope.targetValue)]));
    }
    if (paramsList[4].value != $scope.targetMod) {
        params.push(new Parameter(paramsList[4].param, $scope.targetMod));
    }
    if (paramsList[5].value != $scope.targetPercent) {
        params.push(new Parameter(paramsList[5].param, $scope.targetPercent));
    }
    if (paramsList[6].value != $scope.lumaPercent) {
        params.push(new Parameter(paramsList[6].param, $scope.lumaPercent));
    }
    if (paramsList[7].value != $scope.baseDamage) {
        params.push(new Parameter(paramsList[7].param, $scope.baseDamage));
    }
    if (paramsList[8].value != $scope.angle) {
        params.push(new Parameter(paramsList[8].param, $scope.angle));
    }
    if (paramsList[9].value != boolToString($scope.aerial)) {
        params.push(new Parameter(paramsList[9].param, boolToString($scope.aerial)));
    }
    if (paramsList[10].value != $scope.bkb) {
        params.push(new Parameter(paramsList[10].param, $scope.bkb));
    }
    if (paramsList[11].value != $scope.kbg) {
        params.push(new Parameter(paramsList[11].param, $scope.kbg));
    }
    if (paramsList[12].value != $scope.wbkb) {
        params.push(new Parameter(paramsList[12].param, $scope.wbkb));
    }
    if (paramsList[13].value != boolToString($scope.this.SelectedMove.MoveRef.IsSmashAttack)) {
        params.push(new Parameter(paramsList[13].param, boolToString($scope.this.SelectedMove.MoveRef.IsSmashAttack)));
    }
    if (paramsList[14].value != boolToString($scope.windbox)) {
        params.push(new Parameter(paramsList[14].param, boolToString($scope.windbox)));
    }
    if ($scope.app != "kbcalculator") {
        if (paramsList[15].value != $scope.shieldDamage) {
            params.push(new Parameter(paramsList[15].param, $scope.shieldDamage));
        }
        if (paramsList[16].value != $scope.hitlag) {
            params.push(new Parameter(paramsList[16].param, $scope.hitlag));
        }
    }
    if (paramsList[17].value != boolArrayToString($scope.stale)) {
        params.push(new Parameter(paramsList[17].param, boolArrayToString($scope.stale)));
    }
    if (paramsList[18].value != $scope.preDamage) {
        params.push(new Parameter(paramsList[18].param, $scope.preDamage));
    }
    if (paramsList[19].value != $scope.smashCharge) {
        params.push(new Parameter(paramsList[19].param, $scope.smashCharge));
    }
    if (paramsList[22].value != $scope.kb_modifier) {
        params.push(new Parameter(paramsList[22].param, $scope.kb_modifier));
    }
    if ($scope.app != "kbcalculator") {
		if (paramsList[23].value != $scope.effect) {
			params.push(new Parameter(paramsList[23].param, $scope.effect));
        }
    }
    if (paramsList[25].value != boolToString($scope.kb_modifier_bounce)) {
        params.push(new Parameter(paramsList[25].param, boolToString($scope.kb_modifier_bounce)));
    }
    if (paramsList[26].value != boolToString($scope.this.SelectedMove.MoveRef.IsProjectile)) {
        params.push(new Parameter(paramsList[26].param, boolToString($scope.this.SelectedMove.MoveRef.IsProjectile)));
    }
    if (paramsList[27].value != boolToString($scope.witch_time_charge)) {
        params.push(new Parameter(paramsList[27].param, boolToString($scope.witch_time_charge)));
    }
    if (paramsList[28].value != boolToString($scope.megaman_fsmash)) {
        params.push(new Parameter(paramsList[28].param, boolToString($scope.megaman_fsmash)));
	}
	if ($scope.stick != undefined) {
		if (paramsList[30].value != $scope.stick.X) {
			params.push(new Parameter(paramsList[30].param, $scope.stick.X));
		}
		if (paramsList[31].value != $scope.stick.Y) {
			params.push(new Parameter(paramsList[31].param, $scope.stick.Y));
		}
	}
    if ($scope.app != "kbcalculator") {
        if (paramsList[20].value != $scope.hit_frame) {
            params.push(new Parameter(paramsList[20].param, $scope.hit_frame));
        }
        if (paramsList[21].value != $scope.faf) {
            params.push(new Parameter(paramsList[21].param, $scope.faf));
        }
        if (paramsList[29].value != $scope.shield) {
            params.push(new Parameter(paramsList[29].param, $scope.shield));
        }
    }
    if (paramsList[32].value != boolToString($scope.unblockable)) {
        params.push(new Parameter(paramsList[32].param, boolToString($scope.unblockable)));
    }
    if (paramsList[33].value != $scope.counteredDamage) {
        params.push(new Parameter(paramsList[33].param, $scope.counteredDamage));
    }
    if (paramsList[34].value != $scope.counterMult) {
        params.push(new Parameter(paramsList[34].param, $scope.counterMult));
    }
    if (paramsList[35].value != $scope.stock_dif) {
        params.push(new Parameter(paramsList[35].param, $scope.stock_dif));
    }
    if (paramsList[36].value != $scope.format) {
        params.push(new Parameter(paramsList[36].param, $scope.format));
    }
    if (paramsList[44].value != boolToString($scope.charge_special)) {
        params.push(new Parameter(paramsList[44].param, boolToString($scope.charge_special)));
    }
    if (paramsList[59].value != $scope.attacker_damage_dealt) {
        params.push(new Parameter(paramsList[59].param, $scope.attacker_damage_dealt));
    }
    if (paramsList[60].value != $scope.attacker_kb_dealt) {
        params.push(new Parameter(paramsList[60].param, $scope.attacker_kb_dealt));
    }
    if (paramsList[61].value != $scope.target_weight) {
        params.push(new Parameter(paramsList[61].param, $scope.target_weight));
    }
    if (paramsList[62].value != $scope.target_gravity) {
        params.push(new Parameter(paramsList[62].param, $scope.target_gravity));
    }
    if (paramsList[63].value != $scope.target_fall_speed) {
        params.push(new Parameter(paramsList[63].param, $scope.target_fall_speed));
    }
    if (paramsList[64].value != $scope.target_damage_taken) {
        params.push(new Parameter(paramsList[64].param, $scope.target_damage_taken));
    }
    if (paramsList[65].value != $scope.target_kb_received) {
        params.push(new Parameter(paramsList[65].param, $scope.target_kb_received));
    }
    if (paramsList[66].value != $scope.target_traction) {
        params.push(new Parameter(paramsList[66].param, $scope.target_traction));
    }
    if (paramsList[67].value != boolToString($scope.set_weight)) {
        params.push(new Parameter(paramsList[67].param, boolToString($scope.set_weight)));
    }
    if (paramsList[68].value != $scope.theme) {
        params.push(new Parameter(paramsList[68].param, $scope.theme));
    }
    if (paramsList[69].value != $scope.launch_rate) {
        params.push(new Parameter(paramsList[69].param, $scope.launch_rate));
    }
	if ($scope.app == "calculator" || $scope.app == "kocalculator" || $scope.app == "multicalc") {
        if (paramsList[37].value != $scope.stageName) {
            params.push(new Parameter(paramsList[37].param, $scope.stageName));
        }
        if (paramsList[38].value != $scope.position_x) {
            params.push(new Parameter(paramsList[38].param, $scope.position_x));
        }
        if (paramsList[39].value != $scope.position_y) {
            params.push(new Parameter(paramsList[39].param, $scope.position_y));
        }
        if (paramsList[40].value != boolToString($scope.inverseX)) {
            params.push(new Parameter(paramsList[40].param, boolToString($scope.inverseX)));
        }
        if (paramsList[41].value != boolToString($scope.surface)) {
            params.push(new Parameter(paramsList[41].param, boolToString($scope.surface)));
        }
        if (paramsList[42].value != $scope.game_mode) {
            params.push(new Parameter(paramsList[42].param, $scope.game_mode));
        }
        if (paramsList[45].value != $scope.params.di) {
            params.push(new Parameter(paramsList[45].param, $scope.params.di));
        }
        if (paramsList[46].value != $scope.params.lsi_min) {
            params.push(new Parameter(paramsList[46].param, $scope.params.lsi_min));
        }
        if (paramsList[47].value != $scope.params.lsi_max) {
            params.push(new Parameter(paramsList[47].param, $scope.params.lsi_max));
        }
        if (paramsList[48].value != $scope.params.hitstun) {
            params.push(new Parameter(paramsList[48].param, $scope.params.hitstun));
        }
        if (paramsList[49].value != $scope.params.decay) {
            params.push(new Parameter(paramsList[49].param, $scope.params.decay));
        }
        if (paramsList[50].value != $scope.params.launch_speed) {
            params.push(new Parameter(paramsList[50].param, $scope.params.launch_speed));
        }
        if (paramsList[51].value != $scope.params.gravity.mult) {
            params.push(new Parameter(paramsList[51].param, $scope.params.gravity.mult));
        }
        if (paramsList[52].value != $scope.params.gravity.constant) {
            params.push(new Parameter(paramsList[52].param, $scope.params.gravity.constant));
        }
        if (paramsList[53].value != $scope.params.hitlag.mult) {
            params.push(new Parameter(paramsList[53].param, $scope.params.hitlag.mult));
        }
        if (paramsList[54].value != $scope.params.hitlag.constant) {
            params.push(new Parameter(paramsList[54].param, $scope.params.hitlag.constant));
        }
        if (paramsList[55].value != $scope.params.hitstunCancel.frames.airdodge) {
            params.push(new Parameter(paramsList[55].param, $scope.params.hitstunCancel.frames.airdodge));
        }
        if (paramsList[56].value != $scope.params.hitstunCancel.launchSpeed.airdodge) {
            params.push(new Parameter(paramsList[56].param, $scope.params.hitstunCancel.launchSpeed.airdodge));
        }
        if (paramsList[57].value != $scope.params.hitstunCancel.frames.aerial) {
            params.push(new Parameter(paramsList[57].param, $scope.params.hitstunCancel.frames.aerial));
        }
        if (paramsList[58].value != $scope.params.hitstunCancel.launchSpeed.aerial) {
            params.push(new Parameter(paramsList[58].param, $scope.params.hitstunCancel.launchSpeed.aerial));
        }
        if (paramsList[70].value != $scope.params.paralyzer.constant) {
            params.push(new Parameter(paramsList[70].param, $scope.params.paralyzer.constant));
        }
        if (paramsList[71].value != $scope.params.paralyzer.mult) {
            params.push(new Parameter(paramsList[71].param, $scope.params.paralyzer.mult));
        }
        if (paramsList[72].value != $scope.use_landing_lag) {
            params.push(new Parameter(paramsList[72].param, $scope.use_landing_lag));
		}
		if (paramsList[73].value != boolToString($scope.isFinishingTouch)) {
			params.push(new Parameter(paramsList[73].param, boolToString($scope.isFinishingTouch)));
		}
		if (paramsList[74].value != boolToString($scope.is_1v1)) {
			params.push(new Parameter(paramsList[74].param, boolToString($scope.is_1v1)));
		}
		if (paramsList[75].value != boolToString($scope.shorthop_aerial)) {
			params.push(new Parameter(paramsList[75].param, boolToString($scope.shorthop_aerial)));
		}
		if (paramsList[76].value != boolToString($scope.is_aerial_move)) {
			params.push(new Parameter(paramsList[76].param, boolToString($scope.is_aerial_move)));
		}
		if (paramsList[77].value != boolToString($scope.ignoreStale)) {
			params.push(new Parameter(paramsList[77].param, boolToString($scope.ignoreStale)));
		}
		if (paramsList[78].value != $scope.addHitstun) {
			params.push(new Parameter(paramsList[78].param, $scope.addHitstun));
		}
    } else if ($scope.app == "kbcalculator") {
        if (paramsList[43].value != $scope.kb) {
            params.push(new Parameter(paramsList[43].param, $scope.kb));
        }
    }
    return params;
}

function buildURL($scope) {
    var url = window.location.href;
    url = url.replace(window.location.search, "") + "?";
    var p = "";
    var params = buildParams($scope);
    var andIns = false;
    for (var i = 0; i < params.length; i++) {
        if (params[i].value === undefined) {
            continue;
        }
        if (andIns) {
            p += "&";
        }
        andIns = true;
        var u = encodeURI(params[i].value);
        u = u.replace("&","%26");
        p += params[i].param + "=" + u;
    }
    return url + p;
}

var get_params = getParameters();

function mapParams($scope) {
    //Calculators
    var param = Parameter.get(get_params, "attacker");
	if (param) {
		$scope.attackerValue = displayNames[displayNames.indexOf(param)];
        $scope.updateAttacker();
    }
    param = Parameter.get(get_params, "attackerModifier");
    if (param) {
        $scope.attackerMod = param;
        $scope.updateAttackerMod();
    }
    param = Parameter.get(get_params, "target");
    if (param) {
		$scope.targetValue = displayNames[displayNames.indexOf(param)];
        $scope.updateTarget();
    }
    param = Parameter.get(get_params, "targetModifier");
    if (param) {
        $scope.targetMod = param;
        $scope.updateTargetMod();
    }
    param = Parameter.get(get_params, "attackerPercent");
    if (param) {
        $scope.attackerPercent = parseFloat(param);
    }
    param = Parameter.get(get_params, "targetPercent");
    if (param) {
        $scope.targetPercent = parseFloat(param);
    }
    param = Parameter.get(get_params, "lumaPercent");
    if (param) {
        $scope.lumaPercent = parseFloat(param);
    }
    param = Parameter.get(get_params, "baseDamage");
    if (param) {
        $scope.baseDamage = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "angle");
    if (param) {
        $scope.angle = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "aerial");
    if (param) {
        $scope.in_air = param == "1";
    }
    param = Parameter.get(get_params, "bkb");
    if (param) {
        $scope.bkb = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "wbkb");
	if (param) {
        $scope.wbkb = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "smashAttack");
    if (param) {
        $scope.this.SelectedMove.MoveRef.IsSmashAttack = param == "1";
        $scope.updateAttackData();
        $scope.checkSmashVisibility();
    }
    param = Parameter.get(get_params, "windbox");
    if (param) {
        $scope.windbox = param == "1";
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "kbg");
    if (param) {
        $scope.kbg = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "shieldDamage");
    if (param) {
        $scope.shieldDamage = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "staleness");
    if (param) {
        var s = param.split(",");
        for (var i = 0; i < s.length; i++) {
            try {
                var n = parseFloat(s[i]);
                $scope.stale[n - 1] = true;

            } catch (e) {

            }
        }
    }
    param = Parameter.get(get_params, "hitlag");
    if (param) {
        $scope.hitlag = parseFloat(param);
    }
    param = Parameter.get(get_params, "preDamage");
    if (param) {
        $scope.preDamage = param;
        $scope.update();
    }
    param = Parameter.get(get_params, "hitFrame");
    if (param) {
        $scope.hit_frame = parseFloat(param);
    }
    param = Parameter.get(get_params, "faf");
    if (param) {
        $scope.faf = parseFloat(param);
    }
    param = Parameter.get(get_params, "effect");
	if (param) {
		$scope.effect = param;
		$scope.updateEffect();
    }
    param = Parameter.get(get_params, "kbModifier");
    if (param) {
        $scope.kb_modifier = param;
    }
    param = Parameter.get(get_params, "bounce");
    if (param) {
        $scope.kb_modifier_bounce = param == "1";
    }
    param = Parameter.get(get_params, "witchTime");
    if (param) {
        $scope.witch_time_charge = param == "1";
    }
    param = Parameter.get(get_params, "megamanFsmash");
    if (param) {
        $scope.megaman_fsmash = param == "1";
    }
    param = Parameter.get(get_params, "chargeable");
    if (param) {
        $scope.charge_special = param == "1";
    }
    param = Parameter.get(get_params, "projectile");
    if (param) {
        $scope.this.SelectedMove.MoveRef.IsProjectile = param == "1";
    }
    param = Parameter.get(get_params, "shield");
    if (param) {
        $scope.shield = param;
	}
	param = Parameter.get(get_params, "stickX");
	if (param) {
		$scope.stick.X = Math.floor(parseFloat(param));
		if ($scope.app != "kbcalculator")
			$scope.updateDI();
	}
	param = Parameter.get(get_params, "stickY");
	if (param) {
		$scope.stick.Y = Math.floor(parseFloat(param));
		if ($scope.app != "kbcalculator")
			$scope.updateDI();
	}
  //  param = Parameter.get(get_params, "DI");
  //  if (param) {
		//$scope.di = parseFloat(param);
		//if ($scope.app != "kbcalculator")
		//	$scope.updateDI();
  //  }
  //  param = Parameter.get(get_params, "noDI");
  //  if (param) {
		//$scope.noDI = param == 1;
		//if ($scope.app != "kbcalculator")
		//	$scope.updateDI();
  //  }
    param = Parameter.get(get_params, "counteredDamage");
    if (param) {
        $scope.counteredDamage = param;
    }
    param = Parameter.get(get_params, "counterMult");
    if (param) {
        $scope.counterMult = param;
    }
    param = Parameter.get(get_params, "unblockable");
    if (param) {
        $scope.unblockable = param == 1;
    }
    param = Parameter.get(get_params, "stage");
    if (param) {
        if (!checkUndefined($scope.stageName)) {
            $scope.stageName = param;
            $scope.getStage();
        }
    }
    param = Parameter.get(get_params, "positionX");
    if (param) {
        if (!checkUndefined($scope.position_x)) {
            $scope.position_x = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "positionY");
    if (param) {
        if (!checkUndefined($scope.position_y)) {
            $scope.position_y = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "stockDif");
    if (param) {
        $scope.stock_dif = param;
    }
    param = Parameter.get(get_params, "gameMode");
    if (param) {
        $scope.format = param;
    }
    param = Parameter.get(get_params, "visGameMode");
    if (param) {
        $scope.game_mode = param;
    }
    param = Parameter.get(get_params, "visInverse");
    if (param) {
        if (!checkUndefined($scope.inverseX)) {
            $scope.inverseX = param == 1;
        }
    }
    param = Parameter.get(get_params, "visSurface");
    if (param) {
        if ($scope.surface != undefined) {
            $scope.surface = param == 1;
        }
    }
    param = Parameter.get(get_params, "pDI");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.di = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHitstun");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstun = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pMinLSI");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.lsi_min = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pMaxLSI");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.lsi_max = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pDecay");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.decay = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pLaunchSpeed");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.launch_speed = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pGMult");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.gravity.mult = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pGConst");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.gravity.constant = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHitlagMult");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitlag.mult = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHitlagConst");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitlag.constant = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHCdodgef");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.frames.airdodge = Math.floor(parseFloat(param));
        }
    }
    param = Parameter.get(get_params, "pHCdodgem");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.launchSpeed.airdodge = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHCaerialf");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.frames.airdodge = Math.floor(parseFloat(param));
        }
    }
    param = Parameter.get(get_params, "pHCaerialm");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.launchSpeed.airdodge = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pParalConst");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.paralyzer.constant = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pParalMult");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.paralyzer.mult = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "damageDealt");
    if (param) {
        if ($scope.attacker_damage_dealt != undefined) {
            $scope.attacker_damage_dealt = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "kbDealt");
    if (param) {
        if ($scope.attacker_kb_dealt != undefined) {
            $scope.attacker_kb_dealt = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "damageReceived");
    if (param) {
        if ($scope.target_damage_taken != undefined) {
            $scope.target_damage_taken = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "kbReceived");
    if (param) {
        if ($scope.target_kb_received != undefined) {
            $scope.target_kb_received = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "weight");
    if (param) {
        if ($scope.target_weight != undefined) {
            $scope.target_weight = Math.floor(parseFloat(param));
        }
    }
    param = Parameter.get(get_params, "gravity");
    if (param) {
        if ($scope.target_gravity != undefined) {
            $scope.target_gravity = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "fallSpeed");
    if (param) {
        if ($scope.target_fall_speed != undefined) {
            $scope.target_fall_speed = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "traction");
    if (param) {
        if ($scope.target_traction != undefined) {
            $scope.target_traction = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "setWeight");
    if (param) {
        if ($scope.set_weight != undefined) {
            $scope.set_weight = param == 1;
        }
    }
    param = Parameter.get(get_params, "theme");
    if (param) {
        $scope.theme = param;
        $scope.changeTheme();
    }
    param = Parameter.get(get_params, "KB");
    if (param) {
        if ($scope.kb != undefined) {
            $scope.kb = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "chargeFrames");
    if (param) {
        $scope.smashCharge = parseFloat(param);
        $scope.updateCharge();
    }
    param = Parameter.get(get_params, "launchRate");
    if (param) {
        if ($scope.launch_rate != undefined) {
            $scope.launch_rate = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "useLandingLag");
    if (param) {
        $scope.delayed_landing_lag = param;
	}
	param = Parameter.get(get_params, "isFinishingTouch");
	if (param) {
		if ($scope.isFinishingTouch != undefined) {
			$scope.isFinishingTouch = param == 1;
		}
	}
	param = Parameter.get(get_params, "1v1");
	if (param) {
		if ($scope.is_1v1 != undefined) {
			$scope.is_1v1 = param == 1;
		}
	}
	param = Parameter.get(get_params, "shorthop");
	if (param) {
		if ($scope.shorthop_aerial != undefined) {
			$scope.delayed_shorthop_aerial = param == 1;
			$scope.updateAttackData();
		}
	}
	param = Parameter.get(get_params, "isAerial");
	if (param) {
		if ($scope.is_aerial_move != undefined) {
			$scope.is_aerial_move = param == 1;
			$scope.updateAttackData();
		}
	}
	param = Parameter.get(get_params, "ignoreStale");
	if (param) {
		if ($scope.ignoreStale != undefined) {
			$scope.ignoreStale = param == 1;
			$scope.updateAttackData();
		}
	}
	param = Parameter.get(get_params, "addHitstun");
	if (param) {
		if ($scope.addHitstun != undefined) {
			$scope.addHitstun = parseFloat(param);
		}
	}
}

var styleList = [];

LoadJsonFromPathSync("./css/themes.json", function (data) {
    styleList = data;
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

        this.SelectedMove = new Move(-1);
        this.GameVariables = new GameVariables();

        this.CounteredDamage = 0;
        this.MoveEffectsList = effects;

        this.VisualizerOptions = new VisualizerOptions();

        this.StageList = getStages();
        this.Stage = this.StageList.filter(s => s.stage == "Final Destination")[0];
        this.StageName = this.Stage.stage;
        
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
                this.SelectedMove.Effect = "bury";
            }
            else {
                let match = effects.filter(e => e.id == this.SelectedMove.Effect);
                if (match.length == 0) {
                    this.SelectedMove.Effect = "none";
				}
            }

            this.GameVariables.ChargeFrames = 0;
            this.GameVariables.SmashChargeMaxFrames = 60;
            this.GameVariables.SmashChargeMaxDamageMultiplier = 1.4;
            this.GameVariables.SelectedHitframe = this.SelectedMove.StartFrame;
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
		}

        //Calculator
        this.Calculate = function () {
            
            var is1v1 = this.GameVariables.GameSettings.Players == "2";
            var electric = this.SelectedMove.Effect == "electric";
            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;
            var crouchHitlag = this.GameVariables.Crouching ? parameters.crouch_hitlag : 1;

            var paralyzer = this.SelectedMove.Effect == "paralyze";
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
                    this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.SelectedMove.SetWeight, this.GameVariables.Stick, this.Target.Modifier.name == "Character Inhaled", this.GameVariables.GameSettings.LaunchRate);
                vskb.addModifier(this.Attacker.Modifier.KBDealtMultiplier);
                vskb.addModifier(this.Target.Modifier.KBReceivedMultiplier);
            }
            else {
                vskb = WeightBasedKB(this.SelectedMove.SetWeight ? 100 : this.Target.Attributes.Weight, this.SelectedMove.BKB, this.SelectedMove.FKB, this.SelectedMove.KBG, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, r, this.TargetPercent.Percent,
                    StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, this.SelectedMove.Effect == "electric", this.SelectedMove.SetWeight, this.GameVariables.Stick, this.Target.Modifier.name == "Character Inhaled", 1);
            }

            var damageSpeedUpFrames = [];

            if (vskb.tumble && this.SelectedMove.FKB == 0) {
                damageSpeedUpFrames = DamageSpeedUpFrames(Math.max(0, FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun), vskb.angle);
            }

            var distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.tumble, Math.max(0, vskb.hitstun + this.SelectedMove.AdditionalHitstun), damageSpeedUpFrames, this.SelectedMove.FKB != 0, vskb.angle, vskb.damageflytop, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, (this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.SelectedMove.MoveRef.FAF) - this.GameVariables.SelectedHitframe, this.Target.Attributes.FallSpeed * this.Target.Modifier.FallSpeedMultiplier, this.Target.Attributes.DamageFlyTopFallSpeed, this.Target.Attributes.GroundFriction * this.Target.Modifier.GroundFrictionMultiplier, this.VisualizerOptions.InvertX, !this.GameVariables.OpponentInAir, this.VisualizerOptions.Position, this.Stage, true, parseFloat(this.VisualizerOptions.AdditionalFramesAfterHitstun));

            var damageWithout1v1 = damage;

            var lumaDamage = damage;
            if (is1v1) {
                damage *= 1.2;
            }
            damage *= this.Attacker.Modifier.DamageDealtMultiplier
            damage *= InkDamageMult(this.GameVariables.InkValue);

            var v_hc = HitstunCancel(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.angle, this.SelectedMove.Flinchless, electric, this.SelectedMove.AdditionalHitstun);

            var damageList = [];
            var kbList = [];
            var shieldList = [];

            //Calculation results

            if (!this.GameVariables.StalenessDisabled) {
                if (staleMult > 1) {
                    damageList.push(new Result("Freshness bonus", "x" + staleMult));
                } else {
                    damageList.push(new Result("Stale-move negation", "x" + staleMult));
                }

            }
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
            if (this.GameVariables.InkValue) {
                damageList.push(new Result("Ink damage multiplier", "x" + +InkDamageMult(this.GameVariables.InkValue).toFixed(4)));
            }
            if (this.Attacker.name == "Lucario") {
                damageList.push(new Result("Aura", "x" + +Aura(this.AttackerPercent.Percent, this.GameVariables.GameSettings.AttackerStockDifference, this.GameVariables.GameSettings.Players).toFixed(6)));
            }
            if (this.SelectedMove.MoveRef.IsSmashAttack) {
                damageList.push(new Result("Charged Smash", "x" + +ChargeSmashMultiplier(this.GameVariables.ChargeFrames, megamanFsmash, this.GameVariables.WitchTimeActive, this.GameVariables.SmashChargeMaxDamageMultiplier).toFixed(6)));
            }
            if (this.Attacker.Modifier.BaseDamageMultiplier != 1) {
                damageList.push(new Result("Base damage multiplier", "x" + +this.Attacker.Modifier.BaseDamageMultiplier.toFixed(6)));
            }
            if (preDamage != 0) {
                damageList.push(new Result("Before launch damage", "+" + +(preDamage * staleMult).toFixed(6) + "%"));
            }
            damageList.push(new Result("Damage", +StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled).toFixed(6) + "%"));
            damageList.push(new Result("Target's %", +(this.TargetPercent.Percent + (preDamage * staleMult) + StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled)).toFixed(6) + "%"));
            if (!paralyzer) {
                damageList.push(new Result("Attacker Hitlag", Hitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.MoveRef.IsProjectile ? 0 : this.SelectedMove.Hitlag, electric, 1, this.SelectedMove.MoveRef.IsProjectile)));
                damageList.push(new Result("Target Hitlag", Hitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, crouchHitlag, this.SelectedMove.MoveRef.IsProjectile)));
            } else {
                damageList.push(new Result("Attacker Hitlag", ParalyzerHitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.MoveRef.IsProjectile ? 0 : this.SelectedMove.Hitlag, 1)));
            }
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
            if (!this.GameVariables.StalenessDisabled)
                kbList.push(new Result("Rage", "x" + +Rage(this.AttackerPercent.Percent).toFixed(6)));
            kbList.push(new Result("Total KB", +vskb.kb.toFixed(6)));
            if (this.GameVariables.Buried) {
                kbList.push(new Result("Buried removed", vskb.kb >= parameters.buried_kb_threshold ? "Yes" : "No"));
            }
            kbList.push(new Result("Launch angle", +vskb.angle.toFixed(6)));
            if (paralyzer) {
                kbList.push(new Result("Paralysis time", ParalysisTime(vskb.kb, damage, this.SelectedMove.Hitlag, crouchHitlag)));
            }
            if (this.SelectedMove.Effect == "flower") {
                kbList.push(new Result("Flower time", FlowerTime(StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled))));
            }
            if (this.SelectedMove.Effect == "bury") {
                kbList.push(new Result("Buried time", BuriedTime(this.TargetPercent.Percent + StaleDamage(preDamage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb, this.GameVariables.GameSettings.AttackerStockDifference)));
            }
            if (this.SelectedMove.Effect == "sleep") {
                kbList.push(new Result("Sleep time", SleepTime(this.TargetPercent.Percent + StaleDamage(preDamage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb, this.GameVariables.GameSettings.AttackerStockDifference)));
            }
            if (this.SelectedMove.Effect == "freeze") {
                kbList.push(new Result("Freeze time", FreezeTime(StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb)));
            }
            if (this.SelectedMove.Effect == "bind") {
                kbList.push(new Result("Stun time", StunTime(vskb.kb)));
            }
            if (this.SelectedMove.Effect == "bind_extra") {
                kbList.push(new Result("Disable time", DisableTime(this.TargetPercent.Percent + StaleDamage(preDamage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), vskb.kb, this.GameVariables.GameSettings.AttackerStockDifference)));
            }

            var hitstun = Math.max(0, vskb.hitstun + this.SelectedMove.AdditionalHitstun);

            if (FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) >= 32 && this.SelectedMove.FKB == 0 && vskb.tumble) {
                var speedUpFAF = damageSpeedUpFrames[damageSpeedUpFrames.length - 1];

                hitstun = speedUpFAF - 1;

                kbList.push(new Result("Hitstun", speedUpFAF - 1));
                kbList.push(new Result("FAF", speedUpFAF));

                kbList.push(new Result("Using launch speed up", "Yes"));
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

            kbList.push(new Result("Tumble", vskb.tumble ? "Yes" : "No"));

            kbList.push(new Result("Reeling", vskb.reeling ? "30%" : "0%", !vskb.reeling));

            if (!this.GameVariables.OpponentInAir) {
                kbList.push(new Result("Can Jab lock", vskb.can_jablock ? "Yes" : "No"));
            }

            kbList.push(new Result("LSI", +vskb.lsi.toFixed(6), vskb.lsi == 1));
            kbList.push(new Result("Horizontal Launch Speed", +vskb.horizontal_launch_speed.toFixed(6)));
            kbList.push(new Result("Gravity boost", +vskb.add_gravity_speed.toFixed(6), vskb.add_gravity_speed == 0));
            kbList.push(new Result("Vertical Launch Speed", vskb.vertical_launch_speed));
            kbList.push(new Result("Launch Speed", +vskb.total_launch_speed.toFixed(6)));

            kbList.push(new Result("Hit Advantage", HitAdvantage(hitstun, this.SelectedMove.MoveRef.IsProjectile ? this.GameVariables.SelectedHitframe + Hitlag(StaleDamage(damageWithout1v1, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, crouchHitlag) - 1 : this.GameVariables.SelectedHitframe,
                this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.SelectedMove.MoveRef.FAF, paralyzer ? ParalysisTime(vskb.kb, damage, this.SelectedMove.Hitlag, crouchHitlag) : 0)));

            if (this.Target.name == "Rosalina And Luma") {
                if (this.SelectedMove.FKB == 0) {
                    var luma_vskb = VSKB(15 + 0, baseDamage, lumaDamage, 100, this.SelectedMove.KBG, this.SelectedMove.BKB, this.Target.Attributes.Gravity, this.Target.Attributes.FallSpeed, r, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled, this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.GameVariables.Stick);
                    luma_vskb.addModifier(this.Attacker.Modifier.KBDealtMultiplier);
                    luma_vskb.addModifier(this.Target.Modifier.KBReceivedMultiplier);
                    kbList.push(new Result("Luma KB", +luma_vskb.kb.toFixed(6)));
                    kbList.push(new Result("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
                    kbList.push(new Result("Luma hitstun", LumaHitstun(luma_vskb.kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun, luma_vskb.tumble));
                } else {
                    var luma_vskb = WeightBasedKB(100, this.SelectedMove.BKB, this.SelectedMove.FKB, this.SelectedMove.KBG, this.Target.Attributes.Gravity, this.Target.Attributes.FallSpeed, r, 15 + 0, StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.GameVariables.Stick);
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
                var s = (damageOnShield * 1.19) + (this.SelectedMove.ShieldDamage * 1.19);
                var sv = (StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled) * 1.19) + (this.SelectedMove.ShieldDamage * 1.19);
                if (this.GameVariables.ShieldState != ShieldStates.Perfect) {
                    shieldList.push(new Result("Shield Damage", +sv.toFixed(6)));
                    //shieldList.push(new Result("Full HP shield", +(50 * target.modifier.shield).toFixed(6), +(50 * target.modifier.shield).toFixed(6)));
                    shieldList.push(new Result("Shield Break", sv >= 50 * this.Target.Modifier.ShieldHPMultiplier ? "Yes" : "No"));
                }

                if (!this.SelectedMove.MoveRef.IsProjectile)
                    shieldList.push(new Result("Attacker Shield Hitlag", AttackerShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect), AttackerShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect) == ShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect)));
                //if (this.GameVariables.ShieldState == ShieldStates.Perfect && this.SelectedMove.MoveRef.IsProjectile) {
                //	shieldList.push(new Result("Shield Hitlag (Training)", ShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect)));
                //	shieldList.push(new Result("Shield Hitlag (VS)", VSShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect)));
                //}
                //else {
                //	shieldList.push(new Result("Shield Hitlag", ShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect)));
                //}
                shieldList.push(new Result("Shield Hitlag", ShieldHitlag(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.Hitlag, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect)));
                shieldList.push(new Result("Shield stun multiplier", "x" + ShieldStunMultiplier(this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack), ShieldStunMultiplier(this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack) == 1));
                shieldList.push(new Result("Shield stun", ShieldStun(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.MoveRef.IsProjectile, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)));
                if (this.GameVariables.ShieldState == ShieldStates.Perfect && this.SelectedMove.MoveRef.IsProjectile) {
                    shieldList.push(new Result("Parry Advantage", ShieldAdvantage(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.Hitlag, this.GameVariables.SelectedHitframe, this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.SelectedMove.MoveRef.FAF, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)));
                }
                else {
                    shieldList.push(new Result((this.GameVariables.ShieldState == ShieldStates.Perfect ? "Parry Advantage" : "Shield Advantage"), ShieldAdvantage(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.ShieldstunMultiplier, this.SelectedMove.Hitlag, this.GameVariables.SelectedHitframe, this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.SelectedMove.MoveRef.FAF, this.SelectedMove.MoveRef.IsProjectile, this.SelectedMove.MoveRef.IsProjectileAttached, this.SelectedMove.DirectIndirect, electric, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)));
                }

                if (!this.SelectedMove.Flinchless) {
                    if (!this.SelectedMove.MoveRef.IsProjectile)
                        shieldList.push(new Result("Attacker shield pushback", +AttackerShieldPushback(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled)).toFixed(6)));

                    shieldList.push(new Result("Target shield pushback", +(ShieldPushback(StaleDamage(damageOnShield, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.SelectedMove.MoveRef.IsProjectile, this.GameVariables.ShieldState == ShieldStates.Perfect, this.SelectedMove.MoveRef.IsSmashAttack, this.SelectedMove.MoveRef.IsAerialAttack)).toFixed(6), sv >= 50 * this.Target.Modifier.ShieldHPMultiplier));
                }
            } else {
                shieldList.push(new Result("Unblockable attack", "Yes"));
            }


            this.Visualizer.SetStage(this.Stage);
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
            var electric = this.SelectedMove.Effect == "electric";
            var r = this.GameVariables.Crouching ? parameters.crouch_cancelling : 1;
            var crouchHitlag = this.GameVariables.Crouching ? parameters.crouch_hitlag : 1;

            var paralyzer = this.SelectedMove.Effect == "paralyze";
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
            var electric = this.SelectedMove.Effect == "electric";
            if (this.SelectedMove.FKB == 0) {
                vskb = VSKB(this.TargetPercent.Percent + (preDamage * staleMult), baseDamage, damage, this.SelectedMove.SetWeight ? 100 : this.Target.Attributes.Weight,
                    this.SelectedMove.KBG, this.SelectedMove.BKB, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, r, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled,
                    this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, electric, this.SelectedMove.SetWeight, this.GameVariables.Stick, this.Target.Modifier.name == "Character Inhaled", this.GameVariables.GameSettings.LaunchRate);
                vskb.addModifier(this.Attacker.Modifier.KBDealtMultiplier);
                vskb.addModifier(this.Target.Modifier.KBReceivedMultiplier);
            }
            else {
                vskb = WeightBasedKB(this.SelectedMove.SetWeight ? 100 : this.Target.Attributes.Weight, this.SelectedMove.BKB, this.SelectedMove.FKB, this.SelectedMove.KBG, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, r, this.TargetPercent.Percent,
                    StaleDamage(damage, this.GameVariables.StaleQueue, this.GameVariables.ShieldStaleQueue, this.GameVariables.StalenessDisabled), this.AttackerPercent.Percent, this.SelectedMove.Angle, this.GameVariables.OpponentInAir, this.SelectedMove.Flinchless, this.SelectedMove.Effect == "electric", this.SelectedMove.SetWeight, this.GameVariables.Stick, this.Target.Modifier.name == "Character Inhaled", 1);
            }

            let damageSpeedUpFrames = [];
            if (vskb.tumble && this.SelectedMove.FKB == 0) {
                damageSpeedUpFrames = DamageSpeedUpFrames(Math.max(0, FirstActionableFrame(vskb.base_kb, this.SelectedMove.Flinchless, electric) + this.SelectedMove.AdditionalHitstun), vskb.angle);
            }

            let distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.tumble, Math.max(0, vskb.hitstun + this.SelectedMove.AdditionalHitstun), damageSpeedUpFrames, this.SelectedMove.FKB != 0, vskb.angle, vskb.damageflytop, this.Target.Attributes.Gravity * this.Target.Modifier.GravityMultiplier, this.Target.Attributes.DamageFlyTopGravity, (this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.LandingLag ? this.GameVariables.LandingFrame + this.SelectedMove.MoveRef.LandingLag : this.GameVariables.AerialFrameAdvantageType == AerialFrameAdvCalculation.Autocancel ? this.GameVariables.LandingFrame + this.Attacker.Attributes.HardLandingLag : this.SelectedMove.MoveRef.FAF) - this.GameVariables.SelectedHitframe, this.Target.Attributes.FallSpeed * this.Target.Modifier.FallSpeedMultiplier, this.Target.Attributes.DamageFlyTopFallSpeed, this.Target.Attributes.GroundFriction * this.Target.Modifier.GroundFrictionMultiplier, this.VisualizerOptions.InvertX, !this.GameVariables.OpponentInAir, this.VisualizerOptions.Position, this.Stage, true, parseFloat(this.VisualizerOptions.AdditionalFramesAfterHitstun), false);

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

        this.UpdateAttack();

        if (this.Visualizer) {
            this.Visualizer.SetStage(this.Stage);
            this.UpdateStage();
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
