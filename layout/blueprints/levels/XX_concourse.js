export const Concourse = {
  level: 100,
  width: 10, //26
  length: 10, //26
  description: "Rosenetta Stone",
  background: "", // 'clouds.png',
  backgroundNight: "",
  terrain: {
    name: "floor",
    type: "floor",
    description: "concourse",
    gltf: "concourse.glb",
    attributes: {
      scale: 100,
      borderTrees: false,
      light: {
        sunLight: false,
        overheadPointLight: false
      },
      fog: {
        color: "white",
        density: 0
      }
    }
  },
  items: [],
  structures: [
    {
      name: "portalStone",
      location: { x: 2.66, y: 0, z: -10 },
      attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } }
    },
    {
      name: "portalStone",
      location: { x: 5.2, y: 0, z: -8.9 },
      attributes: { routeTo: { level: 0, location: { x: -0, y: 0, z: 0 } } }
    },
    {
      name: "portalStone",
      location: { x: 7.4, y: 0, z: -7.3 },
      attributes: {
        routeTo: { level: 4, location: { x: -44.5, y: 0, z: -50 } }
      }
    },
    {
      name: "portalStone",
      location: { x: 9.1, y: 0, z: -5.3 },
      attributes: { routeTo: { level: 8, location: { x: -5.7, y: 0, z: 40 } } }
    },
    {
      name: "portalStone",
      location: { x: 10.3, y: 0, z: -2.7 },
      attributes: {
        routeTo: { level: 3, location: { x: -15.5, y: -0.7, z: 38.75 } }
      }
    },
    {
      name: "portalStone",
      location: { x: 10.5, y: 0, z: 0.05 },
      attributes: {
        routeTo: { level: 6, location: { x: -15.5, y: 0, z: -18.5 } }
      }
    },
    {
      name: "portalStone",
      location: { x: 10.2, y: 0, z: 2.7 },
      attributes: {
        routeTo: { level: 5, location: { x: -14.5, y: 0, z: 35.2 } }
      }
    },
    {
      name: "portalStone",
      location: { x: 9.15, y: 0, z: 5.3 },
      attributes: { routeTo: { level: 7, location: { x: 3.5, y: 0, z: 21.1 } } }
    },
    {
      name: "portalStone",
      location: { x: 7.4, y: 0, z: 7.5 },
      attributes: { routeTo: { level: 2, location: { x: 0, y: 0, z: 0 } } }
    },
    {
      name: "portalStone",
      location: { x: 5.3, y: 0, z: 9 },
      attributes: { routeTo: { level: 9, location: { x: 2, y: 0, z: 2 } } }
    },
    {
      name: "portalStone",
      location: { x: 2.7, y: 0, z: 10.1 },
      attributes: { routeTo: { level: 10, location: { x: -31, y: 0, z: 60 } } }
    },
    {
      name: "portalStone",
      location: { x: -0.02, y: 0, z: 10.3 },
      attributes: { routeTo: { level: 11, location: { x: 2, y: 0, z: 2 } } }
    }
  ],
  entities: []
};
