var img = newImage("missile.png");

function Missile() {
	this.isAlive = true;
	this.score;
	this.x = 10; 
	this.y = this.yReached = height - 7.5; //dessiner selon le milieu
	this.r = -Math.PI/2;
	this.v = new Vector(0, 0);
	this.timeAlive = 0;
	this.energySpend = 0;

	this.brain = new NeuralByx(6, 2, 10, 3);

	this.show = function(){
		this.timeAlive ++;

		drawImage(img, this.x, this.y, 1, 1, this.r, true);
		if (this.v.y < 2) this.v.y += 0.1//normal = 0.05;
		this.x += this.v.x;
		this.y += this.v.y;

		if(this.y < this.yReached) this.yReached = this.y;

		//fin de vie
		if(this.y + (Math.sin(this.r)*img.height-2) < 0 || this.x + (Math.cos(this.r)*img.height-1) < 0 || this.y + (Math.sin(this.r)*img.height-2) > height || this.x + (Math.cos(this.r)*img.height-1) > width || this.timeAlive > 300){ //à 500 d'itérations on stop
			this.isAlive = false;
			this.score = 2*(height - this.yReached) - this.energySpend/2 - 8*dist(this.x, this.y, P.x, P.y);
		}
	}

	this.thruster = function(){
		if(this.v.magnitude() == 0){
			this.v.x = this.v.y = 1;
			this.v.setAngle(this.r);
			this.v.setMagnitude(0.5);
		} else {
			this.v.x += Math.cos(this.r) * 0.2;
			this.v.y += Math.sin(this.r) * 0.2;
		}
		this.energySpend ++;
	}

	this.right = function(){
		this.r += Math.PI/16;
		this.energySpend ++;
	}

	this.left = function(){
		this.r -= Math.PI/16;
		this.energySpend ++;
	}

	this.think = function(){
		if(this.r > Math.PI*2) this.r -= Math.PI*2;
		if(this.r < 0) this.r += Math.PI*2;

		let inputs = [this.x/width, this.y/height, P.x/width, this.r/(2*Math.PI), this.v.x/20, this.v.y/20];
		let outputs = this.brain.think(inputs);
		
		if(outputs[0] > 0.5) this.thruster();
		if(outputs[1] > 0.5) this.right();
		if(outputs[2] > 0.5) this.left();
	}
}