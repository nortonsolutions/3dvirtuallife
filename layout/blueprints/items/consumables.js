export const Consumables = {
  bait: {
    name: "bait",
    gltf: "worm.glb",
    image: "worm.png",
    description: "nightcrawler bait",
    type: "item",
    subtype: "bait",
    attributes: {
      animates: false,
      scale: 2,
      equippedScale: 0.3,
      throwable: true,
      throwableAttributes: {
        pitch: 0.7, // angle up (percentage of 90 degrees)
        weight: 2, // lbs
        distance: 2000, // px
        speed: 4 // 1 = full walking speed
      },
      elevation: 10,
      range: 50
      // continuousSprites: true,
      // sprites: [{
      //     name: "blueExplosion",
      //     regex: "",
      //     frames: 10,
      //     scale: 2,
      //     flip: false,
      //     elevation: 0,
      //     time: 2
      // }],
    }
  },

  bait25: {
    name: "bait25",
    gltf: "worm.glb",
    image: "worm.png",
    description: "Twenty-five nightcrawlers",
    type: "item",
    attributes: {
      baseItemName: "bait",
      quantity: 25,
      animates: false,
      scale: 2,
      elevation: 10
    }
  },

  bait10: {
    name: "bait10",
    gltf: "worm.glb",
    description: "Ten nightcrawlers",
    type: "item",
    attributes: {
      baseItemName: "bait",
      quantity: 25,
      animates: false,
      scale: 2,
      elevation: 10
    }
  },

  bait3: {
    name: "bait3",
    gltf: "worm.glb",
    description: "Three nightcrawlers",
    type: "item",
    attributes: {
      baseItemName: "bait",
      quantity: 25,
      animates: false,
      scale: 2,
      elevation: 10
    }
  },

  bait1: {
    name: "bait1",
    gltf: "worm.glb",
    description: "One nightcrawler",
    type: "item",
    attributes: {
      baseItemName: "bait",
      quantity: 25,
      animates: false,
      scale: 2,
      elevation: 10
    }
  },

  food: {
    name: "food",
    gltf: "food.glb",
    image: "food.png",
    description: "Food",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 5,
      elevation: 20
    }
  },

  animalPelt: {
    name: "animalPelt",
    gltf: "leopardskin.glb",
    image: "leopardskin.png",
    description: "Animal pelt",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 5,
      elevation: 20
    }
  },

  dragonPelt: {
    name: "dragonPelt",
    gltf: "animalskin.glb",
    image: "animalskin.png",
    description: "Dragon pelt",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 5,
      elevation: 20
    }
  },

  masterDragonPelt: {
    name: "masterDragonPelt",
    gltf: "animalskin.glb",
    image: "animalskin.png",
    description: "Master Dragon pelt",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 5,
      elevation: 20
    }
  },

  mushroom: {   
    name: 'mushroom',
    gltf: 'mushroom.glb',
    image: 'mushroom.png',
    description: 'A mysterious mushroom',
    type: 'item',
    attributes: {
        animates: false,
        scale: 100,
        elevation: 10,
        effect: "scale/1.5",
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
  
  sunFruit: {   
    name: 'sunFruit',
    gltf: 'sunFruit.glb',
    image: 'sunFruit.png',
    description: 'Beautiful white fruit',
    type: 'item',
    attributes: {
        animates: false,
        scale: 3,
        elevation: 0,
        effect: "health/3",
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
  }
}
