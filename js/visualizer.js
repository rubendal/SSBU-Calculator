class DataPoint {
	constructor(vertex, text, color) {
		this.vertex = vertex;
		this.position = {
			x: vertex.x,
			y: -vertex.y
		};
		this.vertex.x = +this.vertex.x.toFixed(6);
		this.vertex.y = +this.vertex.y.toFixed(6);
		this.text = text.replace(/%x/g, this.vertex.x).replace(/%y/g, this.vertex.y);
		if (color == undefined)
			this.color = "#000000";
		else
			this.color = color;
	}
}

class Visualizer {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.scale = 1;
		this.origin = { x: 0, y: 0 };
		this.dragging = false;
		this.prevPosition = { x: 0, y: 0 };

		this.size = 40;
		this.canvas.width = this.size * 16;
		this.canvas.height = this.size * 9;
		this.canvasSize = { width: this.canvas.width, height: this.canvas.height };

		this.stage = null;
		this.launch = null;
		this.storedLaunches = [];
		this.diLines = null;

		this.dataPoints = [];
		this.launchPoints = [];
		this.diPoints = [];

		this.background = null;

		this.prevTranslate = { x: 0, y: 0 };
		this.prevScale = 1;

		//Touch variables
		this.prevTouch = null;
		this.prevTouch2 = null;

		this.isClick = false;
		this.isZoomingTouch = false;

		var visualizer = this;

		this.SetSize = function (size) {
			this.size = size;
			this.canvas.width = this.size * 16;
			this.canvas.height = this.size * 9;
			this.canvasSize = { width: this.canvas.width, height: this.canvas.height };
			this.Reset();
			this.Draw();
		}

		this.Reset = function () {
			//Reset transform matrix
			this.context.setTransform(1, 0, 0, 1, 0, 0);

			//reset variables
			this.prevTranslate = { x: 0, y: 0 };
			this.prevScale = 1;
			this.origin = { x: 0, y: 0 };
			this.scale = 1;

			this.context.translate(this.canvasSize.width / 2, this.canvasSize.height / 2);

			this.prevTranslate.x += this.canvasSize.width / 2;
			this.prevTranslate.y += this.canvasSize.height / 2;

			this.origin.x += -this.canvasSize.width / 2;
			this.origin.y += -this.canvasSize.height / 2;
		}

		this.Reset();

		this.SetBackground = function (color) {
			this.background = color;
			this.ClearCanvas();
			this.Draw();
		}

		this.ClearCanvas = function () {
			this.context.save();
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			if (this.background) {
				this.context.fillStyle = this.background;
				this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			}

			this.context.strokeStyle = "#000000";
			this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

			this.context.restore();
		}

		this.GetCanvasPoint = function (x, y) {
			return { x: x, y: y };
		}

		this.MoveTo = function (x, y) {
			this.context.moveTo(x, -y);
		}

		this.LineTo = function (x, y) {
			this.context.lineTo(x, -y);
		}

		this.SetStage = function (stage) {
			this.stage = stage;

			this.dataPoints = [];

			if (stage == null)
				return;

			for (var i = 0; i < stage.collisions.length; i++) {
				for (var j = 0; j < stage.collisions[i].vertex.length - 1; j++) {

					this.dataPoints.push(new DataPoint({ x: stage.collisions[i].vertex[j][0], y: stage.collisions[i].vertex[j][1] }, "%x, %y", settings.visualizer_colors.stage));

					var collisionType = GetLineType(stage.collisions[i].materials[j]);
					var collisionText = "Floor";

					if (collisionType == LineTypes.WALL)
						collisionText = "Wall";
					else if (collisionType == LineTypes.CEILING)
						collisionText = "Ceiling";

					if (stage.collisions[i].materials[j].noWallJump && collisionType == LineTypes.WALL) {
						collisionText = "Wall jump disabled";
						this.dataPoints.push(new DataPoint(LineMidPoint({ x: stage.collisions[i].vertex[j][0], y: stage.collisions[i].vertex[j][1] },
							{ x: stage.collisions[i].vertex[j + 1][0], y: stage.collisions[i].vertex[j + 1][1] }), collisionText, settings.visualizer_colors.noWallJump));
					}

					//if ((collisionType == LineTypes.WALL || collisionType == LineTypes.CEILING) && stage.collisions[i].materials[j].length <= 7 && !stage.collisions[i].materials[j].noWallJump) {
					//	collisionText = "Semi-techable wall";
					//	this.dataPoints.push(new DataPoint(LineMidPoint({ x: stage.collisions[i].vertex[j][0], y: stage.collisions[i].vertex[j][1] },
					//		{ x: stage.collisions[i].vertex[j + 1][0], y: stage.collisions[i].vertex[j + 1][1] }), collisionText, settings.visualizer_colors.semitechable));
					//}



				}
				if ((stage.collisions[i].vertex[stage.collisions[i].vertex.length - 1][0] != stage.collisions[i].vertex[0][0]) ||
					stage.collisions[i].vertex[stage.collisions[i].vertex.length - 1][1] != stage.collisions[i].vertex[0][1]) {

					this.dataPoints.push(new DataPoint({ x: stage.collisions[i].vertex[stage.collisions[i].vertex.length - 1][0], y: stage.collisions[i].vertex[stage.collisions[i].vertex.length - 1][1] }, "%x, %y", settings.visualizer_colors.stage));

				}

			}

			if (stage.platforms !== undefined) {
				for (var i = 0; i < stage.platforms.length; i++) {
					for (var j = 0; j < stage.platforms[i].vertex.length - 1; j++) {

						this.dataPoints.push(new DataPoint({ x: stage.platforms[i].vertex[j][0], y: stage.platforms[i].vertex[j][1] }, stage.platforms[i].name + " (%x, %y)", settings.visualizer_colors.platform));



						//this.dataPoints.push(new DataPoint(LineMidPoint({ x: stage.platforms[i].vertex[j][0], y: stage.platforms[i].vertex[j][1] },
						//	{ x: stage.platforms[i].vertex[j + 1][0], y: stage.platforms[i].vertex[j + 1][1] }), stage.platforms[i].name, settings.visualizer_colors.platform));


					}
					if ((stage.platforms[i].vertex[stage.platforms[i].vertex.length - 1][0] != stage.platforms[i].vertex[0][0]) ||
						stage.platforms[i].vertex[stage.platforms[i].vertex.length - 1][1] != stage.platforms[i].vertex[0][1]) {

						this.dataPoints.push(new DataPoint({ x: stage.platforms[i].vertex[stage.platforms[i].vertex.length - 1][0], y: stage.platforms[i].vertex[stage.platforms[i].vertex.length - 1][1] }, stage.platforms[i].name + " (%x, %y)", settings.visualizer_colors.platform));

					}



				}
			}

			this.dataPoints.push(new DataPoint({ x: stage.camera[0], y: stage.camera[2] }, "Camera bounds (%x, %y)", settings.visualizer_colors.camera));
			this.dataPoints.push(new DataPoint({ x: stage.camera[1], y: stage.camera[2] }, "Camera bounds (%x, %y)", settings.visualizer_colors.camera));
			this.dataPoints.push(new DataPoint({ x: stage.camera[1], y: stage.camera[3] }, "Camera bounds (%x, %y)", settings.visualizer_colors.camera));
			this.dataPoints.push(new DataPoint({ x: stage.camera[0], y: stage.camera[3] }, "Camera bounds (%x, %y)", settings.visualizer_colors.camera));

			this.dataPoints.push(new DataPoint({ x: stage.blast_zones[0], y: stage.blast_zones[2] }, "Blast zone (%x, %y)", settings.visualizer_colors.blastzone));
			this.dataPoints.push(new DataPoint({ x: stage.blast_zones[1], y: stage.blast_zones[2] }, "Blast zone (%x, %y)", settings.visualizer_colors.blastzone));
			this.dataPoints.push(new DataPoint({ x: stage.blast_zones[1], y: stage.blast_zones[3] }, "Blast zone (%x, %y)", settings.visualizer_colors.blastzone));
			this.dataPoints.push(new DataPoint({ x: stage.blast_zones[0], y: stage.blast_zones[3] }, "Blast zone (%x, %y)", settings.visualizer_colors.blastzone));

			this.dataPoints.push(new DataPoint({ x: stage.blast_zones[0], y: 0 }, "Left Blast zone (%x)", settings.visualizer_colors.blastzone));
			this.dataPoints.push(new DataPoint({ x: stage.blast_zones[1], y: 0 }, "Right Blast zone (%x)", settings.visualizer_colors.blastzone));
			this.dataPoints.push(new DataPoint({ x: 0, y: stage.blast_zones[2] }, "Top Blast zone (%y)", settings.visualizer_colors.blastzone));
			this.dataPoints.push(new DataPoint({ x: 0, y: stage.blast_zones[3] }, "Bottom Blast zone (%y)", settings.visualizer_colors.blastzone));

			if (stage.camera[3] - 25 >= stage.blast_zones[3])
				this.dataPoints.push(new DataPoint({ x: 0, y: stage.camera[3] - 25 }, "Special blast zone for meteor smashed opponents (%y)", settings.visualizer_colors.meteorBlastzone));


			this.ClearCanvas();
			this.Draw();
		}

