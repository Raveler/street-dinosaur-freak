define(["Compose", "Vector2", "Rectangle", "Animation", "Random", "Logger", "Projectile"], function(Compose, Vector2, Rectangle, Animation, Random, Logger, Projectile) {

	var Tank = Compose(function(game, position) {
		this.position = position;

		this.game = game;
		this.animation = this.game.json["human/heliSS"];
		this.image = this.game.images["human/heliSS"];

		this.attackMode = true;
		//this.speed = 0.5;

		this.frame = 0;
		this.nFrames = 9;
		this.scale = 0.5;
		
		this.missileCooldown = 0;
	},
	{

		update: function() {
			if (this.attackMode) {
				if (this.missileCooldown > 0) {
					this.missileCooldown--;
					return;
				}

				// launch missle
				//var target = new Vector2(this.position.x - 10, this.position.y - 10);
				var target = this.game.dino.getLoc();
				var angle = Math.atan2(this.position.y - target.y, target.x - this.position.x);
				var projectile = new Projectile(this.game, "rocket", this.position, -angle, 1.00, 3.5, false);
				this.game.addProjectile(projectile);

				this.missileCooldown = 120;
			}


			/*if (!this.panic) this.x -= this.walkSpeed;

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
			}*/
		},

		draw: function(ctx) {
			var frame = Math.floor(this.frame / 8); // speed factor
			if (frame == this.nFrames) {
				this.frame = 0;
				frame = 0;
			}

			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.scale(this.scale, this.scale);
			ctx.drawImage(this.image,
				this.animation.width * frame, 0, this.animation.width, this.animation.height,
				0, 0, this.animation.width, this.animation.height);
			ctx.restore();

			this.frame++;
		},

		getCollisionShape: function() {
			//return new Rectangle(this.getLoc(), new Vector2(this.x + this.img.width/2, this.game.height - this.game.floorHeight));
		},

		getDamage: function() {
			return 0;
		},

		handleDamage: function(damage) {
			//var animation = new Animation(this.game, "bloodSausageSS",  1.0, this.getLoc());
			//var animation = new Animation(this.game, "bloodSausageSS", 0.1, Random.getInt(0, 360), this.getLoc());
			/*var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc().subtract(this.width/2, this.height/2));
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			this.game.civilians.splice(this.game.animations.indexOf(this), 1);*/
		}
	})

	return Tank;
});