const socketIO = require('socket.io');
const Deck = require('./game/deck');
const Game = require('./game/game');
const express = require('express');
const cors = require('cors');
const barbuRoutes = require('./routes/barbu.routes');
const typeCardGame = require('./utils/typeCardGame');
const path = require('path');
const port = 3000;

class App {
    server;
    io;
    game;
    players;
    groupes;
    static MAX_PLAYERS = 4;

    constructor(port) {
        this.port = port;

        const app = express();
        app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
        app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
        app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
        app.use(express.static('../frontend'));
        app.use(cors({ origin: true, credentials: true }));

        app.use('/', barbuRoutes);

        this.server = require('http').createServer(app);
        this.io = new socketIO.Server(this.server);

        //this.game = new Game();

        this.groupes = [];

        this.io.on('connection', (socket) => {
            console.log(`[connection] ${socket.id}`);

            let groupe = null;
            socket.on('playerData', (player) => {
                console.log(`[playerData] ${player.username}`);


                if (!player.groupeId) {
                    groupe = this.createGroupe(player);
                    console.log(`[create groupe] - ${groupe.id} - ${player.username}`);
                } else {
                    groupe = this.groupes.find(r => r.id === player.groupeId);
                    if (groupe === undefined) {
                        return;
                    }
                    console.log('player backend', player);
                    player.groupeId = groupe.id;
                    groupe.players.push(player);

                }

                socket.join(groupe.id);
                this.dispatcher(this.io, 'join groupe', groupe.id, socket.id);
                //this.io.to(socket.id).emit('join groupe', groupe.id);

                if (groupe.players.length === App.MAX_PLAYERS) {
                    let newTabPlayers = this.randomize(groupe.players);

                    newTabPlayers.forEach((p, i) => {
                        if (i === 0) {
                            newTabPlayers[i].host = true;
                            newTabPlayers[i].turn = true;
                        } else {
                            newTabPlayers[i].host = false;
                            newTabPlayers[i].turn = false;
                        }
                    });
                    let deckShuffle = Deck.shuffle(Deck.shuffle(typeCardGame.jeuDe52));
                    //console.log('[player data deck] - ', deckShuffle);

                    let size = 13;

                    let newArray = new Array(Math.ceil(deckShuffle.length / size)).fill("")
                        .map(function () { return this.splice(0, size) }, deckShuffle.slice());
                    /* console.log('[player data deck] - ', newArray[0]);
                    console.log('[player data deck] - ', newArray[1]);
                    console.log('[player data deck] - ', newArray[2]);
                    console.log('[player data deck] - ', newArray[3]); */

                    groupe.players[0].cards = Deck.deal(newArray[0]);
                    groupe.players[1].cards = Deck.deal(newArray[1]);
                    groupe.players[2].cards = Deck.deal(newArray[2]);
                    groupe.players[3].cards = Deck.deal(newArray[3]);

                    /* console.log('groupe.players back 0', groupe.players[0].cards);
                    console.log('groupe.players back 1', groupe.players[1].cards);
                    console.log('groupe.players back 2', groupe.players[2].cards);
                    console.log('groupe.players back 3', groupe.players[3].cards); */


                    //console.log('[player data newTabPlayers[0]] - ', newTabPlayers[3]);
                    let game = new Game(groupe);

                    this.dispatcher(
                        this.io,
                        'chatMessage',
                        {
                            username: 'Admin',
                            message: "Bienvenue à toutes et tous dans le jeu du Barbu. <br/>C'est <b>"
                                + groupe.players[0].username +
                                "</b> qui commence la partie.<br/> Amusez-vous bien !!!",
                            type: 'gameMessage'
                        },
                        groupe.id
                    )
                    /* this.io.to(groupe.id).emit('chatMessage', {
                        username: 'Admin',
                        message: "Bienvenue à toutes et tous dans le jeu du Barbu. <br/>C'est <b>" + groupe.players[0].username + "</b> qui commence la partie.<br/> Amusez-vous bien !!!",
                        type: 'gameMessage'
                    }); */
                    this.dispatcher(this.io, 'start game', groupe, groupe.id);
                    //this.io.to(groupe.id).emit('start game', groupe);



                } else {
                    let newTabPlayers = this.randomize(groupe.players);

                    newTabPlayers.forEach((p, i) => {
                        if (i !== 0) {
                            newTabPlayers[i].host = false;
                            newTabPlayers[i].turn = false;
                        }
                    });
                }
            });

            socket.on('cardPlayed', (data) => {
                this.dispatcher(socket.broadcast, 'cardPlayedFromOthers', data, '');
                //socket.broadcast.emit('cardPlayedFromOthers', data);
            });

            socket.on('chatMessage', (chatMessage) => {
                this.dispatcher(socket.broadcast, 'chatMessage', chatMessage, '');
                //socket.broadcast.emit('chatMessage', chatMessage);
            });

            socket.on('contractChosen', (data) => {
                this.dispatcher(socket.broadcast, 'contractChosen', data, data.player.groupeId)
                //socket.broadcast.to(data.player.groupeId).emit('contractChosen', data);
                this.dispatcher(this.io, 'turn', data, data.player.groupeId);
                //this.io.to(data.player.groupeId).emit('turn', data);
            });

            socket.on('get groupes', () => {
                setInterval(() => {
                    this.dispatcher(this.io, 'list groupes', this.groupes, '');
                    //this.io.to(socket.id).emit('list groupes', this.groupes);
                }, 1000);
            });

            socket.on('disconnect', () => {
                console.log(`[disconnect] ${socket.id}`);

                let groupe = null;
                if (this.groupes.length !== 0) {
                    this.groupes.forEach((g => {
                        g.players.forEach((p) => {
                            if (p.socketId === socket.id && p.host) {
                                groupe = g;
                                this.groupes = this.groupes.filter(g => g !== groupe);
                            }
                        });
                    }));
                } else {
                    this.groupes = [];
                }

            });
        });
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on http://localhost:${this.port}/`);
        });
    }

    createGroupe(player) {
        const groupe = { id: this.groupeId(), players: [] };

        player.groupeId = groupe.id;
        groupe.players.push(player);
        this.groupes.push(groupe);

        return groupe;
    }

    groupeId() {
        return Math.random().toString(36).substr(2, 9);
    }

    randomize(tab) {
        var i, j, tmp;
        for (i = tab.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = tab[i];
            tab[i] = tab[j];
            tab[j] = tmp;
        }
        return tab;
    }
    dispatcher(prefix, type, obj, toid) {
        if (toid === '') {
            prefix.emit(type, obj);
        } else {
            prefix.to(toid).emit(type, obj);
        }

    }
}

new App(port).start();