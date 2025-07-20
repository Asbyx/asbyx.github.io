// Bluetooth communication module for Duel d'Arcane
class BluetoothManager {
    constructor() {
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristic = null;
        this.isConnected = false;
        this.isHost = false;
        this.onMessageReceived = null;
        this.onConnectionStatusChanged = null;
        this.onDeviceFound = null;
        
        // Service and characteristic UUIDs
        this.SERVICE_UUID = 'duel-arcane-service';
        this.CHARACTERISTIC_UUID = 'duel-arcane-characteristic';
        
        // Message types
        this.MESSAGE_TYPES = {
            GAME_ACTION: 'game_action',
            GAME_STATE: 'game_state',
            CONNECTION_REQUEST: 'connection_request',
            CONNECTION_ACCEPT: 'connection_accept',
            CONNECTION_REJECT: 'connection_reject',
            PING: 'ping',
            PONG: 'pong'
        };
    }

    // Check if Bluetooth is available
    async checkBluetoothAvailability() {
        if (!navigator.bluetooth) {
            throw new Error('Bluetooth not supported in this browser');
        }
        
        if (!navigator.bluetooth.getAvailability) {
            throw new Error('Bluetooth availability check not supported');
        }
        
        const available = await navigator.bluetooth.getAvailability();
        if (!available) {
            throw new Error('Bluetooth not available on this device');
        }
        
        return true;
    }

    // Request Bluetooth permissions
    async requestPermissions() {
        try {
            const permission = await navigator.permissions.query({ name: 'bluetooth' });
            if (permission.state === 'denied') {
                throw new Error('Bluetooth permission denied');
            }
            return permission.state === 'granted';
        } catch (error) {
            console.warn('Permission API not supported, proceeding anyway');
            return true;
        }
    }

    // Host a game (advertise as a server)
    async hostGame(playerName) {
        try {
            await this.checkBluetoothAvailability();
            await this.requestPermissions();
            
            this.isHost = true;
            
            // Create a custom service for the game
            const service = await this.createGameService();
            
            // Start advertising
            await this.startAdvertising(service, playerName);
            
            if (this.onConnectionStatusChanged) {
                this.onConnectionStatusChanged('advertising', 'En attente de connexion...');
            }
            
            return true;
        } catch (error) {
            console.error('Error hosting game:', error);
            throw error;
        }
    }

    // Create a custom Bluetooth service for the game
    async createGameService() {
        // Note: In a real implementation, you would need to use a Web Bluetooth polyfill
        // or a native app wrapper since custom services aren't fully supported in browsers
        // For this demo, we'll simulate the service creation
        
        const service = {
            uuid: this.SERVICE_UUID,
            characteristics: [{
                uuid: this.CHARACTERISTIC_UUID,
                properties: ['read', 'write', 'notify']
            }]
        };
        
        return service;
    }

    // Start advertising the game
    async startAdvertising(service, playerName) {
        // Note: This is a simplified version. Real implementation would use
        // navigator.bluetooth.requestLEScan() or similar APIs
        
        const advertisementData = {
            serviceData: {
                [this.SERVICE_UUID]: new TextEncoder().encode(JSON.stringify({
                    game: 'Duel d\'Arcane',
                    player: playerName,
                    version: '1.0'
                }))
            }
        };
        
        // Simulate advertising
        console.log('Advertising game:', advertisementData);
        
        // In a real implementation, you would start scanning here
        // For now, we'll simulate the connection process
        setTimeout(() => {
            this.simulateConnection();
        }, 2000);
    }

    // Join a game (scan for hosts)
    async joinGame(playerName) {
        try {
            await this.checkBluetoothAvailability();
            await this.requestPermissions();
            
            this.isHost = false;
            
            // Start scanning for devices
            await this.startScanning();
            
            if (this.onConnectionStatusChanged) {
                this.onConnectionStatusChanged('scanning', 'Recherche de parties...');
            }
            
            return true;
        } catch (error) {
            console.error('Error joining game:', error);
            throw error;
        }
    }

