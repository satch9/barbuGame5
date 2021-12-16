
class Game {

    socket;
    players;
    player;
    groupe;
    static MAX_PLAYER = 5;
    static MIN_PLAYER = 0;
    hands;

    constructor() {
        this.socket = io();
        this.player = new Player();
        this.registerPlayer();
        this.getGroupes();
        this.sendMessage();
        this.listGroupes();
        this.joinGroupe();
        this.displayCard();
        this.hands = [];
        this.turns = null;
    }

    /* init() {
        const usernameInput = document.getElementById('username');
        const gameCard = document.getElementById('game-card');
        const userCard = document.getElementById('user-card');
        const waitingArea = document.getElementById('waiting-area');
        const restartArea = document.getElementById('restart-area');
        const groupesCard = document.getElementById('groupes-card');
        const groupesList = document.getElementById('groupes-list');
        const buttonChoiceContract = document.getElementById('buttonChoiceContract');
        const chatMessage = document.getElementById('chat-message');
        const linkToShare = document.getElementById('link-to-share');
        const containerCentral = document.getElementById('container-central-central');

        const playerNord = document.getElementById('playerNord');
        /* const choicePlayerGameNord = document.getElementById('choicePlayerGameNord');
        const scorePlayerNord = document.getElementById('scorePlayerNord');
        const cartesPlayerNord = document.getElementById('cartesPlayerNord'); 

        const playerEst = document.getElementById('playerEst');
         const choicePlayerGameEst = document.getElementById('choicePlayerGameEst');
        const scorePlayerEst = document.getElementById('scorePlayerEst');
        const cartesPlayerEst = document.getElementById('cartesPlayerEst'); 

        const playerOuest = document.getElementById('playerOuest');
         const choicePlayerGameOuest = document.getElementById('choicePlayerGameOuest');
        const scorePlayerOuest = document.getElementById('scorePlayerOuest');
        const cartesPlayerOuest = document.getElementById('cartesPlayerOuest');
         
        const playerSud = document.getElementById('playerSud');
        const choicePlayerGameSud = document.getElementById('choicePlayerGameSud');
        const scorePlayerSud = document.getElementById('scorePlayerSud');
         const cartesPlayerSud = document.getElementById('cartesPlayerSud'); 


    } */

    getElement(id) {
        return document.getElementById(id);
    }

    querySelect(id) {
        return document.querySelector(id);
    }

    querySelectAll(id) {
        return document.querySelectorAll(id);
    }

    registerPlayer() {
        $("#form").on('submit', (e) => {

            e.preventDefault();

            //player.username = usernameInput.value;
            this.player.username = this.getElement('username').value;
            this.player.host = true;
            this.player.turn = true;
            this.player.socketId = this.socket.id;

            this.getElement('user-card').hidden = true;
            this.getElement('waiting-area').classList.remove('d-none');
            this.getElement('groupes-card').classList.remove('d-none');

            this.socket.emit('playerData', this.player);
            //console.log('registerPlayer', this.player);
        });
    }

    sendMessage() {
        $("#sendMessage").on('click', (e) => {
            e.preventDefault();
            let messageText = $('#messageText').val()
            if (messageText.toString().length > 0) {
                this.socket.emit('chatMessage', {
                    message: messageText,
                    username: this.player.username,
                });

                $('#messages').append(
                    "<li><span class='float-left'><span class='circle'>" + this.player.username + "</span></span><div class='myMessage'>" +
                    messageText +
                    '</div></li>'
                );
                this.scrollChatWindow();

                $('#messageText').val('');
            }
        });

        this.socket.on('chatMessage', (chatMessage) => {
            if (chatMessage.type === 'gameMessage') {
                $('#messages').append(
                    "<li><span class='float-left'><span class='circle'>" +
                    chatMessage.username +
                    "</span></span><div class='gameMessage'>" +
                    chatMessage.message +
                    '</div></li>'
                );
            } else {
                $('#messages').append(
                    "<li><span class='float-right'><span class='circle'>" +
                    chatMessage.username +
                    "</span></span><div class='otherMessage'>" +
                    chatMessage.message +
                    '</div></li>'
                );
            }

            this.scrollChatWindow();
        });


    }

    scrollChatWindow() {
        $('#messages').animate(
            {
                scrollTop: $('#messages li:last-child').position().top,
            },
            500
        );
        setTimeout(() => {
            let messagesLength = $('#messages li');
            if (messagesLength.length > 3) {
                messagesLength.eq(0).remove()
            }
        }, 500);
    }

    getGroupes() {
        this.socket.emit('get groupes');
    }

