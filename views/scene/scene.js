

var cameraReach = 1400;
var cameraDistanceDefault = 200;
var cameraElevationDefault = 40;

var cameraMinimapReach = 1200;
var cameraMinimapElevationDefault = 1000;

var DUENORTH = new THREE.Vector3( 0, 0, 2000 );

var WHITE = new THREE.Color('white');
var BLACK = new THREE.Color('black');

var navbarHeight;

var minimap = false, sidebar = false, chatbar = false;

/**
 * The Scene has graphical display (THREE.js), animates using requestAnimationFrame,
 * and uses controls.  It accepts an initial layout of objects to setup the layout, 
 * then updates the objects array with locations after each animation.
 */

class Scene {

    constructor(controller) {


        this.prevTime = performance.now();

        // SceneController has access to layoutManager, which has levelBuilder
        this.controller = controller;
        this.running = true;

        this.background = controller.layout.background;
        
        this.animate = this.animate.bind(this);
        this.deanimate = this.deanimate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.addControls = this.addControls.bind(this);

        this.controls = null;
        this.scene = null;
        
        this.requestAnimationFrameID = null;
    }

    init(callback) {
        this.scene = new THREE.Scene();

        navbarHeight = 0; // document.querySelector('.navbar').clientHeight;
        
        this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / (window.innerHeight - navbarHeight), 1, cameraReach );

