export const Lavalabyrinth = {
  level: 8,
  width: 72, //26
  length: 72, //26
  description: "Lava Labyrinth",
  background: "clouds.png",
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "Lava Labyrinth",
    gltf: "lavalabyrinth.glb",
    attributes: {
      cutScenes: {
        intro: "volcanoIntro.mkv"
      },
      emissiveIntensity: 10,
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
  items: [{ name: "balloon", location: { x: -7.2, y: 6.0, z: 40 } }],
  structures: [
    { name: "ricketyPlatform", location: { x: -7.2, y: 0, z: 40 } },
    {
      name: "platformBlock",
      location: { x: -4, y: 0, z: 39.4 },
      attributes: {
        routeTo: { level: 5, location: { x: -3.3, y: 0, z: -67.5 } }
      } //kingdom
    },
    {
      name: "platformBlock",
      location: { x: -10.7, y: 0, z: -4.2 },
      attributes: {
        routeTo: { level: 4, location: { x: -78.0, y: 0, z: -86.9 } }
      } //lavaField
    }
  ],
  entities: [
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "iceGhoul", type: "beast" },
    { name: "shockGhoul", type: "beast" },
    { name: "gasGhoul", type: "beast" },
    { name: "ghostGhoul", type: "beast" },
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