		this.SetLaunch = function (launch) {

			this.launch = launch;

			this.launchPoints = [];

			if (launch == null)
				return;

			var style = settings.visualizer_colors.upward;

			var collisions = [];
			var collisionsData = [];
			for (var i = 0; i < launch.collisions.length; i++) {
				if (launch.collisions[i].collisionOccurred) {
					collisions.push(launch.collisions[i].frame);
					collisionsData.push(launch.collisions[i]);
				}
			}

			var techString = "";

			for (var i = 0; i < launch.positions.length; i++) {
				if (collisions.indexOf(i - 1) == -1) {
					techString = "";
					if (i <= launch.hitstun) {
						if (i < launch.airdodgeCancel) {
							if (i < launch.positions.length - 1) {
								if (launch.positions[i].y > launch.positions[i + 1].y) {
									style = settings.visualizer_colors.downward;
								} else {
									style = settings.visualizer_colors.upward;
								}
							}
						} else {
							if (i < launch.aerialCancel) {
								style = settings.visualizer_colors.aerial;
							}
							else {
								style = settings.visualizer_colors.airdodge;
							}
						}
					} else {
						style = settings.visualizer_colors.actionable;
					}
				} else {
					var collisionIndex = collisions.indexOf(i-1);
					if (collisionsData[collisionIndex].collision_data.techable) {
						style = settings.visualizer_colors.techable;
						techString = " Techable";
					//} else if (collisionsData[collisionIndex].collision_data.techable.onCollision) {
					//	style = settings.visualizer_colors.techableOnlyCollision;
					//	techString = " Techable only during collision";
					} else {
						style = settings.visualizer_colors.untechable;
						techString = " Untechable";
					}
					techString += " (Speed: " + +collisionsData[collisionIndex].collision_data.totalLaunchSpeed.toFixed(4) + ")";
				}
				if (i == 0)
					this.launchPoints.push(new DataPoint(launch.positions[i], "Launch position (%x, %y)" + techString, style));
				else
					this.launchPoints.push(new DataPoint(launch.positions[i], "Frame " + i + " (%x, %y)" + techString, style));

				if (i == launch.hitstun)
					this.launchPoints.push(new DataPoint(launch.positions[launch.hitstun], "Frame " + launch.hitstun + " Hitstun end", settings.visualizer_colors.hitstunEnd));

				if (i == launch.faf)
					this.launchPoints.push(new DataPoint(launch.positions[launch.faf], "Frame " + launch.faf + " Attacker's FAF", settings.visualizer_colors.attackerFAF));

				if (i == launch.KOFrame)
					this.launchPoints.push(new DataPoint(launch.positions[launch.KOFrame], "Frame " + launch.KOFrame + " KO", settings.visualizer_colors.ko));

			}




			this.ClearCanvas();
			this.Draw();
		}


		this.SetStoredLaunches = function (storedLaunches) {
			this.storedLaunches = storedLaunches;

			if (storedLaunches == null)
				this.storedLaunches = [];

			this.ClearCanvas();
			this.Draw();
		}

