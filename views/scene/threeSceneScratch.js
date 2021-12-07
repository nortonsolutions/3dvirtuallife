var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer( { antialias: true } );

scene.background = new THREE.Color( 0x000000 );
scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

var orbit = new THREE.OrbitControls( camera, renderer.domElement );
orbit.enableZoom = true;

// LIGHTS
var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 10, 0 );
lights[ 1 ].position.set( 10, 20, 10 );
lights[ 2 ].position.set( - 10, - 20, - 10 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// TEXTURE
var texture = new THREE.TextureLoader().load('../textures/cracks.png')

// CUBE
var boxGeometry = new THREE.BoxGeometry( 8, 8, 8);
// var boxMaterial = new THREE.MeshBasicMaterial( { map: texture } );
var boxMaterial = new THREE.MeshPhongMaterial( {
     map: texture, emissive: 0x072534, 
     side: THREE.DoubleSide, flatShading: true } );
var mesh = new THREE.Mesh( boxGeometry, boxMaterial );
scene.add(mesh);

// LINE
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var line = new THREE.Line( geometry, lineMaterial );
scene.add(line);


// PLANE
var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 10000, 10000 ),
    new THREE.MeshPhongMaterial( { color: 0xffffff, opacity: 0.4, transparent: true } )
);

plane.position.z = 0;
// plane.rotation.x;
scene.add( plane );

// camera.position.z = 5;
camera.position.z = 20;
camera.lookAt( 0, 0, 0 );


function animate() {
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
}

if ( WEBGL.isWebGLAvailable() ) {
	// Initiate function or other initializations here
	animate();
} else {
	var warning = WEBGL.getWebGLErrorMessage();
	document.body.appendChild( warning );
}
