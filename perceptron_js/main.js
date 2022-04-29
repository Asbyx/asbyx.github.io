newCanvas(400, 400);
var allImagesLoaded = true; //true si pas d'images.

//var
var timer = 0;
ctx.translate(width/2, height/2);
ctx.scale(1, -1);
var a = Math.random()*(6) - 3, b = Math.random()*(60) - 30;
//--------------------------- 

function f(x){
	return a * x + b;
}

function Perceptron (){
	this.weights = [Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*2 - 1];
	this.lr = 0.1;

	this.predict = function(inp){
		this.sum = 0;
		for (var j = this.weights.length - 1; j >= 0; j--) {
			this.sum += this.weights[j] * inp[j];
		}
		return this.activation(this.sum);
	}

	this.activation = function(n){
		if(n >= 0) return 1; else return -1;
	}

	this.correction = function(inp, desired){
		this.guess = this.predict(inp);
		this.error = desired - this.guess;

		for (var j = this.weights.length - 1; j >= 0; j--) {
			this.weights[j] += this.error * inp[j] * this.lr;
		}
	}

	this.brainVisualisation = function(){
		fill(0, 0, 255);
		let w0 = this.weights[0];
		let w1 = this.weights[1];
		let w2 = this.weights[2];

		line(-width/2, -w2/w1 - w0/w1 * (-width/2), width/2, -w2/w1 - w0/w1 * (width/2));
	}
}

var Yvan = new Perceptron();

function Point(){
	this.x = Math.random()*( (width/2) + (width/2) + 1 ) - (width/2);
	this.y = Math.random()*( (height/2) + (height/2) + 1) - (height/2);
	if(f(this.x) > this.y) this.nb = 1; else this.nb = -1;

	this.show = function(){
		if(this.nb == 1) fill(255);
		else fill(0);
		circle(this.x, this.y, 6);
	}
}

var pt = [];
for (var i = 0; i < 100; i++) {
	pt[i] = new Point();
}


if (allImagesLoaded) draw();
function draw(){
	timer ++;
	requestAnimationFrame(draw);
	background(127);
	ctx.clearRect(-width, -height, width*2, height*2);

	fill(0);
	line(-width/2, f(-width/2), width/2, f(width/2));

	for (var i = pt.length - 1; i >= 0; i--) {
		pt[i].show();
		let inputs = [pt[i].x, pt[i].y, 1]; //1 == bias
		let target = pt[i].nb;

		if(Yvan.predict(inputs) == pt[i].nb)fill(0, 255, 0); else fill(255, 0, 0);
		circle(pt[i].x, pt[i].y, 3);

		// if(timer % 25 == 0)
		Yvan.correction(inputs, target);
	}
	Yvan.brainVisualisation();
}

function isKeyPressed(key) {
	if(key == "Space"){
		for(i = 0; i < 100; i++){
			pt[i] = new Point();
		}
	}
}