		this.StoreLaunch = function () {
			this.storedLaunches.push(this.launch);

			this.ClearCanvas();
			this.Draw();
		}

		this.ClearStoredLaunches = function () {
			this.storedLaunches = [];

			this.ClearCanvas();
			this.Draw();
		}


		this.SetDILines = function (lines) {

			this.diLines = lines;

			this.diPoints = [];

			if (lines == null)
				return;

			var style = settings.visualizer_colors.diLine;

			for (var i = 0; i < lines.length; i++) {
				if (!lines[i].interpolated)
					style = settings.visualizer_colors.diLine;
				else
					style = settings.visualizer_colors.interpolatedLine;

				if (lines[i].angle >= 0)
					this.diPoints.push(new DataPoint(lines[i].position, "Best DI angle " + lines[i].angle + " (%x, %y)", style));
				else if (lines[i].angle == -2)
					this.diPoints.push(new DataPoint(lines[i].position, "KO's without tumble (%x, %y)", style));
				else if (lines[i].angle == -1)
					this.diPoints.push(new DataPoint(lines[i].position, "KO's at 0% (%x, %y)", style));

			}

			this.ClearCanvas();
			this.Draw();
		}

		this.Draw = function () {

			this.DrawGrid();

			var stage = this.stage;
			var context = this.context;
			var launch = this.launch;

			context.lineWidth = 2 / context.prevScale;

			if (this.stage != null) {

				for (var i = 0; i < stage.collisions.length; i++) {
					context.strokeStyle = settings.visualizer_colors.stage;
					context.beginPath();
					for (var j = 0; j < stage.collisions[i].vertex.length - 1; j++) {
						if (j == 0)
							this.MoveTo(stage.collisions[i].vertex[j][0], stage.collisions[i].vertex[j][1]);
						else
							this.LineTo(stage.collisions[i].vertex[j][0], stage.collisions[i].vertex[j][1]);


					}
					this.LineTo(stage.collisions[i].vertex[j][0], stage.collisions[i].vertex[j][1]);

					context.stroke();
				}


				for (var i = 0; i < stage.collisions.length; i++) {
					context.strokeStyle = settings.visualizer_colors.stage;
					for (var j = 0; j < stage.collisions[i].vertex.length - 1; j++) {


						if (stage.collisions[i].materials[j].noWallJump) {
							//Wall jump disabled walls
							context.strokeStyle = settings.visualizer_colors.noWallJump;
							context.beginPath();
							this.MoveTo(stage.collisions[i].vertex[j][0], stage.collisions[i].vertex[j][1]);
							this.LineTo(stage.collisions[i].vertex[j + 1][0], stage.collisions[i].vertex[j + 1][1]);
							context.closePath();
							context.stroke();
						}
						//else if (stage.collisions[i].materials[j].length <= 7 && (stage.collisions[i].materials[j].wall || stage.collisions[i].materials[j].ceiling) && !stage.collisions[i].materials[j].noWallJump) {
						//	//Small walls
						//	context.strokeStyle = settings.visualizer_colors.semitechable;
						//	context.beginPath();
						//	this.MoveTo(stage.collisions[i].vertex[j][0], stage.collisions[i].vertex[j][1]);
						//	this.LineTo(stage.collisions[i].vertex[j + 1][0], stage.collisions[i].vertex[j + 1][1]);
						//	context.closePath();
						//	context.stroke();
						//}



					}


				}

				context.strokeStyle = settings.visualizer_colors.platform;

				if (stage.platforms !== undefined) {
					for (var i = 0; i < stage.platforms.length; i++) {
						context.beginPath();
						for (var j = 0; j < stage.platforms[i].vertex.length - 1; j++) {
							if (j == 0)
								this.MoveTo(stage.platforms[i].vertex[j][0], stage.platforms[i].vertex[j][1]);

							this.LineTo(stage.platforms[i].vertex[j + 1][0], stage.platforms[i].vertex[j + 1][1]);

						}
						context.closePath();
						context.stroke();

					}
				}

				context.strokeStyle = settings.visualizer_colors.camera;
				context.beginPath();
				this.MoveTo(stage.camera[0], stage.camera[2]);
				this.LineTo(stage.camera[1], stage.camera[2]);
				this.LineTo(stage.camera[1], stage.camera[3]);
				this.LineTo(stage.camera[0], stage.camera[3]);
				context.closePath();
				context.stroke();

				context.strokeStyle = settings.visualizer_colors.blastzone;
				context.beginPath();
				this.MoveTo(stage.blast_zones[0], stage.blast_zones[2]);
				this.LineTo(stage.blast_zones[1], stage.blast_zones[2]);
				this.LineTo(stage.blast_zones[1], stage.blast_zones[3]);
				this.LineTo(stage.blast_zones[0], stage.blast_zones[3]);
				context.closePath();
				context.stroke();

				//Blast zone for meteors
				if (stage.camera[3] - 20 > stage.blast_zones[3]) {
					context.strokeStyle = settings.visualizer_colors.meteorBlastzone;
					context.beginPath();
					this.MoveTo(stage.blast_zones[0], stage.camera[3] - 25);
					this.LineTo(stage.blast_zones[1], stage.camera[3] - 25);
					context.closePath();
					context.stroke();
				}

				if (stage.name == "Training Stage") {
					context.strokeStyle = "#1ab500"; //FD blast zones
					context.beginPath();
					this.MoveTo(-240, 180);
					this.LineTo(240.000031, 180);
					this.LineTo(240.000031, -140);
					this.LineTo(-240, -140);
					context.closePath();
					context.stroke();

					context.strokeStyle = "#b2b006"; //BF blast zones
					context.beginPath();
					this.MoveTo(-240, 192.000092);
					this.LineTo(240, 192.000092);
					this.LineTo(240, -140.000031);
					this.LineTo(-240, -140.000031);
					context.closePath();
					context.stroke();
				}
			}

			context.lineWidth = 1 / visualizer.prevScale;
			if (this.launch != null) {

				var r = 3 / visualizer.prevScale;
				var r2 = 6 / visualizer.prevScale;

				var style = settings.visualizer_colors.upward;
				var prevStyle = style;

				context.strokeStyle = style;
				context.fillStyle = style;

				//Lines
				context.beginPath();

				for (var i = 0; i < launch.positions.length; i++) {
					if (i < launch.hitstun) {
						if (i < launch.airdodgeCancel) {
							if (i < launch.positions.length - 1) {
								if (launch.positions[i].y > launch.positions[i + 1].y) {
									style = settings.visualizer_colors.downward;
								} else {
									style = settings.visualizer_colors.upward;
								}
							}
						} else {
							if (i < launch.aerialCancel) {
								style = settings.visualizer_colors.aerial;
							}
							else {
								style = settings.visualizer_colors.airdodge;
							}
						}
					} else {
						style = settings.visualizer_colors.actionable;
					}

					if (style != prevStyle) {
						prevStyle = style;

						context.stroke();
						context.beginPath();
						context.strokeStyle = style;

						if (i > 0)
							this.MoveTo(launch.positions[i - 1].x, launch.positions[i - 1].y);
					}

					if (i == 0)
						this.MoveTo(launch.positions[i].x, launch.positions[i].y);
					else
						this.LineTo(launch.positions[i].x, launch.positions[i].y);

				}
				context.stroke();

				style = settings.visualizer_colors.upward;

				//Markers

				var collisions = [];
				var collisionsData = [];
				for (var i = 0; i < launch.collisions.length; i++) {
					if (launch.collisions[i].collisionOccurred) {
						collisions.push(launch.collisions[i].frame);
						collisionsData.push(launch.collisions[i]);
					}
				}

				for (var i = 0; i < launch.positions.length; i++) {

					if (collisions.indexOf(i - 1) == -1) {
						if (i <= launch.hitstun) {
							if (i < launch.airdodgeCancel) {
								if (i < launch.positions.length - 1) {
									if (launch.positions[i].y > launch.positions[i + 1].y) {
										style = settings.visualizer_colors.downward;
									} else {
										style = settings.visualizer_colors.upward;
									}
								}
							} else {
								if (i < launch.aerialCancel) {
									style = settings.visualizer_colors.aerial;
								}
								else {
									style = settings.visualizer_colors.airdodge;
								}
							}
						} else {
							style = settings.visualizer_colors.actionable;
						}
					} else {
						var collisionIndex = collisions.indexOf(i - 1);
						if (collisionsData[collisionIndex].collision_data.techable) {
							style = settings.visualizer_colors.techable;
						//} else if (collisionsData[collisionIndex].collision_data.techable.onCollision) {
						//	style = settings.visualizer_colors.techableOnlyCollision;
						} else {
							style = settings.visualizer_colors.untechable;
						}
					}

					context.fillStyle = style;
					context.beginPath();

					context.arc(launch.positions[i].x, - launch.positions[i].y, r, 0, Math.PI * 2);

					context.closePath();
					context.fill();


				}

				if (launch.hitstun < launch.positions.length && launch.hitstun >= 0) {
					context.fillStyle = settings.visualizer_colors.hitstunEnd;

					context.beginPath();

					context.arc(launch.positions[launch.hitstun].x, - launch.positions[launch.hitstun].y, r2, 0, Math.PI * 2);

					context.closePath();
					context.fill();

				}

				if (launch.faf >= 0) {
					if (launch.faf < launch.positions.length) {
						context.fillStyle = settings.visualizer_colors.attackerFAF;

						context.beginPath();

						context.arc(launch.positions[launch.faf].x, - launch.positions[launch.faf].y, r2, 0, Math.PI * 2);

						context.closePath();
						context.fill();
					}
				}

				if (launch.KOFrame != -1) {
					if (launch.KOFrame < launch.positions.length) {
						context.fillStyle = settings.visualizer_colors.ko;

						context.beginPath();

						context.arc(launch.positions[launch.KOFrame].x, - launch.positions[launch.KOFrame].y, r2, 0, Math.PI * 2);

						context.closePath();
						context.fill();
					}
				}
			}

			this.context.globalAlpha = 1;

			//Stored Launches
			if (this.storedLaunches != null) {
				this.context.globalAlpha = 0.5;
				for (var si = 0; si < this.storedLaunches.length; si++) {
					var r = 3 / visualizer.prevScale;
					var r2 = 6 / visualizer.prevScale;

					var style = settings.visualizer_colors.upward;
					var prevStyle = style;

					context.strokeStyle = style;
					context.fillStyle = style;

					//Lines
					context.beginPath();

					for (var i = 0; i < this.storedLaunches[si].positions.length; i++) {
						if (i < this.storedLaunches[si].hitstun) {
							if (i < this.storedLaunches[si].airdodgeCancel) {
								if (i < this.storedLaunches[si].positions.length - 1) {
									if (this.storedLaunches[si].positions[i].y > this.storedLaunches[si].positions[i + 1].y) {
										style = settings.visualizer_colors.downward;
									} else {
										style = settings.visualizer_colors.upward;
									}
								}
							} else {
								if (i < this.storedLaunches[si].aerialCancel) {
									style = settings.visualizer_colors.aerial;
								}
								else {
									style = settings.visualizer_colors.airdodge;
								}
							}
						} else {
							style = settings.visualizer_colors.actionable;
						}

						if (style != prevStyle) {
							prevStyle = style;

							context.stroke();
							context.beginPath();
							context.strokeStyle = style;

							if (i > 0)
								this.MoveTo(this.storedLaunches[si].positions[i - 1].x, this.storedLaunches[si].positions[i - 1].y);
						}

						if (i == 0)
							this.MoveTo(this.storedLaunches[si].positions[i].x, this.storedLaunches[si].positions[i].y);
						else
							this.LineTo(this.storedLaunches[si].positions[i].x, this.storedLaunches[si].positions[i].y);

					}
					context.stroke();

					style = settings.visualizer_colors.upward;

					//Markers

					for (var i = 0; i < this.storedLaunches[si].positions.length; i++) {
						if (i < this.storedLaunches[si].hitstun) {
							if (i < this.storedLaunches[si].airdodgeCancel) {
								if (i < this.storedLaunches[si].positions.length - 1) {
									if (this.storedLaunches[si].positions[i].y > this.storedLaunches[si].positions[i + 1].y) {
										style = settings.visualizer_colors.downward;
									} else {
										style = settings.visualizer_colors.upward;
									}
								}
							} else {
								if (i < this.storedLaunches[si].aerialCancel) {
									style = settings.visualizer_colors.aerial;
								}
								else {
									style = settings.visualizer_colors.airdodge;
								}
							}
						} else {
							style = settings.visualizer_colors.actionable;
						}
						context.fillStyle = style;
						context.beginPath();

						context.arc(this.storedLaunches[si].positions[i].x, - this.storedLaunches[si].positions[i].y, r, 0, Math.PI * 2);

						context.closePath();
						context.fill();


					}

					if (this.storedLaunches[si].hitstun < this.storedLaunches[si].positions.length) {
						context.fillStyle = settings.visualizer_colors.hitstunEnd;

						context.beginPath();

						context.arc(this.storedLaunches[si].finalPosition.x, - this.storedLaunches[si].finalPosition.y, r2, 0, Math.PI * 2);

						context.closePath();
						context.fill();

					}

					if (this.storedLaunches[si].faf >= 0) {
						if (this.storedLaunches[si].faf < this.storedLaunches[si].positions.length) {
							context.fillStyle = settings.visualizer_colors.attackerFAF;

							context.beginPath();

							context.arc(this.storedLaunches[si].positions[this.storedLaunches[si].faf].x, - this.storedLaunches[si].positions[this.storedLaunches[si].faf].y, r2, 0, Math.PI * 2);

							context.closePath();
							context.fill();
						}
					}

					if (this.storedLaunches[si].KOFrame != -1) {
						if (this.storedLaunches[si].KOFrame < this.storedLaunches[si].positions.length) {
							context.fillStyle = settings.visualizer_colors.ko;

							context.beginPath();

							context.arc(this.storedLaunches[si].positions[this.storedLaunches[si].KOFrame].x, - this.storedLaunches[si].positions[this.storedLaunches[si].KOFrame].y, r2, 0, Math.PI * 2);

							context.closePath();
							context.fill();
						}
					}
				}

				this.context.globalAlpha = 1;
			}

			context.lineWidth = 2 / visualizer.prevScale;

			if (this.diLines != null) {

				var d = 25;

				for (var i = 0; i < this.diLines.length; i++) {

					var point = { x: this.diLines[i].position.x, y: this.diLines[i].position.y };
					var angle = this.diLines[i].angle;

					if (angle == -1) {
						if (!this.diLines[i].interpolated)
							this.context.fillStyle = settings.visualizer_colors.diLine;
						else
							this.context.fillStyle = settings.visualizer_colors.interpolatedLine;

						this.context.beginPath();
						this.context.arc(point.x, -point.y, 2, 0, Math.PI * 2);
						this.context.closePath();
						this.context.fill();
					}
					else {
						if (!this.diLines[i].interpolated)
							this.context.strokeStyle = settings.visualizer_colors.diLine;
						else
							this.context.strokeStyle = settings.visualizer_colors.interpolatedLine;

						this.context.beginPath();
						this.MoveTo(point.x, point.y);

						point.x += (d * Math.cos(angle * Math.PI / 180));
						point.y += (d * Math.sin(angle * Math.PI / 180));

						this.LineTo(point.x, point.y);

						var head_angle = 135;

						this.LineTo((point.x + ((d / 3) * Math.cos((angle + head_angle) * Math.PI / 180))),
							(point.y + ((d / 3) * Math.sin((angle + head_angle) * Math.PI / 180))));

						this.LineTo(point.x, point.y);

						this.LineTo((point.x + ((d / 3) * Math.cos((angle - head_angle) * Math.PI / 180))),
							(point.y + ((d / 3) * Math.sin((angle - head_angle) * Math.PI / 180))));

						this.context.stroke();
					}


				}
			}

			context.lineWidth = 1;

		}

