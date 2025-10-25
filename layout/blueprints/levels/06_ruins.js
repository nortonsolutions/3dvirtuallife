export const Ruins = {
  level: 6,
  width: 78, //26
  length: 78, //26
  description: "Ruins",
  background: "ruinsSky.jpg",
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "ruins",
    gltf: "ruins.glb",
    attributes: {
      cutScenes: {
        intro: "volcanoIntro.m4v"
      },
      scale: 100,
      borderTrees: true,
      light: {
        sunLight: true,
        overheadPointLight: true
      },
      fog: {
        color: "white",
        density: 1.2
      },
      designateNPCs: true
    }
  },
  items: [
    // { name: "iron" },
    // { name: "silver" },
    // { name: "titanium" },
    // { name: "wolfram" },
    // { name: "silver" },
    // { name: "iron" },
    // { name: "silver" },
    // { name: "titanium" },
    // { name: "wolfram" },
    // { name: "silver" }
  ],
  structures: [
    {
      name: "platformBlock",
      location: { x: -13.5, y: 0, z: -18.5 },
      attributes: {
        routeTo: { level: 4, location: { x: -8.5, y: 0, z: 18.5 } }
      } // lavaField
    }
  ],
  entities: [
    { name: "crystalMan", type: "beast" },
    { name: "crystalMan", type: "beast" },
    { name: "crystalMan", type: "beast" },
    { name: "crystalMan", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "triceratops", type: "beast" },
    { name: "triceratops", type: "beast" },
    { name: "iceGhoul", type: "beast" },
    { name: "shockGhoul", type: "beast" },
    { name: "gasGhoul", type: "beast" },
    { name: "ghostGhoul", type: "beast" }
  ]
};
