var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
	$scope.app = 'kocalculator';

	stageData = stageData.filter(s => s.stage != "No stage");

	//App list
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;

	//Initialize calculator
	$scope.Calculator = new Calculator($scope, function () {
		this.Visualizer.SetLaunch(new LaunchData([{ x: this.VisualizerOptions.Position.x, y: this.VisualizerOptions.Position.y }], { x: this.VisualizerOptions.Position.x, y: this.VisualizerOptions.Position.y }, [], -1, -1, -1, -1, -1));
	}, document.getElementById("visualizerCanvas"));
	//Set stick canvas
	$scope.Calculator.SetStickCanvas('stickCanvas');
	$scope.Calculator.VisualizerOptions.AdditionalFramesAfterHitstun = 0;

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

	$scope.CalculateKOPercent = function () {
		$scope.results = $scope.Calculator.CalculateKOPercent();
	}

	$scope.CalculateKOPercentBasedDI = function () {
		$scope.results = $scope.Calculator.CalculateKOPercentBasedDI();
	}

	$scope.CalculateKOPercentForBestWorstDI = function (bestDI) {
		$scope.results = $scope.Calculator.CalculateKOPercentForBestWorstDI(bestDI);
	}

	$scope.CalculateDIVectorField = function () {
		$scope.Calculator.CalculateDIVectorField();
	}

	$scope.Calculator.Update();
});
