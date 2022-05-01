function Confettis(x, y) {
	this.x = x;
	this.y = y;
	this.col = Math.round(Math.random()*(8));
	this.v = new Vector(Math.random()*(16)-8, -5);
	this.v.setMagnitude(2);	
	this.timer = 0;

	this.show = function(){
		this.timer ++;
		this.x += this.v.x;
		this.y += this.v.y;
		this.v.y += 0.2;
		this.v.setMagnitude(2);	

		this.getCol();
		rect(this.x, this.y, 4, 4);
	}

	this.getCol = function(){
		switch(this.col){
		case 0:
			fill(255);
			break;

		case 1:
			fill(255, 0, 0);
			break;

		case 2:
			fill(0, 255, 0);
			break;

		case 3:
			fill(0, 0, 255);
			break;

		case 4:
			fill(0, 255, 255);
			break;

		case 5:
			fill(255, 0, 102);
			break;

		case 6:
			fill(153, 0, 205);
			break;

		case 7:
			fill(255, 255, 0);
			break;

		case 8:
			fill(179, 255, 153);
			break;
		}
	}
}
