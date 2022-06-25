export const Spells = {
    healSpell: {
        name: 'healSpell',
        gltf: 'redpotion.glb',
        image: 'healSpell.png',
        description: 'A spell to increase health',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "health/2",
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
    },
    healAllSpell: {
        name: 'healAllSpell',
        gltf: 'redpotion.glb',
        image: 'healAllSpell.png',
        description: 'A spell to increase health of all surrounding friendlies',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "health/2",
            affectAllInParty: true,      
            range: 800,      
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 3
            }]
        }
    },
    poisonSpell: {
        name: 'poisonSpell',
        gltf: 'greenpotion.glb',
        image: 'poisonSpell.png',
        description: 'A spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "poisonDamage/3",
            range: 80,
            sprites: [{ 
                name: "greenExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
    },
    poisonProjectileSpell: {
        name: 'poisonProjectileSpell',
        gltf: 'greenpotion.glb',
        image: 'poisonProjectileSpell.png',
        description: 'A projectile spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "poisonDamage/3",
            range: 80,
            animates: false,
            scale: .5,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [
            { 
                name: "greencloud",
                regex: "",
                frames: 8,
                scale: 300,
                elevation: 20,
                flip: false,
                time: 1
            },
            // { 
            //     name: "greenExplosion",
            //     regex: "",
            //     frames: 10,
            //     scale: 300,
            //     elevation: 20,
            //     flip: false,
            //     time: 1
            // },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 20,
                flip: false,
                time: 1
            }]
        }
    },
    rockProjectileSpell: {
        name: 'rockProjectileSpell',
        gltf: 'iron.glb',
        image: 'iron.png',
        description: 'A rock projectile spell',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "generalDamage/2",
            range: 30,
            animates: false,
            scale: 1000,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .75, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "rock1",
                regex: "",
                frames: 8,
                scale: .05,
                elevation: 0,
                flip: false,
                time: 1
            }]
        }
    },
    fireProjectileSpell: {
        name: 'fireProjectileSpell',
        gltf: 'redpotion.glb',
        image: 'fireProjectileSpell.png',
        description: 'A projectile spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "fireDamage/2",
            range: 40,
            animates: false,
            scale: .5,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 2 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "orangeExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 20,
                flip: false,
                time: 1
            },
            // { 
            //     name: "fireball",
            //     regex: "",
            //     frames: 8,
            //     scale: 300,
            //     elevation: 20,
            //     flip: false,
            //     time: 1
            // },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 20,
                flip: false,
                time: 1
            }]
        }
    },
    fireSpell: {
        name: 'fireSpell',
        gltf: 'redpotion.glb',
        image: 'fireSpell.png',
        description: 'A projectile spell to inflict fire damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "fireDamage/3",
            range: 60,
            animates: false,
            scale: .5,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "reddeath",
                regex: "",
                frames: 8,
                scale: 300,
                elevation: 20,
                flip: false,
                time: 1
            },
            // { 
            //     name: "fireball",
            //     regex: "",
            //     frames: 8,
            //     scale: 300,
            //     elevation: 20,
            //     flip: false,
            //     time: 1
            // },
            { 
                name: "hit2",
                regex: "",
                frames: 15,
                scale: 8,
                elevation: 20,
                flip: false,
                time: 1
            }]
        }
    },
    iceProjectileSpell: {
        name: 'iceProjectileSpell',
        gltf: 'bluepotion.glb',
        image: 'iceProjectileSpell.png',
        description: 'A projectile spell to inflict ice damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "iceDamage/3",
            range: 90,
            animates: false,
            scale: .5,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "blueExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 20,
                flip: false,
                time: 1
            },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 20,
                flip: false,
                time: 1
            }]
        }
    },
    lightningBoltSpell: {
        name: 'lightningBoltSpell',
        gltf: 'lightningBolt.glb',
        image: 'lightningBolt.png',
        description: 'A projectile bolt to inflict thunder damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "thunderDamage/3",
            range: 100,
            animates: true,
            scale: 10,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 10,
                scale: 50,
                elevation: 10,
                flip: false,
                time: 1
            }]
        }
    }
}