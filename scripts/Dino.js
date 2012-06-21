define(["Compose", "Logger", "Vector2", "DinoLeg", "Controller"], function(Compose, Logger, Vector2, DinoLeg, Controller) {

	var Dino = Compose(Controller, function() {

		// loc
		this.loc = new Vector2(400, 0);

		// body size
		this.bodySize = new Vector2(200, 50);

		// body loc relative to dino loc
		this.bodyLoc = new Vector2(-100, -100);

		// make the legs
		this.legs = new Array();
		this.legs[0] = new DinoLeg(new Vector2(-85, -50), 'LEFT', 'BACK', this); // left back
		this.legs[1] = new DinoLeg(new Vector2(90, -50), 'RIGHT', 'BACK', this); // right back
		this.legs[2] = new DinoLeg(new Vector2(75, -50), 'LEFT', 'FRONT', this); // right front
		this.legs[3] = new DinoLeg(new Vector2(-100, -50), 'RIGHT', 'FRONT', this); // left front

		// prev offset sum
		/*this.prevOffsetSum = 0;
		for (var i = 0; i < this.legs.length; ++i) {
			Logger.log(this.legs[i]);
			this.prevOffsetSum += this.legs[i].getOffset();
		}
		Logger.log(this.prevOffsetSum);*/

		// handle leg command
		this.legCommand = function(pose, depth, forward) {
			for (var i = 0; i < this.legs.length; ++i) {
				var leg = this.legs[i];
				if (leg.getPose() == pose && leg.getDepth() == depth) {
					if (forward) leg.moveForward();
					else leg.moveBackward();
				}
			}
		};

		// add controls
		var that = this;
		this.addCommandListener('moveLeg', this.legCommand.bind(this));
	},
	{
		update: function() {

			// all legs are moved already

		},

		draw: function(ctx) {
			ctx.save();
			ctx.translate(this.loc.x, this.loc.y);
			
			// draw body
			ctx.save();
			ctx.fillStyle = "#DD0000";
			//ctx.strokeStyle = "#FF0000";
			ctx.fillRect(this.bodyLoc.x, this.bodyLoc.y, this.bodySize.x, this.bodySize.y);
			ctx.restore();

			ctx.restore();

						// draw legs
			for (var i = 0; i < this.legs.length; ++i) {
				this.legs[i].draw(ctx);
			}
		},

		getLegRootLoc: function(attachLoc) {
			return new Vector2(this.loc.x + attachLoc.x, this.loc.y + attachLoc.y);
		},

		updateBody: function(bodySpeed) {

			// first, verify with all legs
			var ok = true;
			for (var i = 0; i < this.legs.length; ++i) {
				if (this.legs[i].isValidMovement(this.legs[i].getAttachLoc().add(new Vector2(this.loc.x + bodySpeed, this.loc.y)))) ok = false;
			}
			if (!ok) return false;
			// update our body
			this.loc.x += bodySpeed;
			return true;
		}

	});

	return Dino;
});