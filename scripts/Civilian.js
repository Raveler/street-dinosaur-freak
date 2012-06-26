define(["Compose", "Vector2", "Rectangle", "Animation", "Random", "Logger"], function(Compose, Vector2, Rectangle, Animation, Random, Logger) {

	var Civilian = Compose(function(x) {
		this.x = x;
		this.panic = false;
		this.walkSpeed = 0.5;
		this.runSpeed = 2;
		this.direction = 0; // 0 = left, 1 = right
		this.frame = 0;
		this.frameCounter = 6;
		this.targetX = null;

	},
	{

		init: function(game) {
			this.game = game;
			this.json = this.game.json["human/civilianSS"];
			this.img = this.game.images["human/civilianSS"];
			this.width = this.img.width/5;
			this.height = this.img.height/3;
			Logger.log(this.game.json["debris/bloodSausageSS"]);
		},

		update: function() {


			if (!this.panic) this.x -= this.walkSpeed;

			// look for distance from dino
			if (Math.abs(this.x - this.game.dino.getLoc().x) < 150) this.panic = true;

			// PANIC MODE
			if (this.panic) {
				if (this.targetX == null) {
					this.targetX = Random.getInt(this.x - 150, this.x + 150);
				}
				this.direction = (this.targetX < this.x) ? 0 : 1;
				if (this.direction == 0) {
					this.x -= this.runSpeed;
					if (this.x < this.targetX) this.targetX = null;
				}
				else {
					this.x += this.runSpeed;
					if (this.x > this.targetX) this.targetX = null;
				}
			}
		},

		draw: function(ctx) {

			// walking
			var animationOffset = !this.panic ? this.height : this.height*2;
			var frameOffset = this.frame * this.width;
			//var frameOffset = 0;
			var loc = this.getLoc();
			//Logger.log('offsets: ' + animationOffset + ',' + frameOffset);

			// move to the right position
			ctx.save();
			ctx.translate(loc.x, loc.y);
			if (this.direction == 1) ctx.scale(-1, 1);
			ctx.translate(-this.width/2, -10);
			ctx.drawImage(this.img, frameOffset, animationOffset, this.width, this.height, 0, 0, this.width, this.height);
			ctx.restore();

			// next frame
			--this.frameCounter;
			if (this.frameCounter == 0) {
				this.frame = (this.frame + 1) % 5;
				this.frameCounter = 5;
			}
		},

		getCollisionShape: function() {
			return new Rectangle(this.getLoc(), new Vector2(this.x + this.img.width/2, this.game.height - this.game.floorHeight));
		},

		getDamage: function() {
			return 0;
		},

		getLoc: function() {
			return new Vector2(this.x - this.width/2, this.game.height - (this.game.floorHeight + this.height));
		},

		handleDamage: function(damage) {
			//var animation = new Animation(this.game, "bloodSausageSS",  1.0, this.getLoc());
			//var animation = new Animation(this.game, "bloodSausageSS", 0.1, Random.getInt(0, 360), this.getLoc());
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc().subtract(this.width/2, this.height/2));
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			this.game.civilians.splice(this.game.animations.indexOf(this), 1);
		}
	})

	return Civilian;
});