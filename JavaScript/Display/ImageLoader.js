function ImageLoader() {
	var imageNames = [
		"1 asteroid", "2 hollow out", "3 external storage", "4 propulsion unit",
		"5 install axle", "6 inner cyclinder option", "7 spin",
		"8 apply rare elements", "9 install sunline", "10 atmosphere",
		"11 select biome firmament", "12 bacterial bake", "13 create marsh biome",
		 "14 add animal populations", "15 increase biomass", "16 landscaping",
		 "17 many biomes", "18 tweak environment", "19 custom walls", "20 birds",
		 "21 habitation", "22 complete"
	 ];
	this.totalImages = imageNames.length;
	this.loadedImages = 0;
	this.placeholderImage = [];
	this.allImagesLoaded = false;

	var t = this;
	for (var i=0; i<imageNames.length; i++) {
		var name = imageNames[i];
		this.placeholderImage[i] = new Image();
		this.placeholderImage[i].crossOrigin = "Anonymous";
	    this.placeholderImage[i].src = "Resources/Placeholders/"+name+".png";

		this.placeholderImage[i].onload = function() {
			t.loadedImages++;
			if (t.loadedImages === t.totalImages) {
		 		t.allImagesLoaded = true;
	 		}
		}
	}
}
