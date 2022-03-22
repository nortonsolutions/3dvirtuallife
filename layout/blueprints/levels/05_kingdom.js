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
        intro: "volcanoIntro.mkv"
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
    // { name: "crystalBall" },
    { name: "mushroom" }
    // { name: "copper" },
    // { name: "iron" },
    // { name: "silver" },
    // { name: "titanium" },
    // { name: "wolfram" },
    // { name: "silver" },
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
      // animationName,duration,fadeOutDuration,fadeOutDelay,autorestore,concurrent
      name: "platformBlock",
      location: { x: -2.1, y: 0, z: -34.6 },
      attributes: {
        elevation: -5,
        footControls: "tavernShop:Walking in/1/0/0/0/0"
      }
    },
    {
      name: "platformWood",
      location: { x: -0.7, y: 0, z: -34.6 },
      attributes: {
        elevation: 0,
        footControls: "tavernShop:Walking out/1/0/0/0/0"
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
          "kingdomGate:OpenL/3/5/1/noAutorestore/concurrent+OpenR/3/5/1/noAutorestore/concurrent+OpenBars/3/5/1/noAutorestore/concurrent"
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
          "kingdomGate:OpenL/3/5/1/noAutorestore/concurrent+OpenR/3/5/1/noAutorestore/concurrent+OpenBars/3/5/1/noAutorestore/concurrent",
        position: "up"
      }
    },
    {
      name: "elevatorL_6m",
      location: { x: -3.8, y: 0, z: 25.8 }
    },
    {
      name: "lever",
      location: { x: -7, y: 0, z: 24.4 },
      attributes: { controls: "elevatorL_6m:Move/5/9/1", rotateY: 45 }
    },
    {
      name: "lever",
      location: { x: -6.2, y: 12.4, z: 24.8 },
      attributes: {
        controls: "elevatorL_6m:Move/5/9/1",
        staticStartingElevation: true,
        position: "up",
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
      attributes: { controls: "elevatorS_6m:Move/5/9/1", rotateY: 315 }
    },
    {
      name: "lever",
      location: { x: -27.2, y: 12.3, z: 24.3 },
      attributes: {
        controls: "elevatorS_6m:Move/5/9/1",
        staticStartingElevation: true,
        position: "up",
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
        footControls: "vikingShop:doorAction/3/3/1/autorestore"
      } // duration/fadeOutDuration/fadeOutDelay/autorestore
    },
    {
      name: "platformWood",
      location: { x: -64.5, y: 0, z: 57 },
      attributes: {
        elevation: 2,
        footControls: "vikingShop:doorAction/3/3/1/autorestore"
      }
    }
  ],
  entities: [
    { name: "rockyMan", type: "beast" },
    { name: "rockyMan", type: "beast" },
    { name: "rockyMan", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "blacksmith", location: { x: 5, y: 0, z: -37.1 } },
    { name: "centurion", location: { x: -10.8, y: 0, z: 28.4 } },
    { name: "viking", location: { x: -8.8, y: 0, z: 11.15 } },
    { name: "elfgirl", location: { x: -62.4, y: 0, z: 59.1 } },
    { name: "pug", location: { x: 1, y: 0, z: 1 } },
    { name: "cosmichorse" },
    { name: "painthorse" },
    { name: "whitehorse" },
    { name: "blackhorse" },
    { name: "chestnuthorse" },
    { name: "brownhorse" }
  ]
};