		this.DrawGrid = function () {

			if (this.scale > 1.5) {

				var gridScale = 1.07;

				var step = 10;
				
				if (this.scale > 6.2) {
					step = 1;
				} else if (this.scale > 2.7) {
					step = 5;
				}

				for (var x = -500; x <= 500; x += step) {

					if (x % 100 == 0) {
						this.context.globalAlpha = 0.6;
						this.context.strokeStyle = '#FF0000';
						this.context.lineWidth = 0.5;
					} else {
						if (x % 50 == 0) {
							this.context.globalAlpha = 0.5;
							this.context.lineWidth = 0.2;
							this.context.strokeStyle = '#0000FF';
						} else {
							this.context.strokeStyle = '#000000';
							this.context.globalAlpha = 0.3;
							if (x % 10 == 0) {
								this.context.lineWidth = 0.1;
								this.context.globalAlpha = 0.5;
							} else {
								this.context.lineWidth = 0.05;
							}
						}
					}

					this.context.beginPath();

					this.MoveTo(x * gridScale, -500 * gridScale);

					this.LineTo(x * gridScale, 500 * gridScale);

					this.context.stroke();
				}

				for (var y = -500; y <= 500; y += step) {

					if (y % 100 == 0) {
						this.context.strokeStyle = '#FF0000';
						this.context.lineWidth = 0.5;
						this.context.globalAlpha = 0.6;
					} else {
						if (y % 50 == 0) {
							this.context.lineWidth = 0.2;
							this.context.strokeStyle = '#0000FF';
							this.context.globalAlpha = 0.5;
						} else {
							this.context.strokeStyle = '#000000';
							this.context.globalAlpha = 0.3;
							if (y % 10 == 0) {
								this.context.lineWidth = 0.1;
							} else {
								this.context.lineWidth = 0.05;
							}
						}
					}

					this.context.beginPath();

					this.MoveTo(-500 * gridScale, y * gridScale);

					this.LineTo(500 * gridScale, y * gridScale);

					this.context.stroke();
				}

				visualizer.context.font = "4px sans-serif";
				//Labels
				for (var x = -500; x <= 500; x += 5) {

					if (x % 100 == 0) {
						this.context.globalAlpha = 0.8;
						this.context.fillStyle = '#FF0000';
						this.context.fillText(Math.abs(x / 10), x * gridScale + 1, -1);
					} else {
						if (x % 50 == 0) {
							this.context.globalAlpha = 0.8;
							this.context.fillStyle = '#0000FF';
							this.context.fillText(Math.abs(x / 10), x * gridScale + 1, -1);
						}
					}
				}

				for (var y = -500; y <= 0; y += 5) {

					if (y % 100 == 0) {
						this.context.globalAlpha = 0.8;
						this.context.fillStyle = '#FF0000';
						this.context.fillText(Math.abs(y / 10), 1, y * gridScale - 1);
					} else {
						if (y % 50 == 0) {
							this.context.globalAlpha = 0.8;
							this.context.fillStyle = '#0000FF';
							this.context.fillText(Math.abs(y / 10), 1, y * gridScale - 1);
						}
					}
				}
			}


			

			this.context.lineWidth = 1;
			this.context.globalAlpha = 1;

		}

