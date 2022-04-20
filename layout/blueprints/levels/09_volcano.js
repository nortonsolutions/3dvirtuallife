export const Volcano = {
  level: 9,
  width: 104, //26
  length: 104, //26
  description: "Volcano",
  background: "clouds.png",
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "Volcano",
    gltf: "volcano.glb",
    attributes: {
      emissiveIntensity: 10,
      cutScenes: {
        intro: "volcanoIntro.mkv"
      },
      scale: 100,
      borderTrees: false,
      light: {
        sunLight: true,
        overheadPointLight: false
      },
      fog: {
        color: "white",
        density: 1.2
      },
      designateNPCs: true
    }
  },
  items: [],
  structures: [
    {
      name: "platformBlock",
      location: { x: 0, y: 0, z: 2 },
      attributes: {
        routeTo: { level: 4, location: { x: -36.9, y: 0, z: 73.5 } }
      } //lavaField
    }
  ],
  entities: [
    { name: "lavaGhoul", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
  ]
};