    listGroupes() {
        this.socket.on('list groupes', (groupes) => {
            let html = "";

            if (groupes.length > 0) {

                groupes.forEach(groupe => {

                    switch (groupe.players.length >= Game.MIN_PLAYER && groupe.players.length < Game.MAX_PLAYER) {
                        case true:


                            groupe.players.forEach((gp, index) => {

                                if (gp.host && gp.socketId === this.socket.id && index === 0) {
                                    this.getElement('groupes-card').classList.add('d-none');

                                } else {

                                    //this.getElement('groupes-card').classList.add('d-none');
                                    if (index === 0) {

                                        html += `<li class="list-group-item d-flex justify-content-between"><p class="p-0 m-0 flex-grow-1 fw-bold">Groupe de ${groupe.players[0].username} - ${groupe.id}</p>
                                        <button class="btn btn-sm btn-success join-groupe" data-groupe="${groupe.id}">Rejoindre</button>
                                        </li>`;

                                    }

                                    this.getElement('groupes-list').innerHTML = html;
                                    for (const element of document.getElementsByClassName('join-groupe')) {

                                        element.addEventListener('click', (e) => {
                                            if (this.getElement('username').value !== "") {
                                                this.player = new Player();
                                                this.player.username = this.getElement('username').value;
                                                this.player.socketId = this.socket.id;

                                                this.player.groupeId = e.target.dataset.groupe;

                                                this.socket.emit('playerData', this.player);

                                                this.getElement('user-card').hidden = true;
                                                this.getElement('waiting-area').classList.remove('d-none');
                                                this.getElement('groupes-card').classList.add('d-none');
                                            }
                                        });
                                    }


                                }




                            });

                            break;

                        case false:
                            this.getElement('groupes-list').innerHTML = `Encore aucun groupe créé`;
                            break;

                        default:

                            break;
                    }

                });
            } else {
                this.getElement('groupes-card').classList.remove('d-none');
                this.getElement('groupes-list').innerHTML = `<li class="list-group-item d-flex justify-content-between">
                                            <p class="p-0 m-0 flex-grow-1 fw-bold">Pas de groupes créés</p>
                                        </li>`;
            }


        });
    }

    joinGroupe() {
        this.socket.on('join groupe', (groupeId) => {
            //this.player.groupeId = groupeId;
            this.getElement('link-to-share').innerHTML = `<a href="${window.location.href}?groupe=${groupeId}" target="_blank">${window.location.href}?groupe=${groupeId}</a>`;
        });
    }

    beginningGame() {
        this.socket.on('start game', (groupe) => {
            this.players = groupe.players;
            //console.log('this.players', this.players);
            this.groupe = groupe;
            //console.log('this.groupe', this.groupe);
            this.hands.push({
                groupe: this.groupe,
                handsPlayed: []
            });
            console.log('this.hands initial', this.hands);
            this.startGame();
        });
    }

    loadCardsPictures() {
        let pics = [];
        for (var i = 1; i <= 52; i++) {
            let a = new Image();
            a.src = '../assets/cards/card' + i + '.png';
            pics.push(a.src);
        }
        return pics;
    }

    startGame() {
        this.getElement('restart-area').classList.add('d-none');
        this.getElement('waiting-area').classList.add('d-none');
        this.getElement('game-card').classList.remove('d-none');
        this.getElement('chat-message').classList.remove('d-none');
        this.getElement('groupes-card').classList.add('d-none');

        this.players.forEach((player) => {

            this.renderer(this.players, this.player);

            if (this.player.socketId === player.socketId && player.turn) {
                console.log('startGame player in', player);

                this.turn(player);

            }

        });

        this.socket.on('contractChosen', (data) => {
            //console.log('data', data);
            this.getElement('contract').innerHTML = 'Contrat :<br>' + data.contract;
            //this.getElement('buttonChoiceContract').classList.add('d-none');
        });


    }



    turn(player) {

        this.addButtonListeners(player);

        this.socket.on('contractChosen', (data) => {
            //console.log('data', data);
            this.getElement('contract').innerHTML = 'Contrat :<br>' + data.contract;
            //this.getElement('buttonChoiceContract').classList.add('d-none');
        });
        this.socket.on('turn', (data) => {
            this.clickCardListeners(player);
            console.log('turn data', data);


            // 1 tour d'un contrat comprend 13 passes sauf pour réussite qui a besoin de 2 vainqueurs donc 26 passes minimum
            // le joueur qui a été désigné en premier clique sur sa carte pour jouer
            // 1 click fait monter la carte
            // 2 click la carte est placée dans la partie centrale
            // on passe au joueur suivant
            // quand les 4 cartes 
        });



    }

