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

    constructor(hero, length, width, terrain, background, controller) {

        this.prevTime = performance.now();

        // SceneController has access to layoutManager, which has levelBuilder
        this.controller = controller;
        this.running = true;

        this.planeWidth = width? width * multiplier : 2000;
        this.planeHeight = length? length * multiplier : 2000;

        this.hero = hero;
        this.background = background;
        this.terrain = terrain;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
        this.addControls = this.addControls.bind(this);
        
        this.controls = null;
        this.scene = null;
    }

    init(callback) {

        navbarHeight = document.querySelector('.navbar').clientHeight;
    
        this.camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / (SCREEN_HEIGHT - navbarHeight), 1, cameraReach );
        this.camera.position.set( 0, cameraElevationDefault, cameraDistanceDefault );
        
        this.scene = new THREE.Scene();

        this.addControls();
        this.addBackground();
        this.addFloor(() => {
            this.seedObjects3D();
            this.addHero3D();
            this.addLights();
        });
        
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( SCREEN_WIDTH, (SCREEN_HEIGHT - navbarHeight));


        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );

        this.addEventListeners();
        if (callback) callback();
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
        var compassGeometry = new THREE.CylinderBufferGeometry( 0, 10, 100, 12 );
        compassGeometry.rotateX( Math.PI / 2 );
        var compassMaterial = new THREE.MeshNormalMaterial();
        this.compass = new THREE.Mesh( compassGeometry, compassMaterial );
        this.compass.position.set( 0, cameraMinimapElevationDefault/2, -cameraMinimapElevationDefault/10);
        this.controls.getObject().add(this.compass);


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

            var backgroundMesh = new THREE.Mesh(geometry, material)
            this.controls.getObject().add( backgroundMesh );

        } else {
            this.scene.background = BLACK;
        }

        if (this.terrain.fog) this.scene.fog = new THREE.Fog( 'white', 900, cameraReach );
    }

    addLights() {

        if (this.terrain.hemisphereLight) {
            var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
            light.position.set( 0.5, 1, 0.75 );
            this.scene.add( light );
        }

        if (this.terrain.overheadPointLight) {
            this.overheadPointLight = new THREE.PointLight( 0xf37509, 2, 250, 2 );
            this.overheadPointLight.position.set( 0, 0, 0 );
            this.scene.add( this.overheadPointLight );
        }
        
        this.proximityLight = new THREE.PointLight( 0x00ff00, 2, 50, 2 );
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
                this.controller.eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });

            case 77: // m
                minimap = !minimap;
                this.controller.eventDepot.fire('minimap', {});
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

    addFloor(callback) {

        this.controller.load(this.terrain, (gltf) => {
            this.controller.floor = gltf.scene;
            this.scene.add( this.controller.floor );
            setTimeout(() => {
                callback();
            }, 200);
        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    addHero3D = () => {

        this.controller.load(this.hero, (gltf) => {
            let model = gltf.scene;
            
            this.hero.model = model;

            let controlsObj = this.controls.getObject();

            // Adjustments for hero:
            // model.position.z -= 40;
            model.position.y -= this.hero.attributes.height;
            model.rotation.y = Math.PI;


            console.log("this.hero.location in addHero3D");
            console.table(this.hero.location);
            // Set hero location:
            controlsObj.translateX( this.hero.location.x * multiplier );
            controlsObj.translateZ( this.hero.location.z * multiplier );
            controlsObj.translateY( this.controller.determineElevationGeneric(
                this.hero.location.x * multiplier, this.hero.location.z * multiplier, "hero") + this.hero.attributes.height 
            );
            
            controlsObj.attributes = this.hero.attributes;

            // this.hero.attributes.height? this.hero.attributes.height : 20 ); 
            controlsObj.add( model );
            
            this.controller.createMixer( model, gltf.animations, "hero" );
        })
    }

    /** 
     * Create 3D representation of each object:
     */ 
    seedObjects3D = () => {

        this.controller.objects.forEach(object => {

            this.controller.load(object, (gltf) => {

                let model = gltf.scene;
                model.position.x = object.location.x * multiplier;
                model.position.z = object.location.z * multiplier;
                model.position.y = this.controller.determineElevationGeneric(model.position.x, model.position.z,object.name) + object.attributes.elevation;

                if (object.attributes.animates) {
                    this.controller.createMixer( model, gltf.animations, model.uuid );
                }

                this.controller.objects3D.push( model );
                this.scene.add( model );

            }, undefined, function ( error ) {
                console.error( error );
            });

        });
    }

    onMouseClick = (e) => {
        console.log(`Controls object:`);
        console.dir(this.controls.getObject().position);

        console.log(`Objects3D object:`);
        console.dir(this.controller.objects3D);

    }

    onMouseDown = (e) => {

        switch (e.button) {

            case 0:
                let mixers = this.controller.mixers;
                if (mixers.hero && mixers.hero.selectedObject) {

                    let thisObj = mixers.hero.selectedObject;

                    // Get the parent name/type
                    let objectName = this.controller.getObjectName(thisObj);
                    let objectType = this.controller.getObjectType(thisObj);
                    
                    // If it is an item, pick it up and add to inventory
                    if (objectType == "item") {
                        this.controller.eventDepot.fire('takeItem', objectName);
                    // If it is a friendly entity, engage the conversation
                    } else if (objectType == "friendly") {
                        
                        // TODO: Get the intersected object's properties from the level manager.
                        this.controls.unlock();
                        this.controller.eventDepot.fire('modal', { name: objectName });
                   
                    } else if (objectType == "beast") {

                        this.controller.fadeToAction("hero", "Punch", 0.2)
                        // TODO: act upon the enemy with the object in hand


                    } else if (objectType == "structure") {
                        
                        // Does this structure require a key?
                        var accessible = thisObj.attributes.key ? 
                            Object.keys(this.hero.inventory).includes(thisObj.attributes.key) :
                            true;
                        
                        if (accessible) {
                            thisObj.attributes.unlocked = true;
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
    
                    // if (key=="hero") console.log(mixers[key].absVelocity);
                    if (mixers[key].absVelocity < .1 && (mixers[key].activeActionName == 'Walking' || mixers[key].activeActionName == 'Running')) {
                        this.controller.fadeToAction( key, 'Idle', 0.2);
                    } else if (mixers[key].absVelocity >= .1 && mixers[key].activeActionName == 'Idle') {
                        this.controller.fadeToAction( key, 'Walking', 0.2);
                    } else if (mixers[key].absVelocity >= 199 && mixers[key].activeActionName == 'Walking') {
                        this.controller.fadeToAction( key, 'Running', 0.2);
                    }
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

        let thisMixer = this.controller.mixers[uniqueId];

        var yAxisRotation = new THREE.Euler( 0, entity.rotation.y, 0, 'YXZ' );
        let worldDirection = new THREE.Vector3().copy(thisMixer.direction).applyEuler( yAxisRotation );
        
        let mRaycaster = thisMixer.movementRaycaster;
        mRaycaster.ray.origin.copy( entity.position );
        mRaycaster.ray.direction.x = - worldDirection.x;
        mRaycaster.ray.direction.z = - worldDirection.z;

        if (uniqueId != "hero") {
            mRaycaster.ray.direction.x = - mRaycaster.ray.direction.x;
            mRaycaster.ray.direction.z = - mRaycaster.ray.direction.z;
            mRaycaster.ray.origin.y += 20;
        }

        // console.log(`${uniqueId}: origin: ${mRaycaster.ray.origin.x},${mRaycaster.ray.origin.y},${mRaycaster.ray.origin.z}`);
        // console.log(`${uniqueId}: direction: ${mRaycaster.ray.direction.x},${mRaycaster.ray.direction.y},${mRaycaster.ray.direction.z}`);

        let movementIntersects = mRaycaster.intersectObjects(this.controller.objects3D, true).filter(el => this.controller.getRootObject3D(el.object) != entity);
        
        if (movementIntersects.length == 0) {
            
            entity.translateX( thisMixer.velocity.x * delta );
            entity.translateY( thisMixer.velocity.y * delta );
            entity.translateZ( thisMixer.velocity.z * delta );

            // if (uniqueId!="hero") console.log(`thisMixer.velocity.z: ${thisMixer.velocity.z}`);
            if (Math.abs(entity.getWorldPosition(entity.position).x) >= this.planeHeight/2 || 
            Math.abs(entity.getWorldPosition(entity.position).z) >= this.planeWidth/2) {
                entity.translateX( -thisMixer.velocity.x * delta );
                entity.translateY( -thisMixer.velocity.y * delta );
                entity.translateZ( -thisMixer.velocity.z * delta );

                if (uniqueId != "hero") {
                    entity.rotateY(Math.PI);
                }
            }
        } else {
            
            // movementIntersects[ 0 ].object.material.transparent = true;
            // movementIntersects[ 0 ].object.material.opacity = 0.1;

            if (uniqueId!="hero") console.log(`${uniqueId} intersects:`);
            if (uniqueId!="hero") console.dir(movementIntersects[0].object);

            thisMixer.velocity.x = 0;
            thisMixer.velocity.y = 0;
            thisMixer.velocity.z = 0;

            if (uniqueId != "hero") {
                entity.rotateY(2);
            } 
        }

        let elevation = this.controller.castDownrayAndDetemineElevation( uniqueId, entity );

        if (thisMixer.jumpedOnObject || entity.position.y <= (elevation + entity.attributes.elevation)) {
            entity.position.y = (elevation + entity.attributes.elevation);
            thisMixer.velocity.y = Math.max( 0, thisMixer.velocity.y );
            thisMixer.canJump = true;
            thisMixer.justJumped = false;
        } 
    }

    identifySelectedObject(heroObj) {

        this.proximityLight.rotation.copy(heroObj.rotation);
        this.proximityLight.position.copy(heroObj.position);
        this.proximityLight.translateZ(-40);
        this.proximityLight.translateY(-10);

        let closest = Infinity;

        this.controller.objects3D.forEach(o => {
            let distance = o.position.distanceTo(this.proximityLight.position);
            if (distance <= 50 && distance < closest) {
                closest = distance;
                this.controller.mixers.hero.selectedObject = o;
                this.controller.eventDepot.fire('showDescription', { objectType: this.controller.getObjectType(o), objectName: this.controller.getObjectName(o) }); 
            }
        })

        if (closest > 50) {
            this.controller.mixers.hero.selectedObject = null;
            this.controller.eventDepot.fire('hideDescription', {}); 
        }

        // console.log(closest);

    }

    handleAutoZoom = () => {
        this.cameraBackray.ray.origin.copy(this.controls.getObject().position);

        // console.table(this.controls.getObject().position);
        // // ORIGINAL
        // let rotations = new THREE.Euler( 0, 0, 0, 'YXZ' );
        // rotations.set( rotation.x, rotation.y, 0 );
        // let worldDirection = new THREE.Vector3( 0, 0.4, 1 ).applyEuler( rotations );
        
        // //DEBUG
        // console.log("worldDirection:")
        // console.table(worldDirection);
        
        // NEEDS PITCH as well
        let cameraDirection = this.controls.getDirection(new THREE.Vector3( 0, 0, 0 ));

        this.cameraBackray.ray.direction.x = -cameraDirection.x
        this.cameraBackray.ray.direction.y = -cameraDirection.y + 0.4
        this.cameraBackray.ray.direction.z = -cameraDirection.z

        // //DEBUG
        // console.log("this.cameraBackray.ray.direction:")
        // console.table(this.cameraBackray.ray.direction);

        let backrayIntersections = 
            [...this.cameraBackray.intersectObject(this.controller.floor, true), 
            ...this.cameraBackray.intersectObjects(this.controller.objects3D.filter(el => el.objectType == 'structure'), true)]
        
        if (backrayIntersections[0]) {
            let distance = backrayIntersections[0].distance;
            if (distance < cameraDistanceDefault && this.camera.position.z > -5) {
                this.camera.position.z -= cameraDistanceDefault / 30;
                if (this.camera.position.y > this.controls.getObject().position.y) this.camera.position.y -= cameraElevationDefault / 30;
            }
        } else {
            if (this.camera.position.z <= cameraDistanceDefault) {
                this.camera.position.z += cameraDistanceDefault / 100;
                if (this.camera.position.y < cameraElevationDefault) this.camera.position.y += cameraElevationDefault / 100;
            }
        }
    }
    
    // Calculate hero location using grid coordinates
    updateHeroLocation = () => {
        let { x, y, z } = this.controls.getObject().position;
        
        let zOffset = (z < 0) ? 20 : -20;
        
        this.hero.location.x = x / multiplier;
        this.hero.location.z = (z+zOffset) / multiplier;

    }

    handleHeroMovement(delta) {

        if (this.controller.mixers.hero) {

            let thisMixer = this.controller.mixers.hero;

            let heroObj = this.controls.getObject();
            thisMixer.downRaycaster.ray.origin.copy( heroObj.position );

            // INERTIA
            thisMixer.velocity.x -= thisMixer.velocity.x * 10.0 * delta;
            thisMixer.velocity.z -= thisMixer.velocity.z * 10.0 * delta;
            thisMixer.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            thisMixer.direction.z = Number( moveForward ) - Number( moveBackward );
            thisMixer.direction.x = Number( moveLeft ) - Number( moveRight );
            thisMixer.direction.normalize(); // this ensures consistent movements in all directions
            
            if ( moveForward || moveBackward ) thisMixer.velocity.z -= thisMixer.direction.z * 1000.0 * this.hero.attributes.agility * delta;
            if ( moveLeft || moveRight ) thisMixer.velocity.x -= thisMixer.direction.x * 1000.0 * this.hero.attributes.agility * delta;

            this.identifySelectedObject(heroObj);

            this.handleMovement( "hero", heroObj, delta );
            
            if (thisMixer.standingUpon && thisMixer.standingUpon.attributes.routeTo && typeof thisMixer.standingUpon.attributes.routeTo.level == "number") {
                if (thisMixer.standingUpon.attributes.unlocked) {
                    
                    this.updateHeroLocation();

                    this.controller.eventDepot.fire('saveLevel', {
                        hero: this.hero.basic(),
                        level: this.controller.level
                    });

                    this.controller.eventDepot.fire('loadLevel', {
                        level: thisMixer.standingUpon.attributes.routeTo.level,
                        location: thisMixer.standingUpon.attributes.routeTo.location,
                        hero: this.hero
                    });
                }
            }

            this.handleAutoZoom();

            this.overheadPointLight.position.copy(heroObj.position);
            this.overheadPointLight.position.y = this.hero.attributes.height + 40;
        }
    }

    handleEntityMovement(delta) {
        this.controller.objects3D.filter(el => el.objectType == 'friendly' || el.objectType == 'beast').forEach(entity => {
            
            if (this.controller.mixers[entity.uuid]) {
            
                let thisMixer = this.controller.mixers[entity.uuid];

                // Make a random rotation (yaw)
                entity.rotateY(getRndInteger(-1,2)/100);
                
                // GRAVITY
                thisMixer.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                // Basic movement always in the z-axis direction for this entity
                thisMixer.velocity.z = getRnd(.2,entity.attributes.agility) * 100;
                thisMixer.velocity.x = 0; // getRndInteger(.2,entity.attributes.agility) * 100;
                
                thisMixer.direction.z = getRnd(-.2,.2);
                thisMixer.direction.x = getRnd(-.2,.2);

                this.handleMovement(entity.uuid, entity, delta);
            }
        });
    }

    animate() {
        
        requestAnimationFrame( this.animate );
        if ( this.controls.isLocked === true && this.running ) {

            this.time = performance.now();
            this.delta = ( this.time - this.prevTime ) / 1000;

            // console.log(`delta: ${this.delta}`)
            this.handleHeroMovement(this.delta);
            this.handleEntityMovement(this.delta);
            this.handleMixers(this.delta);

            this.prevTime = this.time;

        } else {
            this.prevTime = performance.now();
        }
        this.renderer.render( this.scene, this.camera );



        if (minimap) {
            // renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
            // renderer.render( scene, activeCamera );
            // cameraMinimap.lookAt(this.controls.getObject().position);
            this.rendererMinimap.render(this.scene, this.cameraMinimap);
            // renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
            // renderer.render( scene, camera );

            this.compass.lookAt( DUENORTH );
        }


        this.stats.update();
    }

    deanimate() {
        this.running = false;
        document.getElementById('minimap').firstElementChild.remove();
        cancelAnimationFrame( this.animate );
        return;
    }

    unregisterEventListeners = () => {
        this.instructions.removeEventListener( 'click', this.controls.lock, false );
        document.removeEventListener( 'keydown', this.onKeyDown, false );
        document.removeEventListener( 'keyup', this.onKeyUp, false );
        window.removeEventListener( 'resize', this.onWindowResize, false );
    }

}

export {Scene};