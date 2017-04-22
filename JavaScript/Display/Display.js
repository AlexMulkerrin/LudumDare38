const interfaceColours = {
	background:"#005784", text:"#C1AC7E", textHighlight:"#F1EACC"
}

function Display(canvasName, sim) {
	this.targetSim = sim;
	this.fontSize = 24;
	this.lineWidth = 60;

	this.canvas = document.getElementById(canvasName);
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.starfield = [];
	this.starfieldX = 0;
	this.starfieldY = 0;
	this.starfieldVX = Math.random()-0.5;
	this.starfieldVY = Math.random()-0.5;
	this.createStarfield();
	this.resizeCanvas();

	var t = this;
	window.onresize = function(){t.resizeCanvas();};
}

Display.prototype.resizeCanvas = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx.font = "bold "+this.fontSize+"px Arial";
	this.createStarfield();
	this.refresh();
}
Display.prototype.createStarfield = function() {
	var total = Math.floor(this.canvas.width*this.canvas.height/1000);
	this.starfield = [];
	for (var i=0; i<total; i++) {
		this.starfield[i] = new starPoint(this.canvas.width,this.canvas.height)
	}
}

function starPoint(maxX, maxY) {
	this.x = randomInteger(maxX);
	this.y = randomInteger(maxY);
	this.depth = Math.random()*10;
	this.size = randomInteger(5);
}
Display.prototype.update = function() {
	//this.starfieldX += this.starfieldVX;
	//this.starfieldY += this.starfieldVY;
	this.refresh();
}
Display.prototype.refresh = function() {
	this.clearScreen();
	this.drawStarfield();
	this.drawStoryPage();
}
Display.prototype.clearScreen = function() {
	this.ctx.fillStyle = interfaceColours.background;
	this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
}
Display.prototype.drawStarfield = function() {
	this.ctx.fillStyle = "#ffffff";
	var star;
	for (var i=0; i<this.starfield.length; i++) {
		star = this.starfield[i];
		star.x = (star.x + this.starfieldVX*star.depth)%this.canvas.width;
		star.y = (star.y + this.starfieldVY*star.depth)%this.canvas.height;
		if (star.x < 0) star.x += this.canvas.width;
		if (star.y < 0) star.y += this.canvas.height;
		this.ctx.fillRect(star.x,star.y,star.size, star.size);
	}
}
Display.prototype.drawStoryPage = function() {
	var page = this.targetSim.storyScript[this.targetSim.currentPage] || "";
	for (var i=0; i<page.length/this.lineWidth; i++) {
		var substring = page.substring(i*this.lineWidth, i*this.lineWidth+this.lineWidth);
		this.ctx.fillStyle = interfaceColours.text;
		this.ctx.fillText(substring, this.fontSize, i*this.fontSize+this.fontSize);
		this.ctx.fillStyle = interfaceColours.textHighlight;
		this.ctx.fillText(substring, this.fontSize, i*this.fontSize+this.fontSize);
	}
}
Display.prototype.drawStoryText = function() {
	var index = this.targetSim.currentPage;
	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillText(this.targetSim.storyScript[index], 21, 22);
	this.ctx.fillStyle = interfaceColours.textHighlight;
	this.ctx.fillText(this.targetSim.storyScript[index], 20, 20);
}
