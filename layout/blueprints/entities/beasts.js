export const Beasts = {
  evilOne: {
    name: "evilOne",
    gltf: "boy.glb",
    description: "An autonomous machine with no apparent motive",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 20,
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "2/2/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "1/1/0",
        thunder: "0/0/0"
      },
      grants: ["gold3"]
    }
  },
  lavaMan: {
    name: "lavaMan",
    gltf: "lavaMan.glb",
    description: "Lava man",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 80,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 100,
      stats: {
        health: "5/5/0",
        mana: "0/0/0",
        strength: "4/4/0",
        agility: "2/2/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "5/5/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["gold25"]
    }
  },

  rockyMan: {
    name: "rockyMan",
    gltf: "rockyMan.glb",
    description: "Rocky man",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 100,
      stats: {
        health: "5/5/0",
        mana: "0/0/0",
        strength: "4/4/0",
        agility: "2/2/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["gold25"],
      rangedSpell: "rockProjectileSpell"
    }
  },

  crystalMan: {
    name: "crystalMan",
    gltf: "crystalMan.glb",
    description: "Crystal man",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 80,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 100,
      stats: {
        health: "5/5/0",
        mana: "0/0/0",
        strength: "4/4/0",
        agility: "2/2/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "1/1/0",
        ice: "1/1/0",
        poison: "1/1/0",
        thunder: "1/1/0"
      },
      grants: ["gold25"]
    }
  },

  rat: {
    name: "rat",
    gltf: "rat.glb",
    description: "A rat with fire in its eyes; ready to attack",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 10,
      length: 80,
      width: 20,
      elevation: 0,
      scale: 60,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["gold10"]
    }
  },
  
  crocodile: {
    name: "crocodile",
    gltf: "crocodile.glb",
    description: "Slithering crocodile",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      swims: true,
      height: 10,
      length: 80,
      width: 20,
      elevation: 0,
      scale: 10,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "2/2/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["dragonPelt"]
    }
  },

  catFish: {
    name: "catFish",
    gltf: "catFish.glb",
    image: "catFish.png",
    description: "Gangly catfish",
    type: "beast",
    subtype: "fish",
    attributes: {
      moves: true,
      animates: true,
      swims: true,
      docile: true,
      catchable: true,
      movementRadius: 100,
      height: 10,
      length: 30,
      width: 20,
      elevation: 0,
      scale: 5,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "2/2/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
    }
  },

  carp: {
    name: "carp",
    gltf: "carp.glb",
    image: "carp.png",
    description: "Slimy carp",
    type: "beast",
    subtype: "fish",
    attributes: {
      moves: true,
      animates: true,
      swims: true,
      docile: true,
      catchable: true,
      movementRadius: 100,
      height: 10,
      length: 30,
      width: 20,
      elevation: 0,
      scale: 5,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "2/2/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
    }
  },

  dragon: {
    name: "dragon",
    gltf: "dragon.glb",
    description: "Dragon",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 10,
      length: 120,
      width: 20,
      elevation: 0,
      scale: 60,
      stats: {
        health: "4/4/0",
        mana: "60/60/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "5/5/0",
        ice: "1/1/0",
        poison: "1/1/0",
        thunder: "0/0/0"
      },
      grants: ["dragonPelt", "food"],
      rangedSpell: "fireProjectileSpell"
    }
  },

  triceratops: {
    name: "triceratops",
    gltf: "triceratops.glb",
    description: "Triceratops",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 10,
      length: 100,
      width: 20,
      elevation: 0,
      scale: 25,
      stats: {
        health: "4/4/0",
        mana: "60/60/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "4/4/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["dragonPelt", "food"]
    }
  },

  trex: {
    name: "trex",
    gltf: "trex.glb",
    description: "Tyranosaurus Rex",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 50,
      length: 40,
      width: 20,
      elevation: 0,
      scale: 200,
      stats: {
        health: "4/4/0",
        mana: "60/60/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "5/5/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "2/2/0"
      },
      grants: ["dragonPelt", "food"],
    }
  },
  
  daveDragon: {
    name: "daveDragon",
    gltf: "daveDragon.glb",
    description: "Huge Dragon",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 10,
      length: 300,
      width: 20,
      elevation: 0,
      scale: 50,
      stats: {
        health: "4/4/0",
        mana: "60/60/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "7/7/0", // rock, weapon, arrow damage defense
        fire: "7/7/0",
        ice: "0/0/0",
        poison: "7/7/0",
        thunder: "3/3/0"
      },
      grants: ["dragonPelt", "food"],
      rangedSpell: "fireProjectileSpell"
    }
  },

  bat: {
    name: "bat",
    gltf: "bat.glb",
    description: "A bat",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 10,
      length: 80,
      width: 20,
      elevation: 0,
      scale: 5,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["gold10"]
    }
  },

  murderBear: {
    name: "murderBear",
    gltf: "murderBear.glb",
    description: "Crazy yet agile man dressed in a bear suit",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "2/2/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "2/2/0"
      },
      grants: ["gold10", "katana"]
    }
  },

  zombie: {
    name: "zombie",
    gltf: "zombie.glb",
    description: "Zombie",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["gold10"]
    }
  },

  ghoul: {
    name: "ghoul",
    gltf: "ghoul.glb",
    description: "Menacing ghoul",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "2/2/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["gold10"]
      // rangedSpell: 'poisonProjectileSpell'
    }
  },

  lavaGhoul: {
    name: "lavaGhoul",
    gltf: "lavaGhoul.glb",
    description: "Menacing red lava ghoul",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 600,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "5/5/0",
        ice: "0/0/0",
        poison: "1/1/0",
        thunder: "0/0/0"
      },
      grants: ["gold10"],
      rangedSpell: "fireProjectileSpell"
    }
  },

  shockGhoul: {
    name: "shockGhoul",
    gltf: "shockGhoul.glb",
    description: "Menacing blue shock ghoul",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 600,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "1/1/0",
        thunder: "5/5/0"
      },
      grants: ["gold10"],
      rangedSpell: "lightningBoltSpell"
    }
  },

  iceGhoul: {
    name: "iceGhoul",
    gltf: "iceGhoul.glb",
    description: "Menacing ice ghoul",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 600,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "5/5/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      grants: ["gold10"],
      rangedSpell: "iceProjectileSpell"
    }
  },

  ghostGhoul: {
    name: "ghostGhoul",
    gltf: "ghostGhoul.glb",
    description: "Menacing ghost ghoul",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 600,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "1/1/0",
        ice: "1/1/0",
        poison: "1/1/0",
        thunder: "5/5/0"
      },
      grants: ["gold10"],
      rangedSpell: "lightningBoltSpell"
    }
  },

  gasGhoul: {
    name: "gasGhoul",
    gltf: "gasGhoul.glb",
    description: "Menacing gas ghoul",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      length: 20,
      width: 20,
      elevation: 600,
      scale: 15,
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "3/3/0",
        defense: "1/1/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "5/5/0",
        thunder: "0/0/0"
      },
      grants: ["gold10"],
      rangedSpell: "poisonProjectileSpell"
    }
  },

  demonLord: {
    name: "demonLord",
    gltf: "demonLord.glb",
    description: "A deadly demon Lord",
    type: "beast",
    attributes: {
      moves: true,
      animates: true,
      height: 50,
      length: 80,
      width: 80,
      elevation: 0,
      scale: 20,
      stats: {
        health: "10/10/0",
        mana: "0/0/0",
        strength: "10/10/0",
        agility: "3/3/0",
        defense: "6/6/6", // rock, weapon, arrow damage defense
        fire: "6/6/6",
        ice: "0/0/0",
        poison: "6/6/6",
        thunder: "0/0/0"
      },
      grants: ["keyToChest2"],
      rangedSpell: "fireProjectileSpell"
    }
  }
};
