define(["Compose", "Vector2", "Rectangle"], function(Compose, Vector2, Rectangle) {

	var Civilian = Compose(function(x) {
		this.x = x;
	},
	{

		init: function(game) {
			this.game = game;
			this.json = this.game.json["human/civilianSS"];
			this.img = this.game.images["human/civilianSS"];
		},

		update: function() {

			// update movement hier
		},

		draw: function(ctx) {

			// move to our position
			ctx.save();
			ctx.translate(this.x - this.img.width/2, this.game.floorHeight - this.img.height);
			ctx.fillStyle = "#FF00FF";
			ctx.fillRect(0, 0, this.img.width, this.img.height);
			ctx.restore();
		},

		getCollisionShape: function() {
			return new Rectangle(
			                     new Vector2(this.x - this.img.width/2, this.game.floorHeight - this.img.height),
			                     topRight: new Vector2(this.x + this.img.width/2, this.game.floorHeight)
			                    );
		},

		getDamage: function() {
			return 0;
		},

		handleDamage: function(damage) {

		}
	})

	return Civilian;
});