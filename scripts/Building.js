define(["Compose", "Logger", "Background", "Random", "Vector2"], function(Compose, Logger, Background, Random, Vector2) {
	
	var Building = Compose(function constructor(game, position) {
		this.game = game;
		this.position = position;

		this.maxHeight = 8;
		this.numTopTypes = 2;
		this.numBlockTypes = 4;
		this.buildBlockHeight = 60;
		this.buildBlockWidth = 100;

		// Generate building blocks
		this.numBlocks = Random.getInt(1, this.maxHeight);
		this.buildingBlocks = new Array();
		for(var i = 0; i < this.numBlocks; i++) {
			this.buildingBlocks[i] = ["buildingBlock" + Random.getInt(1, this.numBlockTypes)];
		}

		// Generate top
		this.buildingTop = ["buildingTop" + Random.getInt(1, this.numTopTypes)];
	},
	{

		draw: function(ctx, worldPosition) {
			ctx.save();
			ctx.translate(-worldPosition, 0);
			//ctx.scale(-1, 1);
			//if (random.getInt(0, 1) == 0){
			//	ctx.scale(-1, 1);
			//	ctx.translate(this.buildBlockWidth, 0);
			//}
			for(var i = 0; i < this.buildingBlocks.length; i++) {
				ctx.drawImage(this.game.images[this.buildingBlocks[i]], this.position, this.game.height - (this.buildBlockHeight * (i + 1)));
			}
			ctx.drawImage(this.game.images[this.buildingTop], this.position, this.game.height - (this.buildBlockHeight * (i + 1)));
			ctx.restore();
		},

		checkCollision: function(ctx, point) {
			if ((point.x >= this.position) && (point.x <= (this.position + this.buildBlockWidth))
				&& (point.y <= ((this.buildingBlocks.length +  1) * this.buildBlockHeight))) {
				return true;
			}
		},
	});
	
	return Building;
});