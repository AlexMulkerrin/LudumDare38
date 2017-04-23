function Control(inProgram) {
	this.targetProgram = inProgram;
	this.targetCanvas = document.getElementById("terrariumCanvas");
	var t = this;
	this.createKeyboardEventHandlers();
	this.targetCanvas.onmousedown = function (event) {t.mousePressed(event);};
}

Control.prototype.mousePressed = function (event) {
    if (this.targetProgram.simulation.currentPage < 21) {
		this.targetProgram.simulation.currentPage++;
	}
	this.targetProgram.display.update();
}
Control.prototype.createKeyboardEventHandlers = function() {
	var t = this;
	document.onkeydown = function(event) {
		var keyCode;
		if (event === null) {
			keyCode = window.event.keyCode;
		} else {
			keyCode = event.keyCode;
		}
		switch (keyCode) {
			default:
				t.mousePressed();

				break;
		}
	}
}
