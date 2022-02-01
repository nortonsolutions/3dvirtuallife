import { models } from '/models/models.js'

var props = { level: 0, layouts: [] }
var heroTemplate = newHeroTemplate('dave', 20);

export class CharacterScreen {
 
    constructor(eventDepot, modal) {

        this.eventDepot = eventDepot;
        this.modal = modal;

        this.selectedModel = 0;
        this.heroTemplate = newHeroTemplate();
    }

    addCharacterScreenEvents() {
        document.getElementById('next').addEventListener('click', () => {
            this.selectedModel++;
            if (this.selectedModel >= models.length) this.selectedModel = 0;
            this.refresh();
        });

        document.getElementById('back').addEventListener('click', () => {
            this.selectedModel--;
            if (this.selectedModel < 0 ) this.selectedModel = models.length - 1;
            this.refresh();
        });

        document.getElementById('startLevel').addEventListener('click', (e) => {
            e.preventDefault();

            this.heroTemplate.name = document.getElementById('name').value;
            this.heroTemplate.gltf = models[this.selectedModel].gltf;
            this.heroTemplate.attributes.stats = {...this.heroTemplate.attributes.stats, ...models[this.selectedModel].attributes.stats }
            this.heroTemplate.attributes.height = Number(document.getElementById('height').value);

            handleGet('/listActiveGames', (response) => {

                let activeGames = JSON.parse(response);
                if (Object.keys(activeGames).length > 0) { // if there are games

                    /** 
                     * TODO (future): allow creation of new game namespace.
                     * For now only one namespace is allowed ('/') so the
                     * only option is to join game.
                     */
                    this.eventDepot.fire('closeModal', {});
                    this.eventDepot.fire('joinGame', { heroTemplate: this.heroTemplate, activeGames });

                } else { // no games, so start a new one
                    
                    let namespace = '/';
                    this.eventDepot.fire('closeModal', {});
                    this.eventDepot.fire('startLevel', { heroTemplate: this.heroTemplate, props, namespace });
                }
            });
        });

        document.getElementById('joinGame').addEventListener('click', (e) => {
            
            e.preventDefault();

            this.heroTemplate.name = document.getElementById('name').value;
            this.heroTemplate.gltf = models[this.selectedModel].gltf;
            this.heroTemplate.attributes.stats = {...this.heroTemplate.attributes.stats, ...models[this.selectedModel].attributes.stats }
            this.heroTemplate.attributes.height = Number(document.getElementById('height').value);

            handleGet('/listActiveGames', (response) => {

                let activeGames = JSON.parse(response);
                if (Object.keys(activeGames).length > 0) { // if there are games
            
                    this.eventDepot.fire('closeModal', {});
                    this.eventDepot.fire('joinGame', { heroTemplate: this.heroTemplate, activeGames });

                } else { // no games to join, so notify and start new game

                    let namespace = '/';
                    alert('No games to join!  Starting new game.');
                    this.eventDepot.fire('closeModal', {});
                    this.eventDepot.fire('startLevel', { heroTemplate: this.heroTemplate, props, namespace });
                }
            });

        });
    }

    getContext = () => {

        return {
            model: models[this.selectedModel],
            heroTemplate: this.heroTemplate
        }
    }

    refresh = () => {
        let context = this.getContext(this);
        this.modal.loadTemplate('modal-body', "character", this.getContext(), () => {
            this.addCharacterScreenEvents();
        });
    }
}


function newHeroTemplate(name,height) {
    return {
        name: name,
        type: "hero",
        subtype: "local",
        location: { x: 0, y: 0, z: 0 },
        attributes: {
            moves: true,
            animates: true,
            height: height,
            length: 20,
            width: 20,
            scale: 10,
            elevation: 0,
            experience: 0,
            stats: {
                health: "3/5/0",  // min/max/boost
                mana: "10/10/0",
                strength: "1/1/0",
                agility: "3/3/0",
                defense: "0/0/0"
            },
            xpLevels: {
                health: 0,
                mana: 0,
                strength: 0,
                agility: 0,
                defense: 0
            }
        },
        gltf: 'robot.glb',
        model: null,
        inventory: [],
        spells: [{"itemName":"healAllSpell"},{"itemName":"poisonProjectileSpell"}],
        equipped: {}

    }
}