import { models } from '/models/models.js'

var props = { level: 0, layouts: [] }
var heroTemplate = newHeroTemplate('new', 20);

export class CharacterScreen {
 
    constructor(eventDepot, modal) {

        this.eventDepot = eventDepot;
        this.modal = modal;

        this.selectedModel = 0;
        this.heroTemplate = newHeroTemplate();

        this.models = models;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, 2/3, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();

        var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.cylinder = new THREE.Mesh( geometry, material );
    }

    render = () => {

        this.cylinder.rotation.x += 0.01;
        this.cylinder.rotation.y += 0.01;
        requestAnimationFrame( this.render );
        this.renderer.render( this.scene, this.camera );

    }

    runOnce(callback) {

        handleGet('/listSavedHeroes', (response) => {
            let savedHeroes = JSON.parse(response).map(el => JSON.parse(el));
            this.models = [...this.models, ...savedHeroes];

            let playerPreview = document.getElementById('playerPreview');
            playerPreview.appendChild( this.renderer.domElement );
            this.scene.add( this.cylinder );
            this.camera.position.z = 30;
    
            this.render();
            callback();
        });
    }

    addCharacterScreenEvents() {

        // this.populateModels(() => {
            document.getElementById('next').addEventListener('click', () => {
                this.selectedModel++;
                if (this.selectedModel >= this.models.length) this.selectedModel = 0;
                this.refresh();
            });
    
            document.getElementById('back').addEventListener('click', () => {
                this.selectedModel--;
                if (this.selectedModel < 0 ) this.selectedModel = this.models.length - 1;
                this.refresh();
            });
    
            document.getElementById('startLevel').addEventListener('click', (e) => {
                e.preventDefault();
    
                this.heroTemplate.name = document.getElementById('name').value;
                this.heroTemplate.gltf = this.models[this.selectedModel].gltf;
                this.heroTemplate.attributes.stats = {...this.heroTemplate.attributes.stats, ...this.models[this.selectedModel].attributes.stats }
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
            // });
        });

        document.getElementById('joinGame').addEventListener('click', (e) => {
            
            e.preventDefault();

            this.heroTemplate.name = document.getElementById('name').value;
            this.heroTemplate.gltf = this.models[this.selectedModel].gltf;
            this.heroTemplate.attributes.stats = {...this.heroTemplate.attributes.stats, ...this.models[this.selectedModel].attributes.stats }
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
            model: this.models[this.selectedModel],
            heroTemplate: this.heroTemplate
        }
    }

    refresh = () => {
        this.cylinder.rotation.x = 0;
        this.cylinder.rotation.y = 0;
        let context = this.getContext(this);
        this.modal.loadTemplate('modal-body', "character", this.getContext(), () => {
            this.runOnce(() => {
                this.addCharacterScreenEvents();
            })
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
        spells: [
            {"itemName":"healSpell"},
            {"itemName":"healAllSpell"},
            {"itemName":"poisonSpell"},
            {"itemName":"poisonProjectileSpell"},
            {"itemName":"fireProjectileSpell"},
            {"itemName":"iceProjectileSpell"},
        ],
        equipped: {},
        conversation: {
            conversationState: "intro",
            engagementState: 0,
            special: {
                speech: "Most esteemed greetings to you, my friend!  Let's trade.",
                action: 'showWares'
            }
        },
    }
}