define(["Compose", "Logger", "Background", "Random", "Building", "Vector2"], function(Compose, Logger, Background, Random, Building, Vector2) {
	
	var Game = Compose(function constructor() {
		
		// width, height
		this.width = 1000;
		this.height = 600;
		
		// the canvas
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;





		// Load images
		var imagesFileNames=["buildingBlock1", "buildingBlock2", "buildingBlock3", "buildingBlock4", "buildingTop1", "buildingTop2"];
		this.loadImages(imagesFileNames);

		// Load json data
		var jsonFileNames = []
		this.loadJson(jsonFileNames);

		// Generate the buildings
		this.minBuildingSpacing = 135;
		this.maxBuildingSpacing = 220;
		this.generateBuildings(10);

		this.worldPosition = 0;


	},
	{
		update: function() {
			var ctx = this.canvas.getContext('2d');  
			//ctx.clearRect(0, 0, this.width, this.height);
			ctx.fillStyle = "rgb(135, 206, 250)";
			ctx.fillRect(0, 0, this.width, this.height);
			//this.background.draw(ctx);

			this.update_karel();
			this.update_dave();
		},

		update_karel: function() {

		},







        loadImages: function(fileNames) {
        	this.images = new Array();
        	this.imagesPending = fileNames.length;
        	for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				Logger.log(fileName);
				require(["image!data/" + fileName + '.png'], this.imageLoaded.bind(this, fileName));
			}
        },

		imageLoaded: function(fileName, img) {
			this.ship = img;
			this.imagesPending--;

			this.images[fileName] = img;

			Logger.log('image loaded: ' + fileName + ' - ' + img);
		},

		loadJson: function(fileNames) {
			this.json = new Array();
			this.jsonPending = fileNames.length;
			for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				Logger.log(fileName);
				require(["json!" + fileName], this.jsonLoaded.bind(this, fileName));
			}
		},

		jsonLoaded: function(fileName, json) {
			this.json = json;
			this.jsonPending--;
			this.images[fileName] = json;
			Logger.log('json loaded: ' + fileName + ' - ' + json);
		},

		update_dave: function() {
			if (!(this.imagesPending == 0) || !(this.jsonPending == 0)) {
				return;
			}

			var ctx = this.canvas.getContext('2d');  
			for(var i = 0; i < this.buildings.length; i++) {
				this.buildings[i].draw(ctx, this.worldPosition);
			}

			// TODO tmp
			this.worldPosition += 1
		},

		generateBuildings: function(numBuildings) {
			this.buildings = new Array();
			var position = 0;
			for(var i = 0; i < numBuildings; i++) {
				position += Random.getInt(this.minBuildingSpacing, this.maxBuildingSpacing);
				this.buildings[i] = new Building(this, position);
			}
		},



		
		getCanvas: function() {
			return this.canvas;
		}
	});
	
	return Game;
});