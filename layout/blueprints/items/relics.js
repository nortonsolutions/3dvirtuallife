export const Relics = {
  rosenRelic: {
    name: "rosenRelic",
    gltf: "rosenRelic.glb",
    image: "rosenRelic.png",
    description: "A mystical figurine....",
    type: "item",
    attributes: {
      animates: false,
      scale: 10,
      elevation: 20
    }
  },

  bagOfGems: {
    name: "bagOfGems",
    gltf: "bagOfGems.glb",
    image: "bagOfGems.png",
    description: "A small velvet bag full of gems",
    type: "item",
    attributes: {
      value: 30, // in gold
      animates: false,
      scale: 100,
      elevation: 10
    }
  },

  crystalBall: {
    name: "crystalBall",
    gltf: "crystalball.glb",
    image: "crystalBall.png",
    description: "A gleaming ball of crystal",
    type: "item",
    attributes: {
      equippable: ["mount"],
      animates: false,
      scale: 50,
      elevation: 30,
      effect: "mana/2"
    }
  },
  orb: {
    name: "orb",
    gltf: "orb.glb",
    image: "orb.png",
    description: "Gyrating elements in a sphere",
    type: "item",
    attributes: {
      equippable: ["mount"],
      animates: true,
      scale: 50,
      elevation: 30,
      effect: "mana/2",
      animatesRecurring: true
    }
  }
};
