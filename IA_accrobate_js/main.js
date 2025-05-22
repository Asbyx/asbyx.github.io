newCanvas(800, 600); // Increased height for more acrobatic space
let allImagesLoaded = true; //true si pas d'images.

textSize(12);
//var
let generation = 0; // Start at 0, reproduction will increment to 1 for the first gen
let highscore = 0;

let nbAccrobates = 25;
let nbAccrobatesAlive = 0;
let accrobates = [];
for (let i = 0; i < nbAccrobates; i++) {
	accrobates[i] = new Accrobate();
}

// Inspector Mode variables
let inspectMode = false;
let currentInspectIndex = 0;
let generationToInspectData = []; // Stores {dna, score, numFlips, landedProperly, etc.}
let inspectBtn;
let inspectorInfoDiv;
//---------------------------

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

if (allImagesLoaded) {
    inspectBtn = document.getElementById('inspectBtn');
    inspectorInfoDiv = document.getElementById('inspectorInfo');
    inspectBtn.addEventListener('click', handleClickInspectButton);
    reproduction(); // Create and setup the first generation
    draw();
}

let animationFrameId = null; // To control animation loop

function startNewGeneration() {
    accrobates = [];
    for (let i = 0; i < nbAccrobates; i++) {
        accrobates[i] = new Accrobate();
    }
    nbAccrobatesAlive = nbAccrobates;
    generation++;
}

function draw(){
	requestAnimationFrame(draw);
    
	clear();
	background(200, 220, 255); // Light blue sky background
	
	fill(0);
	text("Generation: " + generation, 5, 15);
	text("High Score: " + highscore.toFixed(2), 5, 30);
    text("Acrobats Alive: " + nbAccrobatesAlive, 5, 45); // Adjusted y-coordinate
    if (inspectMode && generationToInspectData.length > 0) {
        text(`INSPECTING: Acrobat ${currentInspectIndex + 1} of ${generationToInspectData.length}`, width - 250, 15);
    }

	for (let i = 0; i < accrobates.length; i++) {
		let accrobate = accrobates[i];
        let wasAliveBeforeUpdate = accrobate.isAlive;

		accrobate.show(); // show also calls update

        if (wasAliveBeforeUpdate && !accrobate.isAlive) { 
			nbAccrobatesAlive--;
			if (!inspectMode) { // Only update global highscore in normal simulation
                if (accrobate.score > highscore) highscore = accrobate.score;
            }
            if (inspectMode) {
                updateInspectorButtonAndInfoText(true); // True for 'finished' state
            }
		}
	}

	if(nbAccrobatesAlive <= 0 && !inspectMode && accrobates.length > 0) {
        generationToInspectData = accrobates.map(a => ({
            dna: _.cloneDeep(a.dna || []), // Ensure DNA is an array
            score: a.score || 0,
            numFlips: a.numFlips || 0,
            landedProperly: a.landedProperly || false,
            finalAngle: a.angle || 0
        }));
        generationToInspectData.sort((a,b) => b.score - a.score);
        reproduction();
    }
}

function handleClickInspectButton() {
    if (!inspectMode) {
        if (generationToInspectData.length === 0) {
            inspectorInfoDiv.innerHTML = "Waiting for current generation to complete before inspection can start.";
            return;
        }
        inspectMode = true;
        currentInspectIndex = 0;
        prepareNextInspectAcrobat();
    } else {
        currentInspectIndex++;
        if (currentInspectIndex < generationToInspectData.length) {
            prepareNextInspectAcrobat();
        } else {
            inspectMode = false;
            generationToInspectData = []; // Clear inspected data
            // Normal simulation will resume/continue via draw calling reproduction if needed
        }
    }
    updateInspectorButtonAndInfoText(false); // False for 'starting/running next' state
}

