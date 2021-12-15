var camera, scene, renderer, 
    downRaycaster, movementRaycaster, selectRaycaster, floorheightRaycaster,
    intersects, selectIntersects, helper, spotLight;

var mixers = {};
var actions = {};

var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
var emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();

var direction = new THREE.Vector3();
// var vertex = new THREE.Vector3();
// var color = new THREE.Color();
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

    constructor(hero, height, width, terrain, objects, background, controller) {

        // SceneController has access to layoutBuilder, which has levelManager
        this.controller = controller;
        
        this.planeWidth = width? width * multiplier * 1.1 : 2000;
        this.planeHeight = height? height * multiplier * 1.1 : 2000;

        this.hero = hero;
        this.hero3D = new THREE.Object3D();

        this.emissives = [];
        this.objects = objects;
        this.background = background;
        this.terrain = terrain;

        // objects3D is used for raycast intersections
        this.objects3D = [];

        this.controls = null;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
        this.addControls = this.addControls.bind(this);
    }

    init() {

        navbarHeight = document.querySelector('.navbar').clientHeight;
        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / (window.innerHeight - navbarHeight), 1, 1200 );
    
        scene = new THREE.Scene();


        this.addBackground();
        this.addLights();
        this.addControls();
        this.addRaycasters();
        this.addFloor(() => {
            this.seedObjects3D();
            this.addHero3D();
        });
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, (window.innerHeight - navbarHeight));
        
        this.addEventListeners();
    }

    addBackground() {

        // BACKGROUND - EQUIRECT thanks to Paul Debevec! 
        if (this.background && this.background.length > 0) {

            // var textureLoader = new THREE.TextureLoader();
            // var textureEquirec, backgroundMesh;

            // textureEquirec = textureLoader.load( "/models/textures/" + this.background );
            // textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
            // textureEquirec.encoding = THREE.sRGBEncoding;

            // // Materials
            // var equirectShader = THREE.ShaderLib[ "equirect" ];
            // var equirectMaterial = new THREE.ShaderMaterial( {
            //     fragmentShader: equirectShader.fragmentShader,
            //     vertexShader: equirectShader.vertexShader,
            //     uniforms: equirectShader.uniforms,
            //     depthWrite: false,
            //     side: THREE.BackSide
            // } );

            // equirectMaterial.uniforms[ "tEquirect" ].value = textureEquirec;

            // Object.defineProperty( equirectMaterial, 'map', {

            //     get: function () {
            //         return this.uniforms.tEquirect.value;
            //     }
            // } );

            // backgroundMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( this.planeWidth, 400, this.planeHeight ), equirectMaterial );
            // backgroundMesh.position.y = this.planeHeight/2;

            // More simplistic equirectangular mapping to the inverse of a sphere geometry:
            var geometry = new THREE.SphereBufferGeometry(this.planeHeight);
            geometry.scale (-1,.5,1);

            var material = new THREE.MeshBasicMaterial( {
                map: new THREE.TextureLoader().load("/models/textures/" + this.background)
            });

            var backgroundMesh = new THREE.Mesh(geometry, material)
            
            scene.add( backgroundMesh );

        } else {
            scene.background = new THREE.Color( 'white' );
        }

        scene.fog = new THREE.Fog( 'white', 0, 750 );
    }

    addLights() {
        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );

        // var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        // scene.add( directionalLight );

        spotLight = new THREE.SpotLight( 0xfffff, 1 );
        spotLight.angle = Math.PI / 4;
        scene.add(spotLight);


    }

    addControls() {
        this.controls = new THREE.PointerLockControls( camera );

        scene.add( this.controls.getObject() );


        var onKeyDown = ( event ) => {
    
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
                    if ( canJump === true ) {
                        mixers.hero.velocity.y += 350;
                        this.fadeToAction("hero", "Jump", 0.2)
                    }
                    canJump = false;
                    break;

                case 73: // i
                    this.controller.eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });
            }
    
        };
    
        var onKeyUp = ( event ) => {
    
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
    
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
    }

    addRaycasters() {

        downRaycaster = new THREE.Raycaster( new THREE.Vector3(), 
        new THREE.Vector3( 0, - 1, 0 ), 
        0, 10 );

        movementRaycaster = new THREE.Raycaster( new THREE.Vector3(), 
        new THREE.Vector3( 0, 0, 0 ),
        0, 10 );

        helper = new THREE.Mesh ( new THREE.SphereBufferGeometry(5), new THREE.MeshBasicMaterial({ color: 'red' }));
        helper.visible = false;
        scene.add( helper );
    
        selectRaycaster = new THREE.Raycaster( new THREE.Vector3(), 
        new THREE.Vector3( 0, 0, 0 ),
        0, 70 );

        floorheightRaycaster = new THREE.Raycaster( new THREE.Vector3(), 
        new THREE.Vector3( 0, -1, 0 ), 
        0, 140 );
    }

    addFloor(callback) {

        var loader = new THREE.GLTFLoader();
        loader.load( '/models/3d/gltf/' + this.terrain, (gltf) => {
        
            var obj = gltf.scene;
            this.floor = obj.children[0].children[0];

            scene.add( obj );
            callback();
        
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );


        // mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        // scene.add( mesh );


        // var floorGeometry = new THREE.PlaneBufferGeometry( this.planeWidth, this.planeHeight, this.widthSegments, this.heightSegments );
        // floorGeometry.rotateX( - Math.PI / 2 );
    
        // FLOOR VERTEX COLORS
        // position = floorGeometry.attributes.position;
        // var colors = [];
        // for ( var i = 0, l = position.count; i < l; i ++ ) {
        //     color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        //     colors.push( color.r, color.g, color.b );
        // }
        // floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    
        // var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
        // var floor = new THREE.Mesh( floorGeometry, floorMaterial );
        // scene.add( floor );
    
        //     var boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        //     boxGeometry = boxGeometry.toNonIndexed();
        //     // var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
        //     var boxMaterial = new THREE.MeshBasicMaterial();
        //     // boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        //     var box = new THREE.Mesh( boxGeometry, boxMaterial );
    }

    addHero3D = () => {
        var loader = new THREE.ObjectLoader();
        var loader = new THREE.GLTFLoader();
        loader.load( '/models/3d/gltf/' + this.hero.gltf, (gltf) => {
        
            let model = gltf.scene;
            
            model.scale.x = this.hero.attributes.scale;
            model.scale.y = this.hero.attributes.scale;
            model.scale.z = this.hero.attributes.scale;
            
            // model.position.z -= 40;
            model.position.y -= 25;
            model.rotation.y = Math.PI;
            this.controls.getObject().add( model );

            this.createGUI( model, gltf.animations, "hero" );
        
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );
    }

    /**
     * Animation mixer based on webgl/THREE demo with robot.
     * Each entity will have his own mixer;
     */
    createGUI = (model, animations, uniqueId) => {

        var thisMixer = new THREE.AnimationMixer( model );

        animations.forEach(animation => {

            var action = thisMixer.clipAction( animation );

            if ( emotes.indexOf( animation.name ) >= 0 || states.indexOf( animation.name ) >= 4 ) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
            actions[ uniqueId + animation.name ] = action;
        });

        var mixerObj = { 
        
            name: uniqueId, 
            mixer: thisMixer,
            activeActionName: 'Walking',
            activeAction: actions[ uniqueId + 'Walking'],
            previousActionName: '',
            previousAction: null,
            absVelocity: 0,
            velocity: new THREE.Vector3()

        };

        mixers[uniqueId] = mixerObj;

        // DEFAULT:
        mixerObj.activeAction.play();

    }

    fadeToAction = ( uuid, actionName, duration ) => {
        
        // Get the mixer for this uuid:
        let thisMixer = mixers[uuid];

        if ( thisMixer.activeActionName !== actionName ) {

            let newAction = actions[ uuid + actionName ];

            thisMixer.previousActionName = thisMixer.activeActionName;
            thisMixer.previousAction = thisMixer.activeAction;
            thisMixer.activeActionName = actionName;
            thisMixer.activeAction = newAction;

            thisMixer.previousAction.fadeOut( duration );

            thisMixer.activeAction
                .reset()
                .setEffectiveTimeScale( 1 )
                .setEffectiveWeight( 1 )
                .fadeIn( duration )
                .play();

            const restoreState = () => {
                thisMixer.mixer.removeEventListener('finished', restoreState );
                this.fadeToAction( uuid, thisMixer.previousActionName, 0.1 );
            }
    
            // After fadeToAction ({emote}, {seconds}), fadeToAction ({state}, {seconds}) again
            if (emotes.includes(actionName)) {
                thisMixer.mixer.addEventListener( 'finished', restoreState );
            }
        }
    }

    /**
     * This function will move each entity according to his properties,
     * similar to the reposition function for the hero character.
     */
    handleMovement = ( entity, delta ) => {

        if (mixers[entity.uuid]) {
            
            // Make a random rotation (yaw)
            entity.rotateY(getRndInteger(-1,2)/100);

            // Basic movement always in the z-axis direction for this entity
            mixers[entity.uuid].velocity.z = getRndInteger(.2,entity.attributes.agility) * 100;
            var mCaster = this.getMovementRay(entity.position,new THREE.Vector3(0,0,1));
            var mIntersections = mCaster.intersectObjects(this.objects3D, true);
            mIntersections = mIntersections.filter(el => el != entity);
            if (mIntersections.length == 0) {
                entity.translateZ( mixers[entity.uuid].velocity.z * delta );
                let worldPosition = new THREE.Vector3();
                if (Math.abs(entity.getWorldPosition(worldPosition).x) >= this.planeHeight/2 || 
                Math.abs(entity.getWorldPosition(worldPosition).z) >= this.planeWidth/2) {
                    entity.translateZ( - mixers[entity.uuid].velocity.z * delta );
                }
            } else {
                
            }
    
            // Grounded means elevation 30
            
            let floorHeight = this.determineFloorHeight(entity.position.x, entity.position.z);
            if ( entity.position.y < (floorHeight + entity.attributes.elevation)) {
                entity.position.y = (floorHeight + entity.attributes.elevation);
            }
        }


    }

    /** 
     * Create 3D representation of each object:
     */ 
    seedObjects3D = () => {

        // Set hero location:
        this.controls.getObject().translateX( this.hero.location.x * multiplier );
        this.controls.getObject().translateZ( this.hero.location.z * multiplier );
        this.controls.getObject().translateY( this.hero.attributes.height? this.hero.attributes.height : 15 ); 
            // this.determineFloorHeight(this.controls.getObject().position.x, this.controls.getObject().position.z) + this.hero.attributes.height );

        this.objects.forEach(object => {

            // var loader = new THREE.ObjectLoader();
            var loader = new THREE.GLTFLoader();
            loader.load( '/models/3d/gltf/' + object.gltf, (gltf) => {
            
                let model = gltf.scene;
            
                model.scale.x = object.attributes.scale;
                model.scale.y = object.attributes.scale;
                model.scale.z = object.attributes.scale;

                
                model.position.x = object.location.x * multiplier + getRndInteger(-20,20);
                model.position.z = object.location.z * multiplier + getRndInteger(-20,20);
                model.position.y = this.determineFloorHeight(model.position.x, model.position.z) + object.attributes.elevation;

                model.objectName = object.name;
                model.objectType = object.type;
                model.attributes = object.attributes;

                this.objects3D.push( model );
                scene.add( model );

                if (object.type == 'beast') {
                    this.createGUI( model, gltf.animations, model.uuid );
                }

            }, undefined, function ( error ) {
            
                console.error( error );
            
            } );
        }, this)

    }

    onMouseClick = (e) => {
        // DEBUG
        console.log(`Controls object:`);
        console.dir(this.controls.getObject().position);
    }

    getObjectName = (obj) => {
        if (obj.objectName) {
            return obj.objectName;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getObjectName(obj.parent);
        }
    }

    getObjectType = (obj) => {
        if (obj.objectType) {
            return obj.objectType;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getObjectType(obj.parent);
        }
    }

    onMouseDown = (e) => {

        switch (e.button) {

            case 0:
                // selectIntersects = selectRaycaster.intersectObjects(this.objects3D,true);
                if (selectIntersects && selectIntersects.length > 0) {

                    // helper.visible = true;
                    // helper.position.copy(selectIntersects[0].point);

                    let thisObj = selectIntersects[0].object;

                    // Get the parent name/type
                    let objectName = this.getObjectName(thisObj);
                    let objectType = this.getObjectType(thisObj);
                    
                    // If it is an item, pick it up and add to inventory
                    if (objectType == "item") {
                        
                        this.controller.eventDepot.fire('takeItem', objectName);
                        this.objects3D = this.objects3D.filter(el => {
                            return el.objectName != objectName;
                        }); 

                        scene.remove(scene.children.find(el => el.objectName == objectName));

                    // If it is a friendly entity, engage the conversation
                    } else if (objectType == "friendly") {
                        
                        // TODO: Get the intersected object's properties from the level manager.
                        this.controls.unlock();
                        this.controller.eventDepot.fire('modal', { name: objectName });
                   
                    } else if (objectType == "beast") {

                        this.fadeToAction("hero", "Punch", 0.2)
                        // TODO: act upon the enemy with the object in hand


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
                helper.visible = false;
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

        var blocker = document.getElementById( 'blocker' );
        var instructions = document.getElementById( 'instructions' );

        this.controller.eventDepot.addListener('lockControls', () => {
            this.controls.lock();
        })

        this.controller.eventDepot.addListener('unlockControls', () => {
            this.controls.unlock();
        })

        instructions.addEventListener( 'click', () => {

            this.controls.lock();
        
        }, false );

        this.controls.addEventListener( 'lock', () => {

            instructions.style.display = 'none';
            blocker.style.display = 'none';
            document.addEventListener( 'mousedown', this.onMouseDown, false );
            document.addEventListener( 'mouseup', this.onMouseUp, false );
            document.addEventListener( 'click', this.onMouseClick, false );
        } );

        this.controls.addEventListener( 'unlock', () => {

            blocker.style.display = 'block';
            instructions.style.display = '';
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

    determineFloorHeight(x,z) {

        floorheightRaycaster.ray.origin.x = x;
        floorheightRaycaster.ray.origin.z = z;
        floorheightRaycaster.ray.origin.y = 110;

        var floorIntersection = floorheightRaycaster.intersectObject( this.floor, false );
        
        return 110 - floorIntersection[0].distance;
    }

    getMovementRay(origin, direction) {
        return new THREE.Raycaster( origin, direction, 0, 10 );
    }

    castMovementRay() {
        // MOVEMENT
        var movementRaycasterRotation = new THREE.Euler( 0, 0, 0, 'YXZ' );
        movementRaycasterRotation.set( 0, this.controls.getObject().rotation.y, 0 );
        let worldDirection = new THREE.Vector3().copy(direction).applyEuler( movementRaycasterRotation );

        movementRaycaster.ray.origin.copy( this.controls.getObject().position );
        movementRaycaster.ray.origin.y -= 5;
        movementRaycaster.ray.direction.x = - worldDirection.x;
        movementRaycaster.ray.direction.z = - worldDirection.z;
    }

    castSelectionRay() {
        // SELECTION
        selectRaycaster.ray.origin.copy( this.controls.getObject().position );
        let v = new THREE.Vector3();
        selectRaycaster.ray.direction.x = this.controls.getDirection(v).x;
        selectRaycaster.ray.direction.y = this.controls.getDirection(v).y;
        selectRaycaster.ray.direction.z = this.controls.getDirection(v).z;

        selectIntersects = selectRaycaster.intersectObjects(this.objects3D,true);
        if (selectIntersects && selectIntersects.length > 0) {
            // this.addToEmissives(selectIntersects[0]);
            
            spotLight.intensity = 2;
            spotLight.position.set(
                this.controls.getObject().position.x,
                this.controls.getObject().position.y,
                this.controls.getObject().position.z
            );
            spotLight.target = selectIntersects[0].object;
            
        } else {
            spotLight.intensity = 0;
        }


    }

    reposition(delta) {
        // Only perform the translation if I will not invade another.
        intersects = movementRaycaster.intersectObjects(this.objects3D, true);
        if (intersects.length == 0) {
            
            this.controls.getObject().translateX( mixers.hero.velocity.x * delta );
            this.controls.getObject().translateY( mixers.hero.velocity.y * delta );
            this.controls.getObject().translateZ( mixers.hero.velocity.z * delta );

            // Test and bounce back if needed
            let controlsObj = this.controls.getObject();
            if (Math.abs(controlsObj.getWorldPosition(controlsObj.position).x) >= this.planeHeight/2 || 
            Math.abs(controlsObj.getWorldPosition(controlsObj.position).z) >= this.planeWidth/2) {
                this.controls.getObject().translateX( -mixers.hero.velocity.x * delta );
                this.controls.getObject().translateY( -mixers.hero.velocity.y * delta );
                this.controls.getObject().translateZ( -mixers.hero.velocity.z * delta );
            }
        } else {
            // console.dir(intersects);
        }

        // Grounded means elevation 30

        let floorHeight = this.determineFloorHeight(this.controls.getObject().position.x, this.controls.getObject().position.z);
        if ( this.controls.getObject().position.y < (floorHeight + this.hero.attributes.height)) {
            mixers.hero.velocity.y = 0;
            this.controls.getObject().position.y = (floorHeight + this.hero.attributes.height);
            canJump = true;
        }
    }

    addToEmissives(obj) {
        if (!this.emissives.map(el => el.object).includes(obj)) {
            this.emissives.push({object: obj, timeLeft: 30});
        }
    }

    handleEmissives() {

        this.emissives.forEach(obj => {
            obj.object.object.material.emissive = WHITE;

            if (obj.timeLeft > 0) {
                obj.timeLeft --;
            } else {
                obj.object.object.material.emissive = BLACK;
            }
        });

        this.emissives.filter(el => el.timeLeft > 0);
    }

    animate() {
        requestAnimationFrame( this.animate );
        if ( this.controls.isLocked === true ) {

            // this.handleEmissives();

            downRaycaster.ray.origin.copy( this.controls.getObject().position );
            downRaycaster.ray.origin.y -= (this.hero.attributes.height? this.hero.attributes.height : 15);
            var intersections = downRaycaster.intersectObjects( this.objects3D, true );
            var onObject = intersections.length > 0;

            var time = performance.now();
            var delta = ( time - prevTime ) / 1000;

            if (mixers.hero) {

                mixers.hero.velocity.x -= mixers.hero.velocity.x * 10.0 * delta;
                mixers.hero.velocity.z -= mixers.hero.velocity.z * 10.0 * delta;
                mixers.hero.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    
                direction.z = Number( moveForward ) - Number( moveBackward );
                direction.x = Number( moveLeft ) - Number( moveRight );
                direction.normalize(); // this ensures consistent movements in all directions
                
                if ( moveForward || moveBackward ) mixers.hero.velocity.z -= direction.z * 1000.0 * delta;
                if ( moveLeft || moveRight ) mixers.hero.velocity.x -= direction.x * 1000.0 * delta;
                
                if ( onObject === true ) {
                    mixers.hero.velocity.y = Math.max( 0, mixers.hero.velocity.y );
                    canJump = true;
                }

                // this.controls.getObject().rotation.y returns the yaw rotation of the pointer control (mouse)
                this.castMovementRay();
                this.castSelectionRay();
                this.reposition(delta);    
            }


            if ( mixers ) {
                Object.keys(mixers).forEach(key => {
                    mixers[key].mixer.update( delta );

                    mixers[key].absVelocity = Math.max(Math.abs(mixers[key].velocity.x), Math.abs(mixers[key].velocity.z));

                    if (mixers[key].absVelocity < .1 && mixers[key].activeActionName == 'Walking') {
                        this.fadeToAction( key, 'Idle', 0.2);
                    } else if (mixers[key].absVelocity >= .1 && mixers[key].activeActionName == 'Idle') {
                        this.fadeToAction( key, 'Walking', 0.2);
                    }
                })

                this.objects3D.filter(el => el.objectType == 'friendly' || el.objectType == 'beast').forEach(entity => {
                    this.handleMovement(entity, delta);
                });
            } 



        

            prevTime = time;

        } else {
            prevTime = performance.now();
        }
        renderer.render( scene, camera );
    }
}

export {Scene};