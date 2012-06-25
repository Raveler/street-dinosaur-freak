define(["Compose", "Logger", "Vector2", "Controller"], function(Compose, Logger, Vector2, Controller) {

	// head move speed
	var HeadMoveSpeed = 2;

	// max chain angle
	var MaxChainAngle = Math.PI/2;

	// n chains
	var NChains = 18;

	// chain size reduction
	var ChainSizeReduction = 0.95;

	// attach angle
	var AttachAngle = Math.PI/4;

	// max neck length
	var MaxNeckLength = 150;
	var MinNeckLength = 80;

	// lowest neck position
	var MaxNeckLower = -20;
	var MaxNeckLeft = 90;

	var DinoNeck = Compose(function(dino, attachLoc) {

		// dino
		this.dino = dino;

		// head locaton relative to the dino
		this.headLoc = new Vector2(150, -200);

		// head angle
		this.headAngle = 0;

		// attach loc
		this.attachLoc = attachLoc;

		// chain connecting the head to the body
		this.chains = new Array();

		// add the number of chains
		for (var i = 0; i < NChains; ++i) this.chains.push({});
		this.updateChains();
	},
	{
		init: function(game) {
			this.headImg = game.getImage('dino/headClosed');
			this.chainImg = game.getImage('dino/neckPart');
		},

		getMaxAngle: function() {
			return NChains * MaxChainAngle/2;
		},

		isValidHeadLoc: function(headLoc) {

			// put in constraints
			if (headLoc.y > MaxNeckLower) return false;
			if (headLoc.x < MaxNeckLeft) return false;

			// neck length
			var neckLength = headLoc.subtract(this.attachLoc).length();
			//Logger.log('Neck length: ' + neckLength);
			if (neckLength < MinNeckLength || neckLength > MaxNeckLength) return false;

			// all ok
			return true;
		},

		draw: function(ctx) {

			// draw the chains
			var scale = 1.0;
			ctx.fillStyle = "#FF0000";
			for (var i = 0; i < this.chains.length; ++i) {
				var chain = this.chains[i];
				ctx.save();
				ctx.translate(chain.loc.x, chain.loc.y);
				
				ctx.rotate(chain.angle);
				ctx.scale(scale, scale);
				ctx.translate(-this.chainImg.width/2 * scale, -this.chainImg.height/2 * scale);
				ctx.drawImage(this.chainImg, 0, 0);
				ctx.restore();
				scale *= ChainSizeReduction;
			}

			// compute the head angle
			var headAngle = this.getHeadAngle() + 1;

			// draw the head from the bottom left
			ctx.save();
			ctx.translate(this.headLoc.x, this.headLoc.y);
			ctx.rotate(headAngle);
			ctx.translate(-this.headImg.width/2, -this.headImg.height/2);
			ctx.drawImage(this.headImg, 0, 0);
			ctx.restore();

			ctx.fillRect(this.attachLoc.x - 5, this.attachLoc.y - 5, 10, 10);

		},

		getHeadAngle: function() {
			return Math.atan2(this.headLoc.y - this.attachLoc.y, this.headLoc.x - this.attachLoc.x);
		},

		move: function(direction) {

			// move head
			var newLoc = this.headLoc.add(new Vector2(direction.x * HeadMoveSpeed, direction.y * HeadMoveSpeed));

			// verify new loc
			if (!this.isValidHeadLoc(newLoc)) return;

			// update head loc
			this.headLoc = newLoc;

			// update chains
			this.updateChains();
		},

		updateChains: function() {

			// length of the neck
			var distance = this.headLoc.subtract(this.attachLoc).length();

			var P0 = this.attachLoc;
			var P1 = this.attachLoc.add(Vector2(distance/2 * Math.cos(Math.PI /4), distance/2 * Math.sin(Math.PI/4)));
			var P2 = this.headLoc;
			//Logger.log(P0);
			//Logger.log(P1);
			// go in a straight line from attachLoc to headLoc in the number of chains
			
			var nChains = this.chains.length;
			var headAngle = this.getHeadAngle();
			for (var i = 0; i < nChains; ++i) {
				var d = i/nChains; // add 0.5 to center the neck piece in the chain

				var t = i/nChains;
				var Point = new Vector2();
				Point.x = (1-t)*(1-t) * P0.x + 2 * (1-t) * t * P1.x + t*t * P2.x;
				Point.y = (1-t)*(1-t) * P0.y + 2 * (1-t) * t * P1.y + t*t * P2.y;
				var chainLoc = Point;

				//var chainLoc = new Vector2(this.attachLoc.x + (this.headLoc.x - this.attachLoc.x)*d, this.attachLoc.y + (this.headLoc.y - this.attachLoc.y)*d);
				var angle = headAngle;

				// set the chain data
				this.chains[i].loc = chainLoc;
				this.chains[i].angle = angle + 1;
			}


		}
	});

	return DinoNeck;
});