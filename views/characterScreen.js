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

        document.getElementById('startGame').addEventListener('click', (e) => {
            e.preventDefault();
            this.heroTemplate.name = document.getElementById('name').value;
            this.heroTemplate.gltf = models[this.selectedModel].gltf;
            this.heroTemplate.attributes.stats = {...this.heroTemplate.attributes.stats, ...models[this.selectedModel].attributes.stats }
            this.heroTemplate.attributes.height = Number(document.getElementById('height').value);
            this.eventDepot.fire('startGame', { heroTemplate: this.heroTemplate, props });
            this.eventDepot.fire('closeModal', {});
        });

        document.getElementById('joinGame').addEventListener('click', () => {
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
                mana: "0/0/0",
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
        spells: [],
        equipped: {}

    }
}