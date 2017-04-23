const interfaceColours = {
	background:"#005784", text:"#C1AC7E", textHighlight:"#F1EACC"
}

function Display(canvasName, sim) {
	this.targetSim = sim;
	this.fontSize = 24;
	this.maxLineLength = 40;

	this.canvas = document.getElementById(canvasName);
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.starfield = [];
	this.starfieldX = 0;
	this.starfieldY = 0;
	this.starfieldVX = (Math.random()-0.5)*0.2;
	this.starfieldVY = 0;//Math.random()-0.5;
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
	//this.drawStoryPage();
	this.drawStoryText();
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
	var page = this.targetSim.story.text[this.targetSim.currentPage] || "";
	/*var words = page.split(/\s+/);
	var lineLength, end=0, start=0, index = 0;
	while (index<page.length) {
		lineLength = 0;
		start = end
		while ( lineLength < this.maxLineLength) {
			lineLength + words[end].length;
			end++;
		}

	}*/
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
/*
	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillText(this.targetSim.storyScript[index], 21, 22);
	this.ctx.fillStyle = interfaceColours.textHighlight;
	this.ctx.fillText(this.targetSim.storyScript[index], 20, 20);
*/
	// do byteglyph representation
	//this.ctx.fillStyle = interfaceColours.text;
	var words = this.targetSim.story.text[index].split(/\s+/);
	var offsetX = 1;
	var offsetY = 40;
	var scale = 3;
	for (var i=0; i<words.length; i++) {
		var word = words[i];
		if ( (offsetX+word.length) > this.maxLineLength) {
			offsetX = 1;
			offsetY += 52;
		}

		this.ctx.fillStyle = interfaceColours.textHighlight;
		this.ctx.fillText(word, offsetX*scale*7+10, offsetY+42);
		this.ctx.fillStyle = interfaceColours.text;

		for (var j=0; j<word.length; j++) {
			var charCode = word.charCodeAt(j);
			this.drawByteGlyph(offsetX*scale*7, offsetY, scale, charCode);
			offsetX++;
		}
		offsetX++;
	}
}

Display.prototype.drawByteGlyph = function(x, y, scale, inputByte) {
	this.ctx.fillRect(x+2*scale, y, scale, scale*7);

	if (inputByte & 1) this.ctx.fillRect(x+scale*3, y, scale*2, scale);
	if (inputByte & 2) this.ctx.fillRect(x+scale*3, y+scale*2, scale*2, scale);
	if (inputByte & 4) this.ctx.fillRect(x+scale*3, y+scale*4, scale*2, scale);
	if (inputByte & 8) this.ctx.fillRect(x+scale*3, y+scale*6, scale*2, scale);

	if (inputByte & 16) this.ctx.fillRect(x, y, scale*2, scale);
	if (inputByte & 32) this.ctx.fillRect(x, y+scale*2, scale*2, scale);
	if (inputByte & 64) this.ctx.fillRect(x, y+scale*4, scale*2, scale);
	if (inputByte & 128) this.ctx.fillRect(x, y+scale*6, scale*2, scale);
}
