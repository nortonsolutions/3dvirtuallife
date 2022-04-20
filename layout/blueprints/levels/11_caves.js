export const Caves = {
  level: 11,
  width: 32, //32
  length: 32, //32
  description: "Dungeon Caves",
  background: "",
  terrain: {
    name: "floor",
    type: "floor",
    description: "caves",
    gltf: "caves.glb",
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
    { name: "bagOfGems" },
    { name: "mace" },
    { name: "bluepotion" },
    { name: "busterbuckler" },
    { name: "torch", location: { x: 0, y: 0, z: 0 } },
    // { name: "keyToChest", location: { x: 1, y: 0, z: 0 }},
    { name: "gold3" },
    { name: "gold25" },
    { name: "gold1" },
    { name: "gold10" },
    { name: "arrow25" }
    // { name: "aluminium" },
    // { name: "iron" }
  ],
  structures: [
    {
      name: "ancientChest",
      location: { x: 0, y: 0, z: -1 },
      attributes: { key: "keyToChest", contentItems: ["bagOfGems"] }
    }
    // {
    //     name: "archway", location: { x: 16, y: 0, z: 4 },
    //     attributes: { routeTo: { level: 0, location: { x: 3, y: 0, z: 4} } } //valley
    // },
    // {
    //     name: "archway", location: { x: 16, y: 0, z: -4 },
    //     attributes: { routeTo: { level: 2, location: { x: 0, y: 0, z: 0} } } //catacomb
    // },
  ],
  entities: [
    // { name: "evilOne", type: "beast" },
    // { name: "evilOne", type: "beast" },
    // { name: "evilOne", type: "beast" },
    // { name: "rat", type: "beast" },
    // { name: "rat", type: "beast" },
    // { name: "bat", type: "beast" },
    // { name: "bat", type: "beast" },
    // { name: "bat", type: "beast" },
    // { name: "bat", type: "beast" },
    // { name: "bat", type: "beast" },
    // { name: "bat", type: "beast" },
    // { name: "ghoul", type: "beast", attributes: { boss: false } }
    // { name: "john" },
  ]
};
