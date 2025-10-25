export const Lavafield = {
  level: 4,
  width: 26, //26
  length: 26, //26
  description: "Lavafield",
  background: "clouds.png",
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "lavafield",
    gltf: "lavafield.glb",
    attributes: {
      cutScenes: {
        intro: "volcanoIntro.m4v"
      },
      scale: 100,
      borderTrees: true,
      light: {
        sunLight: true,
        overheadPointLight: false
      },
      fog: {
        color: "white",
        density: 1.2
      },
      water: {
        attributes: {
          useTHREE: false,
          elevation: 0,
          color: "red",
          scale: 100,
          lava: true
        },
        gltf: "lava.glb"
      },
      designateNPCs: true
    }
  },
  items: [
    { name: "gold25", location: { x: 10, y: 0, z: -1 } },
    { name: "redpotion" },
    { name: "greenpotion" },
    { name: "helmet" },
    // { name: "copper" },
    // { name: "iron" },
    // { name: "silver" },
    { name: "firesteedIncense", location: { x: -12.4, y: 0, z: -22.7 } }
  ],
  structures: [
    {
      name: "platformBlock",
      location: { x: -42.5, y: 0, z: -50 },
      attributes: {
        routeTo: { level: 0, location: { x: -17.0, y: 0, z: -6.0 } }
      } //valley
    },
    {
      name: "platformBlock",
      location: { x: -80.0, y: 0, z: -86.9 },
      attributes: { routeTo: { level: 8, location: { x: -11, y: 0, z: -6.5 } } } //lavaLabyrinth
    },
    {
      name: "platformBlock",
      location: { x: -34.9, y: 0, z: 73.5 },
      attributes: { routeTo: { level: 9, location: { x: 2, y: 0, z: 2 } } } //volcano
    },
    {
      // fireSteedAltar
      name: "firesteedAltar",
      location: { x: -13.4, y: 0, z: -22.7 }
    }
  ],
  entities: [
    { name: "lavaMan", type: "beast" },
    { name: "lavaMan", type: "beast" },
    { name: "lavaMan", type: "beast" },
    { name: "lavaMan", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "lavaMan", type: "beast" },
    { name: "lavaMan", type: "beast" },
    { name: "lavaMan", type: "beast" },
    { name: "lavaMan", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" }
  ]
};
