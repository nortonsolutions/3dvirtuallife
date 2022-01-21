export const Spells = {
    healSpell: {
        name: 'healSpell',
        gltf: 'redpotion.glb',
        image: 'spell_heal.png',
        description: 'A spell to increase health',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "health/2",
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 10,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
    },
    poisonSpell: {
        name: 'poisonSpell',
        gltf: 'greenpotion.glb',
        image: 'spell_poison.png',
        description: 'A spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "damage/3",
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
    }
}