function Control(inProgram) {
	this.targetProgram = inProgram;
	this.targetCanvas = document.getElementById("terrariumCanvas");
	var t = this;
	this.targetCanvas.onmousedown = function (event) {t.mousePressed(event);};
}

Control.prototype.mousePressed = function (event) {
    if (this.targetProgram.simulation.currentPage < 21) {
		this.targetProgram.simulation.currentPage++;
	}
	this.targetProgram.display.update();
}