    // Start scanning for available games
    async startScanning() {
        try {
            // In a real implementation, you would use navigator.bluetooth.requestLEScan()
            // For this demo, we'll simulate finding devices
            
            setTimeout(() => {
                this.simulateDeviceDiscovery();
            }, 1000);
            
        } catch (error) {
            console.error('Error starting scan:', error);
            throw error;
        }
    }

    // Simulate device discovery (for demo purposes)
    simulateDeviceDiscovery() {
        const mockDevices = [
            { name: 'iPhone de Pierre', id: 'device-1', rssi: -50 },
            { name: 'iPad de Marie', id: 'device-2', rssi: -65 },
            { name: 'iPhone de Jean', id: 'device-3', rssi: -70 }
        ];
        
        mockDevices.forEach(device => {
            if (this.onDeviceFound) {
                this.onDeviceFound(device);
            }
        });
    }

    // Connect to a specific device
    async connectToDevice(deviceId) {
        try {
            if (this.onConnectionStatusChanged) {
                this.onConnectionStatusChanged('connecting', 'Connexion en cours...');
            }
            
            // Simulate connection process
            setTimeout(() => {
                this.simulateConnection();
            }, 1500);
            
        } catch (error) {
            console.error('Error connecting to device:', error);
            throw error;
        }
    }

    // Simulate connection (for demo purposes)
    simulateConnection() {
        this.isConnected = true;
        
        if (this.onConnectionStatusChanged) {
            this.onConnectionStatusChanged('connected', 'Connecté!');
        }
        
        // Send connection request
        this.sendMessage({
            type: this.MESSAGE_TYPES.CONNECTION_REQUEST,
            data: {
                playerName: this.isHost ? 'Hôte' : 'Joueur',
                timestamp: Date.now()
            }
        });
    }

    // Send a message to the connected device
    sendMessage(message) {
        if (!this.isConnected) {
            console.warn('Not connected, cannot send message');
            return false;
        }
        
        try {
            const messageStr = JSON.stringify(message);
            console.log('Sending message:', messageStr);
            
            // In a real implementation, you would write to the characteristic
            // this.characteristic.writeValue(new TextEncoder().encode(messageStr));
            
            // Simulate message transmission
            setTimeout(() => {
                if (this.onMessageReceived) {
                    this.onMessageReceived(message);
                }
            }, 100);
            
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }

    // Send game action
    sendGameAction(action, data) {
        return this.sendMessage({
            type: this.MESSAGE_TYPES.GAME_ACTION,
            data: {
                action: action,
                ...data,
                timestamp: Date.now()
            }
        });
    }

    // Send game state
    sendGameState(gameState) {
        return this.sendMessage({
            type: this.MESSAGE_TYPES.GAME_STATE,
            data: {
                state: gameState,
                timestamp: Date.now()
            }
        });
    }

    // Disconnect from the current device
    disconnect() {
        this.isConnected = false;
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristic = null;
        
        if (this.onConnectionStatusChanged) {
            this.onConnectionStatusChanged('disconnected', 'Déconnecté');
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            isHost: this.isHost,
            device: this.device
        };
    }

    // Set up message handlers
    setMessageHandler(handler) {
        this.onMessageReceived = handler;
    }

    setConnectionStatusHandler(handler) {
        this.onConnectionStatusChanged = handler;
    }

    setDeviceFoundHandler(handler) {
        this.onDeviceFound = handler;
    }
}

// Game synchronization manager
class GameSyncManager {
    constructor(bluetoothManager, gameState) {
        this.bluetooth = bluetoothManager;
        this.gameState = gameState;
        this.lastSyncTime = 0;
        this.syncInterval = null;
        
        // Set up message handlers
        this.bluetooth.setMessageHandler(this.handleMessage.bind(this));
    }

