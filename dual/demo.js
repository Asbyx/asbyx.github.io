// Demo mode for Duel d'Arcane with AI opponent
class DemoGame {
    constructor() {
        this.gameState = new GameState();
        this.currentPlayerIndex = 0;
        this.isMyTurn = true;
        this.selectedCard = null;
        this.aiPlayerIndex = 1;
        
        this.initializeEventListeners();
        this.startGame();
    }

    initializeEventListeners() {
        // Demo menu buttons
        document.getElementById('start-demo').addEventListener('click', () => this.startDemoGame());
        document.getElementById('rules-btn').addEventListener('click', () => this.showRules());
        document.getElementById('back-to-main').addEventListener('click', () => this.goToMain());

        // Game controls
        document.getElementById('end-turn').addEventListener('click', () => this.endTurn());
        document.getElementById('draw-card').addEventListener('click', () => this.drawCard());
        document.getElementById('activate-artifact').addEventListener('click', () => this.activateArtifact());
        document.getElementById('ai-turn').addEventListener('click', () => this.playAITurn());

        // Rules modal
        const modal = document.getElementById('rules-modal');
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => this.hideRules());
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.hideRules();
            }
        });
    }

    showDemoMenu() {
        this.hideAllScreens();
        document.getElementById('demo-menu').classList.add('active');
    }

    showGameScreen() {
        this.hideAllScreens();
        document.getElementById('game-screen').classList.add('active');
        this.renderGame();
    }

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    showRules() {
        document.getElementById('rules-modal').style.display = 'block';
    }

    hideRules() {
        document.getElementById('rules-modal').style.display = 'none';
    }

    goToMain() {
        window.location.href = 'index.html';
    }

    startDemoGame() {
        this.showGameScreen();
        this.startGame();
    }

    startGame() {
        // Add players
        this.gameState.addPlayer('Vous', false);
        this.gameState.addPlayer('IA', true);
        
        if (this.gameState.startGame()) {
            this.currentPlayerIndex = 0;
            this.isMyTurn = true;
            this.renderGame();
        }
    }

    renderGame() {
        this.renderPlayerInfo();
        this.renderGameBoard();
        this.renderHand();
        this.updateGameControls();
    }

    renderPlayerInfo() {
        const player = this.gameState.players[0];
        const opponent = this.gameState.players[1];
        
        if (player) {
            document.getElementById('player-name').textContent = player.name;
            document.getElementById('player-hp').textContent = `PV: ${player.hp}`;
        }
        
        if (opponent) {
            document.getElementById('opponent-name').textContent = opponent.name;
            document.getElementById('opponent-hp').textContent = `PV: ${opponent.hp}`;
        }
        
        document.getElementById('game-phase').textContent = `Phase: ${this.getPhaseName(this.gameState.phase)}`;
    }

    getPhaseName(phase) {
        const phaseNames = {
            'attack': 'Attaque',
            'defense': 'Défense',
            'draw': 'Pioche',
            'artifact': 'Artefact',
            'resolution': 'Résolution'
        };
        return phaseNames[phase] || phase;
    }

    renderGameBoard() {
        this.renderBattlefield('player');
        this.renderBattlefield('opponent');
    }

    renderBattlefield(playerType) {
        const player = playerType === 'player' ? this.gameState.players[0] : this.gameState.players[1];
        const prefix = playerType === 'player' ? 'player' : 'opponent';
        
        // Render attack slot
        const attackSlot = document.getElementById(`${prefix}-attack`);
        attackSlot.innerHTML = '';
        if (player && player.attackCard) {
            attackSlot.appendChild(this.createCardElement(player.attackCard, false));
        }
        
        // Render defense slot
        const defenseSlot = document.getElementById(`${prefix}-defense`);
        defenseSlot.innerHTML = '';
        if (player && player.defenseCard) {
            defenseSlot.appendChild(this.createCardElement(player.defenseCard, false));
        }
        
        // Render artifact slot
        const artifactSlot = document.getElementById(`${prefix}-artifact`);
        artifactSlot.innerHTML = '';
        if (player && player.artifactCard) {
            const cardElement = this.createCardElement(player.artifactCard, false);
            cardElement.classList.add('artifact');
            artifactSlot.appendChild(cardElement);
        }
    }

    renderHand() {
        const player = this.gameState.players[0];
        const opponent = this.gameState.players[1];
        
        // Render player's hand
        const playerHand = document.getElementById('player-hand');
        playerHand.innerHTML = '';
        if (player) {
            player.hand.forEach((card, index) => {
                const cardElement = this.createCardElement(card, true, index);
                playerHand.appendChild(cardElement);
            });
        }
        
        // Render opponent's hand (hidden)
        const opponentHand = document.getElementById('opponent-hand');
        opponentHand.innerHTML = '';
        if (opponent) {
            for (let i = 0; i < opponent.hand.length; i++) {
                const cardElement = this.createHiddenCardElement();
                opponentHand.appendChild(cardElement);
            }
        }
    }

    createCardElement(card, clickable = false, index = null) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.getCSSClass()}`;
        cardElement.innerHTML = `
            <div class="card-suit">${card.suit}</div>
            <div class="card-value">${card.value}</div>
            <div class="card-type">${this.getCardTypeName(card.type)}</div>
        `;
        
        if (clickable && this.isMyTurn) {
            cardElement.addEventListener('click', () => this.selectCard(index));
        }
        
        return cardElement;
    }

    createHiddenCardElement() {
        const cardElement = document.createElement('div');
        cardElement.className = 'card hidden';
        cardElement.innerHTML = `
            <div class="card-value">?</div>
        `;
        return cardElement;
    }

    getCardTypeName(type) {
        const typeNames = {
            'light_attack': 'Attaque',
            'tactical_spell': 'Sort',
            'counter_magic': 'Contre',
            'energy_theft': 'Vol',
            'mental_barrier': 'Barrière',
            'chaotic_summon': 'Invocation'
        };
        return typeNames[type] || type;
    }

    selectCard(index) {
        if (!this.isMyTurn) return;
        
        this.selectedCard = index;
        this.showSlotSelection();
    }

    showSlotSelection() {
        // Highlight available slots based on current phase
        const slots = document.querySelectorAll('.card-slot');
        slots.forEach((slot, index) => {
            if (this.canPlayInSlot(index)) {
                slot.style.borderColor = '#ffd700';
                slot.style.cursor = 'pointer';
                slot.addEventListener('click', () => this.playCard(index));
            }
        });
    }

    canPlayInSlot(slotIndex) {
        const currentPhase = this.gameState.phase;
        const player = this.gameState.players[this.currentPlayerIndex];
        
        switch (slotIndex) {
            case 0: // Attack slot
                return currentPhase === 'attack' && !player.attackCard;
            case 1: // Defense slot
                return currentPhase === 'defense' && !player.defenseCard;
            case 2: // Artifact slot
                return currentPhase === 'artifact' && !player.artifactCard;
            default:
                return false;
        }
    }

    playCard(slotIndex) {
        if (this.selectedCard === null || !this.isMyTurn) return;
        
        const slotNames = ['attack', 'defense', 'artifact'];
        const slotName = slotNames[slotIndex];
        
        const success = this.gameState.playCard(this.currentPlayerIndex, this.selectedCard, slotName);
        
        if (success) {
            this.selectedCard = null;
            this.clearSlotHighlights();
            this.renderGame();
            
            // Check if turn is complete and switch to AI
            if (this.gameState.phase === 'resolution') {
                setTimeout(() => {
                    this.playAITurn();
                }, 1000);
            }
        }
    }

    clearSlotHighlights() {
        const slots = document.querySelectorAll('.card-slot');
        slots.forEach(slot => {
            slot.style.borderColor = '';
            slot.style.cursor = '';
        });
    }

    endTurn() {
        if (!this.isMyTurn) return;
        
        const success = this.gameState.endTurn();
        if (success) {
            this.isMyTurn = false;
            this.renderGame();
            
            // AI takes its turn
            setTimeout(() => {
                this.playAITurn();
            }, 1000);
        }
    }

    drawCard() {
        if (!this.isMyTurn) return;
        
        const player = this.gameState.players[this.currentPlayerIndex];
        const card = player.drawCard();
        
        if (card) {
            this.renderGame();
        }
    }

    activateArtifact() {
        if (!this.isMyTurn) return;
        
        const drawnCards = this.gameState.activateArtifact(this.currentPlayerIndex);
        
        if (drawnCards) {
            this.renderGame();
        }
    }

    updateGameControls() {
        const endTurnBtn = document.getElementById('end-turn');
        const drawCardBtn = document.getElementById('draw-card');
        const activateArtifactBtn = document.getElementById('activate-artifact');
        const aiTurnBtn = document.getElementById('ai-turn');
        
        endTurnBtn.disabled = !this.isMyTurn || this.gameState.phase !== 'artifact';
        drawCardBtn.disabled = !this.isMyTurn || this.gameState.phase !== 'draw';
        activateArtifactBtn.disabled = !this.isMyTurn || !this.gameState.players[this.currentPlayerIndex].artifactCard;
        aiTurnBtn.disabled = this.isMyTurn;
    }

    // AI Logic
    playAITurn() {
        if (this.isMyTurn || this.gameState.gameOver) return;
        
        const aiPlayer = this.gameState.players[this.aiPlayerIndex];
        const humanPlayer = this.gameState.players[0];
        
        // AI plays its turn
        this.playAIPhase();
        
        // Render the game after AI moves
        this.renderGame();
        
        // Check if AI turn is complete
        if (this.gameState.phase === 'resolution') {
            setTimeout(() => {
                this.switchToPlayerTurn();
            }, 1000);
        }
    }

    playAIPhase() {
        const currentPhase = this.gameState.phase;
        const aiPlayer = this.gameState.players[this.aiPlayerIndex];
        
        switch (currentPhase) {
            case 'attack':
                this.playAIAttack();
                break;
            case 'defense':
                this.playAIDefense();
                break;
            case 'draw':
                this.playAIDraw();
                break;
            case 'artifact':
                this.playAIArtifact();
                break;
        }
    }

    playAIAttack() {
        const aiPlayer = this.gameState.players[this.aiPlayerIndex];
        const humanPlayer = this.gameState.players[0];
        
        // Simple AI: play the highest damage card
        let bestCardIndex = -1;
        let bestDamage = 0;
        
        aiPlayer.hand.forEach((card, index) => {
            if (card.damage > bestDamage) {
                bestDamage = card.damage;
                bestCardIndex = index;
            }
        });
        
        if (bestCardIndex >= 0) {
            this.gameState.playCard(this.aiPlayerIndex, bestCardIndex, 'attack');
        }
    }

    playAIDefense() {
        const aiPlayer = this.gameState.players[this.aiPlayerIndex];
        const humanPlayer = this.gameState.players[0];
        
        // Simple AI: play the highest value card for defense
        let bestCardIndex = -1;
        let bestValue = 0;
        
        aiPlayer.hand.forEach((card, index) => {
            const value = card.getNumericValue();
            if (value > bestValue) {
                bestValue = value;
                bestCardIndex = index;
            }
        });
        
        if (bestCardIndex >= 0) {
            this.gameState.playCard(this.aiPlayerIndex, bestCardIndex, 'defense');
        }
    }

    playAIDraw() {
        const aiPlayer = this.gameState.players[this.aiPlayerIndex];
        aiPlayer.drawCard();
    }

    playAIArtifact() {
        const aiPlayer = this.gameState.players[this.aiPlayerIndex];
        
        // Simple AI: play the first available card as artifact
        if (aiPlayer.hand.length > 0) {
            this.gameState.playCard(this.aiPlayerIndex, 0, 'artifact');
        }
    }

    switchToPlayerTurn() {
        this.isMyTurn = true;
        this.currentPlayerIndex = 0;
        this.renderGame();
        
        // Check for game over
        if (this.gameState.gameOver) {
            this.handleGameOver();
        }
    }

    handleGameOver() {
        const winner = this.gameState.winner;
        const winnerName = winner ? winner.name : 'Match nul';
        alert(`Partie terminée! Vainqueur: ${winnerName}`);
        
        // Return to demo menu
        setTimeout(() => {
            this.showDemoMenu();
        }, 2000);
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.demoGame = new DemoGame();
});