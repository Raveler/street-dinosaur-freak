define(["Compose", "Logger", "Vector2", "Controller"], function(Compose, Logger, Vector2, Controller) {

	var DinoLeg = Compose(function(attachLoc, pose, depth, dino) {

		// dino
		this.dino = dino;

		// pose, depth
		this.pose = pose;
		this.depth = depth;

		// some constants
		this.maxLegLength = 60; // maximum length - defines step size
		this.legHeight = 50;
		this.moveSpeed = 1;

		// our attach location
		this.attachLoc = attachLoc;

		// current offset
		this.floorLoc = this.dino.getLegRootLoc(this.attachLoc);
		this.floorLoc.y += this.legHeight;

		// depending on the pose, we update the floor loc
		if (pose == 'LEFT') this.floorLoc.x -= Math.sqrt(this.maxLegLength*this.maxLegLength - this.legHeight*this.legHeight);
		else if (pose == 'RIGHT') this.floorLoc.x += Math.sqrt(this.maxLegLength*this.maxLegLength - this.legHeight*this.legHeight);
		if (depth == 'FRONT') this.color = '#FFFF00';
		else this.color = '#AEB404';
	},
	{
		getLegLength: function() {
			var rootLoc = this.dino.getLegRootLoc(this.attachLoc);
			return rootLoc.subtract(this.floorLoc).length();
		},

		moveForward: function() {

			// make sure this is legal leg movement
			var rootLoc = this.dino.getLegRootLoc(this.attachLoc);
			var legLength = this.floorLoc.add(new Vector2(this.moveSpeed, 0)).subtract(rootLoc).length();
			if (legLength > this.maxLegLength) return;
			// make sure it is also legal for all other legs
			var ok = this.dino.updateBody(this.moveSpeed/4);
			if (!ok) return;

			// update position
			this.floorLoc.x += this.moveSpeed;
		},

		moveBackward: function() {

			// make sure this is legal leg movement
			var rootLoc = this.dino.getLegRootLoc(this.attachLoc);
			var legLength = this.floorLoc.add(new Vector2(this.moveSpeed, 0)).subtract(rootLoc).length();
			if (legLength > this.maxLegLength) return;

			// make sure it is also legal for all other legs
			var ok = this.dino.updateBody(this.moveSpeed/4);
			if (!ok) return;

			// update position
			this.floorLoc.x += this.moveSpeed;
		},

		draw: function(ctx) {
			var rootLoc = this.dino.getLegRootLoc(this.attachLoc);
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.moveTo(rootLoc.x - 5, rootLoc.y);
			ctx.lineTo(rootLoc.x + 5, rootLoc.y);
			ctx.lineTo(this.floorLoc.x + 5, this.floorLoc.y);
			ctx.lineTo(this.floorLoc.x  - 5, this.floorLoc.y);
			ctx.lineTo(rootLoc.x - 5, rootLoc.y);
			ctx.fill();
			ctx.restore();
		},

		getState: function() {

		},

		getGroundLoc: function() {
			return this.attachLoc.add(new Vector2(this.offset, this.legHeight));
		},

		getPose: function() {
			return this.pose;
		},

		getDepth: function() {
			return this.depth;
		},

		getAttachLoc: function() {
			return this.attachLoc;
		},

		isValidMovement: function(newRootLoc) {
			return newRootLoc.subtract(this.floorLoc).length() < this.maxLegLength;
		}
	});

	return DinoLeg;
});