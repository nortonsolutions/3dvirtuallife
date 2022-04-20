export const Armament = {
  iceSword: { // elfgirl
    name: "iceSword",
    gltf: "iceSword.glb",
    image: "iceSword.png",
    description: "Ice sword of the north",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      equippedScale: 0.003,
      animates: false,
      scale: 3,
      elevation: 0,
      equipEffects: "strength/3"
    }
  },
  heavyAxe: { //viking
    name: "heavyAxe",
    gltf: "heavyAxe.glb",
    image: "heavyAxe.png",
    description: "Deadly piercing weapon",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      equippedScale: 0.003,
      animates: false,
      scale: 3,
      elevation: 0,
      equipEffects: "strength/3"
    }
  },
  katana: { // elfgirl
    name: "katana",
    gltf: "katana.glb",
    image: "katana.png",
    description: "Blood-stained weapon of the Samurai",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      equippedScale: 0.015,
      animates: false,
      scale: 15,
      elevation: 0,
      equipEffects: "strength/3"
    }
  },
  zyphosSword: { // elfgirl
    name: "zyphosSword",
    gltf: "zyphosSword.glb",
    image: "zyphosSword.png",
    description: "Ancient sword",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      equippedScale: 0.003,
      animates: false,
      scale: 3,
      elevation: 0,
      equipEffects: "strength/3"
    }
  },
  gladiusSword: { // elfgirl
    name: "gladiusSword",
    gltf: "gladiusSword.glb",
    image: "gladiusSword.png",
    description: "Ancient Long Sword",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      equippedScale: 0.002,
      animates: false,
      scale: 2,
      elevation: 0,
      equipEffects: "strength/3"
    }
  },
  cavalier: { // elfgirl
    name: "cavalier",
    gltf: "cavalier.glb",
    image: "cavalier.png",
    description: "Cavalier Sword",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      equippedScale: 0.0015,
      animates: false,
      scale: 1.5,
      elevation: 0,
      equipEffects: "strength/3"
    }
  },
  crusader: { // elfgirl
    name: "crusader",
    gltf: "crusader.glb",
    image: "crusader.png",
    description: "The crusader sword",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      equippedScale: 0.003,
      animates: false,
      scale: 3,
      elevation: 0,
      equipEffects: "strength/3"
    }
  },
  mace: { //shopkeep
    name: "mace",
    gltf: "mace.glb",
    image: "mace.png",
    description: "A metallic mace",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 0,
      equipEffects: "strength/2"
    }
  },
  direMace: { //elfgirl
    name: "direMace",
    gltf: "direMace.glb",
    image: "direMace.png",
    description: "A dire mace",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      equippedScale: 0.003,
      scale: 3,
      elevation: 0,
      equipEffects: "strength/2"
    }
  },
  busterblade: { //shopkeep
    name: "busterblade",
    gltf: "busterblade.glb",
    image: "busterblade.png",
    description: "A buster blade",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 20,
      equipEffects: "strength/2"
    }
  },
  busterbuckler: { //shopkeep
    name: "busterbuckler",
    gltf: "busterbuckler.glb",
    image: "busterbuckler.png",
    description: "A buster buckler",
    type: "item",
    subtype: "shield",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 20,
      equipEffects: "defense/1"
    }
  },
  waterShield: { //blacksmith
    name: "waterShield",
    gltf: "waterShield.glb",
    image: "waterShield.png",
    description: "A water shield",
    type: "item",
    subtype: "shield",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 20,
      equipEffects: "defense/2"
    }
  },
  thunderShield: { //blacksmith
    name: "thunderShield",
    gltf: "thunderShield.glb",
    image: "thunderShield.png",
    description: "A thunder shield",
    type: "item",
    subtype: "shield",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 20,
      equipEffects: "defense/3"
    }
  },
  blazingShield: { //blacksmith
    name: "blazingShield",
    gltf: "blazingShield.glb",
    image: "blazingShield.png",
    description: "A blazing shield",
    type: "item",
    subtype: "shield",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 20,
      equipEffects: "defense/3"
    }
  },
  arrow: {
    name: "arrow",
    gltf: "arrow.glb",
    image: "arrow.png",
    description: "A buster arrow",
    type: "item",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 250,
      equippedScale: 0.3,
      throwable: true,
      throwableAttributes: {
        pitch: 0.5, // angle up (percentage of 90 degrees)
        weight: 1, // lbs
        distance: 1200, // px
        speed: 4, // 1 = full walking speed
        chanceToLeaveOnGround: 0.5
      },
      elevation: 10,
      effect: "generalDamage/5",
      range: 30
    }
  },
  arrow25: { //shopkeep
    name: "arrow25",
    gltf: "arrow25.glb",
    image: "arrow.png",
    description: "Twenty-five arrows",
    type: "item",
    attributes: {
      baseItemName: "arrow",
      quantity: 25,
      animates: false,
      scale: 200,
      elevation: 10
    }
  },
  blazingBlade: { //blacksmith
    name: "blazingBlade",
    gltf: "blazingBlade.glb",
    image: "blazingBlade.png",
    description: "Blazing Blade",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 60,
      equippedScale: 0.06,
      elevation: 20,
      equipEffects: "strength/1",
      animationOnEquip: false
    }
  },
  natureBlade: { //blacksmith
    name: "natureBlade",
    gltf: "natureBlade.glb",
    image: "natureBlade.png",
    description: "Nature Blade",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 60,
      equippedScale: 0.06,
      elevation: 20,
      equipEffects: "strength/1",
      animationOnEquip: false
    }
  },
  waterBlade: { //blacksmith
    name: "waterBlade",
    gltf: "waterBlade.glb",
    image: "waterBlade.png",
    description: "Water Blade",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 60,
      equippedScale: 0.06,
      elevation: 20,
      equipEffects: "strength/1",
      animationOnEquip: false
    }
  },
  axe2: { //viking
    name: "axe2",
    gltf: "axe2.glb",
    image: "axe2.png",
    description: "Viking war axe",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 1,
      equippedScale: 0.001,
      elevation: 20,
      equipEffects: "strength/3",
      animationOnEquip: false
    }
  },
  armor: { //shopkeep, viking
    name: "armor",
    gltf: "armor.glb",
    image: "armor.png",
    description: "Heavy-duty armor",
    type: "item",
    attributes: {
      equippable: ["Torso"],
      animates: false,
      scale: 20,
      equippedScale: 0.02,
      elevation: 20,
      equipEffects: "defense/1"
    }
  },
  supermanArmor: { //blacksmith
    name: "supermanArmor",
    gltf: "supermanArmor.glb",
    image: "supermanArmor.png",
    description: "Heavy-duty armor",
    type: "item",
    attributes: {
      equippable: ["Torso"],
      animates: false,
      scale: 20,
      equippedScale: 0.02,
      elevation: 20,
      equipEffects: "defense/3"
    }
  },
  legacyArmor: { //blacksmith
    name: "legacyArmor",
    gltf: "legacyArmor.glb",
    image: "legacyArmor.png",
    description: "Heavy-duty armor",
    type: "item",
    attributes: {
      equippable: ["Torso"],
      animates: false,
      scale: 20,
      equippedScale: 0.02,
      elevation: 20,
      equipEffects: "defense/3"
    }
  },
  chevyArmor: { //blacksmith
    name: "chevyArmor",
    gltf: "chevyArmor.glb",
    image: "chevyArmor.png",
    description: "Heavy-duty armor",
    type: "item",
    attributes: {
      equippable: ["Torso"],
      animates: false,
      scale: 20,
      equippedScale: 0.02,
      elevation: 20,
      equipEffects: "defense/2"
    }
  },
  busterboot: { //shopkeep
    name: "busterboot",
    gltf: "busterboot.glb",
    image: "busterboot.png",
    description: "Light-weight armored boots",
    type: "item",
    attributes: {
      equippable: ["FootL, FootR"],
      animates: false,
      scale: 40,
      equippedScale: 0.02,
      elevation: 10,
      equipEffects: "agility/1"
    }
  },
  helmet: { //shopkeep
    name: "helmet",
    gltf: "helmet.glb",
    image: "helmet.png",
    description: "Heavy-duty armor",
    type: "item",
    attributes: {
      equippable: ["Head_end"],
      animates: false,
      scale: 40,
      equippedScale: 0.035,
      elevation: 20,
      equipEffects: "defense/1"
    }
  },
  bow: { //shopkeep
    name: "bow",
    gltf: "bow.glb",
    image: "bow.png",
    description: "A buster bow",
    type: "item",
    subtype: "bow",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: true,
      defaultAction: "ArmatureAction",
      throwable: false,
      throws: "arrow",
      scale: 200,
      equippedScale: 0.2,
      elevation: 20,
      equipEffects: "strength/1"
    }
  },
  smallSword: { //shopkeep
    name: "smallSword",
    gltf: "broadsword.glb",
    image: "broadsword.png",
    description: "A metallic blade, strong yet flexible",
    type: "item",
    subtype: "sword",
    attributes: {
      value: 1,
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 100,
      elevation: 20,
      equipEffects: "strength/1"
      // equipEffects: "light/15",
      // sprites: [
      //     {
      //         name: "flame2",
      //         frames: 40,
      //         scale: .05,
      //         scaleY: 1.5,
      //         translateZ: -.10,
      //         flip: true,
      //         showOnSeed: false,
      //         showOnEquip: true,
      //         elevation: 0
      //     }
      // ],
    }
  },
  lightSaber: {
    name: "lightSaber",
    gltf: "lightSaber.glb",
    image: "lightSaber.png",
    description: "Red light saber",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: true,
      scale: 3,
      equippedScale: 0.003,
      elevation: 20,
      equipEffects: "strength/1",
      animationOnEquip: true
    }
  },
  axe: { //viking, blacksmith
    name: "axe",
    gltf: "axe.glb",
    image: "axe.png",
    description: "Pokeman axe",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 30,
      equippedScale: 0.03,
      elevation: 20,
      equipEffects: "strength/1",
      animationOnEquip: false
    }
  },
  blackBlade: { //blacksmith
    name: "blackBlade",
    gltf: "blackBlade.glb",
    image: "blackBlade.png",
    description: "Black blade",
    type: "item",
    subtype: "sword",
    attributes: {
      flipWeapon: true,
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 60,
      equippedScale: 0.06,
      elevation: 20,
      equipEffects: "strength/1",
      animationOnEquip: false
    }
  },
  hammer: { //viking
    name: "hammer",
    gltf: "hammer.glb",
    image: "hammer.png",
    description: "Hammer",
    type: "item",
    subtype: "sword",
    attributes: {
      equippable: ["Middle2R", "Middle2L"],
      animates: false,
      scale: 30,
      equippedScale: 0.03,
      elevation: 20,
      equipEffects: "strength/1",
      animationOnEquip: false
    }
  }
};
