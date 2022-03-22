// stats: {
//     health: "3/5/0",  // min/max/boost
//     mana: "2/2/0",
//     strength: "1/1/0",
//     agility: "2/2/0",
//     defense: "0/0/0", // rock, weapon, arrow damage defense
//     fire: "0/0/0",
//     ice: "0/0/0",
//     poison: "0/0/0",
//     thunder: "0/0/0"
// },

export const baselineHeroTemplates = [

    {
        class: "Class A Bot",
        gltf: "robot.glb",
        png: "robot.png",
        attributes: {
            stats: {
                agility: "4/4/0",
                defense: "1/1/0"
            }
        },
        description: "Advanced agility and good defense."
    },
    {
        class: "Mano Bot",
        gltf: "robot_blue.glb",
        png: "robot_blue.png",
        attributes: {
            stats: {
                mana: "4/4/0",
                health: "4/6/0"
            }
        },
        description: "Advanced intelligence (mana) and higher health."
    },
    {
        class: "Vi Bot",
        gltf: "gamebot.glb",
        png: "gamebot.png",
        attributes: {
            scale: 5,
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                strength: "3/3/0",
                defense: "1/1/0"
            }
        },
        description: "Advanced strength and good defense."
    },
    {
        class: "Jango Bot",
        gltf: "gamebot2.glb",
        png: "gamebot2.png",
        attributes: {
            scale: 5,
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                strength: "2/2/0",
                agility: "3/3/0"
            }
        },
        description: "Good strength and agility."
    },
    {
        class: "Slavo Bot",
        gltf: "gamebot3.glb",
        png: "gamebot3.png",
        attributes: {
            scale: 5,
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                strength: "2/2/0",
                mana: "3/3/0"
            }
        },
        description: "Good strength and intelligence."
    },
    {
        class: "Asi Bot",
        gltf: "gamebot4.glb",
        png: "gamebot4.png",
        attributes: {
            scale: 5,
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                health: "5/7/0",
                agility: "3/3/0"
            }
        },
        description: "Good health and agility."
    },
    {
        class: "Roma Bot",
        gltf: "gamebot5.glb",
        png: "gamebot5.png",
        attributes: {
            scale: 5,
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                health: "5/7/0",
                mana: "3/3/0"
            }
        },
        description: "Good health and intelligence."
    },
    {
        class: "Arma Bot",
        gltf: "gamebot6.glb",
        png: "gamebot6.png",
        attributes: {
            scale: 5,
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                health: "5/7/0",
                defense: "2/2/0"
            }
        },
        description: "Good health and defense."
    },
    {
        class: "Tro Bot",
        gltf: "gamebot7.glb",
        png: "gamebot7.png",
        attributes: {
            scale: 5,
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                health: "4/5/0",
                mana: "3/3/0",
                agility: "3/3/0",
                defense: "1/1/0"
            }
        },
        description: "Well-balanced."
    }


]