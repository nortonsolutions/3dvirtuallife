export const Snowyland = {
  level: 7,
  width: 26, //26
  length: 26, //26
  description: "Snowyland",
  background: "clouds.png",
  backgroundNight: "stars.png",
  terrain: {
    name: "floor",
    type: "floor",
    description: "snowyland",
    gltf: "snowyland.glb",
    attributes: {
      snowflakes: true,
      cutScenes: {
        intro: "volcanoIntro.mkv"
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
          color: "white",
          scale: 500,
          lava: false
        },
        gltf: "water.glb"
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
    { name: "cavalier" },
    { name: "masterDragonPelt", location: { x: 2.5, y: 0, z: 21.1 } }
  ],
  structures: [
    {
      name: "platformBlock",
      location: { x: 18.4, y: 0, z: -23.1 },
      attributes: {
        locked: false,
        routeTo: { level: 3, location: { x: 40.45, y: 0, z: 19.9 } }
      } //swamp
    },
    {
      name: "platformBlock",
      location: { x: 4.4, y: 0, z: 21.1 },
      attributes: {
        locked: false,
        elevation: 5,
        routeTo: { level: 5, location: { x: -90.4, y: 0, z: 100.8 } }
      } //kingdom
    },
    { name: "tavernShop", location: { x: -3.5, y: 0, z: 0 } },
    {
      name: "platformBlock",
      location: { x: -0.5, y: 0, z: 0.15 },
      attributes: {
        elevation: -5,
        footControls: "tavernShop:Walking in/0.5"
      }
    },
    {
      name: "platformWood",
      location: { x: -1.5, y: 0, z: 0.15 },
      attributes: {
        elevation: 5,
        footControls: "tavernShop:Walking out/0.5"
      }
    }
  ],
  entities: [
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "crystalMan", type: "beast" },
    { name: "crystalMan", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "ghoul", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast" },
    { name: "dragon", type: "beast" },
    { name: "daveDragon", type: "beast",
      attributes: {
        grants: ["masterDragonPelt"]
      } 
    },
    {
      name: "viking",
      location: { x: -0, y: 0, z: 1.9 },
      attributes: { follower: true }
    }
  ]
};
