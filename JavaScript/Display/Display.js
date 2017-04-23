const interfaceColours = {
	background:"#005784", text:"#C1AC7E", textHighlight:"#F1EACC"
}

function Display(canvasName, sim) {
	this.targetSim = sim;
	this.fontSize = 16;
	this.maxLineLength = 70;
	this.loader = new ImageLoader();

	this.canvas = document.getElementById(canvasName);
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.starfield = [];
	this.starfieldX = 0;
	this.starfieldY = 0;
	this.starfieldVX = 0.1;//(Math.random()-0.5)*0.2;
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
	if (this.loader.allImagesLoaded) {
		this.drawAsteroidStage();
	}
	this.drawTitle();
	this.drawAuthor();
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
Display.prototype.drawAsteroidStage = function() {
	var index = this.targetSim.currentPage;
	var image = this.loader.placeholderImage[index];
	var offsetX = (window.innerWidth-image.width)/2;
	this.ctx.drawImage(image, offsetX,0);
}

Display.prototype.drawTitle = function() {
	var text = this.targetSim.story.title;
	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillText(text, this.fontSize+1, this.fontSize+1);
	this.ctx.fillStyle = interfaceColours.textHighlight;
	this.ctx.fillText(text, this.fontSize, this.fontSize);
}
Display.prototype.drawAuthor = function() {
	var text = this.targetSim.story.author;
	//this.ctx.fillStyle = interfaceColours.text;
	//this.ctx.fillText(text, this.fontSize+1, this.fontSize*3+1);
	this.ctx.fillStyle = interfaceColours.textHighlight;
	this.ctx.fillText(text, this.fontSize, this.fontSize*3);
}


Display.prototype.drawStoryText = function() {
	var index = this.targetSim.currentPage;
	// do byteglyph representation
	var words = this.targetSim.story.text[index].split(/\s+/);
	var offsetX = 1;
	var offsetY = 200;
	var scale = 2;
	for (var i=0; i<words.length; i++) {
		var word = words[i];
		if ( (offsetX+word.length) > this.maxLineLength) {
			offsetX = 1;
			offsetY += this.fontSize*3;
		}
		this.ctx.fillStyle = interfaceColours.textHighlight;
		this.ctx.fillText(word, offsetX*scale*7+10, offsetY+this.fontSize*2);
		this.ctx.fillStyle = interfaceColours.text;

		for (var j=0; j<word.length; j++) {
			var charCode = word.charCodeAt(j);
			this.drawByteGlyph(offsetX*scale*7, offsetY, scale, charCode);
			offsetX++;
		}
		offsetX+=0.5;
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