		this.Zoom = function (z) {

			var x = visualizer.canvas.width / 2;
			var y = visualizer.canvas.height / 2;

			var zoom = z;

			if (visualizer.scale * zoom >= 0.7 && visualizer.scale * zoom <= 20) {

				visualizer.ClearCanvas();

				visualizer.context.translate(visualizer.origin.x, visualizer.origin.y);

				visualizer.prevTranslate.x += visualizer.origin.x;
				visualizer.prevTranslate.y += visualizer.origin.y;

				visualizer.context.scale(zoom, zoom);
				visualizer.prevScale *= zoom;

				visualizer.context.translate(
					-(x / visualizer.scale + visualizer.origin.x - x / (visualizer.scale * zoom)),
					-(y / visualizer.scale + visualizer.origin.y - y / (visualizer.scale * zoom))
				);

				visualizer.prevTranslate.x += -(x / visualizer.scale + visualizer.origin.x - x / (visualizer.scale * zoom));
				visualizer.prevTranslate.y += -(y / visualizer.scale + visualizer.origin.y - y / (visualizer.scale * zoom));

				visualizer.origin.x = (x / visualizer.scale + visualizer.origin.x - x / (visualizer.scale * zoom));
				visualizer.origin.y = (y / visualizer.scale + visualizer.origin.y - y / (visualizer.scale * zoom));
				visualizer.scale *= zoom;

				visualizer.Draw();
			}
		}


