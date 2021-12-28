var params = {

    color1: '#ffffff',
    color2: '#ffa000',
    color3: '#000000',
    colorBias: 0.8,
    burnRate: 0.35,
    diffuse: 1.33,
    viscosity: 0.25,
    expansion: - 0.25,
    swirl: 50.0,
    drag: 0.35,
    airSpeed: 12.0,
    windX: 0.0,
    windY: 0.75,
    speed: 500.0,
    massConservation: false

};

class Fire {

    constructor() {

        // this.plane = new THREE.CylinderBufferGeometry( 0, 1, 5, 12, 1, true, 0, 3 * Math.PI );
        this.plane = new THREE.PlaneBufferGeometry( 5, 20 );
        this.fire = new THREE.Fire( this.plane, {
            textureWidth: 512,
            textureHeight: 512,
            debug: false
        } );
        this.fire.material.side = THREE.DoubleSide;
    }

    single() {

        this.fire.clearSources();
        // this.addSource = function ( u, v, radius, density = null, windX = null, windY = null ) {

        // this.addSource( 0.5, 0.1, 0.1, 1.0, 0.0, 1.0 );
        this.fire.addSource( 0.5, 0.05, 0.07, 5, 0.0, 1.0 );



    };

    multiple() {

        this.fire.clearSources();
        this.fire.addSource( 0.45, 0.1, 0.1, 0.5, 0.0, 1.0 );
        this.fire.addSource( 0.55, 0.1, 0.1, 0.5, 0.0, 1.0 );

    };

    updateColor1( value ) {

        this.fire.color1.set( value );

    }

    updateColor2( value ) {

        this.fire.color2.set( value );

    }

    updateColor3( value ) {

        this.fire.color3.set( value );

    }

    updateColorBias( value ) {

        this.fire.colorBias = value;

    }

    updateBurnRate( value ) {

        this.fire.burnRate = value;

    }

    updateDiffuse( value ) {

        this.fire.diffuse = value;

    }

    updateViscosity( value ) {

        this.fire.viscosity = value;

    }

    updateExpansion( value ) {

        this.fire.expansion = value;

    }

    updateSwirl( value ) {

        this.fire.swirl = value;

    }

    updateDrag( value ) {

        this.fire.drag = value;

    }

    updateAirSpeed( value ) {

        this.fire.airSpeed = value;

    }

    updateWindX( value ) {

        this.fire.windVector.x = value;

    }

    updateWindY( value ) {

        this.fire.windVector.y = value;

    }

    updateSpeed( value ) {

        this.fire.speed = value;

    }

    updateMassConservation( value ) {

        this.fire.massConservation = value;

    }

    updateAll(params) {

        this.updateColor1( params.color1 );
        this.updateColor2( params.color2 );
        this.updateColor3( params.color3 );
        this.updateColorBias( params.colorBias );
        this.updateBurnRate( params.burnRate );
        this.updateDiffuse( params.diffuse );
        this.updateViscosity( params.viscosity );
        this.updateExpansion( params.expansion );
        this.updateSwirl( params.swirl );
        this.updateDrag( params.drag );
        this.updateAirSpeed( params.airSpeed );
        this.updateWindX( params.windX );
        this.updateWindY( params.windY );
        this.updateSpeed( params.speed );
        this.updateMassConservation( params.massConservation );

    }



    text() {

        var text = "Three JS";
        var size = 180;
        var color = "#FF0040";
        var canvas = document.createElement( "canvas" );
        canvas.width = 1024;
        canvas.height = 1024;
        var context = canvas.getContext( "2d" );
        context.font = size + "pt Arial";

        context.strokeStyle = "black";
        context.strokeRect( 0, 0, canvas.width, canvas.height );
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 5;
        context.strokeStyle = color;
        context.fillStyle = "black";

        context.strokeText( text, canvas.width / 2, canvas.height * 0.75 );
        var texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;

        this.fire.setSourceMap( texture );

    };
}



