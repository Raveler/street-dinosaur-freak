define(["Compose", "Logger", "Background", "Random", "Vector2"], function(Compose, Logger, Background, Random, Vector2) {
	
	var animationFrameRate = 5;

	var Animations = Compose(function constructor(game, animation, scale, point) {
		this.game = game;
		this.animation = this.game.json[animation];
		this.position = new Vector2(this.game.worldPosition + point.x, point.y); //((this.animation.width / 2), (this.animation.height / 2))); TODO
		this.scale = scale;

		this.done = false;
		this.framesPassed = 0;
		this.frame = 0;
	},
	{

		draw: function(ctx, worldPosition) { // TODO only draw if visible // TODO remove worldposition
			if (this.done) return;

			ctx.save();
			ctx.translate(this.position.x - worldPosition - (this.animation.width / 2),
				this.position.y - (this.animation.height / 2));
			// TODO rotate
			ctx.scale(this.scale, this.scale);
			// TODO move back to half size
			ctx.drawImage(this.game.images[this.animation.fileName],
				this.animation.width * this.frame, 0, this.animation.width, this.animation.height,
				0, 0, this.animation.width, this.animation.height);
			ctx.restore();

			this.framesPassed++;
			this.frame = Math.floor(this.framesPassed / animationFrameRate);

			if (this.frame == this.animation.animations[0].nFrames) {
				this.done = true;
				this.game.stopAnimation(this);
			}
		},

	});
	
	return Animations;
});