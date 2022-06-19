export const Valley = {
  level: 0,
  width: 26, //26
  length: 26, //26
  description: "Valley of Mist",
  background: "clouds.png", // 'clouds.png',
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "valley",
    gltf: "valley.glb",
    attributes: {
      alwaysDaytime: true,
      snowflakes: false,
      cutScenes: {
        intro: "volcanoIntro.mkv"
      },
      addPonds: true,
      scale: 100,
      borderTrees: true,
      light: {
        sunLight: true,
        overheadPointLight: false
      },
      fog: {
        color: "white",
        density: 1
      },
      designateNPCs: true,
      waterSources: [
        [{ x: -16, y: 0, z: -175 }, 80],
        [{ x: -1195, y: 0, z: 5750 }, 800]
      ],
      mineralSources: [
        [{ x: 719, y: -50, z: -598 }, 100, "aluminium"],
        [{ x: 2640, y: 370, z: 2508 }, 100, "iron"]
      ]
    }
  },
  items: [
    { name: "keyToShed", location: { x: 2, y: 0, z: -1 } },
    { name: "miningHammer", location: { x: 2, y: 0, z: -1 } },
    { name: "bow", location: { x: 2, y: 0, z: -1 } },
    { name: "arrow25", location: { x: 2, y: 0, z: -1 } },
    { name: "gold3" },
    { name: "aluminium", location: { x: 7.2, y: -.50, z: -6 }},
    { name: "aluminium", location: { x: 6.2, y: -.50, z: -6 }},
    { name: "aluminium", location: { x: 8.2, y: -.50, z: -6 }},
    { name: "iron", location: { x: 25.8, y: 3.7, z: 23.7 }},
    { name: "iron", location: { x: 24.8, y: 3.7, z: 23.7 }},
    { name: "iron", location: { x: 25.3, y: 3.7, z: 23.7 }},
    { name: "watercan", location: { x: 1.1, y: 0.3, z: 4.4 },
      attributes: { staticStartingElevation: true }
    },
    {
        name: "balloon", location: { x: 3.77, y: 2.8, z: -3.75},
        attributes: { staticStartingElevation: true }
    },
    {
      name: "fishingBoat", location: { x: -6.7, y: 0, z: 52.2 },
      attributes: { staticStartingElevation: false }
    }
  ],
  structures: [
    {
      name: "shed",
      location: { x: 0, y: 0, z: 0 },
      attributes: { transparentWindows: true }
    },
    { name: "rock1" },
    { name: "cart", location: { x: -2, y: 0, z: 2 } },
    { name: "bucket", location: { x: -6, y: 0, z: 2 } },
    {
      name: "grate",
      location: { x: 3, y: 0, z: 4 },
      attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } } //dungeon
    },
    {
      name: "platformBlock",
      location: { x: 5, y: -1, z: -4.9 },
      attributes: {
        scale: 150,
        staticStartingElevation: true,
        routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } }
      } //dungeon
    },
    {
      name: "platformBlock",
      location: { x: 35.15, y: 9.25, z: -0.7 },
      attributes: {
        staticStartingElevation: true,
        routeTo: { level: 2, location: { x: 0, y: 0, z: 0 } }
      } //catacomb
    },
    {
      name: "platformBlock",
      location: { x: -21.4, y: 0, z: 48.5 },
      attributes: { routeTo: { level: 3, location: { x: 9.2, y: 0, z: 39.6 } } } //swamp
    },
    {
      name: "platformBlock",
      location: { x: -17.0, y: 0, z: -6.0 },
      attributes: {
        routeTo: { level: 4, location: { x: -44.5, y: 0, z: -50 } }
      } //lavafield
    },
    {
      name: "elevatorS_1m",
      location: { x: -4.75, y: 0, z: 4.75 },
      attributes: { scale: 200 }
    },
    {
      name: "lever",
      location: { x: -4, y: 0, z: 3.1 },
      attributes: { controls: "elevatorS_1m:Move/0.7", rotateY: 270 }
    },
    {
      name: "lever",
      location: { x: -4.5, y: 2.6, z: 3.45 },
      attributes: {
        controls: "elevatorS_1m:Move/0.7",
        staticStartingElevation: true,
        direction: "up",
        rotateY: 315
      }
    },
    {
      name: "lever",
      location: { x: -0.8, y: 0, z: 4.1 },
      attributes: {
        controls:
          "shed:gateaction/0.5//concurrent+invgateaction/0.5//concurrent"
      }
    },
    {
      name: "lever",
      location: { x: -0.9, y: 2.6, z: 5 },
      attributes: {
        rotateY: 180,
        controls:
          "shed:gateaction/0.5//concurrent+invgateaction/0.5//concurrent",
        direction: "up"
      }
    }
  ],
  entities: [
    { name: "triceratops", type: "beast" },
    { name: "evilOne", type: "beast" },
    { name: "evilOne", type: "beast" },
    { name: "evilOne", type: "beast" },

    { name: "crocodile", type: "beast" },
    { name: "evilOne", type: "beast" },
    { name: "evilOne", type: "beast" },
    { name: "evilOne", type: "beast" },

    { name: "crocodile", type: "beast" },
    { name: "evilOne", type: "beast" },
    { name: "evilOne", type: "beast" },
    { name: "evilOne", type: "beast" },

    { name: "john" },
    { name: "joe", location: { x: 1, y: 0, z: 0 } },
    { name: "shopkeep", location: { x: 1, y: 0, z: 1 } },
    { name: "sunSeed", location: { x: 1, y: 0, z: -1 } },

    { name: "catFish", location: { x: -9, y: 0, z: 56 } },
    { name: "catFish", location: { x: -8, y: 0, z: 56 } },
    { name: "carp", location: { x: -7, y: 0, z: 54 } },
    { name: "carp", location: { x: -7.5, y: 0, z: 54 } },
    { name: "cosmichorse", location: { x: -1, y: 0, z: 1 } },
  ]
};
