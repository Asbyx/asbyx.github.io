# Duel d'Arcane

Un jeu de cartes stratégique pour deux joueurs, jouable entre appareils iOS via Bluetooth.

## 🎮 À propos du jeu

Duel d'Arcane est un jeu de cartes basé sur un jeu classique de 52 cartes avec des mécaniques stratégiques uniques. Les joueurs s'affrontent en utilisant des cartes d'attaque, de défense et des artefacts spéciaux.

### Règles du jeu

#### Structure d'un tour
1. **Attaque** : Poser une carte en attaque
2. **Défense** : Poser une carte en défense (bloque 1 attaque)
3. **Pioche** : Piocher 1 carte
4. **Artefact** : Poser un artefact (activable au prochain tour)

#### Types de cartes

| Cartes | Type | Effet principal |
|--------|------|-----------------|
| 2-5 | Attaque légère | Inflige la valeur en dégâts |
| 6-10 | Sort tactique | Moitié en dégâts + effet spécial |
| Valet (J) | Contre magique | Annule une attaque et renvoie 2 dégâts |
| Dame (Q) | Vol d'énergie | Détruit une défense et +1 PV |
| Roi (K) | Barrière mentale | Ignore la prochaine attaque |
| As (A) | Invocation chaotique | Pioche 2 cartes, joue une attaque gratuite |

#### Effets spéciaux des sorts tactiques
- **6** : Prochain sort = +2 dégâts
- **7** : Pioche 1 carte
- **8** : L'adversaire défausse une carte au hasard
- **9** : Regarde la main adverse (1x par partie)
- **10** : Rejoue un tour immédiatement

#### Artefacts cachés
- **♠️ Pique** : Bloque la prochaine attaque ET pioche 2 cartes
- **♥️ Cœur** : Pose en défense et soigne 2 PV
- **♦️ Carreau** : Joue instantanément un tour
- **♣️ Trèfle** : L'adversaire défausse 1 et vous piochez 1

#### Équipement
Jouer un 2 en plus d'une attaque permet d'ignorer la défense.

## 🚀 Installation

### Option 1 : Installation PWA (Recommandée)

1. Ouvrez votre navigateur Safari sur iOS
2. Naviguez vers `https://asbyx.github.io/dual/`
3. Appuyez sur le bouton de partage (carré avec flèche)
4. Sélectionnez "Sur l'écran d'accueil"
5. L'application sera installée comme une app native

### Option 2 : Accès web

1. Ouvrez votre navigateur sur n'importe quel appareil
2. Naviguez vers `https://asbyx.github.io/dual/`
3. L'application fonctionne directement dans le navigateur

## 📱 Utilisation

### Démarrer une partie

1. **Héberger une partie** :
   - Appuyez sur "Héberger une partie"
   - L'application commencera à diffuser via Bluetooth
   - Attendez qu'un autre joueur se connecte

2. **Rejoindre une partie** :
   - Appuyez sur "Rejoindre une partie"
   - L'application scannera les appareils à proximité
   - Sélectionnez l'appareil de votre adversaire

### Jouer

1. **Votre tour** :
   - Sélectionnez une carte de votre main
   - Choisissez l'emplacement (attaque, défense, artefact)
   - Suivez les phases du tour

2. **Contrôles** :
   - **Fin de tour** : Termine votre tour
   - **Piocher** : Pioche une carte (phase de pioche)
   - **Activer artefact** : Active votre artefact

## 🔧 Configuration technique

### Prérequis

- **iOS** : Safari 14+ (recommandé)
- **Android** : Chrome 88+ ou Edge 88+
- **Desktop** : Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Bluetooth** : Bluetooth Low Energy (BLE) requis

### Fonctionnalités Bluetooth

L'application utilise Web Bluetooth API pour la communication entre appareils. Cette API est limitée sur certains navigateurs et plateformes :

- **iOS Safari** : Support limité, nécessite HTTPS
- **Android Chrome** : Support complet
- **Desktop** : Support variable selon le navigateur

### Développement local

Pour tester en local :

```bash
# Cloner le repository
git clone https://github.com/asbyx/asbyx.github.io.git

# Naviguer vers le dossier
cd asbyx.github.io/dual

# Servir avec un serveur local (HTTPS requis pour Bluetooth)
python -m http.server 8000
# ou
npx serve -s . -l 8000
```

## 🎨 Personnalisation

### Modifier les règles

Les règles du jeu sont définies dans `game.js`. Vous pouvez modifier :

- Les constantes du jeu dans `GAME_CONSTANTS`
- Les types de cartes dans `CARD_TYPES`
- Les effets des cartes dans les méthodes de la classe `Card`

### Modifier l'apparence

Le style est défini dans `style.css`. Vous pouvez personnaliser :

- Les couleurs et thèmes
- Les animations
- La mise en page responsive

## 🐛 Dépannage

### Problèmes de connexion Bluetooth

1. **Vérifiez les permissions** :
   - Assurez-vous que Bluetooth est activé
   - Autorisez l'accès Bluetooth dans votre navigateur

2. **Vérifiez la compatibilité** :
   - Utilisez Safari sur iOS
   - Utilisez Chrome sur Android
   - Vérifiez que votre appareil supporte BLE

3. **Problèmes de portée** :
   - Les appareils doivent être à proximité (quelques mètres)
   - Évitez les interférences Bluetooth

### Problèmes d'installation PWA

1. **iOS** :
   - Utilisez Safari (pas Chrome ou Firefox)
   - Assurez-vous d'être sur HTTPS
   - Vérifiez que "Sur l'écran d'accueil" est disponible

2. **Android** :
   - Utilisez Chrome
   - L'installation devrait être proposée automatiquement

## 📄 Licence

Ce projet est open source. Vous êtes libre de l'utiliser, le modifier et le distribuer selon vos besoins.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités
- Améliorer la documentation

## 📞 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Contactez l'auteur via GitHub

---

**Amusez-vous bien avec Duel d'Arcane !** 🎮✨