		//Events

		this.canvas.onmousewheel = function (event) {
			event.preventDefault();

			var x = visualizer.canvas.width / 2;
			var y = visualizer.canvas.height / 2;

			var wheel = event.wheelDelta / 120;

			var zoom = 1 + wheel / 20; //4

			if (visualizer.scale * zoom >= 0.7 && visualizer.scale * zoom <= 20) {

				visualizer.ClearCanvas();

				visualizer.context.translate(visualizer.origin.x, visualizer.origin.y);

				visualizer.prevTranslate.x += visualizer.origin.x;
				visualizer.prevTranslate.y += visualizer.origin.y;

				visualizer.context.scale(zoom, zoom);
				visualizer.prevScale *= zoom;

				visualizer.context.translate(
					-(x / visualizer.scale + visualizer.origin.x - x / (visualizer.scale * zoom)),
					-(y / visualizer.scale + visualizer.origin.y - y / (visualizer.scale * zoom))
				);

				visualizer.prevTranslate.x += -(x / visualizer.scale + visualizer.origin.x - x / (visualizer.scale * zoom));
				visualizer.prevTranslate.y += -(y / visualizer.scale + visualizer.origin.y - y / (visualizer.scale * zoom));

				visualizer.origin.x = (x / visualizer.scale + visualizer.origin.x - x / (visualizer.scale * zoom));
				visualizer.origin.y = (y / visualizer.scale + visualizer.origin.y - y / (visualizer.scale * zoom));
				visualizer.scale *= zoom;

				visualizer.Draw();
			}


		}

		this.canvas.onmousedown = function (event) {
			var mousex = event.clientX - visualizer.canvas.offsetLeft;
			var mousey = event.clientY - visualizer.canvas.offsetTop;
			visualizer.prevPosition.x = mousex;
			visualizer.prevPosition.y = mousey;
			visualizer.dragging = true;
		}

		this.canvas.ondblclick = function (event) {
			event.preventDefault();
			visualizer.Reset();
		}

		this.canvas.onmouseup = function (event) {
			visualizer.dragging = false;
		}

