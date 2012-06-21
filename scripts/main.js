
require(["Logger", "Loader", "Game", "FPSTimer", "Example"], function callback(Logger, Loader, Game, FPSTimer, Example) {
	
	// draw the log
	var log = document.getElementById("log");
	log.appendChild(Logger.getElement());
	
	// launch the game
	var main = document.getElementById("main");
	var game = new Game();
	main.appendChild(game.getCanvas());
	
	// set up update loop/FPS timer
	var fpsTimer = new FPSTimer(60, function(dt) {
		game.update();
		document.getElementById('fps').innerHTML = "FPS: " + fpsTimer.getFPS();
	});
	fpsTimer.start();
	
	// example
	var example = new Example(10);
	example.print();
	example.add(5);
	example.print();
	
	// als we add doorgeven aan een variabele (function pointer) gaat da, maar het gaat niet werken
	var addFun = example.add;
	addFun(5); // het probleem is dat this altijd naar het parent object wijst dat de functie oproept - in dit geval zijn we dus add aan het doen op de oproeper vd main-functie
	example.print();
	
	// maar als we het met bind doen wel - als ge functions doorgeeft aan variabelen (bv in callbacks) ALTIJD bind doen!
	// bind zorgt ervoor da "this" binnen de functie naar example wijst
	addFun = example.add.bind(example);
	addFun(10000);
	example.print();
});