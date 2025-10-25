export const Kingdom = {
  level: 5,
  width: 52, //26
  length: 52, //26
  description: "Kingdom",
  background: "clouds.png",
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "kingdom",
    gltf: "kingdom.glb",
    attributes: {
      cutScenes: {
        intro: "volcanoIntro.m4v"
      },
      animates: false,
      scale: 200,
      borderTrees: true,
      light: {
        sunLight: true,
        overheadPointLight: false
      },
      fog: {
        color: "white",
        density: 1
      },
      designateNPCs: true
      // grass: {
      //     attributes: {
      //         elevation: 0,
      //         color: "green",
      //         scale: 200
      //     },
      //     gltf: 'water.glb'
      // },
    }
  },
  items: [
    { name: "mushroom" },
    { name: "watercan", location: { x: -25, y: 7.1, z: 32 }}
  ],
  structures: [
    {
      name: "swordRoom",
      location: { x: -31.1, y: 7.1, z: -66.9 }
    },
    // {
    //     name: "barnHouse", location: { x: -32.6, y: 7.1, z: 34 },
    // },
    {
      name: "well",
      location: { x: -23, y: 7.1, z: 32 }
    },
    {
      name: "platformBlock",
      location: { x: -5.3, y: 0, z: -67.5 },
      attributes: { routeTo: { level: 8, location: { x: -3.5, y: 0, z: 40 } } } //lavaLabyrinth
    },
    {
      name: "platformBlock",
      location: { x: -13.5, y: 0, z: 35.5 },
      attributes: {
        locked: false,
        elevation: 10,
        routeTo: { level: 3, location: { x: -15.5, y: 0, z: 38.7 } }
      } //swamp
    },
    {
      name: "platformBlock",
      location: { x: -92.4, y: 0, z: 100.8 },
      attributes: {
        locked: false,
        elevation: 5,
        routeTo: { level: 7, location: { x: 6.4, y: 0, z: 21.1 } }
      } //snowyLand
    },
    {
      name: "portalStone",
      location: { x: -3.3, y: 0, z: -67.5 },
      attributes: { routeTo: { level: 10, location: { x: -29, y: 0, z: 60 } } } // elvandor
    },
    {
      name: "tavernShop",
      location: { x: 1.1, y: 0, z: -34.5 },
      attributes: { rotateY: 180 }
    },
    {
      // animationName,duration,fadeOutDuration,fadeOutDelay,autoRestore,concurrent
      name: "platformBlock",
      location: { x: -2.1, y: 0, z: -34.6 },
      attributes: {
        elevation: -5,
        footControls: "tavernShop:Walking in/1"
      }
    },
    {
      name: "platformWood",
      location: { x: -0.7, y: 0, z: -34.6 },
      attributes: {
        elevation: 0,
        footControls: "tavernShop:Walking out/1"
      }
    },

    {
      name: "kingdomGate",
      location: { x: -15.2, y: 0, z: 27.4 },
      attributes: { locked: true, elevation: 5 }
    },
    {
      name: "lever",
      location: { x: -11.2, y: 0, z: 26.1 },
      attributes: {
        locked: true,
        key: "keyToKingdom",
        controls:
          "kingdomGate:OpenL/0.5//concurrent+OpenR/0.5//concurrent+OpenBars/0.5//concurrent"
      }
    },
    {
      name: "lever",
      location: { x: -11.2, y: 0, z: 28.4 },
      attributes: {
        rotateY: 180,
        locked: true,
        key: "keyToKingdom",
        controls:
          "kingdomGate:OpenL/0.5//concurrent+OpenR/0.5//concurrent+OpenBars/0.5//concurrent",
        direction: "up"
      }
    },
    {
      name: "elevatorL_6m",
      location: { x: -3.8, y: 0, z: 25.8 }
    },
    {
      name: "lever",
      location: { x: -7, y: 0, z: 24.4 },
      attributes: { controls: "elevatorL_6m:Move/0.5", rotateY: 45 }
    },
    {
      name: "lever",
      location: { x: -6.2, y: 12.4, z: 24.8 },
      attributes: {
        controls: "elevatorL_6m:Move/0.5",
        staticStartingElevation: true,
        direction: "up",
        rotateY: 45
      }
    },
    {
      name: "elevatorS_6m",
      location: { x: -26.1, y: 0, z: 25.8 }
    },
    {
      name: "lever",
      location: { x: -24.2, y: 0, z: 25 },
      attributes: { controls: "elevatorS_6m:Move/0.5", rotateY: 315 }
    },
    {
      name: "lever",
      location: { x: -27.2, y: 12.3, z: 24.3 },
      attributes: {
        controls: "elevatorS_6m:Move/0.5",
        staticStartingElevation: true,
        direction: "up",
        rotateY: 45
      }
    },
    {
      name: "vikingShop",
      location: { x: -64.5, y: 0, z: 59 },
      attributes: { rotateY: 180 }
    },
    {
      name: "platformBlock",
      location: { x: -64.5, y: 0, z: 55 },
      attributes: {
        elevation: -2,
        footControls: "vikingShop:doorAction/0.5/autoRestore"
      }
    },
    {
      name: "platformWood",
      location: { x: -64.5, y: 0, z: 57 },
      attributes: {
        elevation: 2,
        footControls: "vikingShop:doorAction/0.5/autoRestore"
      }
    }
  ],
  entities: [
    { name: "rockyMan", type: "beast" },
    { name: "rockyMan", type: "beast" },
    { name: "rockyMan", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "blacksmith", location: { x: 5, y: 0, z: -37.1 } },
    { name: "centurion", location: { x: -10.8, y: 0, z: 28.4 } },
    { name: "elfgirl", location: { x: -62.4, y: 0, z: 59.1 } },
    { name: "pug" },
    { name: "cosmichorse" },
    { name: "painthorse" },
    { name: "whitehorse" },
    { name: "blackhorse" },
    { name: "chestnuthorse" },
    { name: "brownhorse" },
    { name: "elfgirl2" },
    { name: "elfgirl3" },
    { name: "elfgirl5" },
    { name: "joe2" },
    { name: "joe3" },
    { name: "joe6" },
  ]
};
