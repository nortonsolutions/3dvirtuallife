export const Elementals = {
  water: {
    name: "water",
    gltf: "watercan.glb",
    image: "waterDroplet.png",
    description: "water",
    type: "item",
    subtype: "lifegiving",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 0.001,
      equippedScale: 0.001,
      throwable: true,
      throwableAttributes: {
        pitch: 0.7, // angle up (percentage of 90 degrees)
        weight: 4, // lbs
        distance: 700, // px
        speed: 1 // 1 = full walking speed
      },
      elevation: 10,
      effect: "health/.5",
      range: 100,
      continuousSprites: true,
      sprites: [
        {
          name: "blueExplosion",
          regex: "",
          frames: 10,
          scale: 200,
          flip: false,
          elevation: 40,
          time: 2
        }
      ]
    }
  },
  aluminium: {
    name: "aluminium",
    gltf: "aluminium.glb",
    image: "aluminium.png",
    description: "Aluminium",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  chromium: {
    name: "chromium",
    gltf: "chromium.glb",
    image: "chromium.png",
    description: "Chromium",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  copper: {
    name: "copper",
    gltf: "copper.glb",
    image: "copper.png",
    description: "Copper",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  iron: {
    name: "iron",
    gltf: "iron.glb",
    image: "iron.png",
    description: "Iron",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  manganese: {
    name: "manganese",
    gltf: "manganese.glb",
    image: "manganese.png",
    description: "Manganese",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  molybdenum: {
    name: "molybdenum",
    gltf: "molybdenum.glb",
    image: "molybdenum.png",
    description: "Molybdenum",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  platinum: {
    name: "platinum",
    gltf: "platinum.glb",
    image: "platinum.png",
    description: "Platinum",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  rhenium: {
    name: "rhenium",
    gltf: "rhenium.glb",
    image: "rhenium.png",
    description: "Rhenium",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  ruthenium: {
    name: "ruthenium",
    gltf: "ruthenium.glb",
    image: "ruthenium.png",
    description: "Ruthenium",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  silver: {
    name: "silver",
    gltf: "silver.glb",
    image: "silver.png",
    description: "Silver",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  titanium: {
    name: "titanium",
    gltf: "titanium.glb",
    image: "titanium.png",
    description: "Titanium",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },
  wolfram: {
    name: "wolfram",
    gltf: "wolfram.glb",
    image: "wolfram.png",
    description: "Wolfram",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 400,
      elevation: 20
    }
  },

  gold: {
    name: "gold",
    gltf: "gold1.glb",
    image: "gold.png",
    description: "Gold",
    type: "item",
    attributes: {
      value: 1, // in gold
      animates: false,
      scale: 100,
      elevation: 20
    }
  },
  gold1: {
    name: "gold1",
    gltf: "gold1.glb",
    description: "One perfect gold coin",
    type: "item",
    attributes: {
      baseItemName: "gold",
      quantity: 1,
      animates: false,
      scale: 100,
      elevation: 20
    }
  },
  gold3: {
    name: "gold3",
    gltf: "gold3.glb",
    description: "Three gold coins",
    type: "item",
    attributes: {
      baseItemName: "gold",
      quantity: 3,
      animates: false,
      scale: 100,
      elevation: 20
    }
  },
  gold10: {
    name: "gold10",
    gltf: "gold10.glb",
    description: "Ten gold coins",
    type: "item",
    attributes: {
      baseItemName: "gold",
      quantity: 10,
      animates: false,
      scale: 100,
      elevation: 20
    }
  },
  gold25: {
    name: "gold25",
    gltf: "gold25.glb",
    description: "Twenty-five gold coins",
    type: "item",
    attributes: {
      baseItemName: "gold",
      quantity: 25,
      animates: false,
      scale: 100,
      elevation: 20
    }
  }
};