        // 20 should match this.hero.attributes.height?
        this.camera.position.set( 0, cameraElevationDefault + 20, cameraDistanceDefault );
        
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, (window.innerHeight - navbarHeight));
        // this.renderer.gammaInput = true;
        // this.renderer.gammaOutput = true;

        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );

        this.addControls();
        this.addBackground();
        this.addEventListeners();
        // this.addHelper();

        if (callback) setTimeout(() => {
            callback();
        }, 200);
        
    }

    addControls() {
        this.controls = new THREE.PointerLockControls( this.camera );

        this.addMinimap();
        
        this.cameraBackray = new THREE.Raycaster( new THREE.Vector3( ), new THREE.Vector3( 0, 0, 1 ), 0, cameraDistanceDefault + 230);
        this.scene.add( this.controls.getObject() );

        document.addEventListener( 'keydown', this.onF8, false );
        document.addEventListener( 'keydown', this.onKeyDown, false );
        document.addEventListener( 'keyup', this.onKeyUp, false );
    }

    add ( model ) {
        this.scene.add( model );
    }

    removeFromScenebyLayoutId(layoutId) {
        this.scene.remove(this.scene.children.find(el => {
            return el.attributes? el.attributes.layoutId == layoutId : false;
        }));
    }
    
    addBackground() {

        if (this.background && this.background.length > 0) {

            // simplistic equirectangular mapping to the inverse of a sphere geometry:
            var geometry = new THREE.SphereBufferGeometry(cameraReach - 200);
            geometry.scale (-1,1,1);

            var material = new THREE.MeshBasicMaterial( {
                map: new THREE.TextureLoader().load("/textures/" + this.background)
            });

            this.backgroundMesh = new THREE.Mesh(geometry, material)
            this.controls.getObject().add( this.backgroundMesh );

        } else {
            this.scene.background = BLACK;
        }

        if (this.controller.layout.terrain.attributes.fog) {
            this.scene.fog = new THREE.Fog( 
                this.controller.layout.terrain.attributes.fog.color, 
                700/(this.controller.layout.terrain.attributes.fog.density? 
                    this.controller.layout.terrain.attributes.fog.density : 1), 
                cameraReach );
        }
    }

    addMinimap() {

        this.rendererMinimap = new THREE.WebGLRenderer( { antialias: true } );
        document.getElementById('minimap').appendChild( this.rendererMinimap.domElement );
        this.cameraMinimap = new THREE.PerspectiveCamera( 45, 1, 1, cameraMinimapReach );
        this.cameraMinimap.position.set( 0, cameraMinimapElevationDefault, 0);
        this.cameraMinimap.rotation.set( -Math.PI / 2, 0, 0 );
        this.controls.getObject().add(this.cameraMinimap);

        let compassTemplate = {
            gltf: "arrow.gltf",
            attributes: {
                scale: 100
            }
        }

        this.compass = this.controller.formFactory.newForm("compass", compassTemplate);
        this.compass.load(() => {
            this.compass.model.children[0].material.side = THREE.FrontSide;
            this.compass.model.position.set( 0, cameraMinimapElevationDefault/2, -cameraMinimapElevationDefault/10);
            this.controls.getObject().add(this.compass.model);
        });

    }

    /** Separate keyhandling for F8 because it controls other keyhandler */
    onF8 = ( event ) => {

        if (event.keyCode == 119 || (event.altKey && event.keyCode == 84)) {  //F8 or Alt-T
            chatbar = !chatbar;
            this.controller.eventDepot.fire('toggleChatbar', { show: chatbar }); 
        }
    }

    
    onKeyDown = ( event ) => {
    
        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                if (this.controller.hero) this.controller.hero.moveForward = true;
                break;

            case 37: // left
            case 65: // a
                if (this.controller.hero) this.controller.hero.moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                if (this.controller.hero) this.controller.hero.moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                if (this.controller.hero) this.controller.hero.moveRight = true;
                break;

            case 32: // space
                this.controller.eventDepot.fire('jump', {});
                break;

            case 73: // i
                this.controller.hero.cacheHero(); // saves updated location in template
                this.controller.eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });
                this.controller.eventDepot.fire('halt', {});
                break;
                
            case 77: // m
                minimap = !minimap;
                this.controller.eventDepot.fire('minimap', {});
                break;

            case 72: // h
                sidebar = !sidebar;
               
                if (sidebar) this.controller.eventDepot.fire('refreshSidebar', { equipped: this.controller.hero.equipped });
                this.controller.eventDepot.fire('toggleSidebar', { show: sidebar });
                break;
            case 49: // 1
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56: // 8
                this.controller.eventDepot.fire('hotkey', { key: event.keyCode - 48 })
                break;

        }

    };

    onKeyUp = ( event ) => {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                if (this.controller.hero) this.controller.hero.moveForward = false;
                break;

            case 37: // left
            case 65: // a
                if (this.controller.hero) this.controller.hero.moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                if (this.controller.hero) this.controller.hero.moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                if (this.controller.hero) this.controller.hero.moveRight = false;
                break;

        }

    };

    addHelper() {

        this.helper = new THREE.Mesh ( new THREE.SphereBufferGeometry(10), new THREE.MeshBasicMaterial({ color: 'blue' }));
        this.helper.visible = true;
        this.scene.add( this.helper );

    }

    onMouseClick = (e) => {
        // console.log(`Controls object:`);
        console.dir(this.controls.getObject().position);

        // console.log(`Objects3D object:`);
        // console.dir(this.controller.objects3D);
    }

    onMouseDown = (e) => {
        if (this.controller.hero) {

            switch (e.button) {

                case 0:
                    this.controller.eventDepot.fire('mouse0click', {});
                    break;
                case 1:
                    this.controller.eventDepot.fire('mouse1click', {});
                    break;
                case 2:
                    this.controller.hero.moveForward = true;
                    break;
            }
        }
    }

    onMouseUp = (e) => {
        if (this.controller.hero) {
            switch (e.button) {

                case 0:
                    // this.helper.visible = false;
                    break;
                case 1:
                    break;
                case 2:
                    this.controller.hero.moveForward = false;
                    break;
            }
        }
    }

    addEventListeners() {
        let main = document.querySelector('main');
        main.innerHTML = `<div id="blocker" style="display: block;">

        <div id="instructions" style="">
            <span style="font-size:40px">Click to play</span>
            <br>
            (W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)
        </div>

        </div>`;

        this.blocker = document.getElementById( 'blocker' );
        this.instructions = document.getElementById( 'instructions' );

        this.controller.eventDepot.addListener('setHeroStat', (data) => {
            if (data.type == "health" || data.type == "mana") {
                let el = document.getElementById(data.type);
                el.value = data.points;
                el.innerText = data.points;
            }
        })

        this.controller.eventDepot.addListener('setHeroStatMax', (data) => {
            if (data.type == "health" || data.type == "mana") {
                let el = document.getElementById(data.type);
                el.max = data.points;
                el.optimum = Math.floor(data.points*.9);
                el.low = Math.floor(data.points*.3);
                el.high = Math.floor(data.points*.7);
            }
        })

        this.controller.eventDepot.addListener('updateXP', (data) => {
            document.getElementById('xp').innerText = data;
        })

        this.controller.eventDepot.addListener('lockControls', () => {
            this.controls.lock();
        })

        this.controller.eventDepot.addListener('unlockControls', () => {
            this.controls.unlock();
        })

        this.controller.eventDepot.addListener('updateHelper', (data) => {
            this.helper.position.copy(data.position);
            this.helper.material.color = data.color;
        })

        this.controller.eventDepot.addListener('disableKeyDownListener', () => {
            document.removeEventListener( 'keydown', this.onKeyDown, false );
        })

        this.controller.eventDepot.addListener('enableKeyDownListener', () => {
            document.addEventListener( 'keydown', this.onKeyDown, false );
        })

        this.instructions.addEventListener( 'click', () => {

            this.controls.lock();
        
        }, false );

        this.controls.addEventListener( 'lock', () => {

            this.instructions.style.display = 'none';
            this.blocker.style.display = 'none';
            document.addEventListener( 'mousedown', this.onMouseDown, false );
            document.addEventListener( 'mouseup', this.onMouseUp, false );
            document.addEventListener( 'click', this.onMouseClick, false );
        } );

        this.controls.addEventListener( 'unlock', () => {

            this.blocker.style.display = 'block';
            this.instructions.style.display = '';
            document.removeEventListener( 'mousedown', this.onMouseDown, false );
            document.removeEventListener( 'mouseup', this.onMouseUp, false );
            document.removeEventListener( 'click', this.onMouseClick, false );

        } );

        main.appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / (window.innerHeight - navbarHeight);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, (window.innerHeight - navbarHeight) );
    }

    handleAutoZoom = () => {
        // let time = performance.now();
        this.cameraBackray.ray.origin.copy(this.controls.getObject().position);
        this.cameraBackray.ray.origin.y += this.controller.hero.attributes.height-10;

        // NEEDS PITCH as well
        let cameraDirection = this.controls.getDirection(new THREE.Vector3( 0, 0, 0 ));

        this.cameraBackray.ray.direction.x = -cameraDirection.x
        this.cameraBackray.ray.direction.y = -cameraDirection.y + 0.2
        this.cameraBackray.ray.direction.z = -cameraDirection.z

        let backrayIntersections = this.cameraBackray.intersectObjects(this.controller.structureModels, true);

        if (backrayIntersections[0] && backrayIntersections[0].object.type != "Sprite") {
            // console.log("backray intersection:")
            // console.dir(backrayIntersections[0]);
            let distance = backrayIntersections[0].distance;
            if (distance < cameraDistanceDefault && this.camera.position.z > -5) {
                this.camera.position.z = distance - 20; // -= cameraDistanceDefault / 30;
                if (this.camera.position.y > cameraElevationDefault + this.controller.hero.attributes.height) this.camera.position.y -= cameraElevationDefault / 30;
            }
        } else {
            if (this.camera.position.z <= cameraDistanceDefault) {
                this.camera.position.z += cameraDistanceDefault / 100;
                if (this.camera.position.y < cameraElevationDefault) this.camera.position.y += cameraElevationDefault / 100;
            }
        }
        // console.log(`handleAutoZoom: ${performance.now() - time}`);
    }
    
    handleSprites() {
        // let time = performance.now();
        if (this.requestAnimationFrameID % 3 == 0) {
            this.controller.sprites.forEach(sprite => {

                let offsetX = sprite.sprite.material.map.offset.x + (1 / sprite.frames);
                // if (offsetX > (sprite.frames - 1) / sprite.frames) offsetX = 0;
                if (offsetX >= .99) offsetX = 0;
                sprite.sprite.material.map.offset.x = offsetX;
            })
        }
        // console.log(`handleSprites: ${performance.now() - time}`);
    }

    /* Distribute damage to enemies, make item disappear or fall to ground */
    /* 'local' items exert an effect while non-local are just for appearances */
    handleAction(projectile, entitiesInRange) {

        // Sprite effects:
        if (projectile.local && projectile.item.attributes.sprites) {
            projectile.item.attributes.sprites.forEach(spriteConfig => {

                spriteConfig.scale = spriteConfig.scale/10;
                spriteConfig.elevation = spriteConfig.elevation-20;

                this.controller.formFactory.addSprites(projectile.item.model, spriteConfig, this, true, projectile.item.model.position);
                entitiesInRange.forEach(entity => {
                    this.controller.formFactory.addSprites(entity.model, spriteConfig, this, true, projectile.item.model.position);
                })
            });

        }

        if (projectile.local) {
            let [stat, change] = projectile.item.attributes.effect.split("/");

            entitiesInRange.forEach(entity => {
                this.controller.hero.inflictDamage(entity, change);
            })
        }

        if (projectile.item.objectType == 'item' && 
            projectile.item.attributes.throwableAttributes.chanceToLeaveOnGround && 
            Math.random() < projectile.item.attributes.throwableAttributes.chanceToLeaveOnGround) {
            projectile.item.model.position.y = projectile.item.determineElevationFromBase() + projectile.item.attributes.elevation;
        } else {  // remove the item
            // if (projectile.item.model.parent) projectile.item.model.parent.remove(projectile.item.model);
            this.removeFromScenebyLayoutId(projectile.item.attributes.layoutId);
        }
    }


    /** 
     * Each projectile looks like this:
     * {
            item,
            direction,
            velocity: new THREE.Vector3(),
            distanceTraveled: 0,
            local
        }
     *
     */
    handleProjectiles(delta) {
        // let time = performance.now();
        if (this.controller.projectiles.length > 0) {
            this.controller.projectiles.filter(el => el.distanceTraveled == -1).forEach(projectile => {
                this.handleAction(projectile, []);
            })
            
            this.controller.projectiles = this.controller.projectiles.filter(el => el.distanceTraveled != -1);
    
            this.controller.projectiles.forEach(projectile => {
    
                if (projectile.distanceTraveled == 0) { // first iteration, set velocitiess
    
                    projectile.velocity.y = (projectile.direction.y) * 500;
                    projectile.velocity.z = projectile.item.attributes.throwableAttributes.speed * 500;
                    
                } else { // subsequent iterations
    
                    // INERTIA/GRAVITY
                    projectile.velocity.z -= projectile.velocity.z * delta;
                    projectile.velocity.y -= 9.8 * projectile.item.attributes.throwableAttributes.weight * 100 * delta;
                }
    
                projectile.item.model.translateY( projectile.velocity.y * delta );
                projectile.item.model.translateZ( -projectile.velocity.z * delta );
    
                let entitiesInRange = this.controller.allEnemiesInRange(projectile.item.attributes.range, projectile.item.model.position);
    
                if (entitiesInRange.length > 0) {
                    this.handleAction(projectile, entitiesInRange);
                    this.controller.projectiles = this.controller.projectiles.filter(el => el != projectile);
                }
    
                projectile.distanceTraveled += (Math.abs(projectile.velocity.z * delta) + Math.abs(projectile.velocity.y * delta));
    
                let maxDistance = projectile.item.attributes.throwableAttributes.distance;
    
                // console.log(`traveled: ${projectile.distanceTraveled}, position: ${projectile.item.model.position.x}, ${projectile.item.model.position.y},${projectile.item.model.position.z }`);
                console.log(`${projectile.item.model.position.y}`)
                if (projectile.distanceTraveled > maxDistance || projectile.item.model.position.y <= projectile.item.determineElevationFromBase()+5) {
                    projectile.distanceTraveled = -1;
                }
            })
        }
        // console.log(`handleProjectiles: ${performance.now() - time}`);
    }

    animate() {
        
        
        if (this.running) {
            
            this.requestAnimationFrameID = requestAnimationFrame( this.animate );
            if ( this.controls.isLocked === true && this.running ) {

                this.time = performance.now();
                this.delta = ( this.time - this.prevTime ) / 1000;
    
                this.controller.handleMovement(this.delta);
                // this.controller.handleEntityMovement(this.delta);
                // this.controller.handleMixers(this.delta);
                this.handleSprites();
                this.handleProjectiles(this.delta);

                if (this.controller.backgroundMesh) this.controller.backgroundMesh.rotation.y = -this.controls.getObject().rotation.y;
    
                this.prevTime = this.time;
            
            } else {
                this.prevTime = performance.now();
            }

            // let time = performance.now();
            this.renderer.render( this.scene, this.camera );
            // console.log(`render: ${performance.now() - time}`);
            
            if (minimap) {
                this.rendererMinimap.render(this.scene, this.cameraMinimap);
                if (this.compass) this.compass.model.lookAt( DUENORTH );
            }
    
    
            this.stats.update();

        } else {
            cancelAnimationFrame( this.requestAnimationFrameID );
            this.dispose(this.scene);
        }

    }

    dispose(item) {
        if (item.children.length == 0) {
            if (item.dispose) item.dispose();
            return;
        } else {
            item.children.forEach(child => {
                this.dispose(child);
            })
        }
        if (item.dispose) item.dispose();
    }

    deanimate(callback) {
        this.running = false;
        if (document.getElementById('minimap').firstElementChild) document.getElementById('minimap').firstElementChild.remove();
        callback();
    }

    unregisterEventListeners = () => {
        if (this.instructions) this.instructions.removeEventListener( 'click', this.controls.lock, false );
        
        document.removeEventListener( 'keydown', this.onKeyDown, false );
        document.removeEventListener( 'keydown', this.onF8, false );
        document.removeEventListener( 'keyup', this.onKeyUp, false );
        window.removeEventListener( 'resize', this.onWindowResize, false );
        this.controller.eventDepot.removeListeners('lockControls');
        this.controller.eventDepot.removeListeners('unlockControls');
        this.controller.eventDepot.removeListeners('setHeroStat');
        this.controller.eventDepot.removeListeners('setHeroStatMax');
        this.controller.eventDepot.removeListeners('updateHelper');
        this.controller.eventDepot.removeListeners('updateXP');
    }

}

export {Scene};