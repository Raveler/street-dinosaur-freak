define(["Compose", "Vector2", "Rectangle", "Animation", "Random", "Logger", "Projectile"], function(Compose, Vector2, Rectangle, Animation, Random, Logger, Projectile) {

	var deleteThreshold = 2000;

	var Chopper = Compose(function(game, position) {
		this.position = position;

		this.game = game;
		this.animation = this.game.json["human/heliSS"];
		this.image = this.game.images["human/heliSS"];

		this.attackMode = false;
		this.speed = -0.5;

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

				var target = this.game.dino.getLoc();
				var angle = Math.atan2(this.position.y - target.y, target.x - this.position.x);
				var projectile = new Projectile(this.game, "rocket", this.position, -angle, 1.00, 3.5, false);
				this.game.addProjectile(projectile);

				this.missileCooldown = 120;
			} else {
				if (Math.abs(this.position.x - this.game.dino.getLoc().x) < 350) {
					this.attackMode = true;
					return;
				}

				this.position.x += this.speed;

				//delete if far away
				if ((this.position.y > this.game.height) || (this.position.y < (0 - this.height))
					|| (this.position.x < (this.game.worldPosition - deleteThreshold))
					|| (this.position.x > (this.game.worldPosition + deleteThreshold))) {
					this.game.stopActor(this);
					return;
				}
			}
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
			return new Rectangle(this.position, new Vector2(this.position.x + this.animation.width, this.position.y + this.animation.height));
		},

		getDamage: function() {
			return 0;
		},

		handleDamage: function(damage) {
			var animation = new Animation(this.game, "explosion",  1.0, Random.getInt(0, 360),
				new Vector2(this.position.x + this.animation.width / 2, this.position.y + this.animation.height / 2));
			this.game.addAnimation(animation);

			this.game.stopActor(this);
		}
	})

	return Chopper;
});