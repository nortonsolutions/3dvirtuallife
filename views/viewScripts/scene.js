var camera, scene, renderer, controls, raycaster;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();

class Scene {

    constructor(props) {
        
        this.planeWidth = props.planeWidth? props.planeWidth : 2000;
        this.planeHeight = props.planeHeight? props.planeHeight : 2000;
        this.widthSegments = props.widthSegments? props.widthSegments : 100;
        this.heightSegments = props.heightSegments? props.heightSegments : 100;
        this.objects = [];

        this.controls = null;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    
    init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 'white' );
        scene.fog = new THREE.Fog( 'white', 0, 750 );
        
        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        scene.add( directionalLight );

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
    
        raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    
        var floorGeometry = new THREE.PlaneBufferGeometry( this.planeWidth, this.planeHeight, this.widthSegments, this.heightSegments );
        floorGeometry.rotateX( - Math.PI / 2 );
    
        // FLOOR VERTEX DISPLACEMENT
        // var position = floorGeometry.attributes.position;  // Has a count
        // for ( var i = 0, l = position.count; i < l; i ++ ) {
        //     vertex.fromBufferAttribute( position, i );
        //     vertex.x += Math.random() * 20 - 10;
        //     vertex.y += Math.random() * 2;
        //     vertex.z += Math.random() * 20 - 10;
        //     position.setXYZ( i, vertex.x, vertex.y, vertex.z );
        // }
        // floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
    
        // FLOOR VERTEX COLORS
        // position = floorGeometry.attributes.position;
        // var colors = [];
        // for ( var i = 0, l = position.count; i < l; i ++ ) {
        //     color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        //     colors.push( color.r, color.g, color.b );
        // }
        // floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    
        var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
        var floor = new THREE.Mesh( floorGeometry, floorMaterial );
        scene.add( floor );
    
        // BOXES
        // var boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        // boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices
        // var position = boxGeometry.attributes.position;
        // var colors = [];
        // for ( var i = 0, l = position.count; i < l; i ++ ) {
        //     color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        //     colors.push( color.r, color.g, color.b );
        // }
        // boxGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        // for ( var i = 0; i < 500; i ++ ) {
        //     var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
        //     boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        //     var box = new THREE.Mesh( boxGeometry, boxMaterial );
        //     box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
        //     box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
        //     box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
        //     scene.add( box );
        //     this.objects.push( box );
        // }

        var boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        boxGeometry = boxGeometry.toNonIndexed();
        var position = boxGeometry.attributes.position;
        var colors = [];
        for ( var i = 0, l = position.count; i < l; i ++ ) {
            color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            colors.push( color.r, color.g, color.b );
        }

        boxGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        
        var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
        boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        var box = new THREE.Mesh( boxGeometry, boxMaterial );
        box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
        box.position.y = 10;
        box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
        scene.add( box );
        this.objects.push( box );
        

        // model
        var loader = new THREE.FBXLoader();
        loader.load( '/models/fbx/Sphere.fbx', function ( object ) {
            // mixer = new THREE.AnimationMixer( object );
            // var action = mixer.clipAction( object.animations[ 0 ] );
            // action.play();

            object.traverse( function ( child ) {

                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            
            scene.add( object );

            object.position.x = 100;
            object.position.z = 100;
            object.scale.x = .5;
            object.scale.y = .5;
            object.scale.z = .5;
            console.log("test");
        } );
    
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
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

        instructions.addEventListener( 'click', () => {

            this.controls.lock();

        }, false );

        this.controls.addEventListener( 'lock', function () {

            instructions.style.display = 'none';
            blocker.style.display = 'none';

        } );

        this.controls.addEventListener( 'unlock', function () {

            blocker.style.display = 'block';
            instructions.style.display = '';

        } );

        main.appendChild(renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize, false );
    }


    onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate() {

        requestAnimationFrame( this.animate );

        if ( this.controls.isLocked === true ) {

            raycaster.ray.origin.copy( this.controls.getObject().position );
            raycaster.ray.origin.y -= 10;

            var intersections = raycaster.intersectObjects( this.objects );

            var onObject = intersections.length > 0;

            var time = performance.now();
            var delta = ( time - prevTime ) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveLeft ) - Number( moveRight );
            direction.normalize(); // this ensures consistent movements in all directions

            if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
            if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

            if ( onObject === true ) {

                velocity.y = Math.max( 0, velocity.y );
                canJump = true;

            }

            this.controls.getObject().translateX( velocity.x * delta );
            this.controls.getObject().translateY( velocity.y * delta );
            this.controls.getObject().translateZ( velocity.z * delta );

            // Stay grounded
            if ( this.controls.getObject().position.y < 10 ) {
                velocity.y = 0;
                this.controls.getObject().position.y = 10;
                canJump = true;
            }
            prevTime = time;
        }
        renderer.render( scene, camera );
    }
}

export {Scene};