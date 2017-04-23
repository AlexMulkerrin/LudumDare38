// global reference to program object
var asteroidTerrarium;

function loadProgram() {
	asteroidTerrarium = new Program();
	window.requestAnimationFrame( function(){asteroidTerrarium.update();});
}

function Program() {
	this.timer = 0;
	this.updateRate = 2;
	this.control = new Control(this);
	this.simulation = new Simulation();
	this.display = new Display("terrariumCanvas", this.simulation);


	this.loadJSON("story.json");
}

Program.prototype.update = function() {
	this.timer++;
	if (this.timer % this.updateRate == 0) {
		//this.simulation.update();
		this.display.update();
	}
	var t = this;
	window.requestAnimationFrame( function(){t.update();} );
}

Program.prototype.loadJSON = function(name) {
	var t = this;
	var request = new XMLHttpRequest();
	request.open("GET", "Resources/"+name);
	request.overrideMimeType("application/json");
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			t.handleLoadedJSON(request.response, name);

		}
	}
	request.send();
}

Program.prototype.handleLoadedJSON = function(text, name) {
	var jsonObject = JSON.parse(text);
	if (name == "story.json") {
		this.outputStoryScript(jsonObject);
	}

}

Program.prototype.outputStoryScript = function(jsonObject) {

	this.simulation.story = jsonObject;
	this.display.update();
}
