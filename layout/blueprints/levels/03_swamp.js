export const Swamp = {
  level: 3,
  width: 52, //26
  length: 52, //26
  description: "Swamp",
  background: "swampBackground.png",
  backgroundNight: "",
  terrain: {
    name: "floor",
    type: "floor",
    description: "swamp",
    gltf: "swamp.glb",
    attributes: {
      cutScenes: {
        intro: "volcanoIntro.mkv"
      },
      scale: 100,
      borderTrees: false,
      grassSprites: true,
      leaves: true,
      light: {
        sunLight: true,
        overheadPointLight: false
      },
      fog: {
        color: "#88e732",
        density: 0.5
      },
      water: {
        attributes: {
          useTHREE: true,
          elevation: -120,
          color: "green",
          scale: 200
        },
        gltf: "water.glb"
      },
      designateNPCs: true
    }
  },
  items: [
    { name: "busterboot", location: { x: 0, y: 0, z: 0 } },
    // { name: "lightSaber", location: { x: -1, y: 0, z: -1} },
    // { name: "rosenRelic" },
    // { name: "gold25", location: { x: 10, y: 0, z: -1 }},
    { name: "redpotion" },
    { name: "greenpotion" },
    { name: "smallSword" },
    { name: "blackpotion" },
    { name: "bagOfGems" }
    // { name: "chromium" },
    // { name: "copper" }
  ],
  structures: [
    { name: "bridge", location: { x: -14.4, y: 0, z: 31.9 } },
    {
      name: "bridge",
      location: { x: 33.2, y: 0, z: 18.5 },
      attributes: { rotateY: 90 }
    },
    {
      name: "platformBlock",
      location: { x: 11.2, y: 0, z: 39.6 },
      attributes: {
        routeTo: { level: 0, location: { x: -18.4, y: 0, z: 47.8 } }
      } //valley
    },
    {
      name: "platformBlock",
      location: { x: -14.4, y: -0.65, z: 38.7 },
      attributes: {
        staticStartingElevation: true,
        routeTo: { level: 5, location: { x: -7.4, y: 0, z: 38.5 } }
      } //kingdom
    },
    {
      name: "platformBlock",
      location: { x: 40.2, y: 0, z: 18.6 },
      attributes: {
        routeTo: { level: 7, location: { x: 16.9, y: 0, z: -25.5 } }
      } //snowyland
    }
  ],
  entities: [
    { name: "crystalMan", type: "beast" },
    { name: "crystalMan", type: "beast" },
    { name: "crocodile", type: "beast" },
    { name: "crocodile", type: "beast" },
    { name: "crocodile", type: "beast" },
    { name: "crocodile", type: "beast" },
    { name: "crocodile", type: "beast" },
    { name: "crocodile", type: "beast" },
    { name: "crocodile", type: "beast" },
    { name: "iceGhoul", type: "beast"  },
    { name: "shockGhoul", type: "beast"  },
    { name: "gasGhoul", type: "beast" },
    { name: "ghostGhoul", type: "beast"  },
    { name: "ghoul", type: "beast" },
    { name: "triceratops", type: "beast" },
    // { name: "crocodile", type: "beast", location: { x: 1, y: 0, z: 1} },
  ]
};
