// Game constants
const GAME_CONSTANTS = {
    MAX_HAND_SIZE: 5,
    STARTING_HP: 20,
    DECK_SIZE: 52,
    SUITS: ['♠️', '♥️', '♦️', '♣️'],
    VALUES: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
};

// Card types and effects
const CARD_TYPES = {
    LIGHT_ATTACK: 'light_attack',    // 2-5
    TACTICAL_SPELL: 'tactical_spell', // 6-10
    COUNTER_MAGIC: 'counter_magic',   // J
    ENERGY_THEFT: 'energy_theft',     // Q
    MENTAL_BARRIER: 'mental_barrier', // K
    CHAOTIC_SUMMON: 'chaotic_summon'  // A
};

// Game phases
const GAME_PHASES = {
    ATTACK: 'attack',
    DEFENSE: 'defense',
    DRAW: 'draw',
    ARTIFACT: 'artifact',
    RESOLUTION: 'resolution'
};

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.type = this.getCardType();
        this.damage = this.calculateDamage();
        this.effect = this.getEffect();
    }

    getCardType() {
        const numValue = this.getNumericValue();
        if (numValue >= 2 && numValue <= 5) return CARD_TYPES.LIGHT_ATTACK;
        if (numValue >= 6 && numValue <= 10) return CARD_TYPES.TACTICAL_SPELL;
        if (this.value === 'J') return CARD_TYPES.COUNTER_MAGIC;
        if (this.value === 'Q') return CARD_TYPES.ENERGY_THEFT;
        if (this.value === 'K') return CARD_TYPES.MENTAL_BARRIER;
        if (this.value === 'A') return CARD_TYPES.CHAOTIC_SUMMON;
        return CARD_TYPES.LIGHT_ATTACK;
    }

    getNumericValue() {
        if (this.value === 'J') return 11;
        if (this.value === 'Q') return 12;
        if (this.value === 'K') return 13;
        if (this.value === 'A') return 14;
        return parseInt(this.value);
    }

    calculateDamage() {
        const numValue = this.getNumericValue();
        if (this.type === CARD_TYPES.LIGHT_ATTACK) {
            return numValue;
        } else if (this.type === CARD_TYPES.TACTICAL_SPELL) {
            return Math.ceil(numValue / 2);
        }
        return 0;
    }

    getEffect() {
        const numValue = this.getNumericValue();
        switch (this.type) {
            case CARD_TYPES.TACTICAL_SPELL:
                return this.getTacticalEffect(numValue);
            case CARD_TYPES.COUNTER_MAGIC:
                return { type: 'counter', damage: 2 };
            case CARD_TYPES.ENERGY_THEFT:
                return { type: 'destroy_defense', heal: 1 };
            case CARD_TYPES.MENTAL_BARRIER:
                return { type: 'ignore_next_attack' };
            case CARD_TYPES.CHAOTIC_SUMMON:
                return { type: 'draw_and_attack', draw: 2 };
            default:
                return null;
        }
    }

    getTacticalEffect(value) {
        switch (value) {
            case 6: return { type: 'next_spell_bonus', bonus: 2 };
            case 7: return { type: 'draw_card', draw: 1 };
            case 8: return { type: 'opponent_discard', discard: 1 };
            case 9: return { type: 'peek_opponent_hand', uses: 1 };
            case 10: return { type: 'extra_turn' };
            default: return null;
        }
    }

    getDisplayName() {
        return `${this.value}${this.suit}`;
    }

    getCSSClass() {
        switch (this.type) {
            case CARD_TYPES.LIGHT_ATTACK: return 'attack';
            case CARD_TYPES.TACTICAL_SPELL: return 'tactical';
            case CARD_TYPES.COUNTER_MAGIC:
            case CARD_TYPES.ENERGY_THEFT:
            case CARD_TYPES.MENTAL_BARRIER:
            case CARD_TYPES.CHAOTIC_SUMMON: return 'special';
            default: return '';
        }
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.initialize();
    }

    initialize() {
        this.cards = [];
        for (const suit of GAME_CONSTANTS.SUITS) {
            for (const value of GAME_CONSTANTS.VALUES) {
                this.cards.push(new Card(suit, value));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.length > 0 ? this.cards.pop() : null;
    }

    drawMultiple(count) {
        const drawn = [];
        for (let i = 0; i < count && this.cards.length > 0; i++) {
            drawn.push(this.draw());
        }
        return drawn;
    }
}

class Player {
    constructor(name, isHost = false) {
        this.name = name;
        this.isHost = isHost;
        this.hp = GAME_CONSTANTS.STARTING_HP;
        this.hand = [];
        this.deck = new Deck();
        this.deck.shuffle();
        this.attackCard = null;
        this.defenseCard = null;
        this.artifactCard = null;
        this.activeArtifacts = [];
        this.effects = [];
        this.discardPile = [];
    }

    drawCard() {
        if (this.hand.length < GAME_CONSTANTS.MAX_HAND_SIZE) {
            const card = this.deck.draw();
            if (card) {
                this.hand.push(card);
                return card;
            }
        }
        return null;
    }

    drawInitialHand() {
        for (let i = 0; i < 5; i++) {
            this.drawCard();
        }
    }

    playCard(cardIndex, slot) {
        if (cardIndex < 0 || cardIndex >= this.hand.length) return false;
        
        const card = this.hand[cardIndex];
        
        switch (slot) {
            case 'attack':
                if (this.attackCard) return false;
                this.attackCard = card;
                break;
            case 'defense':
                if (this.defenseCard) return false;
                this.defenseCard = card;
                break;
            case 'artifact':
                if (this.artifactCard) return false;
                this.artifactCard = card;
                break;
            default:
                return false;
        }
        
        this.hand.splice(cardIndex, 1);
        return true;
    }

    discardCard(cardIndex) {
        if (cardIndex < 0 || cardIndex >= this.hand.length) return null;
        const card = this.hand.splice(cardIndex, 1)[0];
        this.discardPile.push(card);
        return card;
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.hp <= 0;
    }

    heal(amount) {
        this.hp = Math.min(GAME_CONSTANTS.STARTING_HP, this.hp + amount);
    }

    clearTurn() {
        this.attackCard = null;
        this.defenseCard = null;
        this.artifactCard = null;
    }

    activateArtifact() {
        if (!this.artifactCard) return null;
        
        const artifact = this.artifactCard;
        this.artifactCard = null;
        
        // Apply artifact effects based on suit
        switch (artifact.suit) {
            case '♠️': // Spade - Block next attack and draw 2
                this.effects.push({ type: 'block_next_attack', duration: 1 });
                return this.deck.drawMultiple(2);
            case '♥️': // Heart - Place as defense and heal 2
                if (!this.defenseCard) {
                    this.defenseCard = artifact;
                }
                this.heal(2);
                return [];
            case '♦️': // Diamond - Play an extra turn immediately
                this.effects.push({ type: 'extra_turn', duration: 1 });
                return [];
            case '♣️': // Club - Opponent discards 1, you draw 1
                this.effects.push({ type: 'opponent_discard', duration: 1 });
                return this.deck.drawMultiple(1);
            default:
                return [];
        }
    }
}

class GameState {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.phase = GAME_PHASES.ATTACK;
        this.gameOver = false;
        this.winner = null;
        this.turnNumber = 1;
        this.effects = [];
    }

    addPlayer(name, isHost = false) {
        const player = new Player(name, isHost);
        this.players.push(player);
        return player;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    getOpponent() {
        return this.players[1 - this.currentPlayerIndex];
    }

    startGame() {
        if (this.players.length !== 2) return false;
        
        // Draw initial hands
        for (const player of this.players) {
            player.drawInitialHand();
        }
        
        this.phase = GAME_PHASES.ATTACK;
        this.gameOver = false;
        this.winner = null;
        this.turnNumber = 1;
        
        return true;
    }

    playCard(playerIndex, cardIndex, slot) {
        const player = this.players[playerIndex];
        if (!player || playerIndex !== this.currentPlayerIndex) return false;
        
        const success = player.playCard(cardIndex, slot);
        if (success) {
            this.advancePhase();
        }
        return success;
    }

    advancePhase() {
        switch (this.phase) {
            case GAME_PHASES.ATTACK:
                this.phase = GAME_PHASES.DEFENSE;
                break;
            case GAME_PHASES.DEFENSE:
                this.phase = GAME_PHASES.DRAW;
                break;
            case GAME_PHASES.DRAW:
                this.phase = GAME_PHASES.ARTIFACT;
                break;
            case GAME_PHASES.ARTIFACT:
                this.phase = GAME_PHASES.RESOLUTION;
                this.resolveTurn();
                break;
        }
    }

    resolveTurn() {
        const currentPlayer = this.getCurrentPlayer();
        const opponent = this.getOpponent();
        
        // Draw card
        currentPlayer.drawCard();
        
        // Resolve combat
        this.resolveCombat(currentPlayer, opponent);
        
        // Clear turn state
        currentPlayer.clearTurn();
        opponent.clearTurn();
        
        // Check for game over
        if (currentPlayer.hp <= 0) {
            this.gameOver = true;
            this.winner = opponent;
        } else if (opponent.hp <= 0) {
            this.gameOver = true;
            this.winner = currentPlayer;
        } else {
            // Switch players
            this.currentPlayerIndex = 1 - this.currentPlayerIndex;
            this.phase = GAME_PHASES.ATTACK;
            this.turnNumber++;
        }
    }

    resolveCombat(attacker, defender) {
        if (!attacker.attackCard) return;
        
        let damage = attacker.attackCard.damage;
        
        // Check for defense
        if (defender.defenseCard) {
            if (attacker.attackCard.value === '2' && attacker.hand.some(card => card.value === '2')) {
                // Equipment effect: 2 ignores defense
                damage = attacker.attackCard.damage;
            } else {
                // Normal defense
                const defenseValue = defender.defenseCard.getNumericValue();
                if (damage <= defenseValue) {
                    damage = 0; // Attack blocked
                } else {
                    damage = damage - defenseValue; // Penetration damage
                }
            }
        }
        
        // Apply damage
        if (damage > 0) {
            defender.takeDamage(damage);
        }
        
        // Apply card effects
        this.applyCardEffects(attacker, defender);
    }

    applyCardEffects(attacker, defender) {
        if (!attacker.attackCard) return;
        
        const card = attacker.attackCard;
        const effect = card.effect;
        
        if (!effect) return;
        
        switch (effect.type) {
            case 'counter':
                // Counter magic effect
                attacker.takeDamage(effect.damage);
                break;
            case 'destroy_defense':
                // Energy theft effect
                if (defender.defenseCard) {
                    defender.defenseCard = null;
                }
                attacker.heal(effect.heal);
                break;
            case 'ignore_next_attack':
                // Mental barrier effect
                attacker.effects.push({ type: 'ignore_next_attack', duration: 1 });
                break;
            case 'draw_and_attack':
                // Chaotic summon effect
                const drawnCards = attacker.deck.drawMultiple(effect.draw);
                if (drawnCards.length > 0) {
                    // Play first card as attack, discard second
                    attacker.attackCard = drawnCards[0];
                    if (drawnCards.length > 1) {
                        attacker.discardPile.push(drawnCards[1]);
                    }
                }
                break;
            case 'next_spell_bonus':
                attacker.effects.push({ type: 'spell_bonus', bonus: effect.bonus, duration: 1 });
                break;
            case 'draw_card':
                attacker.deck.drawMultiple(effect.draw);
                break;
            case 'opponent_discard':
                if (defender.hand.length > 0) {
                    const randomIndex = Math.floor(Math.random() * defender.hand.length);
                    defender.discardCard(randomIndex);
                }
                break;
            case 'peek_opponent_hand':
                // This would be handled in the UI
                break;
            case 'extra_turn':
                attacker.effects.push({ type: 'extra_turn', duration: 1 });
                break;
        }
    }

    activateArtifact(playerIndex) {
        const player = this.players[playerIndex];
        if (!player || playerIndex !== this.currentPlayerIndex) return false;
        
        const drawnCards = player.activateArtifact();
        return drawnCards;
    }

    endTurn() {
        if (this.phase !== GAME_PHASES.ARTIFACT) return false;
        
        this.advancePhase();
        return true;
    }

    getGameStatus() {
        return {
            currentPlayer: this.currentPlayerIndex,
            phase: this.phase,
            gameOver: this.gameOver,
            winner: this.winner,
            turnNumber: this.turnNumber,
            players: this.players.map(player => ({
                name: player.name,
                hp: player.hp,
                handSize: player.hand.length,
                hasAttack: !!player.attackCard,
                hasDefense: !!player.defenseCard,
                hasArtifact: !!player.artifactCard
            }))
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameState, Card, Deck, Player, GAME_CONSTANTS, CARD_TYPES, GAME_PHASES };
}