		this.canvas.onmousemove = function (event) {
			if (visualizer.dragging) {
				//Drag event

				visualizer.ClearCanvas();

				var mousex = event.clientX - visualizer.canvas.offsetLeft;
				var mousey = event.clientY - visualizer.canvas.offsetTop;

				visualizer.context.translate(- (visualizer.prevPosition.x - mousex) / visualizer.scale, - (visualizer.prevPosition.y - mousey) / visualizer.scale);

				visualizer.prevTranslate.x += - (visualizer.prevPosition.x - mousex) / visualizer.scale;
				visualizer.prevTranslate.y += - (visualizer.prevPosition.y - mousey) / visualizer.scale;

				visualizer.origin.x += (visualizer.prevPosition.x - mousex) / visualizer.scale;
				visualizer.origin.y += (visualizer.prevPosition.y - mousey) / visualizer.scale;

				visualizer.prevPosition.x = mousex;
				visualizer.prevPosition.y = mousey;



				visualizer.Draw();
			} else {
				//Tooltips

				var r = 10;

				var mousex = event.clientX - visualizer.canvas.getBoundingClientRect().left;
				var mousey = event.clientY - visualizer.canvas.getBoundingClientRect().top;

				var x = (mousex / visualizer.prevScale) - visualizer.prevTranslate.x;
				var y = (mousey / visualizer.prevScale) - visualizer.prevTranslate.y;

				var points = [];

				for (var i = 0; i < visualizer.dataPoints.length; i++) {
					var point = visualizer.dataPoints[i];
					var l = LineLength({ x: x, y: y }, point.position);

					if (l < r)
						points.push({ p: -1, r: l, point: point });
				}

				points.sort(function (a, b) {
					if (b.point.vertex.y - a.point.vertex.y != 0)
						return b.point.vertex.y - a.point.vertex.y;
					else
						return a.point.vertex.x - b.point.vertex.x;
				});

				for (var i = 0; i < visualizer.launchPoints.length; i++) {
					var point = visualizer.launchPoints[i];
					var l = LineLength({ x: x, y: y }, point.position);

					if (l < r)
						points.push({ p: i, r: l, point: point, opacity: 1 });
				}

				for (var i = 0; i < visualizer.diPoints.length; i++) {
					var point = visualizer.diPoints[i];
					var l = LineLength({ x: x, y: y }, point.position);

					if (l < r)
						points.push({ p: i, r: l, point: point, opacity: 1 });
				}

				points.sort(function (a, b) { //Sort them by distance closer to mouse pointer
					return b.r - a.r;
				});

				if (points.length > 5) { //Limit to 5 tooltips
					points.splice(0, points.length - 5);

				}

				points.sort(function (a, b) {
					if (b.p != -1 && a.p != -1) {
						return a.p - b.p; //Sort launch points by frame
					}
					else {

						if (b.p == -1 && a.p == -1) { //Sort stage points by height
							if (b.point.vertex.y - a.point.vertex.y != 0)
								return b.point.vertex.y - a.point.vertex.y;
							else
								return a.point.vertex.x - b.point.vertex.x;
						}

						if (b.p == -1) //Stage points have higher priority
							return 1;
						else
							return -1;

					}
				});

				visualizer.ClearCanvas();
				visualizer.Draw();

				visualizer.context.save();

				visualizer.context.setTransform(1, 0, 0, 1, 0, 0);

				if (points.length > 0) {
					var d = 20;
					var dy = (points.length - 1) * d;
					var dx = 5;

					//Draw tooltips

					//Point
					for (var i = 0; i < points.length; i++) {
						var point = points[i].point;

						visualizer.context.globalAlpha = points[i].opacity;

						visualizer.context.fillStyle = "#000000";
						visualizer.context.beginPath();
						//stageCanvas.context.fillRect(((point.position.x + stageCanvas.prevTranslate.x) * stageCanvas.prevScale) - stageCanvas.prevScale / 4, ((point.position.y + stageCanvas.prevTranslate.y) * stageCanvas.prevScale) - stageCanvas.prevScale / 4, stageCanvas.prevScale / 2, stageCanvas.prevScale / 2);
						visualizer.context.arc((point.position.x + visualizer.prevTranslate.x) * visualizer.prevScale, (point.position.y + visualizer.prevTranslate.y) * visualizer.prevScale, 2 / visualizer.prevScale, 0, Math.PI * 2);
						visualizer.context.closePath();
						visualizer.context.fill();

						visualizer.context.globalAlpha = 1;

					}

					//Line
					for (var i = 0; i < points.length; i++) {
						var point = points[i].point;

						visualizer.context.globalAlpha = points[i].opacity;

						visualizer.context.strokeStyle = point.color; //Color

						visualizer.context.beginPath();

						visualizer.context.moveTo(((point.position.x + visualizer.prevTranslate.x) * visualizer.prevScale), ((point.position.y + visualizer.prevTranslate.y) * visualizer.prevScale));

						visualizer.context.lineTo(mousex + dx, mousey - dy);

						visualizer.context.closePath();

						visualizer.context.stroke();

						visualizer.context.globalAlpha = 1;
						dy -= d;
					}

					dy = (points.length - 1) * d;

					var fontlength = 12 / 2;

					//Tooltip
					for (var i = 0; i < points.length; i++) {
						var point = points[i].point;

						visualizer.context.globalAlpha = points[i].opacity;

						visualizer.context.strokeStyle = point.color; //Color
						visualizer.context.fillStyle = point.color; //Color

						visualizer.context.clearRect(mousex + dx, mousey - dy - d / 2, point.text.length * fontlength + dx * 4, d);

						visualizer.context.strokeRect(mousex + dx, mousey - dy - d / 2, point.text.length * fontlength + dx * 4, d);

						visualizer.context.font = "12px sans-serif";
						visualizer.context.fillText(point.text, mousex + dx * 2, mousey - dy + 5);
						//stageCanvas.context.fillText(point.text, (point.position.x + stageCanvas.prevTranslate.x) * stageCanvas.prevScale, ((point.position.y + stageCanvas.prevTranslate.y) * stageCanvas.prevScale) - 5 - y);

						visualizer.context.globalAlpha = 1;

						dy -= d;
					}
				}

				visualizer.context.restore();

			}
		}

		//Touch events