    renderer(p, playerCurrent) {
        let cardsPictures = this.loadCardsPictures();
        for (let index = 0; index < p.length; index++) {
            //console.log('renderer p[index].host', p[index].host);
            //console.log('renderer p[index].socketId', p[index].socketId);
            //console.log('renderer playerCurrent.socketId', playerCurrent);
            //console.log('renderer p[index].socketId === playerCurrent.socketId', p[index].socketId === playerCurrent.socketId);
            if (p[index].host && p[index].socketId === playerCurrent.socketId) {
                this.getElement('playerSud').innerHTML = playerCurrent.username;

                p[index].cards.forEach((card, ind) => {
                    let cardPlayer = this.querySelect('div.card-player-sud div#card' + ind);

                    cardPlayer.style.backgroundImage = 'url(' + cardsPictures[card.position - 1] + ')';
                    cardPlayer.style.width = '41px';
                    cardPlayer.style.height = '59px';
                    cardPlayer.style.backgroundSize = '41px';
                    cardPlayer.style.backgroundRepeat = 'none';
                    cardPlayer.style.marginRight = "-23px";
                });

                this.getElement('scorePlayerSud').innerHTML = 'Score : ' + 0;



                if (index === 3) {
                    this.getElement('playerOuest').innerHTML = p[0].username;

                } else {
                    this.getElement('playerOuest').innerHTML = p[index + 1].username;
                    this.getElement('playerNord').innerHTML = p[index + 2].username;
                    this.getElement('playerEst').innerHTML = p[index + 3].username;
                }

            } else if (!p[index].host && p[index].socketId === playerCurrent.socketId) {
                this.getElement('playerSud').innerHTML = p[index].username;

                p[index].cards.forEach((card, ind) => {

                    let cardPlayer = this.querySelect('div.card-player-sud div#card' + ind);

                    cardPlayer.style.backgroundImage = 'url(' + cardsPictures[card.position - 1] + ')';
                    cardPlayer.style.width = '41px';
                    cardPlayer.style.height = '59px';
                    cardPlayer.style.backgroundSize = '41px';
                    cardPlayer.style.backgroundRepeat = 'none';
                    cardPlayer.style.marginRight = "-23px";
                    cardPlayer.disabled = true;

                });

                this.getElement('scorePlayerSud').innerHTML = 'Score : ' + 0;

                if (index === 3) {
                    this.getElement('playerOuest').innerHTML = p[0].username;
                    this.getElement('playerNord').innerHTML = p[1].username;
                    this.getElement('playerEst').innerHTML = p[2].username;

                } else if (index === 2) {
                    this.getElement('playerOuest').innerHTML = p[3].username;
                    this.getElement('playerNord').innerHTML = p[0].username;
                    this.getElement('playerEst').innerHTML = p[1].username;

                } else if (index === 1) {
                    this.getElement('playerOuest').innerHTML = p[2].username;
                    this.getElement('playerNord').innerHTML = p[3].username;
                    this.getElement('playerEst').innerHTML = p[0].username;
                }
                if (p[index].host === false && p[index].turn === false && p[index].socketId === playerCurrent.socketId) {
                    this.getElement('buttonChoiceContract').classList.add('d-none');
                }

            }

        }
    }

    addButtonListeners(player) {
        this.player.contracts.push('barbu');
        let contractsAvailable = player.contracts.filter(c => c !== this.player.contracts);

        //console.log('contractsAvailable before', contractsAvailable);

        contractsAvailable.forEach(id => {
            const button = document.getElementById(id);
            button.addEventListener('click', () => {

                player.contracts = this.arrayRemove(player.contracts, id);

                let contract;
                switch (id) {
                    case 'barbu':
                        contract = "Barbu";
                        break;

                    case 'salade':
                        contract = "Salade";
                        break;
                    case 'pasDePlis':
                        contract = "Pas de plis";
                        break;

                    case 'pasDeDame':
                        contract = "Pas de dames";
                        break;

                    case 'pasDeCoeur':
                        contract = "Pas de coeurs";
                        break;

                    default:
                        contract = "Réussite";
                        break;
                }
                this.socket.emit('contractChosen', { contract, player });
                this.getElement(id).classList.add('d-none');
                this.getElement('contract').innerHTML = "Contrat :<br>" + contract;
                this.getElement('buttonChoiceContract').classList.add('d-none');
                this.socket.emit('chatMessage', {
                    message: `${this.player.username} a choisi le contrat ${contract}`,
                    username: 'Admin',
                    type: 'gameMessage'
                });
            }, false);
            //console.log('contractsAvailable after', contractsAvailable);
        });

    };

    arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }


    clickCardListeners(player) {

        //console.log(card);
        if (player.turn) {
            const card = this.querySelectAll("[id^=card]");
            card.forEach(node => {
                let count = 0;
                node.addEventListener('click', (e) => {

                    if (!count) {
                        setTimeout(() => {
                            if (count > 1) {
                                let cardPlayedSud = document.querySelector('div#cardPlayedSud');
                                //console.log("e.target", JSON.stringify(e.target.outerHTML).split('/')[5].split('&')[0]);
                                cardPlayedSud.innerHTML = e.target.outerHTML;
                                this.hands.handsPlayed.push({ player, cardPlayedSud });
                                this.socket.emit('cardPlayed', {
                                    player: this.player,
                                    cardPlayed: e.target.outerHTML
                                });
                                e.target.style.visibility = 'hidden';
                                console.log('this.hands', this.hands);
                            } else {
                                e.target.style.transform = 'translate(0px, -20px)';
                                count = 0;
                            }
                        }, 400);// 400 ms click delay
                    }
                    count += 1;
                });
            });
        }



    }

    displayCard() {
        this.socket.on('cardPlayedFromOthers', (data) => {
            console.log('displayCard', data);
        })
    }
}