function updateInspectorButtonAndInfoText(isFinishedDisplay) {
    if (!inspectMode) {
        inspectBtn.textContent = "Inspect Generation";
        inspectorInfoDiv.innerHTML = "";
        return;
    }

    if (currentInspectIndex >= generationToInspectData.length) { // Should only happen when exiting
        inspectBtn.textContent = "Inspect Generation";
        inspectorInfoDiv.innerHTML = "Inspection finished. Restart simulation.";
        return;
    }

    let acrobatData = generationToInspectData[currentInspectIndex];
    let displayIndex = currentInspectIndex + 1;

    if (isFinishedDisplay) {
        let currentDisplayedAcrobat = accrobates[0]; // The one that just finished its run
        inspectorInfoDiv.innerHTML = 
            `<b>Acrobat ${displayIndex} Finished Run</b><br>
             Score: ${currentDisplayedAcrobat.score.toFixed(2)}<br>
             Flips: ${currentDisplayedAcrobat.numFlips}<br>
             Landed: ${currentDisplayedAcrobat.landedProperly}<br> 
             Angle: ${(currentDisplayedAcrobat.angle * 180 / Math.PI).toFixed(1)}deg<br>
             Original Score: ${acrobatData.score.toFixed(2)}`;
        if (displayIndex < generationToInspectData.length) {
            inspectBtn.textContent = `Run Next Acrobat (${displayIndex + 1}/${generationToInspectData.length})`;
        } else {
            inspectBtn.textContent = "Restart Simulation";
        }
    } else { // Acrobat is about to run or is running
        inspectorInfoDiv.innerHTML = `Now Running: Acrobat ${displayIndex}/${generationToInspectData.length}<br>(Original Score: ${acrobatData.score.toFixed(2)})`;
        inspectBtn.textContent = `Acrobat ${displayIndex} is Running...`; 
        // For now, button click during run will advance to next if it finishes early due to crash.
        // True skip functionality would require more logic to interrupt the current acrobat.
    }
}

function prepareNextInspectAcrobat() {
    if (currentInspectIndex >= generationToInspectData.length) return;

    let dnaInfo = generationToInspectData[currentInspectIndex];
    let acrobatToRun = new Accrobate(); 
    acrobatToRun.dna = _.cloneDeep(dnaInfo.dna || []); // Ensure DNA is an array
    
    accrobates = [resetAccrobate(acrobatToRun)]; 
    nbAccrobatesAlive = 1;
    // updateInspectorButtonAndInfoText(false) will be called by handleClickInspectButton after this
}

function resetAccrobate(accrobateInstance) {
    accrobateInstance.isAlive = true;
    accrobateInstance.x = 50;
    accrobateInstance.y = height / 4;
    accrobateInstance.vx = 0; accrobateInstance.vy = 0;
    accrobateInstance.angle = 0; accrobateInstance.angularVelocity = 0;
    accrobateInstance.onBar = true;
    accrobateInstance.internalClock = 0; accrobateInstance.currentDnaIndex = 0;
    accrobateInstance.score = 0; accrobateInstance.landedProperly = false;
    accrobateInstance.totalRotation = 0;
    accrobateInstance.numFlips = 0;
    return accrobateInstance;
}

function reproduction(){
    if (inspectMode) return; 

    let prevGenerationAcrobats = accrobates;
    if (prevGenerationAcrobats.length > 0 && prevGenerationAcrobats[0].score > highscore) {
        highscore = prevGenerationAcrobats[0].score;
    }

    let bestDNAs = [];
    if (prevGenerationAcrobats.length > 0) {
        prevGenerationAcrobats.sort((a, b) => b.score - a.score);
        let topPercent = 0.1;
        let numToKeep = Math.max(1, Math.floor(nbAccrobates * topPercent));
        for (let i = 0; i < numToKeep && i < prevGenerationAcrobats.length; i++) {
            bestDNAs.push(_.cloneDeep(prevGenerationAcrobats[i].dna || []));
        }
    }
    if (bestDNAs.length === 0 && nbAccrobates > 0) { // Fallback: if no best DNA, use new random for seeds
        for(let i=0; i< Math.max(1, Math.floor(nbAccrobates * 0.1)); i++) bestDNAs.push(new Accrobate().dna);
    }

    let newAccrobatesList = [];
    for (let i = 0; i < nbAccrobates; i++) {
        let newAcrobat;
        if (i < bestDNAs.length) { // Elitism for the very best
            newAcrobat = new Accrobate();
            newAcrobat.dna = _.cloneDeep(bestDNAs[i]);
        } else if (i < nbAccrobates * 0.7 && bestDNAs.length > 0) { 
            let parentADNA = bestDNAs[random(0, bestDNAs.length - 1, true)];
            let parentBDNA = bestDNAs[random(0, bestDNAs.length - 1, true)];
            let tempParentA = new Accrobate(); tempParentA.dna = parentADNA;
            let tempParentB = new Accrobate(); tempParentB.dna = parentBDNA;
            newAcrobat = crossover(tempParentA, tempParentB);
        } else { 
            newAcrobat = new Accrobate();
        }
        newAcrobat.mutate(0.1);
        newAccrobatesList.push(resetAccrobate(newAcrobat));
    }
    
    accrobates = newAccrobatesList;
    nbAccrobatesAlive = accrobates.length;
    generation++; 
} 