		this.canvas.ontouchstart = function (event) {
			event.preventDefault();

			if (event.touches.length === 1 && event.touches[0].identifier === 0) {

				visualizer.isClick = true;

				//Tooltips

				var r = 10;

				var mousex = event.touches[0].clientX - visualizer.canvas.getBoundingClientRect().left;
				var mousey = event.touches[0].clientY - visualizer.canvas.getBoundingClientRect().top;

				var x = (mousex / visualizer.prevScale) - visualizer.prevTranslate.x;
				var y = (mousey / visualizer.prevScale) - visualizer.prevTranslate.y;

				var points = [];

				for (var i = 0; i < visualizer.dataPoints.length; i++) {
					var point = visualizer.dataPoints[i];
					var l = LineLength({ x: x, y: y }, point.position);

					if (l < r)
						points.push({ p: -1, r: l, point: point });
				}

				points.sort(function (a, b) {
					if (b.point.vertex.y - a.point.vertex.y != 0)
						return b.point.vertex.y - a.point.vertex.y;
					else
						return a.point.vertex.x - b.point.vertex.x;
				});

				for (var i = 0; i < visualizer.launchPoints.length; i++) {
					var point = visualizer.launchPoints[i];
					var l = LineLength({ x: x, y: y }, point.position);

					if (l < r)
						points.push({ p: i, r: l, point: point, opacity: 1 });
				}

				for (var i = 0; i < visualizer.diPoints.length; i++) {
					var point = visualizer.diPoints[i];
					var l = LineLength({ x: x, y: y }, point.position);

					if (l < r)
						points.push({ p: i, r: l, point: point, opacity: 1 });
				}

				points.sort(function (a, b) { //Sort them by distance closer to mouse pointer
					return b.r - a.r;
				});

				if (points.length > 5) { //Limit to 5 tooltips
					points.splice(0, points.length - 5);

				}

				points.sort(function (a, b) {
					if (b.p != -1 && a.p != -1) {
						return a.p - b.p; //Sort launch points by frame
					}
					else {

						if (b.p == -1 && a.p == -1) { //Sort stage points by height
							if (b.point.vertex.y - a.point.vertex.y != 0)
								return b.point.vertex.y - a.point.vertex.y;
							else
								return a.point.vertex.x - b.point.vertex.x;
						}

						if (b.p == -1) //Stage points have higher priority
							return 1;
						else
							return -1;

					}
				});

				visualizer.ClearCanvas();
				visualizer.Draw();

				visualizer.context.save();

				visualizer.context.setTransform(1, 0, 0, 1, 0, 0);

				if (points.length > 0) {
					var d = 20;
					var dy = (points.length - 1) * d;
					var dx = 5;

					//Draw tooltips

					//Point
					for (var i = 0; i < points.length; i++) {
						var point = points[i].point;

						visualizer.context.globalAlpha = points[i].opacity;

						visualizer.context.fillStyle = "#000000";
						visualizer.context.beginPath();
						//stageCanvas.context.fillRect(((point.position.x + stageCanvas.prevTranslate.x) * stageCanvas.prevScale) - stageCanvas.prevScale / 4, ((point.position.y + stageCanvas.prevTranslate.y) * stageCanvas.prevScale) - stageCanvas.prevScale / 4, stageCanvas.prevScale / 2, stageCanvas.prevScale / 2);
						visualizer.context.arc((point.position.x + visualizer.prevTranslate.x) * visualizer.prevScale, (point.position.y + visualizer.prevTranslate.y) * visualizer.prevScale, 2 / visualizer.prevScale, 0, Math.PI * 2);
						visualizer.context.closePath();
						visualizer.context.fill();

						visualizer.context.globalAlpha = 1;

					}

					//Line
					for (var i = 0; i < points.length; i++) {
						var point = points[i].point;

						visualizer.context.globalAlpha = points[i].opacity;

						visualizer.context.strokeStyle = point.color; //Color

						visualizer.context.beginPath();

						visualizer.context.moveTo(((point.position.x + visualizer.prevTranslate.x) * visualizer.prevScale), ((point.position.y + visualizer.prevTranslate.y) * visualizer.prevScale));

						visualizer.context.lineTo(mousex + dx, mousey - dy);

						visualizer.context.closePath();

						visualizer.context.stroke();

						visualizer.context.globalAlpha = 1;
						dy -= d;
					}

					dy = (points.length - 1) * d;

					var fontlength = 12 / 2;

					//Tooltip
					for (var i = 0; i < points.length; i++) {
						var point = points[i].point;

						visualizer.context.globalAlpha = points[i].opacity;

						visualizer.context.strokeStyle = point.color; //Color
						visualizer.context.fillStyle = point.color; //Color

						visualizer.context.clearRect(mousex + dx, mousey - dy - d / 2, point.text.length * fontlength + dx * 4, d);

						visualizer.context.strokeRect(mousex + dx, mousey - dy - d / 2, point.text.length * fontlength + dx * 4, d);

						visualizer.context.font = "12px sans-serif";
						visualizer.context.fillText(point.text, mousex + dx * 2, mousey - dy + 5);
						//stageCanvas.context.fillText(point.text, (point.position.x + stageCanvas.prevTranslate.x) * stageCanvas.prevScale, ((point.position.y + stageCanvas.prevTranslate.y) * stageCanvas.prevScale) - 5 - y);

						visualizer.context.globalAlpha = 1;

						dy -= d;
					}
				}

				visualizer.context.restore();
			}


		}

		this.canvas.ontouchend = function (event) {
			event.preventDefault();

			for (var i = 0; i < event.changedTouches.length; i++) {

				if (event.changedTouches[i].identifier === 0) {
					visualizer.prevTouch = null;
					visualizer.dragging = false;


				} else if (event.changedTouches[i].identifier === 1) {
					visualizer.prevTouch2 = null;
					visualizer.isZoomingTouch = false;
				}

			}
		}

		this.canvas.ontouchmove = function (event) {
			event.preventDefault();

			visualizer.isClick = false;

			if (event.touches.length === 1) { //Translate

				if (visualizer.prevTouch !== null) {

					//Drag event

					visualizer.ClearCanvas();

					var mousex = (event.touches[0].pageX - visualizer.prevTouch.pageX);
					var mousey = (event.touches[0].pageY - visualizer.prevTouch.pageY);

					visualizer.context.translate(- (- mousex) / visualizer.scale, - (- mousey) / visualizer.scale);

					visualizer.prevTranslate.x += - (- mousex) / visualizer.scale;
					visualizer.prevTranslate.y += - (- mousey) / visualizer.scale;

					visualizer.origin.x += (- mousex) / visualizer.scale;
					visualizer.origin.y += (- mousey) / visualizer.scale;

					visualizer.prevPosition.x = mousex;
					visualizer.prevPosition.y = mousey;



					visualizer.Draw();

					visualizer.prevTouch = event.touches[0];

				}
				else {
					visualizer.prevTouch = event.touches[0];
					visualizer.dragging = true;
				}
			} else if (event.touches.length === 2) { //Zoom

				if (visualizer.prevTouch !== null && visualizer.prevTouch2 !== null) {
					var initial = Math.sqrt(Math.pow(visualizer.prevTouch.pageX - visualizer.prevTouch2.pageX, 2) + Math.pow(visualizer.prevTouch.pageY - visualizer.prevTouch2.pageY, 2));

					var currentDistance = Math.sqrt(Math.pow(event.touches[0].pageX - event.touches[1].pageX, 2) + Math.pow(event.touches[0].pageY - event.touches[1].pageY, 2));

					var zoom = currentDistance / initial;

					visualizer.Zoom(zoom);

					visualizer.prevTouch = event.touches[0];
					visualizer.prevTouch2 = event.touches[1];
				}
				else {
					visualizer.prevTouch = event.touches[0];
					visualizer.prevTouch2 = event.touches[1];

					visualizer.isZoomingTouch = true;
				}
			}


		}

	}
}