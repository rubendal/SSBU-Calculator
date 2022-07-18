class StickWheel {
	constructor(CalculatorRef, id, position) {
		this.CalculatorRef = CalculatorRef;
		this.id = id;
		this.canvas = document.getElementById(id);

		this.s = 130;
		this.canvas.width = this.s;
		this.canvas.height = this.s;
		this.center = { x: this.s / 2, y: this.s / 2 };
		this.r = 40;
		this.r2 = 40;
		this.gate = 40;
		this.controllerR = 128;
		this.h = 15;
		this.c = 120 / 128;
		this.controller = "GameCube";

		this.position = { X: 0, Y: 0 };

		this.clickActive = false;

		var stickWheel = this;

		this.mouseEvent = function (e) {
			if (!stickWheel.clickActive)
				return;

			var rect = stickWheel.canvas.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;

			var position = { x: 0, y: 0 };

			position.x = Math.min(Math.max(Math.floor((((x - stickWheel.center.x)) / stickWheel.r) * 120), -127), 127);
			position.y = Math.min(Math.max(Math.floor((((stickWheel.center.y - y)) / stickWheel.r) * 120), -127), 127);

			if (stickWheel.controller == "Wiimote") {
				if (position.x < -24)
					position.x = -127;
				else if (position.x > 24)
					position.x = 127;
				else
					position.x = 0;

				if (position.y < -24)
					position.y = -127;
				else if (position.y > 24)
					position.y = 127;
				else
					position.y = 0;

			} else {

				if (!InsideStickGate(stickWheel.controllerR, position.x, position.y))
					position = stickWheel.position;

			}

			this.position = position;
			stickWheel.CalculatorRef.UpdateStickFromCanvas(position);
		}

		this.canvas.ontouchmove = function(event) {
			event.preventDefault();

			if (event.touches.length === 1 && event.touches[0].identifier === 0) {

				var rect = stickWheel.canvas.getBoundingClientRect();
				var x = event.touches[0].clientX - rect.left;
				var y = event.touches[0].clientY - rect.top;

				var position = { x: 0, y: 0 };

				position.x = Math.min(Math.max(Math.floor((((x - stickWheel.center.x)) / stickWheel.r) * 120), -127), 127);
				position.y = Math.min(Math.max(Math.floor((((stickWheel.center.y - y)) / stickWheel.r) * 120), -127), 127);

				if (stickWheel.controller == "Wiimote") {
					if (position.x < -24)
						position.x = -127;
					else if (position.x > 24)
						position.x = 127;
					else
						position.x = 0;

					if (position.y < -24)
						position.y = -127;
					else if (position.y > 24)
						position.y = 127;
					else
						position.y = 0;

				} else {

					if (!InsideStickGate(stickWheel.controllerR, position.x, position.y))
						position = stickWheel.position;

				}

				this.position = position;
				stickWheel.CalculatorRef.UpdateStickFromCanvas(position);
			}
		};


		this.canvas.addEventListener('mousedown', function (e) {
			stickWheel.clickActive = true;
		}, false);
		this.canvas.addEventListener('mousemove', this.mouseEvent, false);
		this.canvas.addEventListener('mouseup', function (e) {
			stickWheel.clickActive = false;
		}, false);
		this.canvas.addEventListener('mouseleave', function (e) {
			stickWheel.clickActive = false;
		}, false);

		this.drawStick = function (position) {
			var context = this.canvas.getContext("2d");
			
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			//context.strokeStyle = '#FF0000';

			//context.beginPath();
			//context.strokeRect((this.center.x - this.r), (this.center.y - this.r), this.r * 2, this.r * 2);
			//context.closePath();
			//context.stroke();

			context.strokeStyle = settings.stick_color;

			if (this.controller == "Wiimote") {
				context.beginPath();
				context.strokeRect((this.center.x - this.r * this.c), (this.center.y - this.r * this.c), this.r * 2 * this.c, this.r * 2 * this.c);
				context.closePath();
				context.stroke();
			}

			//context.beginPath();
			//context.strokeRect((this.center.x - this.r * this.c), (this.center.y - this.r * this.c), this.r * 2 * this.c, this.r * 2 * this.c);
			//context.closePath();
			//context.stroke();
			
			context.beginPath();
			context.arc(this.center.x, this.center.y, this.gate * this.controllerR / 128, 0, 2 * PI);
			context.closePath();
			context.stroke();

			context.globalCompositeOperation = 'destination-out';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.x)), this.center.y + (-this.r * StickSensibilityPosition(position.y)), this.r2 / 1.75, 0, 2 * PI);
			context.closePath();
			context.fill();
			context.globalCompositeOperation = 'source-over';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.x)), this.center.y + (-this.r * StickSensibilityPosition(position.y)), this.r2 / 1.75, 0, 2 * PI);
			context.closePath();
			context.stroke();
			context.globalCompositeOperation = 'destination-out';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.x)), this.center.y + (-this.r * StickSensibilityPosition(position.y)), this.r2 / 2.5, 0, 2 * PI);
			context.closePath();
			context.fill();
			context.globalCompositeOperation = 'source-over';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.x)), this.center.y + (-this.r * StickSensibilityPosition(position.y)), this.r2 / 2.5, 0, 2 * PI);
			context.closePath();
			context.stroke();
			context.globalCompositeOperation = 'destination-out';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.x)), this.center.y + (-this.r * StickSensibilityPosition(position.y)), this.r2 / 4, 0, 2 * PI);
			context.closePath();
			context.fill();
			context.globalCompositeOperation = 'source-over';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.x)), this.center.y + (-this.r * StickSensibilityPosition(position.y)), this.r2 / 4, 0, 2 * PI);
			context.closePath();
			context.stroke();

			this.position = position;
		}

		this.drawStick(position);
		
	}

	
}

