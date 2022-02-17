export const baselineHeroTemplates = [

    {
        type: "Ranger",
        gltf: "robot.glb",
        png: "robot.png",
        attributes: {
            stats: {
                agility: "5/5/0"
            }
        },
        description: "Above-average agility."
    },
    {
        type: "Mage",
        gltf: "robot_blue.glb",
        png: "robot_blue.png",
        attributes: {
            stats: {
                mana: "4/4/0"
            }
        },
        description: "Above-average intelligence (mana)."
    },
    {
        type: "Rosen",
        gltf: "rosen.glb",
        png: "robot2.png",
        attributes: {
            handScaleFactor: 50,
            stats: {
                agility: "1/1/0",
                strength: "2/2/0"
            }
        },
        description: "Above-average strength, slower agility."
    },
    {
        type: "RodBot",
        gltf: "rodbot.glb",
        png: "rodbot.png",
        attributes: {
            handScaleFactor: 50,
            flipWeapon: true,
            stats: {
                strength: "2/2/0",
                
            }
        },
        description: "Above-average strength."
    }

]