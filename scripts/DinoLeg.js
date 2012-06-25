define(["Compose", "Logger", "Vector2", "Controller"], function(Compose, Logger, Vector2, Controller) {

	var DinoLeg = Compose(function(attachLoc, initialOffset, dino, idx, color) {

		// index
		this.idx = idx;

		// dino
		this.dino = dino;

		// step size
		this.stepSize = 50;

		// some constants
		this.maxLegLength = 60; // maximum length - defines step size
		this.legHeight = 50;
		this.moveSpeed = 1;

		// our attach location
		this.attachLoc = attachLoc;

		// moving?
		this.moving = false;

		// initial offset
		if (initialOffset == -2) this.initialOffset = -this.stepSize/2;
		if (initialOffset == -1) this.initialOffset = -this.stepSize/3/2;
		if (initialOffset == 1) this.initialOffset = this.stepSize/3/2;
		if (initialOffset == 2) this.initialOffset = this.stepSize/2;

		//this.initialOffset = this.stepSize / 3 * (initialOffset+2) - this.stepSize/2;
		Logger.log(this.initialOffset);
		// current offset
		this.offset = this.initialOffset;

		// color
		this.color = color;
	},
	{
		init: function(game) {

		},
		
		getFloorLoc: function() {
			var legRootLoc = this.getLegRootLoc();
			return new Vector2(legRootLoc.x + this.offset, legRootLoc.y + this.legHeight);
		},

		getLegOffset: function() {
			return this.offset;
		},

		getLegRootLoc: function() {
			return this.dino.getLegRootLoc(this.attachLoc);
		},

		isMovable: function() {
			return Math.abs(this.getLegOffset()) + 0.00001 > this.stepSize/2;
		},

		isMoving: function() {
			return this.moving;
		},

		moveForward: function() {

			// not movable - skip
			if (!this.moving && !this.isMovable()) return;

			// we can move, but another leg is moving - skip
			if (!this.moving && this.dino.hasMovingLeg()) return;

			// we are definitely moving now
			this.moving = true;

			// we update our position in the right direction
			var prevOffset = this.offset;
			this.offset += this.moveSpeed;
			if (this.offset > this.stepSize/2) this.offset = this.stepSize/2;

			// update the dino
			this.dino.updateBody((this.offset - prevOffset)/4);

			// update other legs
			for (var i = 0; i < this.dino.legs.length; ++i) {
				var leg = this.dino.legs[i];
				if (leg.idx != this.idx) leg.offset += -(this.offset - prevOffset)/3;
			}

			// when we reach the ending, we are done with this animation
			if (this.getLegOffset() >= this.stepSize/2) {
				Logger.log('done moving');
				this.moving = false;
				if (Math.abs(this.initialOffset - this.offset) > 0.0001) {
					this.initialOffset = this.offset;
				}
			}
		},

		moveBackward: function() {

			// not movable - skip
			if (!this.moving && !this.isMovable()) return;

			// we can move, but another leg is moving - skip
			if (!this.moving && this.dino.hasMovingLeg()) return;
			
			// we are definitely moving now
			this.moving = true;

			// we update our position in the right direction
			var prevOffset = this.offset;
			this.offset -=this.moveSpeed;
			if (this.offset < -this.stepSize/2) this.offset = -this.stepSize/2;

			// update the dino
			this.dino.updateBody((this.offset - prevOffset)/4);

			// update other legs
			for (var i = 0; i < this.dino.legs.length; ++i) {
				var leg = this.dino.legs[i];
				if (leg.idx != this.idx) leg.offset += -(this.offset - prevOffset)/3;
			}

			// when we reach the ending, we are done with this animation
			if (this.getLegOffset() <= -this.stepSize/2) {
				this.moving = false;
				if (Math.abs(this.initialOffset - this.offset) > 0.0001) {
					this.initialOffset = this.offset;
				}
			}
		},

		draw: function(ctx) {
			var rootLoc = this.dino.getLegRootLoc(this.attachLoc);
			var floorLoc = this.getFloorLoc();
			ctx.save();
			if (!this.trying) ctx.fillStyle = this.color;
			else ctx.fillStyle = "#FF0000";
			ctx.beginPath();
			ctx.moveTo(rootLoc.x - 5, rootLoc.y);
			ctx.lineTo(rootLoc.x + 5, rootLoc.y);
			ctx.lineTo(floorLoc.x + 5, floorLoc.y);
			ctx.lineTo(floorLoc.x  - 5, floorLoc.y);
			ctx.lineTo(rootLoc.x - 5, rootLoc.y);
			ctx.fill();
			ctx.restore();
		}
	});

	return DinoLeg;
});