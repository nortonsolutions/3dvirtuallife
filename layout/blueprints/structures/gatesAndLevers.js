export const GatesAndLevers = {
    
  grate: {
    name: "grate",
    gltf: "grate.gltf",
    description: "Rusty iron grate",
    type: "structure",
    attributes: {
      defaultSingleAction: true,
      animates: true,
      key: "keyToShed",
      scale: 100,
      elevation: 0,
      locked: true,
      position: "down"
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
      position: "down"
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
      position: "down"
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
      position: "middle"
    }
  }
};
