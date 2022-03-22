export const Catacomb = {
  level: 2,
  width: 45, //32
  length: 45, //32
  description: "Catacomb",
  background: "",
  terrain: {
    name: "floor",
    type: "floor",
    description: "catacomb",
    gltf: "catacomb.glb",
    attributes: {
      cutScenes: {
        intro: "volcanoIntro.mkv"
      },
      scale: 100,
      light: {
        sunLight: false,
        overheadPointLight: true
      },
      fog: {
        color: "black",
        density: 1
      },
      designateNPCs: true
    }
  },
  items: [
    { name: "crystalBall", location: { x: 10, y: 0, z: 0 } },
    { name: "busterblade", location: { x: 10, y: 0, z: -2 } },
    { name: "gold25", location: { x: 10, y: 0, z: -2 } },
    { name: "redpotion" },
    { name: "greenpotion" }
    // { name: "aluminium" },
    // { name: "chromium" },
    // { name: "iron" }
  ],
  structures: [
    {
      name: "archway",
      location: { x: 1, y: 0, z: 0 },
      attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: -4 } } } //dungeon
    },
    {
      name: "ancientChest",
      location: { x: 10, y: 0, z: -1 },
      attributes: { key: "keyToChest2", contentItems: ["orb"] }
    }
  ],
  entities: [
    { name: "rat", location: { x: 10, y: 0, z: 0 }, type: "beast" },
    { name: "demonLord", location: { x: 10, y: 0, z: 0 }, type: "beast" },
    { name: "ghoul", location: { x: 10, y: 0, z: 0 }, type: "beast" },
    { name: "ghoul", location: { x: 10, y: 0, z: 0 }, type: "beast" }
  ]
};
