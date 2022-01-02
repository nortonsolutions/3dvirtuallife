var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var cameraReach = 1200;
var cameraDistanceDefault = 200;
var cameraElevationDefault = 40;

var cameraMinimapReach = 1200;
var cameraMinimapElevationDefault = 1000;

var DUENORTH = new THREE.Vector3( 0, 0, 2000 );

var multiplier = 100;
var navbarHeight;

var WHITE = new THREE.Color('white');
var BLACK = new THREE.Color('black');

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var minimap = false;

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

        this.planeWidth = controller.layout.width? controller.layout.width * multiplier : 2000;
        this.planeHeight = controller.layout.length? controller.layout.length * multiplier : 2000;

        this.hero = controller.hero;
        this.background = controller.layout.background;
        this.terrain = controller.layout.terrain;
        this.layout = controller.layout;
        
        this.animate = this.animate.bind(this);
        this.deanimate = this.deanimate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
        this.addControls = this.addControls.bind(this);
        
        this.controls = null;
        this.scene = null;

        this.requestAnimationFrameID = null;
    }

    init(callback) {

        navbarHeight = 0; // document.querySelector('.navbar').clientHeight;
    
        this.camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / (SCREEN_HEIGHT - navbarHeight), 1, cameraReach );
        this.camera.position.set( 0, cameraElevationDefault + this.hero.attributes.height, cameraDistanceDefault );
        
        this.scene = new THREE.Scene();

        this.addFloor(() => {
            this.addControls();
            this.addBackground();
            this.seedObjects3D();
            this.addHero3D();
            this.addLights();

            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( SCREEN_WIDTH, (SCREEN_HEIGHT - navbarHeight));
    
    
            this.stats = new Stats();
            document.body.appendChild( this.stats.dom );
    
            this.addEventListeners();


            if (callback) callback();
        });

    }

    addControls() {
        this.controls = new THREE.PointerLockControls( this.camera );

        // MINIMAP      
        this.rendererMinimap = new THREE.WebGLRenderer( { antialias: true } );
        document.getElementById('minimap').appendChild( this.rendererMinimap.domElement );
        this.cameraMinimap = new THREE.PerspectiveCamera( 45, 1, 1, cameraMinimapReach );
        this.cameraMinimap.position.set( 0, cameraMinimapElevationDefault, 0);
        this.cameraMinimap.rotation.set( -Math.PI / 2, 0, 0 );
        this.controls.getObject().add(this.cameraMinimap);
        
        // COMPASS
        // var compassGeometry = new THREE.CylinderBufferGeometry( 0, 10, 100, 12 );
        // compassGeometry.rotateX( Math.PI / 2 );
        // var compassMaterial = new THREE.MeshNormalMaterial();
        // this.compass = new THREE.Mesh( compassGeometry, compassMaterial );

        this.controller.loader.load( '/models/3d/gltf/arrow.gltf', (gltf) => {
            this.compass = gltf.scene;
            this.compass.scale.set( 100, 100, 100 );
            this.compass.children[0].material.side = THREE.FrontSide;
            this.compass.position.set( 0, cameraMinimapElevationDefault/2, -cameraMinimapElevationDefault/10);
            this.controls.getObject().add(this.compass);
        });

        

        this.cameraBackray = new THREE.Raycaster( new THREE.Vector3( ), new THREE.Vector3( 0, 0, 1 ), 0, cameraDistanceDefault);
        this.scene.add( this.controls.getObject() );
    
        document.addEventListener( 'keydown', this.onKeyDown, false );
        document.addEventListener( 'keyup', this.onKeyUp, false );
    }

    addBackground() {

        if (this.background && this.background.length > 0) {

            // simplistic equirectangular mapping to the inverse of a sphere geometry:
            var geometry = new THREE.SphereBufferGeometry(cameraReach - 250);
            geometry.scale (-1,1,1);

            var material = new THREE.MeshBasicMaterial( {
                map: new THREE.TextureLoader().load("/models/textures/" + this.background)
            });

            this.backgroundMesh = new THREE.Mesh(geometry, material)
            this.controls.getObject().add( this.backgroundMesh );

        } else {
            this.scene.background = BLACK;
        }

        if (this.terrain.fog) this.scene.fog = new THREE.Fog( this.terrain.fogColor, 900, cameraReach );
    }

    addLights() {

        if (this.terrain.hemisphereLight) {
            var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
            light.position.set( 0.5, 1, 0.75 );
            this.scene.add( light );
        }

        if (this.terrain.overheadPointLight) {
            this.overheadPointLight = new THREE.PointLight( 0xf37509, 15, 350, 3 );
            this.overheadPointLight.position.set( 0, 0, 0 );
            this.scene.add( this.overheadPointLight );
        }
        
        this.proximityLight = new THREE.PointLight( 0x00ff00, 5, 250, 30 );
        this.proximityLight.position.set( 0, 0, 0 );
        this.scene.add( this.proximityLight );

    }

    onKeyDown = ( event ) => {
    
        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                let heroMixer = this.controller.mixers.hero;
                
                if ( heroMixer.canJump === true ) {
                    heroMixer.velocity.y += 350;
                    this.controller.fadeToAction("hero", "Jump", 0.2)
                }
                heroMixer.canJump = false;
                heroMixer.justJumped = true;
                break;

            case 73: // i
                this.updateHeroLocation(false);
                this.controller.eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });
                break;
                
            case 82: // r
                this.controller.eventDepot.fire('modal', { type: 'spells', title: 'Spells' });
                break;

            case 77: // m
                minimap = !minimap;
                this.controller.eventDepot.fire('minimap', {});
                break;
        }

    };

    onKeyUp = ( event ) => {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    addHelper() {

        this.helper = new THREE.Mesh ( new THREE.SphereBufferGeometry(5), new THREE.MeshBasicMaterial({ color: 'red' }));
        this.helper.visible = false;
        this.scene.add( this.helper );

    }

    setToRenderDoubleSided(object) {


        if (object.material) {
            if (object.material.name != "Roof") { 
                object.material.side = THREE.DoubleSide;
            } else {
                object.material.side = THREE.FrontSide;
            }
        }

        if (object.children) {
            object.children.forEach(e => this.setToRenderDoubleSided(e)); 
        }
    }

    addFloor(callback) {

        this.controller.load(this.terrain, (gltf) => {
            
            this.controller.floor = gltf.scene;
            this.controller.floor.objectName = "floor";
            this.controller.floor.objectType = "floor"; 
            this.setToRenderDoubleSided(this.controller.floor);

            this.addSconces(this.controller.floor);
            this.scene.add( this.controller.floor );
            this.controller.objects3D.push(this.controller.floor);
            setTimeout(() => {
                callback();
            }, 500);
        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    addSconces = (object) => {
        if (/sconce/i.test(object.name)) {

            // let fireObj = this.controller.getFire();
            // this.fireParams.Torch();

            let fireObj = this.controller.getSprite("flame", 0);
            fireObj.scale.set(.4, .4, .4);
            fireObj.translateY(.15);
            object.add(fireObj);

        } else {
            if (object.children) {
                object.children.forEach(el => {
                    this.addSconces(el);
                })
            }
        }
    }

    addHero3D = () => {

        this.controller.load(this.hero, (gltf) => {
            let model = gltf.scene;
            
            this.hero.model = model;

            if (this.hero.equipped) {
                Object.keys(this.hero.equipped).forEach(bodyPart => {
                    this.controller.eventDepot.fire('equipItem', {bodyPart, itemName: this.hero.equipped[bodyPart]});
                })
            }


            let controlsObj = this.controls.getObject();

            // Adjustments for hero:
            model.rotation.y = Math.PI;

            // Set hero location:
            controlsObj.translateX( this.hero.location.x * multiplier );
            controlsObj.translateZ( this.hero.location.z * multiplier );
            controlsObj.translateY( this.controller.determineElevationGeneric(
                this.hero.location.x * multiplier, this.hero.location.z * multiplier, "hero")
            );
            
            controlsObj.attributes = this.hero.attributes;
            controlsObj.add( model );

            this.controller.createMixer( model, gltf.animations, "hero" );
            this.updateHeroLocation(true);
            this.updateHeroStats();
        })
    }

    updateHeroStats = () => {

        Object.keys(this.hero.attributes.stats).forEach(stat => {
            
            let points = this.hero.attributes.stats[stat].split('/')
            let cur = points[0];
            let max = points[1];

            this.controller.eventDepot.fire('setHeroStatMax', { type: stat, points: max});
            this.controller.eventDepot.fire('setHeroStat', { type: stat, points: cur});

        })

        document.getElementById('heroStats').classList.remove('d-none');
    }

    seedObjects3D = () => {
        this.layout.items.forEach(item => this.seedObject3D(item));
        this.layout.structures.forEach(structure => this.seedObject3D(structure));
        this.layout.entities.forEach(entity => this.seedObject3D(entity));
        this.controller.eventDepot.fire('cacheLayout', {});

    }

    /** 
     * Create 3D representation of each object:
     */ 
    seedObject3D = (object) => {

        this.controller.load(object, (gltf) => {

            let model = gltf.scene;

            object.uuid = model.uuid;
            model.position.x = object.location.x * multiplier;
            model.position.z = object.location.z * multiplier;
            model.position.y = this.controller.determineElevationGeneric(model.position.x, model.position.z,object.name) + object.attributes.elevation;
            
            if (object.attributes.animates) {
                this.controller.createMixer( model, gltf.animations, model.uuid );
                if (object.attributes.unlocked) {
                    this.controller.mixers[model.uuid].activeAction.play();
                }
            }

            if (object.attributes.contentItems) {
                object.attributes.contentItems.forEach(contentItem => {
                    this.controller.load(contentItem, (iGltf) => {
                        let iModel = iGltf.scene;
                        iModel.position.x = model.position.x;
                        iModel.position.z = model.position.z;
                        iModel.position.y = model.position.y + contentItem.attributes.elevation;
                        this.controller.objects3D.push( iModel );
                        this.scene.add( iModel );
                    })
                });
            }

            // console.log(`${object.name} @`);
            // console.table(model.position);

            this.controller.objects3D.push( model );
            this.scene.add( model );

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    onMouseClick = (e) => {
        // console.log(`Controls object:`);
        // console.dir(this.controls.getObject().position);

        // console.log(`Objects3D object:`);
        // console.dir(this.controller.objects3D);
    }

    onMouseDown = (e) => {

        switch (e.button) {

            case 0:
                let mixers = this.controller.mixers;
                if (mixers.hero && mixers.hero.selectedObject) {

                    let thisObj = mixers.hero.selectedObject;

                    let objectName = this.controller.getObjectName(thisObj);
                    let objectType = this.controller.getObjectType(thisObj);
                    
                    if (objectType == "item") {
                        this.controller.eventDepot.fire('takeItemFromScene', {itemName: objectName, uuid: thisObj.uuid});

                    } else if (objectType == "friendly") {
                        
                        // TODO: conversation
                        this.controls.unlock();
                        this.controller.eventDepot.fire('modal', { name: objectName });
                   
                    } else if (objectType == "beast") {

                        // TODO: combat
                        this.controller.fadeToAction("hero", "Punch", 0.2)

                    } else if (objectType == "structure") {
                        
                        var accessible = thisObj.attributes.key ? 
                            this.hero.inventory.map(el => {
                                return el? el.itemName: null;
                            }).includes(thisObj.attributes.key) :
                            true;
                        
                        if (accessible) {
                            this.updateStructureAttributes(thisObj, {unlocked: true});
                            if (mixers[thisObj.uuid] && mixers[thisObj.uuid].activeAction) {
                                this.controller.runActiveAction(thisObj.uuid, 0.2);
                            }
                        }
                    }
                }
                break;
            case 1:
                break;
            case 2:
                moveForward = true;
                break;
        }
    }

    updateStructureAttributes = (object, payload) =>  {
        object.attributes = {...object.attributes, ...payload};
        this.controller.eventDepot.fire('updateStructureAttributes', {uuid: object.uuid, attributes: payload});
    }

    onMouseUp = (e) => {
        switch (e.button) {

            case 0:
                // this.helper.visible = false;
                break;
            case 1:
                break;
            case 2:
                moveForward = false;
                break;
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

        {/* <div id="heroStats" class="d-none">
            Health: <meter id="health" low="30" high="70" max="100" value="0" optimum="90"></meter>
            Mana: <meter id="mana" low="30" high="70" max="100" value="0" optimum="90"></meter>
        </div> */}

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

        this.controller.eventDepot.addListener('lockControls', () => {
            this.controls.lock();
        })

        this.controller.eventDepot.addListener('unlockControls', () => {
            this.controls.unlock();
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
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        this.camera.aspect = SCREEN_WIDTH / (SCREEN_HEIGHT - navbarHeight);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( SCREEN_WIDTH, (SCREEN_HEIGHT - navbarHeight) );
    }

    getMovementRay(origin, direction) {
        return new THREE.Raycaster( origin, direction, 0, 10 );
    }

    handleMixers(delta) {
        if ( this.controller.mixers ) {

            let mixers = this.controller.mixers;
            Object.keys(mixers).forEach(key => {
                

                if (mixers[key].moves) {
                    mixers[key].absVelocity = Math.max(Math.abs(mixers[key].velocity.x), Math.abs(mixers[key].velocity.z));
    
                    // if (mixers[key].name != "rat") {
                        if (mixers[key].absVelocity < .1 && (mixers[key].activeActionName == 'Walking' || mixers[key].activeActionName == 'Running')) {
                            this.controller.fadeToAction( key, 'Idle', 0.2);
                        } else if (mixers[key].absVelocity >= .1 && mixers[key].activeActionName == 'Idle') {
                            this.controller.fadeToAction( key, 'Walking', 0.2);
                        } else if (mixers[key].absVelocity >= 199 && mixers[key].activeActionName == 'Walking') {
                            this.controller.fadeToAction( key, 'Running', 0.2);
                        }
                    // } else {

                    // }
                }

                mixers[key].mixer.update( delta );
            })
        }
    }

    /**
     * This function will move an entity from one location to another.
     * Direction is relative to the entity in question
     */
    handleMovement = ( uniqueId, entity, delta ) => {

        var yAxisRotation = new THREE.Euler( 0, entity.rotation.y, 0, 'YXZ' );
        let worldDirection = new THREE.Vector3().copy(this.controller.mixers[uniqueId].direction).applyEuler( yAxisRotation );
        
        let mRaycaster = this.controller.mixers[uniqueId].movementRaycaster;
        mRaycaster.ray.origin.copy( entity.position );
        mRaycaster.ray.origin.y += entity.attributes.height;
        mRaycaster.ray.direction.x = - worldDirection.x;
        mRaycaster.ray.direction.z = - worldDirection.z;
        

        if (uniqueId != "hero") {
            mRaycaster.ray.direction.x = - mRaycaster.ray.direction.x;
            mRaycaster.ray.direction.z = - mRaycaster.ray.direction.z;
        }

        let movementIntersects = mRaycaster.intersectObjects(this.controller.objects3D, true).filter(el => this.controller.getRootObject3D(el.object) != entity);
        
        if (movementIntersects.length == 0) {

            entity.translateX( this.controller.mixers[uniqueId].velocity.x * delta );
            entity.translateY( this.controller.mixers[uniqueId].velocity.y * delta );
            entity.translateZ( this.controller.mixers[uniqueId].velocity.z * delta );

            if (Math.abs(entity.getWorldPosition(entity.position).x) >= this.planeHeight/2 || 
            Math.abs(entity.getWorldPosition(entity.position).z) >= this.planeWidth/2) {

                entity.translateX( -this.controller.mixers[uniqueId].velocity.x * delta );
                entity.translateY( -this.controller.mixers[uniqueId].velocity.y * delta );
                entity.translateZ( -this.controller.mixers[uniqueId].velocity.z * delta );
                if (uniqueId != "hero") {
                    entity.rotateY(Math.PI/4);
                }
            }
        } else {
            

            this.controller.mixers[uniqueId].velocity.x = 0;
            this.controller.mixers[uniqueId].velocity.y = 0;
            this.controller.mixers[uniqueId].velocity.z = 0;

            if (uniqueId != "hero") {
                entity.rotateY(Math.PI/4);
            }
        }

        this.controller.setElevation( uniqueId, entity );

    }

    identifySelectedObject(heroObj) {

        this.proximityLight.rotation.copy(heroObj.rotation);
        this.proximityLight.position.copy(heroObj.position);
        this.proximityLight.translateZ(-40);
        this.proximityLight.translateY(40);

        // console.table(this.proximityLight.position);

        let closest = Infinity;

        this.controller.objects3D.forEach(o => {
            let distance = o.position.distanceTo(this.proximityLight.position);
            if (distance <= 50 && distance < closest) {
                // If the object is unlocked, exclude to allow selecting the contents
                if (!o.attributes.contentItems || (o.attributes.contentItems && !o.attributes.unlocked))  {
                    closest = distance;
                    this.controller.mixers.hero.selectedObject = o;
                    this.controller.eventDepot.fire('showDescription', { objectType: this.controller.getObjectType(o), objectName: this.controller.getObjectName(o) }); 
                }
            }
        })

        if (closest > 50) {
            this.controller.mixers.hero.selectedObject = null;
            this.controller.eventDepot.fire('hideDescription', {}); 
        }

    }

    handleAutoZoom = () => {
        this.cameraBackray.ray.origin.copy(this.controls.getObject().position);
        this.cameraBackray.ray.origin.y += this.hero.attributes.height;

        // NEEDS PITCH as well
        let cameraDirection = this.controls.getDirection(new THREE.Vector3( 0, 0, 0 ));

        this.cameraBackray.ray.direction.x = -cameraDirection.x
        this.cameraBackray.ray.direction.y = -cameraDirection.y + 0.4
        this.cameraBackray.ray.direction.z = -cameraDirection.z

        let backrayIntersections = 
            [...this.cameraBackray.intersectObject(this.controller.floor, true), 
            ...this.cameraBackray.intersectObjects(this.controller.objects3D.filter(el => el.objectType == 'structure'), true)]
        
        if (backrayIntersections[0]) {
            let distance = backrayIntersections[0].distance;
            if (distance < cameraDistanceDefault && this.camera.position.z > -5) {
                this.camera.position.z -= cameraDistanceDefault / 30;
                if (this.camera.position.y > cameraElevationDefault + this.hero.attributes.height) this.camera.position.y -= cameraElevationDefault / 30;
            }
        } else {
            if (this.camera.position.z <= cameraDistanceDefault) {
                this.camera.position.z += cameraDistanceDefault / 100;
                if (this.camera.position.y < cameraElevationDefault) this.camera.position.y += cameraElevationDefault / 100;
            }
        }
    }
    
    // Calculate hero location using grid coordinates
    updateHeroLocation = (offset = false) => {

        let { x, y, z } = this.controls.getObject().position;
        
        if (offset) {
            z = z + (z < 0) ? 20 : -20;
            x = x + (x < 0) ? 20 : -20;
        }

        this.controller.eventDepot.fire('updateHeroLocation', { x: x / multiplier, y, z: z / multiplier });

        this.controller.mixers.hero.velocity.x = 0;
        this.controller.mixers.hero.velocity.z = 0;

        moveForward = false;
        moveBackward = false;
        moveLeft = false;
        moveRight = false;

    }

    handleHeroMovement(delta) {

        if (this.controller.mixers.hero) {

            // INERTIA
            this.controller.mixers.hero.velocity.x -= this.controller.mixers.hero.velocity.x * 10.0 * delta;
            this.controller.mixers.hero.velocity.z -= this.controller.mixers.hero.velocity.z * 10.0 * delta;
            this.controller.mixers.hero.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            this.controller.mixers.hero.direction.z = Number( moveForward ) - Number( moveBackward );
            this.controller.mixers.hero.direction.x = Number( moveLeft ) - Number( moveRight );
            this.controller.mixers.hero.direction.normalize(); // this ensures consistent movements in all directions
            
            let agility = this.hero.attributes.stats.agility.substring(0,2);

            if ( moveForward || moveBackward ) this.controller.mixers.hero.velocity.z -= this.controller.mixers.hero.direction.z * 1000.0 * agility * delta;
            if ( moveLeft || moveRight ) this.controller.mixers.hero.velocity.x -= this.controller.mixers.hero.direction.x * 1000.0 * agility * delta;

            this.identifySelectedObject(this.controls.getObject());

            this.handleMovement( "hero", this.controls.getObject(), delta );
            
            if (this.controller.mixers.hero.standingUpon && this.controller.mixers.hero.standingUpon.attributes.routeTo && typeof this.controller.mixers.hero.standingUpon.attributes.routeTo.level == "number") {
                if (this.controller.mixers.hero.standingUpon.attributes.unlocked) {
                    
                    this.controller.eventDepot.fire('cacheLayout', {});

                    let loadData = {

                        level: this.controller.mixers.hero.standingUpon.attributes.routeTo.level,
                        location: this.controller.mixers.hero.standingUpon.attributes.routeTo.location,
                    }

                    this.controller.eventDepot.fire('loadLevel', loadData);
                }
            }

            this.handleAutoZoom();

            if (this.terrain.overheadPointLight) {
                this.overheadPointLight.position.copy(this.controls.getObject().position);
                this.overheadPointLight.rotation.copy(this.controls.getObject().rotation);
                this.overheadPointLight.position.y = this.controls.getObject().position.y + 60;
                this.overheadPointLight.translateZ(-80);
            }
        }
    }

    handleEntityMovement(delta) {
        this.controller.objects3D.filter(el => el.objectType == 'friendly' || el.objectType == 'beast').forEach(entity => {
            
            if (this.controller.mixers[entity.uuid]) {
            
                // Make a random rotation (yaw)
                entity.rotateY(getRndInteger(-1,2)/100);
                
                // GRAVITY
                this.controller.mixers[entity.uuid].velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                // Basic movement always in the z-axis direction for this entity
                this.controller.mixers[entity.uuid].velocity.z = getRnd(.2,entity.attributes.stats.agility.substring(0,2)) * 100;
                this.controller.mixers[entity.uuid].velocity.x = 0;
                
                this.controller.mixers[entity.uuid].direction.z = getRnd(-.2,.2);
                this.controller.mixers[entity.uuid].direction.x = getRnd(-.2,.2);

                this.handleMovement(entity.uuid, entity, delta);
            }
        });
    }

    handleSprites() {
        if (this.requestAnimationFrameID % 7 == 0) {
            this.controller.sprites.forEach(sprite => {

                let offsetX = sprite.material.map.offset.x + (1 / 10);
                if (offsetX > .9) offsetX = 0;
                sprite.material.map.offset.x = offsetX;
            })
        }
    }

    animate() {
        
        this.requestAnimationFrameID = requestAnimationFrame( this.animate );
        if (this.running) {

            if ( this.controls.isLocked === true && this.running ) {

                this.time = performance.now();
                this.delta = ( this.time - this.prevTime ) / 1000;
    
                this.handleHeroMovement(this.delta);
                this.handleEntityMovement(this.delta);
                this.handleMixers(this.delta);
                this.handleSprites();

                if (this.backgroundMesh) this.backgroundMesh.rotation.y = -this.controls.getObject().rotation.y;
    
                this.prevTime = this.time;
            
            } else {
                this.prevTime = performance.now();
            }
            this.renderer.render( this.scene, this.camera );
    
                if (minimap) {
    
                    // renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
                    // renderer.render( scene, activeCamera );
                    // cameraMinimap.lookAt(this.controls.getObject().position);
                    // renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
                    // renderer.render( scene, camera );
                    this.rendererMinimap.render(this.scene, this.cameraMinimap);
                    if (this.compass) this.compass.lookAt( DUENORTH );
            }
    
    
            this.stats.update();

        } else {
            cancelAnimationFrame( this.requestAnimationFrameID );
            this.dispose(this.scene);
            this.scene = null;
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
        document.removeEventListener( 'keyup', this.onKeyUp, false );
        window.removeEventListener( 'resize', this.onWindowResize, false );
        this.controller.eventDepot.removeListeners('lockControls');
        this.controller.eventDepot.removeListeners('unlockControls');
    }

}

export {Scene};