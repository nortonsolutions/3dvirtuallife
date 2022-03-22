export const Tools = {
  torch: {
    name: "torch",
    gltf: "torch.glb",
    image: "torch.png",
    description: "A simple wooden torch",
    type: "item",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 5,
      effect: "light/15",
      sprites: [
        {
          name: "flame2",
          frames: 16,
          scale: 0.05,
          scaleY: 1.5,
          translateZ: -0.3,
          flip: false,
          showOnSeed: false,
          showOnEquip: true,
          elevation: 0
        }
      ]
    }
  },
  watercan: {
    name: "watercan",
    gltf: "watercan.glb",
    image: "watercan.png",
    description: "Sturdy watering can",
    type: "item",
    subtype: "launcher",
    attributes: {
      waters: true,
      animates: false,
      scale: 100,
      equippedScale: 0.1,
      elevation: 0,
      throwable: false,
      throws: "water",
      full: 0
    }
  },
  miningHammer: {
    name: "miningHammer",
    gltf: "miningHammer.glb",
    image: "miningHammer.png",
    description: "Sturdy mining hammer",
    type: "item",
    subtype: "miningTool",
    attributes: {
      animates: false,
      scale: 100,
      equippedScale: 0.1,
      elevation: 0
    }
  },

  miningPickAxe: {
    name: "miningPickAxe",
    gltf: "pickAxe.glb",
    image: "pickAxe.png",
    description: "Strong pickaxe",
    type: "item",
    subtype: "miningTool",
    attributes: {
      animates: false,
      scale: 3,
      equippedScale: 0.003,
      elevation: 0
    }
  },

  fishingPole: {
    name: "fishingPole",
    gltf: "fishingPole.glb",
    image: "fishingPole.png",
    description: "Fishing pole",
    type: "item",
    subtype: "launcher",
    attributes: {
      animates: true,
      defaultAction: "SnapAction",
      scale: 2,
      equippedScale: 0.002,
      elevation: 0,
      throwable: false,
      throws: "bait"
    }
  },
  bucket: {
    name: "bucket",
    gltf: "bucket.glb",
    image: "bucket.png",
    description: "Sturdy bucket",
    type: "item",
    attributes: {
      animates: false,
      scale: 8,
      equippedScale: 0.008,
      elevation: 3
    }
  }
};
