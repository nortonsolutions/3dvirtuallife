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

    listGames() {
        handleGet('/list', response => {
            // Launch the loadGame template with the list of games
            this.eventDepot.fire('modal', { type: 'loadGame', title: 'Load Game', context: JSON.parse(response) });
        })
    }

    /** load gameName and gameProps into localStorage, then launch game */
    loadGame(gameName) {
        handleGet('/load/' + gameName, response => {

            let props = JSON.parse(response).props;
            // let heroTemplate = JSON.parse(response).heroTemplate;

            localStorage.setItem('gameName', gameName);
            localStorage.setItem('gameProps', props);
            // localStorage.setItem('gameHeroTemplate', heroTemplate);

            let heroTemplate = localStorage.getItem('gameHeroTemplate');
            this.eventDepot.fire('startLevel', { heroTemplate: JSON.parse(heroTemplate), props: JSON.parse(props) });
        })
    }

    deleteGame(gameName, callback) {
        handlePost('/delete', { gameName }, response => {
            callback();
        })
    }

}