    // Handle incoming messages
    handleMessage(message) {
        console.log('Received message:', message);
        
        switch (message.type) {
            case this.bluetooth.MESSAGE_TYPES.CONNECTION_REQUEST:
                this.handleConnectionRequest(message.data);
                break;
            case this.bluetooth.MESSAGE_TYPES.GAME_ACTION:
                this.handleGameAction(message.data);
                break;
            case this.bluetooth.MESSAGE_TYPES.GAME_STATE:
                this.handleGameState(message.data);
                break;
            case this.bluetooth.MESSAGE_TYPES.PING:
                this.handlePing(message.data);
                break;
        }
    }

    // Handle connection request
    handleConnectionRequest(data) {
        if (this.bluetooth.isHost) {
            // Host accepts the connection
            this.bluetooth.sendMessage({
                type: this.bluetooth.MESSAGE_TYPES.CONNECTION_ACCEPT,
                data: {
                    playerName: 'Hôte',
                    timestamp: Date.now()
                }
            });
            
            // Start the game
            this.startGame();
        }
    }

    // Handle game action
    handleGameAction(data) {
        const { action, ...actionData } = data;
        
        switch (action) {
            case 'play_card':
                this.handlePlayCard(actionData);
                break;
            case 'end_turn':
                this.handleEndTurn(actionData);
                break;
            case 'activate_artifact':
                this.handleActivateArtifact(actionData);
                break;
            case 'draw_card':
                this.handleDrawCard(actionData);
                break;
        }
    }

    // Handle play card action
    handlePlayCard(data) {
        const { playerIndex, cardIndex, slot } = data;
        const success = this.gameState.playCard(playerIndex, cardIndex, slot);
        
        if (success) {
            this.syncGameState();
        }
    }

    // Handle end turn action
    handleEndTurn(data) {
        const success = this.gameState.endTurn();
        
        if (success) {
            this.syncGameState();
        }
    }

    // Handle activate artifact action
    handleActivateArtifact(data) {
        const { playerIndex } = data;
        const drawnCards = this.gameState.activateArtifact(playerIndex);
        
        if (drawnCards) {
            this.syncGameState();
        }
    }

    // Handle draw card action
    handleDrawCard(data) {
        const { playerIndex } = data;
        const player = this.gameState.players[playerIndex];
        
        if (player) {
            const card = player.drawCard();
            if (card) {
                this.syncGameState();
            }
        }
    }

    // Handle game state update
    handleGameState(data) {
        const { state } = data;
        
        // Update local game state
        this.updateGameState(state);
    }

    // Handle ping
    handlePing(data) {
        // Respond with pong
        this.bluetooth.sendMessage({
            type: this.bluetooth.MESSAGE_TYPES.PONG,
            data: {
                timestamp: Date.now()
            }
        });
    }

    // Start the game
    startGame() {
        if (this.gameState.players.length === 0) {
            // Add players
            this.gameState.addPlayer('Hôte', true);
            this.gameState.addPlayer('Joueur', false);
        }
        
        const success = this.gameState.startGame();
        
        if (success) {
            this.syncGameState();
            this.startSyncInterval();
        }
    }

    // Sync game state with opponent
    syncGameState() {
        const gameStatus = this.gameState.getGameStatus();
        
        this.bluetooth.sendGameState(gameStatus);
        this.lastSyncTime = Date.now();
    }

    // Update local game state from received data
    updateGameState(state) {
        // Update game state based on received data
        // This would need to be implemented based on your specific needs
        
        console.log('Updating game state:', state);
    }

    // Start periodic synchronization
    startSyncInterval() {
        this.syncInterval = setInterval(() => {
            this.syncGameState();
        }, 1000); // Sync every second
    }

    // Stop synchronization
    stopSyncInterval() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // Send game action to opponent
    sendGameAction(action, data) {
        this.bluetooth.sendGameAction(action, data);
    }

    // Clean up
    destroy() {
        this.stopSyncInterval();
        this.bluetooth.disconnect();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BluetoothManager, GameSyncManager };
}