export const Potions = {
  bluepotion: {
    name: "bluepotion",
    gltf: "bluepotion.glb",
    image: "bluepotion.png",
    description: "A glowing blue mana potion",
    type: "item",
    attributes: {
      animates: false,
      scale: 5,
      elevation: 10,
      effect: "mana/2",
      sprites: [
        {
          name: "heal",
          regex: "",
          frames: 10,
          scale: 50,
          elevation: 30,
          flip: false,
          time: 3
        }
      ]
    }
  },
  greenpotion: {
    name: "greenpotion",
    gltf: "greenpotion.glb",
    image: "greenpotion.png",
    description: "A bubbling green potion",
    type: "item",
    attributes: {
      animates: false,
      throwable: true,
      throwableAttributes: {
        pitch: 0.7, // angle up (percentage of 90 degrees)
        weight: 2, // lbs
        distance: 700, // px
        speed: 4 // 1 = full walking speed
      },
      scale: 5,
      equippedScale: 0.005,
      elevation: 10,
      effect: "poisonDamage/3",
      range: 40,
      sprites: [
        {
          name: "greenExplosion",
          regex: "",
          frames: 10,
          scale: 300,
          elevation: 30,
          flip: false,
          time: 3
        }
      ]
    }
  },
  redpotion: {
    name: "redpotion",
    gltf: "redpotion.glb",
    image: "redpotion.png",
    description: "A gleaming red life potion",
    type: "item",
    attributes: {
      animates: false,
      scale: 5,
      elevation: 10,
      effect: "health/2",
      sprites: [
        {
          name: "Heal",
          regex: "",
          frames: 15,
          scale: 50,
          elevation: 30,
          flip: false,
          time: 1
        }
      ]
    }
  },
  blackpotion: {
    name: "blackpotion",
    gltf: "greenpotion.glb",
    image: "greenpotion.png",
    description: "A bubbling black potion",
    type: "item",
    attributes: {
      animates: false,
      throwable: true,
      throwableAttributes: {
        pitch: 0.7, // angle up (percentage of 90 degrees)
        weight: 2, // lbs
        distance: 700, // px
        speed: 4 // 1 = full walking speed
      },
      scale: 5,
      equippedScale: 0.005,
      elevation: 10,
      effect: "thunderDamage/3",
      range: 40,
      sprites: [
        {
          name: "hitEffect",
          regex: "",
          frames: 9,
          scale: 1200,
          elevation: 30,
          flip: false,
          time: 3
        },
        {
          name: "Heal",
          regex: "",
          frames: 15,
          scale: 500,
          elevation: 30,
          flip: false,
          time: 3
        }
      ]
    }
  }
};
