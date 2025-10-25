import { convo } from "./convo.js";
import { Animals } from './animals.js';

export const Friendlies = {
  ...Animals,
  elfgirl: {
    name: "elfgirl",
    gltf: "elfgirl.glb",
    description: "Elvish woman",
    type: "friendly",
    inventory: [
      { itemName: "houseSmall", quantity: 1, price: "gold/2" },
      { itemName: "houseMedium", quantity: 1, price: "gold/3000" },
      { itemName: "houseLarge", quantity: 1, price: "gold/4000" },
      { itemName: "zyphosSword", quantity: 1, price: "gold/30,smallSword/1,aluminium/100" },
      { itemName: "gladiusSword", quantity: 1, price: "gold/100,smallSword/1,aluminium/100" },
      { itemName: "cavalier", quantity: 1, price: "gold/200,smallSword/1,aluminium/100" },
      { itemName: "crusader", quantity: 1, price: "gold/200,smallSword/1,iron/100" },
      { itemName: "iceSword", quantity: 1, price: "gold/200,smallSword/1,iron/100" },
      { itemName: "katana", quantity: 1, price: "gold/5000,wolfram/100" },
      { itemName: "direMace", quantity: 1, price: "gold/100,wolfram/50" }
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 45,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 30,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Welcome to my shop, young robot.",
          responses: [convo.reset]
        },
        special: {
          condition: ["masterDragonPelt"],
          speech:
            "My hero!  You have slain the mightiest dragon in the land, and given hope to us all!  The passphrase to enter the Kingdom is 'shibboleth'.  Perhaps we can begin to restore the kingdom?",
          responses: [convo.thank],
        },
        intro: {
          speech: "Hello there, stranger.",
          responses: [convo.engage, convo.trade, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "You are the first visitor I've had in a long while....",
            responses: [convo.engage, convo.trade, convo.disengage]
          },
          {
            speech:
              "If only the curse of the dragon infestation would pass!",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  If you can destroy the dragons, I will provide the passphrase to the kingdom.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
      },
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },
  elfgirl2: {
    name: "elfgirl2",
    gltf: "elfgirl2.glb",
    description: "Elvish woman",
    type: "friendly",
    inventory: [
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 45,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 25,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Welcome to my shop, young robot.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there, stranger.",
          responses: [convo.engage, convo.trade, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "You are the first visitor I've had in a long while....",
            responses: [convo.engage, convo.trade, convo.disengage]
          },
          {
            speech:
              "If only the curse of the dragon infestation would pass!",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  If you can destroy the dragons, I will provide the passphrase to the kingdom.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
      },
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },
  elfgirl3: {
    name: "elfgirl3",
    gltf: "elfgirl3.glb",
    description: "Elvish woman",
    type: "friendly",
    inventory: [
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 45,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 25,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Welcome to my shop, young robot.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there, stranger.",
          responses: [convo.engage, convo.trade, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "You are the first visitor I've had in a long while....",
            responses: [convo.engage, convo.trade, convo.disengage]
          },
          {
            speech:
              "If only the curse of the dragon infestation would pass!",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  If you can destroy the dragons, I will provide the passphrase to the kingdom.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
      },
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },
  elfgirl4: {
    name: "elfgirl4",
    gltf: "elfgirl4.glb",
    description: "Elvish woman",
    type: "friendly",
    inventory: [
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 45,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 25,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Welcome to my shop, young robot.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there, stranger.",
          responses: [convo.engage, convo.trade, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "You are the first visitor I've had in a long while....",
            responses: [convo.engage, convo.trade, convo.disengage]
          },
          {
            speech:
              "If only the curse of the dragon infestation would pass!",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  If you can destroy the dragons, I will provide the passphrase to the kingdom.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
      },
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },
  elfgirl5: {
    name: "elfgirl5",
    gltf: "elfgirl5.glb",
    description: "Elvish woman",
    type: "friendly",
    inventory: [
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 45,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 25,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Welcome to my shop, young robot.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there, stranger.",
          responses: [convo.engage, convo.trade, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "You are the first visitor I've had in a long while....",
            responses: [convo.engage, convo.trade, convo.disengage]
          },
          {
            speech:
              "If only the curse of the dragon infestation would pass!",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  If you can destroy the dragons, I will provide the passphrase to the kingdom.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
      },
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },
  elfgirl6: {
    name: "elfgirl6",
    gltf: "elfgirl6.glb",
    description: "Elvish woman",
    type: "friendly",
    inventory: [
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 45,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 25,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Welcome to my shop, young robot.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there, stranger.",
          responses: [convo.engage, convo.trade, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "You are the first visitor I've had in a long while....",
            responses: [convo.engage, convo.trade, convo.disengage]
          },
          {
            speech:
              "If only the curse of the dragon infestation would pass!",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  If you can destroy the dragons, I will provide the passphrase to the kingdom.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
      },
      stats: {
        health: "4/4/0",
        mana: "0/0/0",
        strength: "2/2/0",
        agility: "1/1/0",
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },
  john: {
    name: "john",
    gltf: "robot.glb",
    description: "Another robot which seems different",
    type: "friendly",
    inventory: [
      { itemName: "armor", quantity: 3, price: "gold/20,aluminium/50,iron/250" },
      { itemName: "bluepotion", quantity: 3, price: "gold/20,aluminium/50,iron/250" },
      { itemName: "busterboot", quantity: 3, price: "gold/20,aluminium/50,iron/250" },
      { itemName: "helmet", quantity: 3, price: "gold/20,aluminium/50,iron/250" },
      { itemName: "busterblade", quantity: 3, price: "gold/20,aluminium/50,iron/250" },
      { itemName: "busterbuckler", quantity: 3, price: "gold/20,aluminium/50,iron/250" },
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 10,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.wellwish, convo.trade]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "1/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  joe: {
    name: "joe",
    gltf: "gamebot.glb",
    description: "",
    type: "friendly",
    equipped: [], // allow AI's to equip their inventory
    inventory: [
      { itemName: "armor", quantity: 1, price: "gold/1" }
    ],
    attributes: {
      // loyalTo: "whom"?
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 4,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        special: {
          condition: ["crystalBall"],
          speech:
            "Ah, you have the crystal ball!  Please grant the item and you will have my loyalty!",
          responses: [convo.grant, convo.decline],
          jumpToState: "loyal" // if special condition is met
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.engage, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "These are terrible times here, so beware.  The place is overrun with horrors from the depths.",
            responses: [convo.engage, convo.disengage]
          },
          {
            speech:
              "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.  Recently they stole my crystal ball.",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  If you could find and return my crystal ball, I will reward your efforts.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
        disengaged: {
          speech: "Have a fine day, stranger.",
          responses: [convo.engage, convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "2/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  joe2: {
    name: "joe2",
    gltf: "gamebot2.glb",
    description: "",
    type: "friendly",
    equipped: [], // allow AI's to equip their inventory
    inventory: [
      { itemName: "armor", quantity: 1, price: "gold/1" }
    ],
    attributes: {
      // loyalTo: "whom"?
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 4,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.engage, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "These are terrible times here, so beware.  The place is overrun with horrors from the depths.",
            responses: [convo.engage, convo.disengage]
          },
          {
            speech:
              "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
        disengaged: {
          speech: "Have a fine day, stranger.",
          responses: [convo.engage, convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "2/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  joe3: {
    name: "joe3",
    gltf: "gamebot3.glb",
    description: "",
    type: "friendly",
    equipped: [], // allow AI's to equip their inventory
    inventory: [
      { itemName: "armor", quantity: 1, price: "gold/1" }
    ],
    attributes: {
      // loyalTo: "whom"?
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 4,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.engage, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "These are terrible times here, so beware.  The place is overrun with horrors from the depths.",
            responses: [convo.engage, convo.disengage]
          },
          {
            speech:
              "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
        disengaged: {
          speech: "Have a fine day, stranger.",
          responses: [convo.engage, convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "2/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  joe4: {
    name: "joe4",
    gltf: "gamebot4.glb",
    description: "",
    type: "friendly",
    equipped: [], // allow AI's to equip their inventory
    inventory: [
      { itemName: "armor", quantity: 1, price: "gold/1" }
    ],
    attributes: {
      // loyalTo: "whom"?
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 4,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.engage, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "These are terrible times here, so beware.  The place is overrun with horrors from the depths.",
            responses: [convo.engage, convo.disengage]
          },
          {
            speech:
              "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
        disengaged: {
          speech: "Have a fine day, stranger.",
          responses: [convo.engage, convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "2/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  joe5: {
    name: "joe5",
    gltf: "gamebot5.glb",
    description: "",
    type: "friendly",
    equipped: [], // allow AI's to equip their inventory
    inventory: [
      { itemName: "armor", quantity: 1, price: "gold/1" }
    ],
    attributes: {
      // loyalTo: "whom"?
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 4,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.engage, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "These are terrible times here, so beware.  The place is overrun with horrors from the depths.",
            responses: [convo.engage, convo.disengage]
          },
          {
            speech:
              "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
        disengaged: {
          speech: "Have a fine day, stranger.",
          responses: [convo.engage, convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "2/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  joe6: {
    name: "joe6",
    gltf: "gamebot6.glb",
    description: "",
    type: "friendly",
    equipped: [], // allow AI's to equip their inventory
    inventory: [
      { itemName: "armor", quantity: 1, price: "gold/1" }
    ],
    attributes: {
      // loyalTo: "whom"?
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 4,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.engage, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "These are terrible times here, so beware.  The place is overrun with horrors from the depths.",
            responses: [convo.engage, convo.disengage]
          },
          {
            speech:
              "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
        disengaged: {
          speech: "Have a fine day, stranger.",
          responses: [convo.engage, convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "2/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  joe7: {
    name: "joe7",
    gltf: "gamebot7.glb",
    description: "",
    type: "friendly",
    equipped: [], // allow AI's to equip their inventory
    inventory: [
      { itemName: "armor", quantity: 1, price: "gold/1" }
    ],
    attributes: {
      // loyalTo: "whom"?
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 30,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 4,
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all",
          speech: "Let us trade.",
          responses: [convo.reset]
        },
        intro: {
          speech: "Hello there.",
          responses: [convo.engage, convo.wellwish]
        },
        engaged: [
          // ordered to allow progression
          {
            speech:
              "These are terrible times here, so beware.  The place is overrun with horrors from the depths.",
            responses: [convo.engage, convo.disengage]
          },
          {
            speech:
              "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.",
            responses: [convo.empathize, convo.disengage]
          },
          {
            speech:
              "Thank you for your concern, fellow man.  Care to trade in the meantime?",
            responses: [convo.trade, convo.wellwish]
          }
        ],
        disengaged: {
          speech: "Have a fine day, stranger.",
          responses: [convo.engage, convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "2/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },

  shopkeep: {
    name: "shopkeep",
    gltf: "shopkeep.glb",
    description: "Robust shopkeeper",
    type: "friendly",
    inventory: [

      { itemName: "bluepotion", quantity: 30, price: "gold/10" },
      { itemName: "redpotion", quantity: 30, price: "gold/10" },
      { itemName: "greenpotion", quantity: 30, price: "gold/10" },
      { itemName: "arrow25", quantity: 30, price: "gold/10" },
      { itemName: "bow", quantity: 10, price: "gold/10" },
      { itemName: "bait25", quantity: 30, price: "gold/10" },
      { itemName: "fishingPole", quantity: 10, price: "gold/10" },
      { itemName: "smallSword", quantity: 30, price: "gold/10" },
      { itemName: "miningHammer", quantity: 10, price: "gold/10" },
      { itemName: "sunSeed", quantity: 20, price: "gold/10" },
      { itemName: "mace", quantity: 3, price: "gold/200,aluminium/50,iron/250" },
      { itemName: "armor", quantity: 10, price: "gold/30,dragonPelt/1,aluminium/50,iron/50"},

    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 40,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 25,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        defaultState: "trade",
        state: "trade",
        trade: {
          wants: ["bagOfGems", "gold","aluminium","iron","dragonPelt"],
          speech: "Welcome to my shop, my friend."
        },
        comeback: {
          speech:
            "Hello there, stranger.  Come back when you have something to trade.",
          responses: [convo.wellwish]
        }
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "1/2/0",
        defense: "3/3/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      }
    }
  },
  centurion: {
    name: "centurion",
    gltf: "soldier.glb",
    description: "Robust Centurion",
    type: "friendly",
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 60,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 45,
      rotateY: 180,
      conversation: {
        state: "intro",
        engagementState: 0,
        challenge: {
          condition: ["keyToKingdom"],
          speech: "Please provide the passphrase.",
          challenge: "shibboleth",
          grants: "keyToKingdom",
          fail: "That is not the pass.",
          success: "The pass is right.  Here is your key to operate the lever."
        },
        intro: {
          speech: "Hello there, fine sir.  Have a glorious day.",
          responses: [convo.wellwish]
        }
      },
      stats: {
        health: "7/7/7",
        mana: "0/0/0",
        strength: "7/7/7",
        agility: "0/0/0", // stands in place
        defense: "10/10/0", // rock, weapon, arrow damage defense
        fire: "2/2/0",
        ice: "2/2/0",
        poison: "2/2/0",
        thunder: "2/2/0"
      }
    }
  },
  blacksmith: {
    name: "blacksmith",
    gltf: "blacksmith.glb",
    description: "Hearty blacksmith",
    type: "friendly",
    inventory: [
      { itemName: "blackBlade", quantity: 1, price: "gold/300,aluminium/100,iron/200" },
      { itemName: "blazingBlade", quantity: 1, price: "gold/700,aluminium/100,iron/200" },
      { itemName: "natureBlade", quantity: 1, price: "gold/900,aluminium/100,iron/200" },
      { itemName: "waterBlade", quantity: 1, price: "gold/500,aluminium/100,iron/200" },
      { itemName: "axe", quantity: 1, price: "gold/300,aluminium/100,iron/200" },
      { itemName: "blazingShield", quantity: 1, price: "gold/300,aluminium/100,iron/200" },
      { itemName: "thunderShield", quantity: 1, price: "gold/700,aluminium/100,iron/200" },
      { itemName: "waterShield", quantity: 1, price: "gold/600,aluminium/100,iron/200" },
      { itemName: "supermanArmor", quantity: 1, price: "gold/600,aluminium/100,iron/200" },
      { itemName: "legacyArmor", quantity: 1, price: "gold/500,aluminium/100,iron/200" },
      { itemName: "chevyArmor", quantity: 1, price: "gold/400,aluminium/100,iron/200" },
      { itemName: "miningPickAxe", quantity: 30, price: "gold/50" },
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 20,
      dialogHeight: 60,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 35,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: "all", // ["bagOfGems","gold","aluminium","smallSword"],
          speech: "Welcome to my shop, my friend."
        },
        intro: {
          speech:
            "Hello there, stranger.  Come back when you have something to trade.",
          responses: [convo.wellwish]
        }
      },
      cutScenes: {
        acceptDeal: "smithing.m4v"
      },
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "0/0/0",
        defense: "5/5/0", // rock, weapon, arrow damage defense
        fire: "5/5/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "5/5/0"
      }
    }
  },

  sunSeed: {
    name: "sunSeed",
    gltf: "",
    image: "sunSeed.png",
    description: "Sun Tree Seed",
    type: "friendly",
    subtype: "tree",
    attributes: {
      bears: "sunFruit",
      moves: false,
      animates: false,
      plantable: true,
      throwable: true,
      throwableAttributes: {
        pitch: 0.7, // angle up (percentage of 90 degrees)
        weight: 4, // lbs
        distance: 700, // px
        speed: 1 // 1 = full walking speed
      },
      height: 30,
      dialogHeight: 60,
      length: 20,
      width: 20,
      elevation: 0,
      scale: 10,
      equippedScale: 0.01,
      stats: {
        health: "2/2/0",
        mana: "0/0/0",
        strength: "1/1/0",
        agility: "0/0/0", // stands in place
        defense: "0/0/0", // rock, weapon, arrow damage defense
        fire: "0/0/0",
        ice: "0/0/0",
        poison: "0/0/0",
        thunder: "0/0/0"
      },
      stage: 0,
      gltfs: [
        "sunSeed2.glb",
        "sunTree1.glb",
        "sunTree2.glb",
        "sunTree3.glb",
        "sunTree4.glb"
      ],
      continuousSprites: true,
      sprites: [
        {
          name: "Heal",
          regex: "",
          frames: 10,
          scale: 5,
          elevation: 10,
          flip: false,
          time: 2
        }
      ]
    }
  },
  
  viking: {
    name: "viking",
    gltf: "viking.glb",
    description: "Viking with violent tendencies",
    type: "friendly",
    inventory: [
      { itemName: "zyphosSword", quantity: 1, price: "gold/3,smallSword/1,aluminium/1" },
      { itemName: "armor", quantity: 1, price: "gold/700,aluminium/100,iron/200" },
      { itemName: "hammer", quantity: 1, price: "gold/900,aluminium/100,iron/200" },
      { itemName: "axe2", quantity: 1, price: "gold/500,aluminium/100,iron/200" },
      { itemName: "axe", quantity: 1, price: "gold/250,aluminium/100,iron/200" },
      { itemName: "heavyAxe", quantity: 1, price: "gold/300,aluminium/100,iron/200" },
      { itemName: "miningPickAxe", quantity: 30, price: "gold/50" },
    ],
    attributes: {
      moves: true,
      animates: true,
      height: 30,
      dialogHeight: 60,
      handL: "handL",
      length: 20,
      width: 20,
      elevation: 0,
      scale: 17,
      goldValue: 1.1, // Slightly higher value of gold on exchanges
      conversation: {
        state: "intro",
        engagementState: 0,
        trade: {
          wants: ["all"],
          speech: "Welcome to my shop, my friend.",
          responses: [convo.reset]
        },
        special: {
          condition: ["masterDragonPelt"],
          speech:
            "Good work, my brother!  We have slain the mightiest dragons in the land, and given hope to us all!  The passphrase to enter the Kingdom is 'shibboleth'.  Perhaps we can begin to restore the kingdom?  Give me the Master Dragon Pelt and you have my loyalty.",
          responses: [convo.grant, convo.decline],
          jumpToState: "loyal" // if special condition is met
        },
        intro: {
          speech:
            "Hello there, stranger.  Come back when you have something to trade.",
          responses: [convo.wellwish]
        },
        loyalSubject: {
          speech: "Hello master!",
          responses: [convo.trade, convo.enlist, convo.carryon]
        },
        loyalFollower: {
          speech: "Yes?",
          responses: [convo.trade, convo.release, convo.carryon]
        }
      },
      stats: {
        health: "20/20/0",
        mana: "0/0/0",
        strength: "3/2/0",
        agility: "5/5/0",
        defense: "7/7/0", // rock, weapon, arrow damage defense
        fire: "1/1/0",
        ice: "1/1/0",
        poison: "1/1/0",
        thunder: "1/1/0"
      },
      handScaleFactor: 60,
      grants: ["gold10", "axe2"]
    },
    equipped: { Middle2R: ["axe2", false, null] }
  },

};
