module.exports = function (mongoose, callback) {

    const CONNECTION_STRING = process.env.DB || "mongodb://localhost:27017/nortonAdventure";

    const vectorSchema = mongoose.Schema({
        x: Number,
        y: Number,
        z: Number
    })

    const itemSchema = mongoose.Schema({
        name: String,
        gltf: String,
        image: String,
        description: String,
        type: String,
        location: vectorSchema,
        uuid: String,
        attributes: {
            animates: Boolean,
            scale: Number,
            elevation: Number,
        }
    })

    const structureSchema = mongoose.Schema({
        name: String,
        gltf: String,
        image: String,
        description: String,
        type: String,
        location: vectorSchema,
        uuid: String,
        attributes: {
            animates: Boolean,
            scale: Number,
            elevation: Number,
            key: String,
            unlocked: Boolean,
            routeTo: { 
                level: Number, 
                location: vectorSchema
            }
        }
    })

    const entitySchema = mongoose.Schema({
        name: String,
        gltf: String,
        image: String,
        description: String,
        type: String,
        location: vectorSchema,
        uuid: String,
        attributes: {
            moves: Boolean,
            animates: Boolean,
            height: Number,
            radius: Number,
            elevation: Number,
            scale: Number,
            elevation: 0,
            stats: {
                health: String,
                mana: String,
                strength: String,
                agility: String
            },
            conversation: [],
            offers: [],
            accepts: []
        }
    })

    const layoutSchema = mongoose.Schema({
        terrain: {
            description: String,
            gltf: String,
            fog: Boolean,
            fogColor: String,
            hemisphereLight: Boolean,
            overheadPointLight: Boolean,
            attributes: {
                scale: Number
            }
        },
        items: [itemSchema],
        structures: [structureSchema],
        entities: [entitySchema],
        width: Number,
        length: Number,
        background: String
    })

    const inventorySchema = mongoose.Schema({
        itemName: String,
        quantity: Number
    })

    const savedGameSchema = mongoose.Schema({
        gameName: {type: String, unique: true, required: true},
        props: {
            level: Number,
            layouts: {type: [layoutSchema], default: []}
        },
        heroTemplate: {
            name: String,
            type: String,
            location: vectorSchema,
            attributes: {
                moves: Boolean,
                height: Number,
                scale: Number,
                elevation: Number,
                stats: {
                    health: String,
                    mana: String,
                    strength: String,
                    agility: String
                },
                gltf: String,
                model: null,
                inventory: [inventorySchema],
                spells: [],
                equipped: {}
            }
        }
    })
      
    const SavedGame = mongoose.model('User', savedGameSchema);

    mongoose.connect(CONNECTION_STRING, { useMongoClient: true })
    .then(
      (db) => {
        callback(db);
      },
  
      (err) => {
          console.log('Database error: ' + err.message);
      }
    ); 
}