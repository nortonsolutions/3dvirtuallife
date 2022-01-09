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
    newHeroTemplate(name,height) {
        return {
            name: name,
            type: "hero",
            location: { x: 0, y: 0, z: 0 },
            attributes: {
                moves: true,
                animates: true,
                height: height,
                length: 20,
                width: 20,
                scale: 10,
                elevation: 0,
                stats: {
                    health: "03/05",
                    mana: "00/00",
                    strength: "01/01",
                    agility: "03/03"
                }
            },
            gltf: 'robot.glb',
            model: null,
            inventory: [],
            spells: [],
            equipped: {}

        }
    }


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
            // Launch the loadgame template with the list of games
            this.eventDepot.fire('modal', { type: 'loadgame', title: 'Load Game', context: JSON.parse(response) });
        })
    }

    /** load gameName, gameProps, and gameHeroTemplate into localStorage, then launch game */
    loadGame(gameName) {
        handleGet('/load/' + gameName, response => {

            let props = JSON.parse(response).props;
            let heroTemplate = JSON.parse(response).heroTemplate;

            localStorage.setItem('gameName', gameName);
            localStorage.setItem('gameProps', props);
            localStorage.setItem('gameHeroTemplate', heroTemplate);

            this.eventDepot.fire('startGame', { heroTemplate: JSON.parse(heroTemplate), props: JSON.parse(props) })
        })
    }

    deleteGame(gameName, callback) {
        handlePost('/delete', { gameName }, response => {
            callback();
        })
    }

}