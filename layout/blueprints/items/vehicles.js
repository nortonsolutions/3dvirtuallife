export const Vehicles = {
    
  balloon: {
    name: "balloon",
    gltf: "balloon.glb",
    image: "balloon.png",
    description: "Festive hot-air balloon",
    type: "item",
    attributes: {
      mountable: true,
      equippedScale: 30,
      // staticStartingElevation: true,
      rotateY: 180,
      animates: false,
      scale: 30,
      elevation: 30
      // addToStructureModels: true
    }
  },

  fishingBoat: {
    name: "fishingBoat",
    gltf: "fishingBoat3.glb",
    image: "fishingBoat.png",
    description: "Fishing boat",
    type: "item",
    attributes: {
      height: 10,
      movingAnimations: "RowAction/1",
      mountable: true,
      floats: true,
      equippedScale: 15,
      // rotateY: -90,
      animates: true,
      scale: 15,
      elevation: 10,
      // translateZ: -40
      // addToStructureModels: true
    }
  }
};
