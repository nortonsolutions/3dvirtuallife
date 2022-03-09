

var cameraReach = 2000;
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
        this.readyForLock = false;
        
        // SceneController has access to layoutManager, which has levelBuilder
        this.controller = controller;
        this.running = true;

        this.background = controller.layout.background;
        this.backgroundNight = controller.layout.backgroundNight;
        
        this.animate = this.animate.bind(this);
        this.deanimate = this.deanimate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.addControls = this.addControls.bind(this);

        this.onMouseClick = this.onMouseClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.controlsLocked = this.controlsLocked.bind(this);
        this.controlsUnlocked = this.controlsUnlocked.bind(this);
        this.instructionsLock = this.instructionsLock.bind(this);

        this.controls = null;
        this.scene = null;
        
        this.requestAnimationFrameID = null;

        this.projectileMovementRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(0,0,1), 0, 40 );
        // this.clock = new THREE.Clock(); // for use by refractor uniform updates
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
        let formToRemove = this.scene.children.find(el => {
            return el.attributes? el.attributes.layoutId == layoutId : false;
        })
        this.scene.remove(formToRemove);
    }
    
    addBackground() {

        
        if (this.backgroundNight && this.backgroundNight.length > 0 && !this.controller.layout.dayTime) {

            // simplistic equirectangular mapping to the inverse of a sphere geometry:
            var geometry = new THREE.SphereBufferGeometry(cameraReach - 200);
            geometry.scale (-1,1,1);


            var material = new THREE.MeshBasicMaterial( {
                map: new THREE.TextureLoader().load("/textures/" + this.backgroundNight)
            });

            this.backgroundMesh = new THREE.Mesh(geometry, material);
            this.backgroundMesh.rotateZ(Math.PI);
            this.scene.background = BLACK;
            this.controls.getObject().add( this.backgroundMesh );

        } else if (this.background && this.background.length > 0 && this.controller.layout.dayTime) {

            // simplistic equirectangular mapping to the inverse of a sphere geometry:
            var geometry = new THREE.SphereBufferGeometry(cameraReach - 200);
            geometry.scale (-1,1,1);

            var material = new THREE.MeshBasicMaterial( {
                map: new THREE.TextureLoader().load("/textures/" + this.background)
            });

            // Match the background color to the fog for best fadeout
            this.scene.background = WHITE;
            this.backgroundMesh = new THREE.Mesh(geometry, material);
            this.controls.getObject().add( this.backgroundMesh );

        } else {
            this.scene.background = BLACK;
        }

        if (this.controller.layout.terrain.attributes.fog) {
            if (this.controller.layout.terrain.attributes.fog && this.controller.layout.dayTime) {
                this.scene.fog = new THREE.Fog( 
                    this.controller.layout.terrain.attributes.fog.color, 
                    700/(this.controller.layout.terrain.attributes.fog.density? 
                        this.controller.layout.terrain.attributes.fog.density : 1), 
                    cameraReach-100 );
            } else if (this.controller.layout.dayTime == false) {
                this.scene.fog = new THREE.Fog( 
                    'black', 
                    700/(this.controller.layout.terrain.attributes.fog.density? 
                        this.controller.layout.terrain.attributes.fog.density : 1), 
                    cameraReach-100 );
            }
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

    addHelper() {

        this.helper = new THREE.Mesh ( new THREE.SphereBufferGeometry(10), new THREE.MeshBasicMaterial({ color: 'blue' }));
        this.helper.visible = true;
        this.scene.add( this.helper );

    }

    handleAutoZoom = () => {
        this.cameraBackray.ray.origin.copy(this.controls.getObject().position);
        this.cameraBackray.ray.origin.y += this.controller.hero.attributes.height-10;

        // NEEDS PITCH as well
        let cameraDirection = this.controls.getDirection(new THREE.Vector3( 0, 0, 0 ));

        this.cameraBackray.ray.direction.x = -cameraDirection.x;
        this.cameraBackray.ray.direction.y = -cameraDirection.y + 0.25;
        this.cameraBackray.ray.direction.z = -cameraDirection.z;

        var backrayIntersections;
        backrayIntersections = this.cameraBackray.intersectObjects(this.controller.structureModels, true);

        // if (!backrayIntersections[0] && this.controller.hero.balloonRide) {
        //     backrayIntersections = this.cameraBackray.intersectObject(this.controller.hero.balloonModel, true);
        // }

        if (backrayIntersections[0] && backrayIntersections[0].object.type != "Sprite") {
            
            this.controller.hero.healthSprite.visible = false;
            this.controller.hero.manaSprite.visible = false;
            let distance = backrayIntersections[0].distance;
            if (distance < cameraDistanceDefault && this.camera.position.z > -5) {
                this.camera.position.z = distance - 20;
                if (this.camera.position.y > cameraElevationDefault + this.controller.hero.attributes.height) this.camera.position.y -= cameraElevationDefault / 30;
            }
        } else {
            this.controller.hero.healthSprite.visible = true;
            this.controller.hero.manaSprite.visible = true;

            if (this.camera.position.z <= cameraDistanceDefault) {
                this.camera.position.z += cameraDistanceDefault / 100;
                if (this.scene.fog) this.scene.fog.far = cameraReach-100;
            }
            if (this.camera.position.y < cameraElevationDefault + this.controller.hero.attributes.height) this.camera.position.y += cameraElevationDefault / 100;
        }
    }
    
    handleSprites() {
        if (this.requestAnimationFrameID % 3 == 0) {
            this.controller.sprites.forEach(sprite => {

                let offsetX = sprite.sprite.material.map.offset.x + (1 / sprite.frames);
                if (offsetX >= .99) offsetX = 0;
                sprite.sprite.material.map.offset.x = offsetX;
            })
        }
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

                // if (hostile) {
                //     this.controller.formFactory.addSprites(this.controller.hero.model, spriteConfig, this, true, projectile.item.model.position);
                // } else {
                //     entitiesInRange.forEach(entity => {
                //         this.controller.formFactory.addSprites(entity.model, spriteConfig, this, true, projectile.item.model.position);
                //     })
                // }
            });
        }

        if (projectile.local) {

            if (projectile.item.attributes.effect && !(projectile.item.objectSubtype == 'lifegiving')) {
                let [type, change] = projectile.item.attributes.effect.split("/");

                if (projectile.hostile) {
                    this.controller.hero.changeStat('health', -change, false);
                } else {
                    entitiesInRange.forEach(entity => {
                        this.controller.hero.inflictDamage(entity, change, type);
                    })
                }
    
            } else if (projectile.item.attributes.plantable) {
                let dropData = {
                    itemName: projectile.item.objectName,
                    position: projectile.item.model.position,
                    location: this.controller.getLocationFromPosition(projectile.item.model.position),
                    source: "",
                    type: "entity"
                };
    
                // console.log(`scene: dropping plantable item to scene:`)
                // console.dir(dropData);
                this.controller.dropItemToScene(dropData);
            
            } else if (projectile.item.objectSubtype == 'lifegiving') {
                
                let [type, change] = projectile.item.attributes.effect.split("/");
                // console.log(`Inside Entities in range:`);
                // console.dir(entitiesInRange);
                entitiesInRange.forEach(entity => {

                    entity.changeStat(type, change, true);
                    // this.controller.hero.inflictDamage(entity, change, type);
                    if (entity.attributes.stage < 4 && entity.getEffectiveStat('health') >= 10 * (entity.attributes.stage + 1)) {
                        entity.attributes.stage++;
            
                        // remove and re-add to layout:
                        let data = {    
                            itemName: entity.objectName, 
                            quantity: entity.attributes.quantity? entity.attributes.quantity : 1,
                            layoutId: entity.attributes.layoutId,
                            type: entity.objectType
                        }

                        this.controller.takeItemFromScene(data);
                        
                        let dropData = {
                            itemName: entity.objectName,
                            position: entity.model.position,
                            location: this.controller.getLocationFromPosition(entity.model.position),
                            source: "",
                            type: "entity",
                            attributes: {stage: entity.attributes.stage }
                        };
            
                        this.controller.dropItemToScene(dropData);
                    }
                })

            } 
        }


        if (projectile.item.objectType == 'item' && 
            projectile.item.objectSubtype != "tree" && projectile.item.objectSubtype != 'lifegiving' &&
            projectile.item.attributes.throwableAttributes.chanceToLeaveOnGround && 
            Math.random() < projectile.item.attributes.throwableAttributes.chanceToLeaveOnGround) {
            projectile.item.model.position.y = projectile.item.determineElevationFromBase() + projectile.item.attributes.elevation;
        } else {  // remove the item
            // Uncommented for lightning:
            if (projectile.item.model.parent) projectile.item.model.parent.remove(projectile.item.model);
            this.controller.forms = this.controller.forms.filter(el => el != projectile.item);
            this.removeFromScenebyLayoutId(projectile.item.attributes.layoutId);
        }
        
        // filter out of projectiles
        this.controller.projectiles = this.controller.projectiles.filter(el => el != projectile);
    }
    
    catch(projectile, entitiesInRange) {
        
        entitiesInRange.forEach(e => {

            if (e.attributes.catchable) { // just apply locally; do not broadcast
                e.fadeToAction("Thrashing", 0.2);
                e.model.position.x = 0;
                e.model.position.y = 0;
                e.model.position.z = 0;
                e.model.scale.set(.01,.01,.01);
                
                projectile.item.model.add(e.model);
            }
        })    
    }

    release(projectile) {
        projectile.item.model.children.forEach(child => {
            if (child.attributes && child.attributes.catchable) {
                child.position.copy(projectile.item.model.position);
                child.scale.set(10,10,10);
                this.add(child);
                let caught = this.controller.getFormByLayoutId(child.attributes.layoutId);
                caught.attributes.stats.agility = "0/0/0";
                caught.fadeToAction('Flopping', 0.2);

                
            }
        })

        if (projectile.item.model.parent) projectile.item.model.parent.remove(projectile.item.model);
        this.controller.forms = this.controller.forms.filter(el => el != projectile.item);
        this.removeFromScenebyLayoutId(projectile.item.attributes.layoutId);
        this.controller.projectiles = this.controller.projectiles.filter(el => el != projectile);
    }


    /** 
     * Each projectile looks like this:
     * {
            item,
            direction,
            velocity: new THREE.Vector3(),
            distanceTraveled: 0,
            local,
            hostile
        }
     *
     */
    handleProjectiles(delta) {
        if (this.controller.projectiles.length > 0) {

            for (let projectile of this.controller.projectiles) {
                
                console.log(`${projectile.item.objectName}: ${projectile.velocity.z} @ ${projectile.item.model.position.x}, ${projectile.item.model.position.y}, ${projectile.item.model.position.z}`);
                
                if (projectile.distanceTraveled == 0) { // first iteration, set velocities
                    projectile.startingPosition = new THREE.Vector3();
                    projectile.startingPosition.copy(projectile.item.model.position);
                    projectile.velocity.y = (projectile.item.direction.y) * 500;
                    projectile.velocity.z = projectile.item.attributes.throwableAttributes.speed * 500;
                    
                } else { // subsequent iterations
    
                    // INERTIA/GRAVITY
                    projectile.velocity.z -= projectile.velocity.z * delta;
                    if (!projectile.returning) projectile.velocity.y -= 9.8 * projectile.item.attributes.throwableAttributes.weight * 100 * delta;
                }
    
                if (!projectile.returning) projectile.item.model.translateY( projectile.velocity.y * delta );
                projectile.item.model.translateZ( -projectile.velocity.z * delta );

                if (projectile.item.attributes.plantable) { // seeds (plantable)

                    if (projectile.item.model.position.y <= projectile.item.determineElevationFromBase()+5) {
                        this.handleAction(projectile, []);
                        continue;
                    }

                } else if (projectile.item.objectSubtype == "lifegiving") { // e.g. water
                    var entitiesInRange = this.controller.allFriendliesInRange(projectile.item.attributes.range, projectile.item.model.position);
                    if (entitiesInRange.length > 0) {
                        this.handleAction(projectile, entitiesInRange);
                        continue;
                    }


                } else if (projectile.item.objectSubtype != "bait") { // weapons/spells
                    if (projectile.hostile && this.controller.heroInRange(projectile.item.attributes.range, projectile.item.model.position)) {
                        this.handleAction(projectile, null);
                        continue;
                    } else if (!projectile.hostile) { // projectiles launched by hero
                        var entitiesInRange = this.controller.allEnemiesInRange(projectile.item.attributes.range, projectile.item.model.position);
                        if (entitiesInRange.length > 0) {
                            this.handleAction(projectile, entitiesInRange);
                            continue;
                        }
                    }
        
                    // if I hit a structure, handleAction
                    this.projectileMovementRaycaster.ray.origin.copy(projectile.item.model.position);
                    let pIntersects = this.projectileMovementRaycaster.intersectObjects(this.controller.structureModels, true);
                    if (pIntersects.length > 0 && pIntersects[0].object.type != "Sprite") { 
                        this.handleAction(projectile, []);
                        continue;
                    }
                }

                // Otherwise if I hit the max range, expire
                projectile.distanceTraveled += (Math.abs(projectile.velocity.z * delta) + Math.abs(projectile.velocity.y * delta));
                let maxDistance = projectile.item.attributes.throwableAttributes.distance;

                console.log(`traveled: ${projectile.distanceTraveled}, y: ${projectile.item.model.position.y}, elev: ${projectile.item.determineElevationFromBase()}`)
                if (projectile.distanceTraveled > maxDistance || projectile.item.model.position.y <= projectile.item.determineElevationFromBase()+15 || this.returning) {
                    if (projectile.item.objectSubtype == 'bait') {
                        // turn around and reset velocity, then head back until I reach the caster
                        if (!projectile.returning) {
                            console.log(`Turning AROUND.`)
                            projectile.item.model.lookAt(projectile.startingPosition);
                            projectile.velocity.z = -projectile.item.attributes.throwableAttributes.speed * 350;
                            projectile.returning = true;
                        } else {
                            projectile.item.model.lookAt(projectile.startingPosition);
                        }
                        
                        let distanceToOrigin = projectile.item.model.position.distanceTo(projectile.startingPosition);
                        console.log(`distanceToOrigin: ${distanceToOrigin}`);
                        if (distanceToOrigin < 100) {
                            this.release(projectile);
                        } else {
                            var entitiesInRange = this.controller.allEnemiesInRange(projectile.item.attributes.range, projectile.item.model.position);
                            if (entitiesInRange.length > 0) {
                                this.catch(projectile, entitiesInRange);
                                continue;
                            }
                        }
                    } else {
                        this.handleAction(projectile, []);
                    }
                    continue;
                } else {

                }
            }
        }
    }

    animate() {
        
        
        if (this.running) {
            
            this.requestAnimationFrameID = requestAnimationFrame( this.animate );
            if ( this.controls.isLocked === true && this.running ) {

                this.time = performance.now();
                this.delta = ( this.time - this.prevTime ) / 1000;
    
                this.controller.handleMovement(this.delta);
                this.handleSprites();
                this.handleProjectiles(this.delta);

                // if (this.controller.layout.terrain.attributes.addPonds) {
                //     this.handleRefractors();
                // }

                if (this.backgroundMesh && this.controls) this.backgroundMesh.rotation.y = -this.controls.getObject().rotation.y;
    
                this.prevTime = this.time;
            
            } else {
                this.prevTime = performance.now();
            }
            // this.renderer.setClearColor( 0x20252f );
            this.renderer.render( this.scene, this.camera );
            
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

    handleRefractors() {
        this.controller.refractors.forEach(refractor => {
            refractor.material.uniforms[ "time" ].value += this.clock.getDelta();
            
        })
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
        this.controls = null;
        callback();
    }



    unregisterEventListeners = () => {

        this.instructions.removeEventListener( 'click', this.instructionsLock, false );
        this.controls.removeEventListener( 'lock', this.controlsLocked );
        // this.controls.removeEventListener( 'unlock', this.controlsUnlocked );

        document.removeEventListener( 'keydown', this.onKeyDown, false );
        document.removeEventListener( 'keydown', this.onF8, false );
        document.removeEventListener( 'keyup', this.onKeyUp, false );
        window.removeEventListener( 'resize', this.onWindowResize, false );

        this.controller.eventDepot.removeListeners('setHeroStat');
        this.controller.eventDepot.removeListeners('setHeroStatMax');
        this.controller.eventDepot.removeListeners('updateHelper');
        this.controller.eventDepot.removeListeners('updateXP');
        this.controller.eventDepot.removeListeners('lockControls');
        this.controller.eventDepot.removeListeners('unlockControls');
        this.controller.eventDepot.removeListeners('disableKeyDownListener');
        this.controller.eventDepot.removeListeners('enableKeyDownListener');
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

        this.instructions.addEventListener( 'click', this.instructionsLock, false );
        this.controls.addEventListener( 'lock', this.controlsLocked);
        this.controls.addEventListener( 'unlock', this.controlsUnlocked );

        main.appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    instructionsLock() {
        if (this.readyForLock && !this.controls.isLocked) {
            this.controls.lock();
        }
    }

    controlsLocked() {
        this.instructions.style.display = 'none';
        this.blocker.style.display = 'none';
        document.addEventListener( 'mousedown', this.onMouseDown, false );
        document.addEventListener( 'mouseup', this.onMouseUp, false );
        document.addEventListener( 'wheel', this.onMouseWheel, false );
        document.addEventListener( 'click', this.onMouseClick, false );
    }

    controlsUnlocked() {
        this.blocker.style.display = 'block';
        this.instructions.style.display = '';
        document.removeEventListener( 'mousedown', this.onMouseDown, false );
        document.removeEventListener( 'mouseup', this.onMouseUp, false );
        document.removeEventListener( 'wheel', this.onMouseWheel, false );
        document.removeEventListener( 'click', this.onMouseClick, false );
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
                
                if (this.controller.hero.mountedUpon) {
                    this.controller.eventDepot.fire('descend', { vehicle: this.controller.hero.mountedUpon.objectName });
                } else {
                    this.controller.eventDepot.fire('jump', {});
                }
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

    onMouseClick() {
        if (this.controls) {
            let x = this.controls.getObject().position;
            console.log(`${this.controller.level}: ${x.x}, ${x.y}, ${x.z}`);
        }
    }

    /**
     * 
     */
    onMouseWheel(e) {

        if (e.shiftKey) {
            this.controller.eventDepot.fire('wheel', e);
        } else {
            this.camera.position.z += e.deltaY;
            this.camera.position.y += e.deltaY/5;
        }
    }

    onMouseDown(e) {
        if (this.controller.hero) {

            switch (e.button) {

                case 0:
                    this.controller.eventDepot.fire('mouse0click', event.shiftKey );
                    break;
                case 1:
                    this.controller.eventDepot.fire('mouse1click', {});
                    break;
                case 2:
                    this.controller.eventDepot.fire('mouse2click', event.shiftKey );
                    // this.controller.hero.moveForward = true;
                    break;
            }
        }
    }

    onMouseUp(e) {
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

    onWindowResize() {
        this.camera.aspect = window.innerWidth / (window.innerHeight - navbarHeight);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, (window.innerHeight - navbarHeight) );
    }
}

export {Scene};