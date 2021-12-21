var camera, scene, renderer, 
    helper, proximityLight;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var cameraReach = 1000;
var cameraDistanceDefault = 200;
var cameraElevationDefault = 40;

var multiplier = 100;
var navbarHeight;

var WHITE = new THREE.Color('white');
var BLACK = new THREE.Color('black');
/**
 * The Scene has graphical display (THREE.js), animates using requestAnimationFrame,
 * and uses controls.  It accepts an initial layout of objects to setup the layout, 
 * then updates the objects array with locations after each animation.
 */

class Scene {

    constructor(hero, length, width, terrain, background, controller) {

        this.prevTime = performance.now();
        // SceneController has access to layoutBuilder, which has levelManager
        this.controller = controller;
        this.running = true;

        this.planeWidth = width? width * multiplier : 2000;
        this.planeHeight = length? length * multiplier : 2000;

        this.hero = hero;
        this.background = background;
        this.terrain = terrain;

        this.controls = null;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
        this.addControls = this.addControls.bind(this);
    }

    init(callback) {

        navbarHeight = document.querySelector('.navbar').clientHeight;
    
        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / (window.innerHeight - navbarHeight), 1, cameraReach );
        camera.position.set( 0, cameraElevationDefault, cameraDistanceDefault );
        
        scene = new THREE.Scene();

        this.addControls();
        this.addBackground();
        this.addFloor(() => {
            this.seedObjects3D();
            this.addHero3D();
            this.addLights();
        });
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, (window.innerHeight - navbarHeight));
        
        this.addEventListeners();
        if (callback) callback();
    }

    addControls() {
        this.controls = new THREE.PointerLockControls( camera );
        this.cameraBackray = new THREE.Raycaster( new THREE.Vector3( ), new THREE.Vector3( 0, 0, 1 ), 0, cameraDistanceDefault);
        scene.add( this.controls.getObject() );
    
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
            scene.background = BLACK;
        }

        if (this.terrain.fog) scene.fog = new THREE.Fog( 'white', 100, cameraReach );
    }

    addLights() {

        if (this.terrain.hemisphereLight) {
            var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
            light.position.set( 0.5, 1, 0.75 );
            scene.add( light );
        }

        if (this.terrain.overheadPointLight) {
            this.overheadPointLight = new THREE.PointLight( 0xf37509, 2, 250, 2 );
            this.overheadPointLight.position.set( 0, 0, 0 );
            scene.add( this.overheadPointLight );
        }
        
        proximityLight = new THREE.PointLight( 0x00ff00, 2, 50, 2 );
        proximityLight.position.set( 0, 0, 0 );
        scene.add( proximityLight );

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

        helper = new THREE.Mesh ( new THREE.SphereBufferGeometry(5), new THREE.MeshBasicMaterial({ color: 'red' }));
        helper.visible = false;
        scene.add( helper );

    }

    addFloor(callback) {

        this.controller.load(this.terrain, (gltf) => {
            this.controller.floor = gltf.scene;
            scene.add( this.controller.floor );
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
                scene.add( model );

            }, undefined, function ( error ) {
                console.error( error );
            });

        });
    }

    onMouseClick = (e) => {
        console.log(`Controls object:`);
        console.dir(this.controls.getObject().position);
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
                        this.controller.removeFromObjects3DbyName(objectName);
                        scene.remove(scene.children.find(el => el.objectName == objectName));

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
                // helper.visible = false;
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

        main.appendChild(renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    onWindowResize() {
        camera.aspect = window.innerWidth / (window.innerHeight - navbarHeight);
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, (window.innerHeight - navbarHeight) );
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

        proximityLight.rotation.copy(heroObj.rotation);
        proximityLight.position.copy(heroObj.position);
        proximityLight.translateZ(-40);
        proximityLight.translateY(-10);

        let closest = Infinity;

        this.controller.objects3D.forEach(o => {
            let distance = o.position.distanceTo(proximityLight.position);
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
            if (distance < cameraDistanceDefault && camera.position.z > -5) {
                camera.position.z -= cameraDistanceDefault / 30;
                if (camera.position.y > this.controls.getObject().position.y) camera.position.y -= cameraElevationDefault / 30;
            }
        } else {
            if (camera.position.z <= cameraDistanceDefault) {
                camera.position.z += cameraDistanceDefault / 100;
                if (camera.position.y < cameraElevationDefault) camera.position.y += cameraElevationDefault / 100;
            }
        }
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
            
            if (thisMixer.standingUpon && typeof thisMixer.standingUpon.attributes.routeToLevel == "number") {
                if (thisMixer.standingUpon.attributes.unlocked) {
                    // Use the GAME to start a new level

                    this.controller.eventDepot.fire('saveLevel', {
                        // TODO: implement save level, item locations, etc.

                        
                    });

                    this.controller.eventDepot.fire('loadLevel', {
                        level: thisMixer.standingUpon.attributes.routeToLevel,
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
        renderer.render( scene, camera );
    }

    deanimate() {
        this.running = false;
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