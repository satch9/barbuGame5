const Card = require('./card');

class Deck {

    cards = [];

    static deal(numbers) {
        return numbers.sort((a, b) => a.suit.localeCompare(b.suit) || a.position - b.position || a.value - b.value);
    }

    static shuffle(tab) {
        var i, j, tmp;
        for (i = tab.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = tab[i];
            tab[i] = tab[j];
            tab[j] = tmp;
        }
        return tab;
    }

    add(n) {
        this.cards.push(new Card(n));
    }

    getCards() {
        return this.cards;
    }


}

module.exports = Deck;