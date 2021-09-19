var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
	$scope.app = 'calculator';

	//App list
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;

	//Initialize calculator
	$scope.Calculator = new Calculator($scope, function () {
		$scope.results = this.Calculate();
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

	$scope.Calculator.Update();
});
