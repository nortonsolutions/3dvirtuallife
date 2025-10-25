export const Elvandor = {
  level: 10,
  width: 70, //26
  length: 70, //26
  description: "elvandor",
  background: "clouds.png",
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "Elvandor",
    gltf: "elvandor.glb",
    attributes: {
      cutScenes: {
        intro: "volcanoIntro.m4v"
      },
      emissiveIntensity: 10,
      scale: 40,
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
    // {
    //     name: "platformBlock", location: { x: -8.8, y: 0, z: 38.4 },
    //     attributes: { routeTo: { level: 5, location: { x: -3.3, y: 0, z: -67.5 } }} //kingdom
    // },
    {
      name: "platformBlock",
      location: { x: -19.5, y: 0, z: -6.5 },
      attributes: {
        routeTo: { level: 4, location: { x: -18.0, y: 0, z: -6.5 } }
      } //lavaField
    },
    {
      name: "portalStone",
      location: { x: -29, y: 0, z: 60 },
      attributes: {
        routeTo: { level: 5, location: { x: -3.3, y: 0, z: -67.5 } }
      } // kingdom
    }
  ],
  entities: [
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "lavaGhoul", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "cosmichorse" },
    { name: "painthorse" },
    { name: "whitehorse" },
    { name: "blackhorse" },
    { name: "chestnuthorse" },
    { name: "brownhorse" },
    { name: "elfgirl2" },
    { name: "elfgirl3" },
    { name: "elfgirl2" },
    { name: "elfgirl4" },
    { name: "elfgirl2" },
    { name: "elfgirl6" },
    { name: "elfgirl2" },
    { name: "elfgirl3" },
    { name: "elfgirl5" },
  ]
};
