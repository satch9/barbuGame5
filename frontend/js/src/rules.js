/*
barbu =>70 pts 
tour s'arrête quand un joueur gagne une main avec le roi de coeur.

pas de plis => 5 pts par plis
tour s'arrête quand les x mains ont été jouées. donc dépend du nombre de 
cartes utilisées

pas de coeurs => 5 pts par plis
tour s'arrête quand les x mains ont été jouées. donc dépend du nombre de 
cartes utilisées

pas de dames => 15 pts par dames
tour s'arrête quand les 4 dames ont été jouées.


salade  => barbu, pas de plis, pas de dames, pas de coeur
tour s'arrête quand les x mains ou plis ont été jouées à 'intérieur de ces plis
un joueur a le roi de coeur et/ou  quand les x mains avec des coeurs 
ont été jouées et/ou quand les 4 dames ne sont plus dans les mains des 4 joueurs


réussite => 1er gagne 100 pts et 2ème gagne 50 pts
tour s'arrête quand 2 joueurs sur 4 n'ont plus de cartes. 
*/

const barbu = [
    {
        typeJeu: 52,
        carte: { suit: 'h', position: 47, value: 13 },
        points: -70
    },
    {
        typeJeu: 32,
        carte: { suit: 'h', position: 27, value: 13 },
        points: -70
    }
];

const pasDePlis = [
    {
        typeJeu: 52,
        tour: 13,
        points: -5
    },
    {
        typeJeu: 32,
        tour: 8,
        points: -5
    }
];

const pasDeCoeurs = [
    {
        typeJeu: 52,
        tour: 13,
        cartes: [
            { suit: 'h', position: 3, value: 2 },
            { suit: 'h', position: 7, value: 3 },
            { suit: 'h', position: 11, value: 4 },
            { suit: 'h', position: 15, value: 5 },
            { suit: 'h', position: 19, value: 6 },
            { suit: 'h', position: 23, value: 7 },
            { suit: 'h', position: 27, value: 8 },
            { suit: 'h', position: 31, value: 9 },
            { suit: 'h', position: 35, value: 10 },
            { suit: 'h', position: 39, value: 11 },
            { suit: 'h', position: 43, value: 12 },
            { suit: 'h', position: 47, value: 13 },
            { suit: 'h', position: 51, value: 14 }
        ],
        points: -5
    },
    {
        typeJeu: 32,
        tour: 8,
        cartes: [
            { suit: 'h', position: 3, value: 7 },
            { suit: 'h', position: 7, value: 8 },
            { suit: 'h', position: 11, value: 9 },
            { suit: 'h', position: 15, value: 10 },
            { suit: 'h', position: 19, value: 11 },
            { suit: 'h', position: 23, value: 12 },
            { suit: 'h', position: 27, value: 13 },
            { suit: 'h', position: 31, value: 14 },
        ],
        points: -5
    }
];

const pasDeDames = [
    {
        typeJeu: 52,
        points: -15
    },
    {
        typeJeu: 32,
        points: -15
    }
];

const reussite = [
    {
        typeJeu: 52,
        points: {
            premier: 100,
            second: 50
        }
    },
    {
        typeJeu: 32,
        points: {
            premier: 100,
            second: 50
        }
    }
];