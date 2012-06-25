define(["Compose", "Logger", "Background", "Random", "Building", "Vector2", "Dino", "Animation"], function(Compose, Logger, Background, Random, Building, Vector2, Dino, Animation) {
	
	var Game = Compose(function constructor() {
		
		// width, height
		this.width = 1000;
		this.height = 600;

		// floor height
		this.floorHeight = 25;
		
		// the canvas
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		// Load images
		var imagesFileNames=["ground", "buildingBlock1", "buildingBlock2", "buildingBlock3", "buildingBlock4", "buildingTop1", "buildingTop2", "dinoAnimLegSS", "explosionSS", "BG2"];
		this.loadImages(imagesFileNames);

		// Load json data
		var jsonFileNames = ["explosion"];
		this.loadJson(jsonFileNames);

		// Generate the buildings
		this.minBuildingSpacing = 135;
		this.maxBuildingSpacing = 220;
		this.generateBuildings(250);

		this.worldPosition = 0;

		// Animations
		this.animations = new Array();

		// dino
		this.dino = new Dino();

		// keys
		this.keys = {};
		this.keyDown = function(e) {
			var ch = String.fromCharCode(e.keyCode);
			this.keys[ch] = true;
		};
		
		this.keyUp = function(e) {
			var ch = String.fromCharCode(e.keyCode);
			this.keys[ch] = false;
		};

		this.mouseClick = function(e) {
			var mousePosX = -1;
			var mousePosY = -1;
			if (!e) var e = window.event;
			if (e.pageX || e.pageY) 	{
				mousePosX = e.pageX;
				mousePosY = e.pageY;
			}
			else if (e.clientX || e.clientY) 	{
				mousePosX = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				mousePosY = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}

			if ((this.mousePosX != -1) && (this.mousePosX != -1)) {
				this.mousePressed = true;
				mousePosX -= this.canvas.offsetLeft;
				mousePosY -= this.canvas.offsetTop;

				this.MousePosition = new Vector2(mousePosX, mousePosY)
			}
		};
		
		document.onkeydown = this.keyDown.bind(this);
		document.onkeyup = this.keyUp.bind(this);
		this.canvas.onmousedown = this.mouseClick.bind(this);
	},
	{
		update: function() {
			var ctx = this.canvas.getContext('2d');  
			//ctx.fillStyle = "rgb(135, 206, 250)";
			//ctx.fillRect(0, 0, this.width, this.height);

			this.update_karel();
			this.update_dave();
		},

		update_karel: function() {
			var ctx = this.canvas.getContext('2d');
			ctx.save();

			// update the different chars
			if (this.keys['A']) this.dino.issueCommand('moveLeg', 'LEFT', 'BACK', false);
			if (this.keys['Z']) this.dino.issueCommand('moveLeg', 'LEFT', 'BACK', true);
			if (this.keys['E']) this.dino.issueCommand('moveLeg', 'RIGHT', 'BACK', false);
			if (this.keys['R']) this.dino.issueCommand('moveLeg', 'RIGHT', 'BACK', true);
			if (this.keys['Q']) this.dino.issueCommand('moveLeg', 'LEFT', 'FRONT', false);
			if (this.keys['S']) this.dino.issueCommand('moveLeg', 'LEFT', 'FRONT', true);
			if (this.keys['D']) this.dino.issueCommand('moveLeg', 'RIGHT', 'FRONT', false);
			if (this.keys['F']) this.dino.issueCommand('moveLeg', 'RIGHT', 'FRONT', true);

			// draw the dino
			this.dino.update();
			this.dino.draw(ctx);

			ctx.restore();
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
			this.imagesPending--;
			this.images[fileName] = img;
			Logger.log('image loaded: ' + fileName + ' - ' + img);
		},

		loadJson: function(fileNames) {
			this.json = new Array();
			this.jsonPending = fileNames.length;
			for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				Logger.log(fileName);
				require(["json!data/" + fileName + '.json'], this.jsonLoaded.bind(this, fileName));
			}
		},

		jsonLoaded: function(fileName, json) {
			this.jsonPending--;
			this.json[fileName] = json;
			Logger.log('json loaded: ' + fileName + ' - ' + json);
		},



		update_dave: function() {
			if (!(this.imagesPending == 0) || !(this.jsonPending == 0)) {
				this.mousePressed = false;
				return;
			}

			var ctx = this.canvas.getContext('2d');  

			// Handle mouse events
			this.handleMouseClick();

			// Draw the background
			ctx.drawImage(this.images["BG2"], - (Math.floor(this.worldPosition / 3) % this.width), 0);
			ctx.drawImage(this.images["BG2"], - (Math.floor(this.worldPosition / 3) % this.width) + this.width, 0);
			//ctx.drawImage(this.images["BG2"], 0, 0);

			// Draw buildings
			for(var i = 0; i < this.buildings.length; i++) {
				this.buildings[i].draw(ctx, this.worldPosition);
			}

			// Draw the ground
			ctx.drawImage(this.images["ground"], -(this.worldPosition % this.width), this.height - 50);
			ctx.drawImage(this.images["ground"], this.width - (this.worldPosition % this.width), this.height - 50);
			ctx.drawImage(this.images["ground"], (this.width * 2) - (this.worldPosition % this.width), this.height - 50);

			// Draw animations
			for(var j = 0; j < this.animations.length; j++) {
				this.animations[j].draw(ctx, this.worldPosition);
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

		handleMouseClick: function() {
			if (!this.mousePressed) {
				return;
			}

			this.mousePressed = false;

			// Detect collision with building
			for(var i = 0; i < this.buildings.length; i++) {
				if (this.buildings[i].checkCollision(this.worldPosition, this.MousePosition)) {
					this.buildings[i].handleDamage(15, this.worldPosition, this.MousePosition);
				}
			}
		},


		addAnimation: function(animation) {
			this.animations[this.animations.length] = animation;
		},

		stopAnimation: function(animation) {
			var idx = this.animations.indexOf(animation);
			if(idx != -1) {
				this.animations.splice(idx, 1);
			}
		},
		
		getCanvas: function() {
			return this.canvas;
		}
	});
	
	return Game;
});