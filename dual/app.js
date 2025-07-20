// Main application controller for Duel d'Arcane
class DuelArcaneApp {
    constructor() {
        this.gameState = new GameState();
        this.bluetoothManager = new BluetoothManager();
        this.gameSyncManager = null;
        this.currentPlayerIndex = 0;
        this.isMyTurn = false;
        this.selectedCard = null;
        this.selectedSlot = null;
        
        this.initializeEventListeners();
        this.setupBluetoothHandlers();
    }

    initializeEventListeners() {
        // Main menu buttons
        document.getElementById('host-game').addEventListener('click', () => this.showConnectionScreen('host'));
        document.getElementById('join-game').addEventListener('click', () => this.showConnectionScreen('join'));
        document.getElementById('demo-btn').addEventListener('click', () => this.showDemo());
        document.getElementById('rules-btn').addEventListener('click', () => this.showRules());
        document.getElementById('back-to-menu').addEventListener('click', () => this.showMainMenu());

        // Connection screen
        document.getElementById('scan-devices').addEventListener('click', () => this.scanDevices());

        // Game controls
        document.getElementById('end-turn').addEventListener('click', () => this.endTurn());
        document.getElementById('draw-card').addEventListener('click', () => this.drawCard());
        document.getElementById('activate-artifact').addEventListener('click', () => this.activateArtifact());

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

    setupBluetoothHandlers() {
        this.bluetoothManager.setConnectionStatusHandler((status, message) => {
            this.updateConnectionStatus(status, message);
        });

        this.bluetoothManager.setDeviceFoundHandler((device) => {
            this.addDeviceToList(device);
        });

        this.bluetoothManager.setMessageHandler((message) => {
            this.handleBluetoothMessage(message);
        });
    }

    showMainMenu() {
        this.hideAllScreens();
        document.getElementById('main-menu').classList.add('active');
    }

    showConnectionScreen(mode) {
        this.hideAllScreens();
        document.getElementById('connection-screen').classList.add('active');
        
        if (mode === 'host') {
            this.startHosting();
        } else {
            this.startJoining();
        }
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

    showDemo() {
        window.location.href = 'demo.html';
    }

    async startHosting() {
        try {
            await this.bluetoothManager.hostGame('Hôte');
        } catch (error) {
            this.updateConnectionStatus('error', `Erreur: ${error.message}`);
        }
    }

    async startJoining() {
        try {
            await this.bluetoothManager.joinGame('Joueur');
        } catch (error) {
            this.updateConnectionStatus('error', `Erreur: ${error.message}`);
        }
    }

    async scanDevices() {
        try {
            await this.bluetoothManager.startScanning();
        } catch (error) {
            this.updateConnectionStatus('error', `Erreur de scan: ${error.message}`);
        }
    }

    updateConnectionStatus(status, message) {
        const statusElement = document.getElementById('connection-status');
        statusElement.textContent = message;
        statusElement.className = `status ${status}`;
        
        if (status === 'connected') {
            setTimeout(() => {
                this.initializeGame();
            }, 1000);
        }
    }

    addDeviceToList(device) {
        const deviceList = document.getElementById('device-list');
        const deviceElement = document.createElement('div');
        deviceElement.className = 'device-item';
        deviceElement.innerHTML = `
            <div class="device-name">${device.name}</div>
            <div class="device-signal">Signal: ${device.rssi} dBm</div>
        `;
        
        deviceElement.addEventListener('click', () => {
            this.connectToDevice(device.id);
        });
        
        deviceList.appendChild(deviceElement);
    }

    async connectToDevice(deviceId) {
        try {
            await this.bluetoothManager.connectToDevice(deviceId);
        } catch (error) {
            this.updateConnectionStatus('error', `Erreur de connexion: ${error.message}`);
        }
    }

    handleBluetoothMessage(message) {
        if (this.gameSyncManager) {
            this.gameSyncManager.handleMessage(message);
        }
    }

    initializeGame() {
        this.gameSyncManager = new GameSyncManager(this.bluetoothManager, this.gameState);
        this.showGameScreen();
        this.startGame();
    }

    startGame() {
        if (this.gameState.startGame()) {
            this.currentPlayerIndex = this.bluetoothManager.isHost ? 0 : 1;
            this.isMyTurn = this.bluetoothManager.isHost;
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
            
            // Send action to opponent
            if (this.gameSyncManager) {
                this.gameSyncManager.sendGameAction('play_card', {
                    playerIndex: this.currentPlayerIndex,
                    cardIndex: this.selectedCard,
                    slot: slotName
                });
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
            
            if (this.gameSyncManager) {
                this.gameSyncManager.sendGameAction('end_turn', {});
            }
        }
    }

    drawCard() {
        if (!this.isMyTurn) return;
        
        const player = this.gameState.players[this.currentPlayerIndex];
        const card = player.drawCard();
        
        if (card) {
            this.renderGame();
            
            if (this.gameSyncManager) {
                this.gameSyncManager.sendGameAction('draw_card', {
                    playerIndex: this.currentPlayerIndex
                });
            }
        }
    }

    activateArtifact() {
        if (!this.isMyTurn) return;
        
        const drawnCards = this.gameState.activateArtifact(this.currentPlayerIndex);
        
        if (drawnCards) {
            this.renderGame();
            
            if (this.gameSyncManager) {
                this.gameSyncManager.sendGameAction('activate_artifact', {
                    playerIndex: this.currentPlayerIndex
                });
            }
        }
    }

    updateGameControls() {
        const endTurnBtn = document.getElementById('end-turn');
        const drawCardBtn = document.getElementById('draw-card');
        const activateArtifactBtn = document.getElementById('activate-artifact');
        
        endTurnBtn.disabled = !this.isMyTurn || this.gameState.phase !== 'artifact';
        drawCardBtn.disabled = !this.isMyTurn || this.gameState.phase !== 'draw';
        activateArtifactBtn.disabled = !this.isMyTurn || !this.gameState.players[this.currentPlayerIndex].artifactCard;
    }

    // Handle turn changes
    onTurnChanged(playerIndex) {
        this.isMyTurn = playerIndex === this.currentPlayerIndex;
        this.selectedCard = null;
        this.clearSlotHighlights();
        this.renderGame();
    }

    // Handle game over
    onGameOver(winner) {
        const winnerName = winner ? winner.name : 'Match nul';
        alert(`Partie terminée! Vainqueur: ${winnerName}`);
        
        // Return to main menu
        this.showMainMenu();
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.duelArcaneApp = new DuelArcaneApp();
});

// Add some utility functions for debugging
window.debugGame = () => {
    if (window.duelArcaneApp) {
        console.log('Game State:', window.duelArcaneApp.gameState);
        console.log('Current Player:', window.duelArcaneApp.gameState.getCurrentPlayer());
        console.log('Game Status:', window.duelArcaneApp.gameState.getGameStatus());
    }
};

// Add PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/dual/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}