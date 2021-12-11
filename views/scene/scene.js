var camera, scene, renderer, 
    downRaycaster, movementRaycaster, selectRaycaster, floorheightRaycaster,
    intersects, selectIntersects, helper;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
// var vertex = new THREE.Vector3();
// var color = new THREE.Color();
var multiplier = 100;

var navbarHeight;

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
        this.objects = objects;
        this.background = background;
        this.terrain = terrain;

        // objects3D is used for raycast intersections
        this.objects3D = [];

        this.controls = null;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
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
            this.seedObjects3D()
            console.dir(this.objects3D);
        });
        
        // this.seedObjects3D();

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, (window.innerHeight - navbarHeight));
        
        this.addEventListeners();

        console.dir(this.hero);

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

        scene.fog = new THREE.Fog( 'white', 0, 490 );
    }

    addLights() {
        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );

        // var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        // scene.add( directionalLight );
    }

    addControls() {
        this.controls = new THREE.PointerLockControls( camera );

        scene.add( this.controls.getObject() );


        var onKeyDown = function ( event ) {
    
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
                    if ( canJump === true ) velocity.y += 350;
                    canJump = false;
                    break;
    
            }
    
        };
    
        var onKeyUp = function ( event ) {
    
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
        /**
         * Raycasters:
         * 
         * downRaycaster - cast directly beneath the camera for terrain, objects, verticle elevation
         * 
         * movementRaycaster - cast at height 10 in the direction of controls movement
         * 
         * selectRaycaster - cast immediately in front of the camera for item selection, etc.
         */

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
        0, 30 );

        floorheightRaycaster = new THREE.Raycaster( new THREE.Vector3(), 
        new THREE.Vector3( 0, -1, 0 ), 
        0, 140 );
    }

    addFloor(callback) {

        var loader = new THREE.GLTFLoader();
        loader.load( '/models/3d/gltf/' + this.terrain + '.gltf', (gltf) => {
        
            var obj = gltf.scene;
            this.floor = obj.children[0].children[0];

            scene.add( obj );
            console.dir(this.floor);
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

    /** 
     * Create 3D representation of each object:
     */ 
    seedObjects3D = () => {

        // Set hero location:
        this.controls.getObject().translateX( this.hero.location.x * multiplier );
        this.controls.getObject().translateZ( this.hero.location.z * multiplier );
        this.controls.getObject().translateY( this.hero.height? this.hero.height : 15 ); 
            // this.determineFloorHeight(this.controls.getObject().position.x, this.controls.getObject().position.z) + this.hero.height );

        this.objects.forEach(object => {

            // var loader = new THREE.ObjectLoader();
            var loader = new THREE.GLTFLoader();
            loader.load( '/models/3d/gltf/' + object.gltf + '.gltf', (gltf) => {
            
                var obj = gltf.scene;
                obj.position.y = object.elevation;
                obj.scale.x = object.scale;
                obj.scale.y = object.scale;
                obj.scale.z = object.scale;

                // Set the name recursively
                (function setName(o) {

                    if (o.children && o.children.length > 0) {
                        o.name = object.name;
                        Array.from(o.children).forEach(child => {
                            setName(child);
                        })
                        return;
                    } else {
                        o.name = object.name;
                        return;
                    }

                })(obj);

                obj.position.x = object.location.x * multiplier + getRndInteger(-20,20);
                obj.position.z = object.location.z * multiplier + getRndInteger(-20,20);
                
                // ELEVATION based on floor plane
                // Lift up, then drop down to proper level

                obj.position.y = this.determineFloorHeight(obj.position.x, obj.position.z);
                this.objects3D.push( obj );
                scene.add( obj );
            
            }, undefined, function ( error ) {
            
                console.error( error );
            
            } );
        }, this)

        // var boxGeometry = new THREE.BoxBufferGeometry( 50, 50, 50 );
        // boxGeometry = boxGeometry.toNonIndexed();
        // // boxGeometry.computeBoundingBox();
        // // var position = boxGeometry.attributes.position;
        // // var colors = [];
        // // for ( var i = 0, l = position.count; i < l; i ++ ) {
        // //     color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        // //     colors.push( color.r, color.g, color.b );
        // // }
        // // boxGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        // // var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
        // var boxMaterial = new THREE.MeshBasicMaterial();
        // // boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        // var box = new THREE.Mesh( boxGeometry, boxMaterial );
        // box.name = 'randomBox';

        // this.objects3D.push(box);
        // scene.add(box);

    }

    onMouseClick = (e) => {
    }

    onMouseDown = (e) => {

        switch (e.button) {

            case 0:
                selectIntersects = selectRaycaster.intersectObjects(this.objects3D,true);
                if (selectIntersects.length > 0) {
                    // helper.visible = true;
                    // helper.position.copy(selectIntersects[0].point);

                    // TODO: Get the intersected object's properties from the level manager.
                    // If it is an item, pick it up and add to inventory
                    // If it is a friendly entity, engage the conversation

                    this.controls.unlock();

                    this.controller.eventDepot.fire('modal', { name: selectIntersects[0].object.name });
                    console.log(selectIntersects[0].object.name);
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
        selectRaycaster.ray.origin.y -= 5;
        let v = new THREE.Vector3();
        selectRaycaster.ray.direction.x = this.controls.getDirection(v).x;
        selectRaycaster.ray.direction.y = this.controls.getDirection(v).y;
        selectRaycaster.ray.direction.z = this.controls.getDirection(v).z;

    }

    reposition(delta) {
        // Only perform the translation if I will not invade another.
        intersects = movementRaycaster.intersectObjects(this.objects3D, true);
        if (intersects.length == 0) {
            
            this.controls.getObject().translateX( velocity.x * delta );
            this.controls.getObject().translateY( velocity.y * delta );
            this.controls.getObject().translateZ( velocity.z * delta );

            // Test and bounce back if needed
            let controlsObj = this.controls.getObject();
            if (Math.abs(controlsObj.getWorldPosition(controlsObj.position).x) >= this.planeHeight/2 || 
            Math.abs(controlsObj.getWorldPosition(controlsObj.position).z) >= this.planeWidth/2) {
                this.controls.getObject().translateX( -velocity.x * delta );
                this.controls.getObject().translateY( -velocity.y * delta );
                this.controls.getObject().translateZ( -velocity.z * delta );
            }
        } else {
            // console.dir(intersects);
        }

        // Grounded means elevation 30

        let floorHeight = this.determineFloorHeight(this.controls.getObject().position.x, this.controls.getObject().position.z);
        if ( this.controls.getObject().position.y < (floorHeight + this.hero.height)) {
            velocity.y = 0;
            this.controls.getObject().position.y = (floorHeight + this.hero.height);
            canJump = true;
        }
    }

    animate() {
        requestAnimationFrame( this.animate );
        if ( this.controls.isLocked === true ) {

            downRaycaster.ray.origin.copy( this.controls.getObject().position );
            downRaycaster.ray.origin.y -= (this.hero.height? this.hero.height : 15);
            var intersections = downRaycaster.intersectObjects( this.objects3D, true );
            var onObject = intersections.length > 0;

            var time = performance.now();
            var delta = ( time - prevTime ) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveLeft ) - Number( moveRight );
            direction.normalize(); // this ensures consistent movements in all directions
            
            if ( moveForward || moveBackward ) velocity.z -= direction.z * 1000.0 * delta;
            if ( moveLeft || moveRight ) velocity.x -= direction.x * 1000.0 * delta;
            
            if ( onObject === true ) {
                velocity.y = Math.max( 0, velocity.y );
                canJump = true;
            }
            
            // this.controls.getObject().rotation.y returns the yaw rotation of the pointer control (mouse)
            this.castMovementRay();
            this.castSelectionRay();
            this.reposition(delta);            

            prevTime = time;

        } else {
            prevTime = performance.now();
        }
        renderer.render( scene, camera );
    }
}

export {Scene};