define(["Compose", "Logger", "Vector2", "Controller", "Bezier"], function(Compose, Logger, Vector2, Controller, Bezier) {

	// head move speed
	var HeadMoveSpeed = 2;

	// max chain angle
	var MaxChainAngle = Math.PI/2;

	// n chains
	var NChains = 12;

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

		// mouth
		this.open = false;

		// bite countdown - this is the period in which a collision is registered as a bite instead of a headbutt (open mouth)
		this.biteCountDown = 0;

		// add the number of chains
		for (var i = 0; i < NChains; ++i) this.chains.push({});
		this.updateChains();
	},
	{
		init: function(game) {
			this.headClosedImg = game.getImage('dino/headClosed');
			this.headOpenImg = game.getImage('dino/headOpen');
			this.chainImg = game.getImage('dino/neckPart');
			this.game = game;
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

		update: function() {

			// reduce the bite countdown
			--this.biteCountDown;

			// look for collisions in all objects
			//for (var )

		},

		draw: function(ctx) {

			// draw the chains
			for (var i = 0; i < this.chains.length; ++i) {
				var chain = this.chains[i];
				var scale = chain.scale;
				ctx.save();
				ctx.translate(chain.loc.x, chain.loc.y);
				ctx.rotate(chain.angle);
				ctx.scale(scale, scale);
				ctx.translate(-this.chainImg.width/2 * scale, -this.chainImg.height/2 * scale);
				ctx.drawImage(this.chainImg, 0, 0);
				ctx.restore();
				
			}

			// compute the head angle
			var headAngle = this.getHeadAngle() + 1;
			
			// draw the head from the bottom left
			ctx.save();
			ctx.translate(this.headLoc.x, this.headLoc.y);
			ctx.rotate(headAngle);
			var img = this.open ? this.headOpenImg : this.headClosedImg;
			ctx.translate(-img.width/2, -img.height/2);
			ctx.drawImage(img, 0, 0);
			ctx.restore();
		},

		isBiteCollision: function(rect) {
			var headLoc = this.dino.getRootLoc(this.headLoc);
			if (rect.collidesWithSphere(headLoc, this.headOpenImg.width/2) && this.biteCountDown > 0) return true;
		},

		isNormalCollision: function(rect) {

			// compute distance from the head and look for collision
			var headLoc = this.dino.getRootLoc(this.headLoc);
			if (rect.collidesWithSphere(headLoc, this.headOpenImg.width/2)) return true;

			// go over all chains
			for (var i = 0; i < this.chains.length; ++i) {
				var chain = this.chains[i];
				var chainLoc = this.dino.getRootLoc(chain.loc);
				if (rect.collidesWithSphere(chainLoc, this.chainImg.width/2 * chain.scale)) return true;
			}

			// no collision
			return false;
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

		openMouth: function(open) {
			if (this.open && !open) {
				this.biteCountDown = 5;
			}
			this.open = open;
		},

		updateChains: function() {

			// length of the neck
			var distance = this.headLoc.subtract(this.attachLoc).length();

			var bezier = new Bezier(this.attachLoc, this.attachLoc.add(new Vector2(200, -200)), this.headLoc);
			//Logger.log(P0);
			//Logger.log(P1);
			// go in a straight line from attachLoc to headLoc in the number of chains
			
			var nChains = this.chains.length;
			var headAngle = this.getHeadAngle();
			var scale = 1.0;
			for (var i = 0; i < nChains; ++i) {
				var d = i/nChains; // add 0.5 to center the neck piece in the chain

				var t = i/nChains;
				/*var Point = new Vector2();
				Point.x = (1-t)*(1-t) * P0.x + 2 * (1-t) * t * P1.x + t*t * P2.x;
				Point.y = (1-t)*(1-t) * P0.y + 2 * (1-t) * t * P1.y + t*t * P2.y;
				var chainLoc = Point;*/
				var chainLoc = bezier.get(t);

				//var chainLoc = new Vector2(this.attachLoc.x + (this.headLoc.x - this.attachLoc.x)*d, this.attachLoc.y + (this.headLoc.y - this.attachLoc.y)*d);
				var angle = headAngle;

				// set the chain data
				this.chains[i].loc = chainLoc;
				this.chains[i].angle = angle + 1;
				this.chains[i].scale = scale;
				scale *= ChainSizeReduction;
			}
		}
	});

	return DinoNeck;
});