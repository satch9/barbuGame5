class Player {
    host;
    groupeId;
    username;
    socketId;
    cards;
    turn;
    win;
    score;
    contracts;

    constructor() {
        this.host = false;
        this.groupeId = null;
        this.username = "";
        this.socketId = "";
        this.cards = [];
        this.turn = false;
        this.win = false;
        this.score = 0;
        this.contracts = ['barbu', 'pasDePlis', 'pasDeDame', 'pasDeCoeur', 'salade', 'reussite'];
    }
}