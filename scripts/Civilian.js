define(["Compose", "Vector2", "Rectangle", "Animation"], function(Compose, Vector2, Rectangle, Animation) {

	var Civilian = Compose(function(x) {
		this.x = x;
	},
	{

		init: function(game) {
			this.game = game;
			this.json = this.game.json["human/civilianSS"];
			this.img = this.game.images["human/civilianSS"];
			this.width = this.img.width/5;
			this.height = this.img.height/3;
		},

		update: function() {

			// update movement hier
		},

		draw: function(ctx) {

			// move to our position
			ctx.save();
			ctx.translate(this.getLoc().x, this.getLoc().y);
			ctx.fillStyle = "#FF00FF";
			ctx.strokeRect(0, 0, this.width, this.height);
			ctx.restore();
		},

		getCollisionShape: function() {
			return new Rectangle(this.getLoc(), new Vector2(this.x + this.img.width/2, this.game.floorHeight));
		},

		getDamage: function() {
			return 0;
		},

		getLoc: function() {
			return new Vector2(this.x - this.width/2, this.game.height - (this.game.floorHeight + this.height));
		},

		handleDamage: function(damage) {

			// DIE
			var animation = new Animation(this.game, "bloodSausageSS",  1.0, this.getLoc());
			this.game.addAnimation(animation);
		}
	})

	return Civilian;
});