params.Candle = () => {

    params.color1 = 0xffffff;
    params.color2 = 0xffa000;
    params.color3 = 0x000000;
    params.windX = 0.0;
    params.windY = 0.5;
    params.colorBias = 0.3;
    params.burnRate = 1.6;
    params.diffuse = 1.33;
    params.viscosity = 1.33;
    params.expansion = 0.0;
    params.swirl = 0.0;
    params.drag = 0.0;
    params.airSpeed = 8.0;
    params.speed = 500.0;
    params.massConservation = false;

};

params.Torch = () => {

    params.color1 = 0xffdcaa;
    params.color2 = 0xffa000;
    params.color3 = 0x000000;
    params.windX = 0.0;
    params.windY = 0.75;
    params.colorBias = 0.9;
    params.burnRate = 1.0;
    params.diffuse = 1.33;
    params.viscosity = 0.25;
    params.expansion = 0.0;
    params.swirl = 50.0;
    params.drag = 0.35;
    params.airSpeed = 10.0;
    params.speed = 500.0;
    params.massConservation = false;

};

params.Campfire = () => {

    params.color1 = 0xffffff;
    params.color2 = 0xffa000;
    params.color3 = 0x000000;
    params.windX = 0.0;
    params.windY = 0.75;
    params.colorBias = 0.8;
    params.burnRate = 0.3;
    params.diffuse = 1.33;
    params.viscosity = 0.25;
    params.expansion = - 0.25;
    params.swirl = 50.0;
    params.drag = 0.35;
    params.airSpeed = 12.0;
    params.speed = 500.0;
    params.massConservation = false;

};

params.Fireball = () => {

    params.color1 = 0xffffff;
    params.color2 = 0xffa000;
    params.color3 = 0x000000;
    params.windX = 0.0;
    params.windY = 0.75;
    params.colorBias = 0.8;
    params.burnRate = 1.2;
    params.diffuse = 3.0;
    params.viscosity = 0.0;
    params.expansion = 0.0;
    params.swirl = 6.0;
    params.drag = 0.0;
    params.airSpeed = 20.0;
    params.speed = 500.0;
    params.massConservation = false;

};

params.Iceball = () => {

    params.color1 = 0x00bdf7;
    params.color2 = 0x1b3fb6;
    params.color3 = 0x001869;
    params.windX = 0.0;
    params.windY = - 0.25;
    params.colorBias = 0.25;
    params.burnRate = 2.6;
    params.diffuse = 5.0;
    params.viscosity = 0.5;
    params.expansion = 0.75;
    params.swirl = 30.0;
    params.drag = 0.0;
    params.airSpeed = 40.0;
    params.speed = 500.0;
    params.massConservation = false;

};

params.Smoke = () => {

    params.color1 = 0xd2d2d2;
    params.color2 = 0xd7d7d7;
    params.color3 = 0x000000;
    params.windX = - 0.05;
    params.windY = 0.15;
    params.colorBias = 0.95;
    params.burnRate = 0.0;
    params.diffuse = 1.5;
    params.viscosity = 0.25;
    params.expansion = 0.2;
    params.swirl = 3.75;
    params.drag = 0.4;
    params.airSpeed = 18.0;
    params.speed = 500.0;
    params.massConservation = false;

};

params.Cigar = () => {

    params.color1 = 0xc5c5c5;
    params.color2 = 0x787878;
    params.color3 = 0x000000;
    params.windX = 0.0;
    params.windY = 0.3;
    params.colorBias = 0.55;
    params.burnRate = 0.0;
    params.diffuse = 1.3;
    params.viscosity = 0.05;
    params.expansion = - 0.05;
    params.swirl = 3.7;
    params.drag = 0.6;
    params.airSpeed = 6.0;
    params.speed = 500.0;
    params.massConservation = false;

};



export { Fire, params };