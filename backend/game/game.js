
class Game {
    constructor(groupe) {
        this.players = groupe.players;
        this.groupe = groupe;
        this.getContratChoisi();
        this.turns = [groupe.players[0].turn, groupe.players[1].turn, groupe.players[2].turn, groupe.players[3].turn];
    }

    sendToPlayers(msg) {
        console.log('sendToPlayers game', io);
        io.to(this.groupe.id).emit('chatMessage', msg);
    }

    getPlayers() {
        return this.players;
    }

    getContratChoisi() {

    }



}

module.exports = Game;