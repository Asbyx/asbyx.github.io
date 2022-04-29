/* le test ultime, sera très simple: entrainer le réseau pour
lui faire comprendre le concept de droite ou gauche.
inputs: x et y (compris entre 0 et 1)
outputs: droite ou gauche, celui avec le nb le plus proche du 1
		est considéré comme la réponse donnée.
*/


function NeuralByx (nbInputs, nbHidden, nbPerHidden, nbOutputs){
/*nbInputs = nb de neurone dans l'inputs layer
  nbHidden = nb de hidden layer (nombre de couches cachées)
  nbPerHidden = nb de neurones dans les hidden layer
  nbOutputs = nb de neurones dans l'outputs layer
*/


//initialisation de tous les neurones
	this.inputs = nbInputs;
	this.nbOutputs = nbOutputs;
	this.lastHiddenLayer = nbHidden-1;
	this.nbNeurones = nbOutputs + nbPerHidden*nbHidden; //compte le nb de neurones au total


	this.outputs = [];
	for (var j = 0; j < nbOutputs; j++) {
		this.outputs[j] = [[], Math.random()*2 - 1, 0]; //[weights, bias, valeur calculée par le neurone]
		for (var k = 0; k < nbPerHidden; k++) { //weights
			this.outputs[j][0][k] = Math.random()*2 - 1;
		}
	}
		

	this.hidden = [];
	for (var i = 0; i < nbHidden; i++) {
		this.hidden[i] = [];

		if(i === 0){ //on calcule le nombre de weights nécessaires.
			previousNumberOfNeurones = this.inputs;
		} else {
			previousNumberOfNeurones = this.hidden[i-1].length;
		}

		for (var j = 0; j < nbPerHidden; j++) {
			this.hidden[i][j] = [[], Math.random()*2 - 1, 0];

			for (var k = 0; k < previousNumberOfNeurones; k++) { //weights
				this.hidden[i][j][0][k] = Math.random()*2 - 1;
			}
		}
	}



	this.think = function(inputs){
	//inputs -> hidden
		//si on a pas le bon nombre d'inputs, pas de guess
		if(inputs.length != this.inputs) {alert("NeuralByx Error:\nNumbers of inputs incorrect"); return false;};

		for (var i = 0; i < this.hidden.length; i++) {
			activations = [];

			if(i === 0){ //si c'est le premier layer
				previousNumberOfNeurones = this.inputs;
				activations = inputs;
			} else {
				previousNumberOfNeurones = this.hidden[i-1].length;
				for (var j = 0; j < previousNumberOfNeurones; j++) {
					activations[j] = this.hidden[i-1][j][2];
				}
			}

			
			for (var j = 0; j < this.hidden[i].length; j++) {
				sum = 0;
				for (var k = 0; k < previousNumberOfNeurones; k++) {
					sum += activations[k]*this.hidden[i][j][0][k];
				}
				sum -= this.hidden[i][j][1]; //bias

				this.hidden[i][j][2] = sigmoid(sum);
			}
		}

		for (var i = 0; i < this.outputs.length; i++) {
			sum = 0;
			for (var j = 0; j < this.outputs[i][0].length; j++) {
				sum += this.outputs[i][0][j]*this.hidden[this.lastHiddenLayer][j][2];
			}
			sum -= this.outputs[i][1]; //bias

			this.outputs[i][2] = sigmoid(sum);
		}

		outputs = [];
		for (var i = 0; i < this.nbOutputs; i++) {
			outputs[i] = this.outputs[i][2];
		}
		return outputs;
	};



	this.mutate = function (tx) { //tx = taux de mutation (de 0 à 1) 
		//(= % de chances qu'un neurone mute)

		//hidden
		for (var i = 0; i < this.hidden.length; i++) {		
			for (var j = 0; j < this.hidden[i].length; j++) {
				for (var k = 0; k < this.hidden[i][j][0].length; k++) {
					if(Math.random() < tx){
						this.hidden[i][j][0][k] = Math.random()*2 - 1;
					}
				}

				//bias
				if(Math.random() < tx){
					this.hidden[i][j][1] = Math.random()*2 - 1;
				}
			}
		}

		//output
		for (var i = 0; i < this.outputs.length; i++) {
			//weights
			for (var j = 0; j < this.outputs[i][0].length; j++) {
				if(Math.random() < tx){
					this.outputs[i][0][j] = Math.random()*2 - 1;
				}
			}

			//bias
			if(Math.random() < tx){
				this.outputs[i][1] = Math.random()*2 - 1;
			}
		}
	};







}

function sigmoid (x){
	return 1/(1+Math.exp(-x));
}