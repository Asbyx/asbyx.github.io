function Bird (){	this.isAlive = true;
	this.y = height/2;
	this.inertie = 0;

	this.brain = new neuralByx(3, 1, 6, 1);

	this.isOneOfTheBests = false;

	this.fly = function () {
		this.inertie = -10;
	}

	this.show = function(){
		let inputs = [this.y/height, pipeRight.x/(width+50), pipeRight.y/height]
		this.thought = this.brain.think(inputs);
		if(this.thought > 0.5) this.fly();

		this.inertie += 0.5;
		this.y += this.inertie;

		if (this.y >= height - 10 || this.y <= 10 || (this.y+10 > pipeRight.y && pipeRight.x < 60 && pipeRight.x > 40) || (this.y+10 < pipeRight.y - taille && pipeRight.x < 60 && pipeRight.x > 40)) this.isAlive = false;


		fill(0, 0, 0, 0.1);
		circle(50, this.y, 10);
	}
}