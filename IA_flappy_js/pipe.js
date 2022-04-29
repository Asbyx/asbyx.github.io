//le this.y désigne le pipe du bas
var taille = 95;
var largeur = 7.5;

function Pipe () {
	this.y = random(height-taille, taille*1.5);;
	this.x = width + 50;;


	this.show = function (){
		this.x -= 1.5;

		fill(0);
		rect(this.x, this.y, largeur, height-this.y);
		rect(this.x, 0, largeur, this.y-taille);
	}
}