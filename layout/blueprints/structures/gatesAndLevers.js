export const GatesAndLevers = {
    
  grate: {
    name: "grate",
    gltf: "grate.gltf",
    description: "Rusty iron grate",
    type: "structure",
    attributes: {
      defaultSingleAction: true,
      timeScale: 0.1,
      animates: true,
      key: "keyToShed",
      scale: 100,
      elevation: 0,
      locked: true,
      direction: "down"
    }
  },

  kingdomGate: {
    name: "kingdomGate",
    gltf: "kingdomGate.glb",
    description: "Large Gate",
    type: "structure",
    attributes: {
      animates: true,
      scale: 200,
      elevation: 0,
      key: "passphrase", // switch to passphrase
      locked: true, // lock and require password
      direction: "down"
    }
  },

  lever: {
    name: "lever",
    gltf: "lever.glb",
    description: "Control switch",
    type: "structure",
    attributes: {
      defaultSingleAction: true,
      animates: true,
      scale: 100,
      elevation: 0,
      direction: "down"
    }
  },

  leverTristate: {
    name: "leverTristate",
    gltf: "leverTristate.glb",
    description: "Tristate Control switch",
    type: "structure",
    attributes: {
      animates: true,
      scale: 100,
      elevation: 0,
      direction: "middle"
    }
  }
};
