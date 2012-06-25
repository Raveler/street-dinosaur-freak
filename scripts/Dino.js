define(["Compose", "Logger", "Vector2", "DinoLeg", "DinoNeck", "Controller"], function(Compose, Logger, Vector2, DinoLeg, DinoNeck, Controller) {

	var Dino = Compose(Controller, function() {

		// loc
		this.loc = new Vector2(400, 0);

		// body size
		this.bodySize = new Vector2(200, 50);

		// body loc relative to dino loc
		this.bodyLoc = new Vector2(-100, -150);

		// make the legs
		this.legs = new Array();
		this.legs[0] = new DinoLeg(new Vector2(-85, -50), 1, this, 0, '#AAAA00'); // left back
		this.legs[1] = new DinoLeg(new Vector2(90, -50), -1, this, 1, '#AAAA00'); // right back
		this.legs[2] = new DinoLeg(new Vector2(75, -50), 2, this, 2, '#FFFF00'); // right front
		this.legs[3] = new DinoLeg(new Vector2(-100, -50), -2, this, 3, '#FFFF00'); // left front

		// neck
		this.neck = new DinoNeck(this, new Vector2(90, -100));

		// prev offset sum
		/*this.prevOffsetSum = 0;
		for (var i = 0; i < this.legs.length; ++i) {
			Logger.log(this.legs[i]);
			this.prevOffsetSum += this.legs[i].getOffset();
		}
		Logger.log(this.prevOffsetSum);*/

		// handle leg command
		this.legCommand = function(idx, forward) {
			if (forward) this.legs[idx].moveForward();
			else this.legs[idx].moveBackward();
		};

		// add controls
		var that = this;
		this.addCommandListener('moveLeg', this.legCommand.bind(this));
		this.addCommandListener('moveHead', this.neck.move.bind(this.neck));
	},
	{
		init: function(game) {
			this.bodyImg = game.getImage('dino/body');
			this.neck.init(game);
			for (var i = 0; i < this.legs.length; ++i) this.legs[i].init(game);
		},

		update: function() {

			// all legs are moved already

		},

		draw: function(ctx) {
			ctx.save();
			ctx.translate(this.loc.x, this.loc.y);
			

			// draw neck
			this.neck.draw(ctx);

			// draw body
			ctx.drawImage(this.bodyImg, this.bodyLoc.x, this.bodyLoc.y);

			ctx.restore();

						// draw legs
			for (var i = 0; i < this.legs.length; ++i) {
				this.legs[i].draw(ctx);
			}
		},

		getLegRootLoc: function(attachLoc) {
			return new Vector2(this.loc.x + attachLoc.x, this.loc.y + attachLoc.y);
		},

		hasMovingLeg: function() {
			for (var i = 0; i < this.legs.length; ++i) {
				if (this.legs[i].isMoving()) return true;
			}
			return false;
		},

		updateBody: function(bodySpeed) {
			this.loc.x += bodySpeed;
		}

	});

	return Dino;
});