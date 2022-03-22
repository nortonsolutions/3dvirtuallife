export const Platforms = {
  platformWood: {
    name: "platformWood",
    gltf: "platformWood.glb",
    description: "Platform",
    type: "structure",
    attributes: {
      scale: 100,
      elevation: 0
    }
  },

  platformBlock: {
    name: "platformBlock",
    gltf: "platformBlock.glb",
    description: "Platform",
    type: "structure",
    attributes: {
      scale: 100,
      elevation: 0
    }
  },

  elevatorL_1m: {
    name: "elevatorL_1m",
    gltf: "elevatorL_1m.glb",
    description: "Elevator",
    type: "structure",
    subtype: "shelter",
    attributes: {
      animates: true,
      scale: 200,
      elevation: 0,
      position: "down"
    }
  },

  elevatorS_1m: {
    name: "elevatorS_1m",
    gltf: "elevatorS_1m.glb",
    description: "Elevator",
    type: "structure",
    subtype: "shelter",
    attributes: {
      animates: true,
      scale: 200,
      elevation: 0,
      position: "down"
    }
  },

  elevatorL_4m: {
    name: "elevatorL_4m",
    gltf: "elevatorL_4m.glb",
    description: "Elevator",
    type: "structure",
    subtype: "shelter",
    attributes: {
      animates: true,
      scale: 200,
      elevation: -5,
      position: "down"
    }
  },

  elevatorS_4m: {
    name: "elevatorS_4m",
    gltf: "elevatorS_4m.glb",
    description: "Elevator",
    type: "structure",
    subtype: "shelter",
    attributes: {
      animates: true,
      scale: 200,
      elevation: -5,
      position: "down"
    }
  },

  elevatorL_6m: {
    name: "elevatorL_6m",
    gltf: "elevatorL_6m.glb",
    description: "Elevator",
    type: "structure",
    subtype: "shelter",
    attributes: {
      animates: true,
      scale: 200,
      elevation: -5,
      position: "down"
    }
  },

  elevatorS_6m: {
    name: "elevatorS_6m",
    gltf: "elevatorS_6m.glb",
    description: "Elevator",
    type: "structure",
    subtype: "shelter",
    attributes: {
      animates: true,
      scale: 200,
      elevation: -5,
      position: "down"
    }
  },

  ricketyPlatform: {
    name: "ricketyPlatform",
    gltf: "ricketyPlatform.glb",
    description: "Rickety Platform",
    type: "structure",
    attributes: {
      animates: false,
      scale: 30,
      elevation: 0
    }
  },

  portal: {
    name: "portal",
    gltf: "portal.glb",
    description: "Portal",
    type: "structure",
    attributes: {
      visible: false,
      animates: false,
      scale: 40,
      elevation: 0
    }
  },

  portalStone: {
    name: "portalStone",
    gltf: "platformBlock.glb",
    description: "Portal",
    type: "structure",
    attributes: {
      visible: false,
      animates: false,
      scale: 40,
      elevation: 0
    }
  },

  archway: {
    name: "archway",
    gltf: "archway.gltf",
    description: "Dark gothic archway",
    type: "structure",
    attributes: {
      animates: false,
      scale: 100,
      elevation: 1
    }
  },

  swordRoom: {
    name: "swordRoom",
    gltf: "swordRoom.glb",
    description: "Sword Room",
    type: "structure",
    attributes: {
      transparentWindows: false,
      animates: false,
      scale: 7,
      elevation: 40,
      // staticStartingElevation: true,
      rotateY: 90
    }
  },

  bridge: {
    name: "bridge",
    gltf: "bridge.glb",
    description: "Sturdy bridge",
    type: "structure",
    attributes: {
      transparentWindows: true,
      animates: false,
      scale: 120,
      elevation: -90
    }
  },

  firesteedAltar: {
    name: "firesteedAltar",
    gltf: "firesteedAltar.glb",
    description: "Strange altar in the lava field",
    type: "structure",
    attributes: {
      scale: 100,
      elevation: 0,
      sprites: [
        {
          name: "flame2",
          regex: "sconce",
          frames: 16,
          scale: 2.5,
          elevation: -0.5,
          flip: false,
          animates: true,
          showOnSeed: false
        }
      ],
      keyCode: "firesteedAltar",
      sealed: true,
      releases: "fireSteed"
    }
  }
};
