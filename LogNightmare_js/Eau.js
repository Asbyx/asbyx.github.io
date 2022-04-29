function Eau (x, y, isD, l) { //isD => true si le jet va à droite
	this.x = x;
	this.y = y;
	this.timer = 50+7.5*l;
	switch(l){
	case 1:
		if (isD) this.v = new Vecteur(5, Math.random()*(0.5)); else this.v = new Vecteur(-5, Math.random()*(0.5));
		break;
	case 2:
		if (isD) this.v = new Vecteur(5, Math.random()*(1)); else this.v = new Vecteur(-5, Math.random()*(1));
		break;
	case 3:
		if (isD) this.v = new Vecteur(5, Math.random()*(2)); else this.v = new Vecteur(-5, Math.random()*(2));
		break;
	case 4:
		if (isD) this.v = new Vecteur(5, Math.random()*(4)); else this.v = new Vecteur(-5, Math.random()*(4));
		break;
	case 5:
		if (isD) this.v = new Vecteur(5, Math.random()*(6)); else this.v = new Vecteur(-5, Math.random()*(8));
		break;
	case 6:
		if (isD) this.v = new Vecteur(5, Math.random()*(3)); else this.v = new Vecteur(-5, Math.random()*(3));
		break;
	}

	if(Math.random() > 0.5) this.v.y *= -1;
	this.v.setNorme(5);
	eauUsed ++;
	eau.push(this);

	this.show = function (e){
		this.timer --;
		this.x += this.v.x;
		this.y += this.v.y;
		drawImage(imgEau, this.x, this.y, taille/4, taille/4, 0, true);
		if(this.timer < 0){
			eau.splice(eau.findIndex(this.isThis), 1); //se supprime lui-même 
		}
	}
	this.isThis = (el) => el == this;
}