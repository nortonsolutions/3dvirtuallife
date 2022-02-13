/**
* 
* Here we keep track of the hero, inventory, saving/loading games, etc.
* 
* When a game is saved, the props are saved in the profile,
* so loading will resume at the same level with the same inventory, etc.
*/
export class GameAPI {
    
    constructor(eventDepot) {
        this.eventDepot = eventDepot;
    }
    
    /**
     * Fresh game props from scratch with only personal details provided.
     */

    /** Post to /save with the gameProps, etc. to save information in the server db */
    saveGame(gameName) {

        let gameData = {
            gameName: gameName,
            gameProps: localStorage.getItem('gameProps'),
            gameHeroTemplate: localStorage.getItem('gameHeroTemplate')
        }
        
        handlePost('/save', gameData, response => {
            if (JSON.parse(response).success) {
                localStorage.setItem('gameName', gameName);
            } else {
                alert(JSON.parse(response).error);
            }

        })

    }

    
    /**
     * listGames is part of the 'loadGame' workflow.
     * Character has been selected/cached before calling this.
     * TODO: after /listActiveGames, allow the player to select a game to join,
     * or allow the creation of a new nameSpace with an existing saved game.
     */ 
    listGames() {

        handleGet('/listActiveGames', (response) => {

            let activeGames = JSON.parse(response);
            if (Object.keys(activeGames).length > 0) { // if there are games
        
                alert('Game is already running!  Joining the game with your character.');
                let heroTemplate = JSON.parse(localStorage.getItem('gameHeroTemplate'));
                this.eventDepot.fire('joinGame', { heroTemplate, activeGames });

            } else { // no games to join, so call /list and the loadGame modal

                handleGet('/list', response => {
                    // Launch the loadGame template with the list of games
                    this.eventDepot.fire('modal', { type: 'loadGame', title: 'Load Game', context: JSON.parse(response) });
                })
           }
        });
    }

    /** 
     * load gameName and gameProps into localStorage, then launch game.
     * Using default '/' namespace for now.
     */
    loadGame(gameName) {
        handleGet('/load/' + gameName, response => {
            let namespace = '/';
            let props = JSON.parse(JSON.parse(response).props);
            localStorage.setItem('gameName', gameName);
            localStorage.setItem('gameProps', JSON.stringify(props));
            let heroTemplate = JSON.parse(localStorage.getItem('gameHeroTemplate'));
            this.eventDepot.fire('startLevel', { heroTemplate, props, namespace });
        })
    }

    deleteGame(gameId, callback) {
        handlePost('/delete', { gameId }, response => {
            callback();
        })
    }

}