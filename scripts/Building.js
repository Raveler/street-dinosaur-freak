define(["Compose", "Logger", "Background", "Random", "Vector2", "Animation"], function(Compose, Logger, Background, Random, Vector2, Animation) {
	
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
		this.buildingBlocksFlipped = new Array();
		for(var i = 0; i < this.numBlocks; i++) {
			this.buildingBlocks[i] = ["buildingBlock" + Random.getInt(1, this.numBlockTypes)];
			this.buildingBlocksFlipped[i] = Random.getInt(0, 1);
		}

		// Generate top
		this.buildingTop = ["buildingTop" + Random.getInt(1, this.numTopTypes)];
		this.buildingTopFlipped = Random.getInt(0, 1);

		this.hitPoints = 20 + (this.buildingBlocks.length * 10);
		this.destroyed = false;
	},
	{

		draw: function(ctx, cameraPosition) { // TODO only draw if visible
			if (this.destroyed) return;
			if (((this.position - cameraPosition) < (-this.buildBlockWidth))
				|| ((this.position - cameraPosition) > (this.game.width))) return;

			ctx.save();
			ctx.translate(this.position - cameraPosition, this.game.height - this.game.floorHeight);
			for(var i = 0; i < this.buildingBlocks.length; i++) {
				this.drawBlock(ctx, this.game.images[this.buildingBlocks[i]], this.buildingBlocksFlipped[i], 0, - (this.buildBlockHeight * (i + 1)));				
			}

			this.drawBlock(ctx, this.game.images[this.buildingTop], this.buildingTopFlipped, 0, - (this.buildBlockHeight * (i + 1)));

			ctx.restore();
		},

		drawBlock: function(ctx, img, inverted, width, height) {
			if (inverted == 0) {
				ctx.save();
				ctx.scale(-1, 1);
				ctx.translate(-this.buildBlockWidth, 0)
				ctx.drawImage(img, width, height);
				ctx.restore();
			} else {
				ctx.drawImage(img, width, height);
			}
		},

		checkCollision: function(cameraPosition, point) { // TODO only world coor
			if (this.destroyed) return;

			if ((point.x >= (this.position - cameraPosition)) && (point.x <= ((this.position + this.buildBlockWidth) - cameraPosition))
				&& (point.y > (this.game.height - ((this.buildingBlocks.length +  2) * this.buildBlockHeight)))) {
				return true;
			}

			return false;
		},

		handleDamage: function(damage, cameraPosition, point) { // TODO only world coor // TODO remove cameraPosition
			if (this.destroyed) return;

			var animation = new Animation(this.game, "explosion",  1.0, point);
			this.game.addAnimation(animation);

			this.hitPoints -= damage;
			if (this.hitPoints < 0) {
				this.destroyed = true;

				for(var i = 0; i < (this.buildingBlocks.length + 1); i++) {

					var minX = this.position - cameraPosition;
					var maxX = this.position + this.buildBlockWidth - cameraPosition + 25;
					var minY = this.game.height - this.game.floorHeight - (i * this.buildBlockHeight + 1) + 20;
					var maxY = this.game.height - this.game.floorHeight - (i * this.buildBlockHeight) - 20;
					
					explosionPosition1 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition2 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition3 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition4 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition5 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition6 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					var animation1 = new Animation(this.game, "explosion", 0.8, explosionPosition1);
					var animation2 = new Animation(this.game, "explosion", 0.6, explosionPosition2);
					var animation3 = new Animation(this.game, "explosion", 0.4, explosionPosition3);
					var animation4 = new Animation(this.game, "explosion", 0.3, explosionPosition4);
					var animation5 = new Animation(this.game, "explosion", 0.2, explosionPosition5);
					var animation6 = new Animation(this.game, "explosion", 0.1, explosionPosition6);
					this.game.addAnimation(animation1);
					this.game.addAnimation(animation2);
					this.game.addAnimation(animation3);
					this.game.addAnimation(animation4);
					this.game.addAnimation(animation5);
					this.game.addAnimation(animation6);
				}
			}
		}
	});
	
	return Building;
});