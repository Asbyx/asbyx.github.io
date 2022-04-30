function Point (){
	this.x = random(width/2, width-20);
	this.y = height;

	this.show = function(){
		fill(0, 255, 0);
		rectCenter("C");
		rect(this.x, this.y, 8, 16);
	}
}
