define(["Compose", "Logger", "Background", "Random", "Vector2", "Rectangle"], function(Compose, Logger, Background, Random, Vector2, Rectangle) {

	var Projectile = Compose(function constructor(game, imageName, point, rotation, scale, velocity, dinoProjectile) {
		this.game = game;
		this.image = this.game.images[imageName];

		this.width = this.image.width;
		this.height = this.image.height;

		this.position = new Vector2(point.x - (this.width / 2), point.y - (this.height / 2));
		this.rotation = rotation;
		this.scale = scale;
		this.velocity = velocity;

		this.dinoProjectile = dinoProjectile; // TODO implement
	},
	{

		update: function() {
			this.position.x += Math.cos(this.rotation) * this.velocity;
			this.position.y += Math.sin(this.rotation) * this.velocity;

			if ((this.position.y > this.game.height)
				|| (this.position.y < (0 - this.height))) {
				this.game.stopProjectile(this);
				return;
			}
		},

		draw: function(ctx) {
			ctx.save();

			 // Translate to midpoint before rotating
			ctx.translate(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
			ctx.rotate(this.rotation);
			ctx.translate(-(this.width / 2), -(this.height / 2));
			ctx.scale(this.scale, this.scale);
			ctx.drawImage(this.image, 0, 0, this.width, this.height);

			ctx.restore();
		},

		getCollisionShape: function() { // TODO should be rotated too!!!
			return new Rectangle(
				//new Vector2(this.position.x, this.position.y),
				//new Vector2(this.position.x + this.width, this.position.y + this.height)
				new Vector2(this.position.x + (this.width / 5), this.position.y),
				new Vector2(this.position.x + this.width - (this.width / 5), this.position.y + this.height)
			);
		},

		getDamage: function() {
			return 20;
		},

		handleDamage: function(damage) {
			this.game.stopProjectile(this);
		}

	});
	
	return Projectile;
});