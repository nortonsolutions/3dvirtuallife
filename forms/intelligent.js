import { AnimatedForm } from './animated.js'

let hitSpriteConfig = { 
    name: "hit1",
    regex: "",
    frames: 8,
    scale: 40, 
    elevation: 30,
    flip: false,
    time: .1
}

/** IntelligentForms are AnimatedForms which also
 * move and make decisions every turn.  Subclasses
 * include the Hero and ArtificialForms (AIs).
 * 
 * They also have an inventory and can equip items.
 */

export class IntelligentForm extends AnimatedForm{

    constructor(template, sceneController) {
        super(template, sceneController);

        // Animation mixer has been added by superclass
        this.absVelocity = 0;
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );
        
        this.justJumped = false;
        this.standingUpon = null;
        this.canJump = true;
        this.alive = true;

        this.inventory = this.template.inventory;
        this.attributes = this.template.attributes;
        this.spells = this.template.spells;
        this.equipped = this.template.equipped? this.template.equipped: [];

        this.movementRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.length/2 + 35 );

    }

    /** load is for loading the model and animations specifically */
    load(callback) {
        
        super.load(() => {
            // this.listGeometries(this.model);
            // this.listPositions(this.model);
            // this.getBoundingSphereHandR(this.model);
            // this.setToDoubleSided(this.model);

            this.principalGeometry = this.identifyPrincipalGeometry(this.model);
            if (!this.principalGeometry) this.findFirstGeometry(this.model);
            
            // if (this.principalGeometry){
                this.principalGeometry.computeBoundingSphere();
                this.principalBoundingSphere = this.principalGeometry.boundingSphere;
                this.radius = this.principalBoundingSphere.radius * this.attributes.scale;
            // }
            
            this.computeVertexNormals(this.model);
            this.setToCastShadows();

            if (this.equipped) {
                // Reduce cached boosts to zero before re-equipping
                Object.keys(this.attributes.stats).forEach(stat => {
                    this.changeStatBoost(stat, -this.getStatBoost(stat));
                })

                Object.keys(this.equipped).forEach(bodyPart => {
                    this.equip(bodyPart, this.equipped[bodyPart][0], this.equipped[bodyPart][1], this.equipped[bodyPart][2], true); // bodyPart, itemName, throwable
                })
            }
            
            // this.sceneController.socket.emit('updateHeroTemplate', { level: this.sceneController.level, heroTemplate: this.returnTemplate() });
            this.addHealthBarToModel();

            if (this.attributes.movementRadius) {
                this.startingPoint = new THREE.Vector3();
                this.startingPoint.copy(this.model.position);
            }

            if (callback) callback();
        })

    }

    /**
     * The purpose of identifyPrincipalGeometry is to set this.principalGeometry,
     * which will be used throughout the life of the intelligence to identify its
     * bounding box (used for collision detection).
     * 
     * Lobato's models use the 'IcoSphere' geometry as its basis;
     * Tidwell's models use the 'Body' or 'Rat_Geometry'.
     * Rodney's models use 'Cube' or some variant like 'Cube.001_0'
     * Default robot model uses 'Head_*' for head and 'Torso_*' for its torso.
     * Horse uses 'mesh_0'
     *
     * TODO: Otherwise find the FIRST geometry...?
     */
    identifyPrincipalGeometry(el)  {
        // let possibleNames = ['Torso_0', 'Head_0', 'Icosphere', 'Body', "Cube.001_0", "Cube", "Body_0", "Rat_Geometry", 'Mesh_0', "Leg.R_0", "Elf_0", "Elf01_posed.002_0"];
        let possibleNames = ['Torso_0', 'Head_0'];
        for (const name of possibleNames) {
            if (el.getObjectByName(name)) {
                return el.getObjectByName(name).geometry;
            }
        }
    }

    getBoundingSphereHandR(el) {
        let temp = this.model.getObjectByName('HandR').geometry; // .children[1];
        temp.computeBoundingSphere();
    }

    spriteScaleX(stat) { // can't be zero
        return Math.max((this.getEffectiveStat(stat) / this.getStatMax(stat))*10 / this.attributes.scale, 0.0001);
    }

    addHealthBarToModel() {
        
        // addSprites = (model, spriteConfig, scene = null, broadcast = false, position = null) => {
        let spriteConfig = {
            name: 'greensquare',
            frames: 1,
            scale: 10 / this.attributes.scale,
            scaleY: .25,
            elevation: 63 / this.attributes.scale,
            flip: false,
            animates: false,
            time: null
        }
        
        this.healthSprite = this.sceneController.formFactory.addSprites(this.model, spriteConfig);
        this.healthSprite.scale.x = this.spriteScaleX("health");
        
        spriteConfig = {
            name: 'redsquare',
            frames: 1,
            scale: 10 / this.attributes.scale,
            scaleY: .25,
            elevation: 60 / this.attributes.scale,
            flip: false,
            animates: false,
            time: null
        }
        
        this.manaSprite = this.sceneController.formFactory.addSprites(this.model, spriteConfig);
        this.manaSprite.scale.x = this.spriteScaleX("mana");

    }

    findFirstGeometry(el) {
        if (!this.principalGeometry && el.geometry) {
            this.principalGeometry = el.geometry;
        } else if (!this.principalGeometry) {
            for (let i = 0; i < el.children.length; i++) {
                this.findFirstGeometry(el.children[i]);
            }
        }
    }

    listGeometries(el) {

        if (el.geometry) {
            console.log(`${this.objectName}: ${el.name}`);
            el.children.forEach(child => {
                this.listGeometries(child);
            })
        } else {
            el.children.forEach(child => {
                this.listGeometries(child);
            })
        }
    }

    listPositions(el) {
        if (el.position) {
            console.log(`${this.objectName}: ${el.name} ${el.position.x},${el.position.z} `);
            el.children.forEach(child => {
                this.listPositions(child);
            })
        } else {
            el.children.forEach(child => {
                this.listPositions(child);
            })
        }
    }



    /**
     * This function will move an entity from one location to another.
     * Direction is relative to the entity in question
     */
    move(delta) {
        
        if (this.alive) {
            let worldDirection = new THREE.Vector3().copy(this.direction).applyEuler( this.rotation );
            this.movementRaycaster.ray.direction.x = worldDirection.x; // -worldDirection.x;
            this.movementRaycaster.ray.direction.z = worldDirection.z; // -worldDirection.z;
            this.movementRaycaster.ray.origin.y += this.attributes.height;
            
            if (typeof this.sceneController.waterElevation == "number") {
                
                if (this.model.position.y <= this.sceneController.waterElevation) {
                    if (this.attributes.swims) {
                        this.swimming = true;
                    } else {
                        let distanceBelowWater = Math.abs(this.sceneController.waterElevation - this.model.position.y);
                        this.underWater(distanceBelowWater);
                    }
                } else {
                    if (this.attributes.swims) this.swimming = false;
                }
    
            } else if (this.attributes.swims && this.attributes.movementRadius) {
                this.swimming = true;
            } else if (this.sceneController.layout.terrain.attributes.addPonds && this.atWaterSource()) {
                // If floor line is below water line....
                let pondLine = this.determinePondElevation();
                let floorLine = this.determineElevationFromBase();
                if (floorLine < pondLine) {
                    // console.log(`${this.objectName} - floorLine ${floorLine} is below pondLine ${pondLine}`)
                    if (this.attributes.swims) {
                        this.swimming = true;
                    } else {
                        let distanceBelowWater = Math.abs(pondLine - floorLine);
                        this.underWater(distanceBelowWater);
                    }
                } 

            } 


            let fIntersects = this.movementRaycaster.intersectObjects(this.sceneController.structureModels, true);
            
            if (fIntersects.length == 0) { // || (fIntersects[0] && fIntersects[0].object.type == "Sprite")) { // Nothing is in the front, so move forward at given velocity
                
                if (this.attributes.movementRadius && this.outOfMovementRadius()) {
                    this.stopAndBackup(delta);
                } else {
                    this.model.translateX( this.velocity.x * delta );
                    this.model.translateY( this.velocity.y * delta );
                    this.model.translateZ( this.velocity.z * delta );
                }
    
            } else { // Something is blocking, so stop without moving
                // if (this.objectSubtype == "local") //local only?
                this.stopAndBackup(delta);
            }

            this.intermittentRecharge();

            if ((this.objectType == 'hero' && this.objectSubtype == 'local') || this.objectType == 'friendly') {
                if (this.handAttackR){
                    this.handleAttack('Middle2R');
                } else if (this.handAttackL){
                    this.handleAttack('Middle2L');
                } else if (this.kickAttackR){
                    this.handleAttack('FootR');
                } else if (this.kickAttackL){
                    this.handleAttack('FootL');
                }
            }


        }
    }

    atMineralSource() { // returns mineral name or null
        
        // this.sceneController.waterSources -- arsay of waterSources, i.e.,
        //  [[{position},radius],[{position},radius]]
        for (let mineralSource of this.sceneController.mineralSources) {
            let position = new THREE.Vector3(mineralSource[0].x, mineralSource[0].y, mineralSource[0].z);
            let distance = mineralSource[1];

            // test my distance
            if (this.model.position.distanceTo(position) <= distance) {
                // console.log(`${this.objectName} near mineral source`);
                return mineralSource[2]; // mineral name
            } 
        }
        
        return null;
    }

    atWaterSource() {
        
        // this.sceneController.waterSources -- array of waterSources, i.e.,
        //  [[{position},radius],[{position},radius]]
        for (let waterSource of this.sceneController.waterSources) {
            let position = new THREE.Vector3(waterSource[0].x, waterSource[0].y, waterSource[0].z);
            let distance = waterSource[1];

            // test my distance
            if (this.model.position.distanceTo(position) <= distance) {
                // console.log(`${this.objectName} near water source`);
                return true;
            } 
        }
        
        return false;
    }

    underWater(distanceBelowWater) {
        // console.log(`under water!`)
        this.velocity.x *= Math.max((100-(distanceBelowWater*3))/100,.5);
        this.velocity.y *= Math.max((100-(distanceBelowWater*3))/100,.5);
        this.velocity.z *= Math.max((100-(distanceBelowWater*3))/100,.5);

        if (this.sceneController.water && this.sceneController.water.attributes.lava && this.getEffectiveStat('fire')<5) {
            this.changeStat('health',-distanceBelowWater/1000);
        }
    }

    stopAndBackup(delta) {

        this.model.translateX( -this.velocity.x * delta );
        this.model.translateY( -this.velocity.y * delta );
        this.model.translateZ( -this.velocity.z * delta );

        this.velocity.x = 0;
        this.velocity.y = 0;
        this.velocity.z = 0;

        if (this.acceleration) {
            this.acceleration.x = -this.acceleration.x;
            this.acceleration.y = -this.acceleration.y;
            this.acceleration.z = -this.acceleration.z;
    
        }
        
    }

    outOfMovementRadius() { // assumes static position
        return (this.startingPoint.distanceTo(this.model.position) >= this.movementRadius)                
    }

    handleAttack(bodyPart) {

        let diff = new THREE.Vector3();
        // What is the world position of my hands or their associated weapons?  Start with right hand.
        let weapon = this.equipped[bodyPart]? this.equipped[bodyPart][0] : bodyPart;
        this.positionWeapon = weapon==bodyPart? this.model.getObjectByName(bodyPart).getWorldPosition(this.positionWeapon) : this.model.getObjectByProperty("objectName", weapon).getWorldPosition(this.positionWeapon);
        
        for (const entity of this.sceneController.allEnemiesInRange(100, this.model.position)) {

            diff.subVectors(this.positionWeapon, entity.model.position);

            console.log(`Diff between weaponPos and entity model pos: ${diff.length()}; radius ${entity.radius}`);
            if ( diff.length() < entity.radius ) {
                let hitPointReduction = (getRandomArbitrary(0,this.getEffectiveStat('strength'))/3);
                this.inflictDamage(entity, hitPointReduction, "generalDamage");

                // Add hit sprites at the location of the hand:
                this.sceneController.formFactory.addSprites(null, hitSpriteConfig, this.sceneController.scene, true, this.positionWeapon);
            }
        }

    }

    /**
     * 
     * @param entity 
     * @param hitPointReduction - base hitPoint reduction
     * @param type - type of damage
     */
    inflictDamage(entity, hitPointReduction, type) {
        
        console.log(`Inflicting ${hitPointReduction} damage, type ${type}, on ${entity.objectName}, health: ${entity.getEffectiveStat('health')}`);
        var defenseRating = entity.getEffectiveStat('defense');
        // check the defense level for this type of damage
        switch (type) {
            case "iceDamage":
                defenseRating += entity.getEffectiveStat('ice');
                break;
            case "fireDamage":
                defenseRating += entity.getEffectiveStat('fire');
                break;
            case "poisonDamage":
                defenseRating += entity.getEffectiveStat('poison');
                break;
            case "thunderDamage":
                defenseRating += entity.getEffectiveStat('thunder');
                break;
            default:
                break;
        }

        hitPointReduction = Math.max(hitPointReduction - defenseRating,0.03);

        console.log(`Defense rating is: ${defenseRating} ... total reduction: ${hitPointReduction}`);
        if (entity.changeStat('health', -hitPointReduction, false) <= 0) {
    
            this.attributes.experience += entity.getStatMax('health');

            if (this.objectType == "hero" && this.levelUpEligibility().length > 0) {
                setTimeout(() => {
                    this.sceneController.eventDepot.fire('modal', { type: 'levelUp', title: 'Level Up', context: this.levelUpEligibility() });
                }, 1500);
            }

            this.sceneController.eventDepot.fire('updateXP', this.attributes.experience); 
        };
    }


    setElevation() {
        
        let downRayOriginHeight = this.model.position.y + 50;

        this.downRaycaster.ray.origin.copy(this.model.position);
        this.downRaycaster.ray.origin.y = downRayOriginHeight;

        let downwardIntersections = this.downRaycaster.intersectObjects( this.sceneController.structureModels, true );
        if (downwardIntersections[0]) { 
            var topOfObject = downRayOriginHeight - downwardIntersections[0].distance + 2;
            if (this.model.position.y <= topOfObject) {
                this.model.position.y = topOfObject;

                if (this.objectType == "hero") {
                    let standingUponImmediate = downwardIntersections[0].object;
                    let standingUpon = getRootObject3D(downwardIntersections[0].object);

                    this.standingUpon = {
                        objectName: standingUpon.objectName,
                        objectType: standingUpon.objectType,
                        objectSubtype: standingUpon.objectSubtype,
                        attributes: standingUpon.attributes
                    }

                    if (standingUponImmediate && (standingUponImmediate.name == "entryMat" || standingUponImmediate.name == "exitMat" || standingUponImmediate.name == "Base")) {// standingUponImmediate.parent && standingUponImmediate.parent.attributes && standingUponImmediate.parent.attributes.keyCode) {
                        this.standingUponImmediate = {
                            objectName: standingUponImmediate.name,
                            controls: standingUponImmediate.parent.attributes.layoutId,
                            keyCode: standingUponImmediate.parent.attributes.keyCode
                        }
                    } else {
                        this.standingUponImmediate = null;
                    }
                }

                this.velocity.y = Math.max( 0, this.velocity.y );
                this.canJump = true;
                this.justJumped = false;
            }
            
        } else {

            this.standingUpon = null;

            let newYposition = this.determineElevationFromBase();

            if (newYposition == -1) { 
                this.model.position.x = shiftTowardCenter(this.model.position.x, 1);
                this.model.position.z = shiftTowardCenter(this.model.position.z, 1);
                return -1;
            } else if ((this.model.position.y - newYposition) < this.attributes.height) {
                this.model.position.y = newYposition;
            }
        }
    }

    death(local = true) {
        this.alive = false;
        
        this.sceneController.entities = this.sceneController.entities.filter(el => el != this);
        this.fadeToAction("Death", 0.2);
        
        if (local) {
            this.sceneController.socket.emit('death', {level: this.sceneController.level, layoutId: this.attributes.layoutId, hero: this.objectType=="hero"});
            if (this.attributes.grants) {
                this.attributes.grants.forEach(itemName => {
                    // load the object model to the scene, copy the position/rotation of hero,

                    let position = new THREE.Vector3();
                    position.copy(this.model.position);
                    // position.y = this.determineElevationFromBase(); // causes disappearing floor!
                    
                    let data = {
                        itemName,
                        position
                    };

                    this.sceneController.dropItemToScene(data);

                })
            }

        } else {

        }


        setTimeout(() => {  // Wait until the death scene has occurred before removal
            this.sceneController.forms = this.sceneController.forms.filter(el => {
                return el.model.attributes.layoutId != this.attributes.layoutId;
            });
            
        }, 4000);
    }

    firstInventorySlot() {
        let max = this.inventory.length;
        for (let i = 0; i < this.inventory.length; i++ ) {
            if (!this.inventory[i] || !this.inventory[i].itemName) return i;
        }
        return max;
    }

    getInventoryQuantity(itemName) {
        var itemIndex = this.inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1) {
            return this.inventory[itemIndex].quantity;
        } else return 0;
    }

    getInventoryKeyCode(itemName) {
        var itemIndex = this.inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1 && this.inventory[itemIndex].keyCode) {
            return this.inventory[itemIndex].keyCode;
        } else return null;
    }

    getGoldValue(itemName) {

        let obj = this.sceneController.getTemplateByName(itemName);
        if (obj.attributes.value) {

            let goldValue = this.attributes.goldValue? this.attributes.goldValue: 1;
            return Number(obj.attributes.value / goldValue);
        } else return 0;
    }

    getTotalNetWorth() {
        let worth = 0;
        this.inventory.forEach(item => {
            if (item.itemName == "gold") {
                worth += item.quantity;
            } else {
                worth += getGoldValue(item.itemName);
            }
        })
        return worth;
    }

    addToInventory(itemName, desiredIndex, quantity = 1, keyCode = null) {

        var newQuantity;
        var itemIndex = this.inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1) {
            newQuantity = this.inventory[itemIndex]? this.inventory[itemIndex].quantity + quantity : 1;
        } else {

            // If desiredIndex is already defined, use the first inventory slot
            if (desiredIndex == undefined || this.inventory[desiredIndex]) {
                itemIndex = this.firstInventorySlot();
            } else itemIndex = desiredIndex;

            newQuantity = quantity;
        }

        this.inventory[itemIndex] = {
            itemName: itemName,
            quantity: newQuantity
        }

        if (keyCode) this.inventory[itemIndex].keyCode = keyCode;

        if (this.objectSubtype == "local") this.cacheHero();
        return {itemIndex, quantity: newQuantity};
    }

    /**
     * returns the remaining quantity
     */
    removeFromInventory(itemName) {

        let index = this.inventory.findIndex(el => {
            return el != undefined && el.itemName == itemName
        });

        var quantityRemaining;
        if (index != -1) {
            if (this.inventory[index].quantity > 1) {
                this.inventory[index].quantity--;
                quantityRemaining = this.inventory[index].quantity;
            } else {
                this.inventory[index] = null;
                quantityRemaining = 0;
            }
        } else quantityRemaining = -1;

        if (this.objectSubtype == "local") this.cacheHero();
        return quantityRemaining;
    }

    swapInventoryPositions(first,second) {
        let temp = {...this.inventory[first]};
        let temp2 = {...this.inventory[second]};
        this.inventory[first] = temp2;
        this.inventory[second] = temp;
        if (this.objectSubtype == "local") this.cacheHero();
    }

    getInventory() {
        return this.inventory;
    }
l
    inventoryContains(items) {

        if (items == 'all') return true;
        var found = false;
        items.forEach(item => {
            if (this.inventory.map(el => el? el.itemName: null).includes(item)) found = true;
        })
        return found;
    }

    inventoryContainsAll(items) {
        for (const item of items) {
            if (!(this.inventory.map(el => el? el.itemName: null).includes(item))) return false;
        }
        return true;
    }

    inventoryDoesNotContain(item) {
        if ((this.inventory.map(el => el? el.itemName: null).includes(item))) return false;
        return true;
    }

    equip(area, itemName, throwable = false, throws = null, initial = false) {
        this.equipped[area] = [itemName,throwable,throws];
        
        if (this.objectType == "hero" && this.objectSubtype == "local") {
            this.cacheHero();
            if (!initial) this.sceneController.socket.emit('updateHeroTemplate', { level: this.sceneController.level, heroTemplate: this.returnTemplate() });
        }

        if (area.match('key')) {
            this.sceneController.eventDepot.fire('refreshSidebar', { equipped: this.equipped });
        } else {
            this.sceneController.loadFormByName(itemName, (item) => { // no layoutId

                item.model.position.set(0,0,0);

                if (item.attributes.rotateY) item.model.rotateY(degreesToRadians(item.attributes.rotateY));
                if (item.attributes.rotateX) item.model.rotateX(degreesToRadians(item.attributes.rotateX));
                if (item.attributes.rotateZ) item.model.rotateZ(degreesToRadians(item.attributes.rotateZ));

                if (item.model.attributes.rotateY) item.model.rotateY(degreesToRadians(item.model.attributes.rotateY));
                if (!this.attributes.flipWeapon || (this.attributes.flipWeapon && item.attributes.mountable)) item.model.rotateY(Math.PI); // player specific

                let scale = item.attributes.equippedScale? item.attributes.equippedScale: 0.1;
                if (this.attributes.handScaleFactor && !item.attributes.mountable) scale *= this.attributes.handScaleFactor;
                // if (this.attributes.mountScaleFactor && item.attributes.mountable) scale *= this.attributes.mountScaleFactor;
                item.model.scale.copy(new THREE.Vector3( scale, scale, scale ));

                // if (itemName == "torch") {
                //     this.sceneController.formFactory.addTorchLight(item.model);
                // } 

                if (item.attributes.effect && !item.attributes.throwable) { // body parts (non 'key' positions)
                    
                    // What is the item effect?
                    let stat = item.attributes.effect.split("/")[0];
                    let change = Number(item.attributes.effect.split("/")[1]);
    
                    switch (stat) {
                        case "health":
                        case "mana":
                        case "strength":
                        case "agility":
                        case "defense":
                        case "fire":
                        case "ice":
                        case "thunder":
                        case "poison": 
                            this.changeStatBoost(stat, change);
                            break;
                        case "light":
                            if (this.sceneController.overheadPointLight) this.sceneController.overheadPointLight.intensity += 10;
                            break;
                    }
                }
                
                switch (area) {
                    case "special":
                        break;
                    case "feet":
                        let itemCopy = new THREE.Object3D().copy(item.model);
                        if (this.model.getObjectByName("FootR")) {
                            this.model.getObjectByName("FootR").add(item.model);
                        } else if (this.model.getObjectByName("footR")) this.model.getObjectByName("footR").add(item.model);
                        if (this.model.getObjectByName("FootL")) {
                            this.model.getObjectByName("FootL").add(itemCopy);
                        }  else if (this.model.getObjectByName("footL")) this.model.getObjectByName("footL").add(itemCopy);
                        break;
                    case "mount":

                        switch (itemName) { 
                            case "balloon":
                                // special case for remote balloon ?!?
                                if (this.objectSubtype == "remote") {
                                    item.model.rotation.y += Math.PI;
                                    scale = scale/10;
                                    item.model.scale.copy(new THREE.Vector3( scale, scale, scale ));
                                    item.model.position.y += this.attributes.height/10;
                                } else {
                                    item.model.position.y += this.attributes.height;
                                }
                                break;
                            case "horse":
                            case "fireSteed":
                            case "cosmichorse":
                            case "brownhorse":
                            case "blackhorse":
                            case "whitehorse":
                            case "chestnuthorse":
                            case "painthorse":
                            case "fishingBoat":
                                
                                if (this.objectSubtype == "remote") {
                                    item.model.rotation.y += Math.PI;
                                    scale = scale/10;
                                    item.model.scale.copy(new THREE.Vector3( scale, scale, scale ));
                                    item.model.position.y -= item.attributes.height/10;
                                } else {
                                    item.model.position.y -= item.attributes.height;
                                }
                                break;
                        }


                        this.model.add(item.model);
                        
                        if (this.objectSubtype == "local") {
                            this.mounted = true;
                            this.mountedUpon = item;
                            // updateAttributes for remote animation connection
                            this.updateAttributes({mountedUpon: itemName});
                            switch (itemName) { 
                                case "balloon":
                                    this.balloonFloat = true;
                                    this.balloonRide = true;
                                    break;
                                case "horse":
                                case "fireSteed":
                                case "cosmichorse":
                                case "brownhorse":
                                case "blackhorse":
                                case "whitehorse":
                                case "chestnuthorse":
                                case "painthorse":
                                case "fishingBoat":
                                    this.mountedUpon.controlled = true;
                                    this.mountedUpon.updateAttributes({controlled: true});
                                    break;
                            }
                        }
                        break;
                    default:
                        this.model.getObjectByName(area).add(item.model);
                        break;
                }

                if (item.attributes.animates) {
                    
                    this.animatedSubforms.push([area,item]);
                    if (item.attributes.animationOnEquip) {
                        item.runActiveAction(2);
                    }
                }

                if (item.attributes.sprites) {
                    item.attributes.sprites.forEach(spriteConfig => {
                        if (spriteConfig.showOnEquip) {
                            this.sceneController.formFactory.addSprites(item.model, spriteConfig, null, false);
                        }
                    })
                } 
            },true,false,false);  // optional: addToForms, reseed, trackEntity
        }



    }
    
    unequip(area, death = false) {
        
        if (this.equipped[area]) {
            let itemName = this.equipped[area][0];

            delete this.equipped[area];


            
            if (this.objectType == "hero" && this.objectSubtype == "local") {

                if (area == 'mount' && this.mountedUpon) {
                    this.mountedUpon = this.attributes.mountedUpon = null;
                    // this.updateAttributes({mountedUpon: null});  // is this redundant?

                    // clean up the forms for the item without layoutId
                    this.sceneController.cleanupForms();
                }
                
                this.cacheHero();
                if (!death) this.sceneController.socket.emit('updateHeroTemplate', { level: this.sceneController.level, heroTemplate: this.returnTemplate() });
            }

            if (area.match('key')) {
                this.sceneController.eventDepot.fire('refreshSidebar', { equipped: this.equipped });
            } else {
                
                let item = this.sceneController.getTemplateByName(itemName);
    
                if (area != "special") { // special = no model to remove
                    let thisItem = this.model.getObjectByProperty("objectName", itemName);
                    // let layoutId = thisItem.attributes.layoutId;

                    // let data = {
                    //     layoutId,
                    //     type: thisItem.objectType,
                    //     level: this.sceneController.level
                    // }
                    // this.sceneController.takeItemFromScene(data);



                    this.sceneController.forms = this.sceneController.forms.filter(el => el.model != thisItem);
                    thisItem.parent.remove(thisItem);
                    this.sceneController.scene.scene.remove(thisItem);
                    
                }
    
                if (item.attributes.effect) {
                    let stat = item.attributes.effect.split("/")[0];
                    let change = Number(item.attributes.effect.split("/")[1]);
        
                    switch (stat) {
                        case "health":
                        case "mana":
                        case "strength":
                        case "agility": 
                            this.changeStatBoost(stat, -change);
                            break;
                        case "light":
                            if (this.sceneController.overheadPointLight) this.sceneController.overheadPointLight.intensity -= change;
                            break;
                    }
                }
    
                if (item.attributes.animates) {
                    this.animatedSubforms = this.animatedSubforms.filter(el => { el[0] != area });
                }
            }
        }
    }

    returnTemplate() {

        return {
            name: this.objectName,
            type: this.objectType,
            subtype: this.objectSubtype,
            location: this.location,
            attributes: this.attributes,
            gltf: this.template.gltf,
            inventory: this.inventory,
            spells: this.spells,
            equipped: this.equipped,
            party: this.party
        }
    }

    /**
     * e.g.
     * attributes: {
            manaCost: 1,
            effect: "damage/3",
            range: 80,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: 1, // lbs
                distance: 1200, // px
                speed: 4 // 1 = full walking speed
            },
            sprites: [{ 
                name: "greenExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 30,
                flip: false,
                time: 1
            },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,s
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
     */

    castSpell(spell, local = true, hostile = false) {
        
        if (local && !hostile) {
            if (this.getStat("mana") < spell.attributes.manaCost) return;
            this.changeStat('mana', -spell.attributes.manaCost);
        }

        if (spell.attributes.throwable) {
            this.launch(spell.name, null, [], local, null, hostile);
        } else {
            if (local && spell.attributes.affectAllInParty) { // general effect against all in range
                let inRange = this.sceneController.allFriendliesInRange(spell.attributes.range, this.model.position);
                inRange.forEach(entity => {
                    this.sceneController.socket.emit('castSpell', { level: this.sceneController.level, layoutId: entity.attributes.layoutId, spell, hostile });    
                });
            }

            this.takeEffect(spell);

            // Sprite effects:
            if (spell.attributes.sprites) {
                spell.attributes.sprites.forEach(spriteConfig => {
                    this.sceneController.formFactory.addSprites(this.model, spriteConfig, null, true);
                })
            }
        }
    }

    /** 
     * launch is used for throwables, like greenpotion, arrows, spells, etc.
     * Every throwable item has specific properties including quantity,
     * raised pitch, and weight (which affects how the trajectory declines).
     * 
     * Throwing an item affects inventory similarly to using a hotkey potion,
     * pulling from inventory until the last item is used (or all mana is used).
     * 
     * When local = false, data is expected to define rotation/position.
     */
    launch(itemName, bodyPart = null, [parentBodyPart, parentItemName] = [], local = true, data, hostile = false) {

        if (local) {
            // If this is a child item, check inventory first and bail if needed
            if (parentBodyPart && this.getInventoryQuantity(itemName) == 0) {
                this.unequip(parentBodyPart);
                this.addToInventory(parentItemName, 0, 1);
            } else {
                // load the object model to the scene, copy the position/rotation of hero
                this.sceneController.loadFormByName(itemName, (item) => {

                    if (item.activeAction) {
                        item.activeAction.play();
                    }
                    item.model.position.copy(this.model.position);
                    item.model.rotation.copy(this.model.rotation);
                    item.model.position.y += this.attributes.height;
                    
                    // Starting direction
                    let direction = new THREE.Vector3().copy(this.direction); // this.sceneController.scene.controls.getDirection(new THREE.Vector3( 0, 0, 0 ));
                    
                    if (hostile) {
                        item.model.rotateY(Math.PI);
                    }
                    
                    direction.y += item.attributes.throwableAttributes.pitch;

                    item.direction = direction;

                    this.sceneController.socket.emit('launch', { level: this.sceneController.level, itemName, position: item.model.position, rotation: item.model.rotation, direction, hostile })
                    this.sceneController.addToProjectiles(item, local, hostile);
                    
                    if (bodyPart || parentBodyPart) { // remove from inventory, unequip when out
                        if (this.removeFromInventory(itemName) == -1) {
                            this.unequip(parentBodyPart? parentBodyPart : bodyPart);
    
                            // re-equip parent item to inventory if applicable
                            if (parentBodyPart) this.addToInventory(parentItemName, 0, 1);
                        }
                    }
                },true,false,false); // addToForms, reseed, trackEntity

            }

        } else {
            this.sceneController.loadFormByName(itemName, (item) => {

                item.model.position.copy(data.position);
                item.model.rotation.copy(data.rotation);
                item.direction = data.direction;
                
                this.sceneController.addToProjectiles(item, local, hostile);
            }, false, false, false);
        }

    }

    /**
     * side is L or R; shift is true (kick) or false (hand)
     */
    attack(side, shift) {
        
        if (side=='R' && !shift && this.handAttacksR.length == 0) {
            side = 'L';
        } else if (side=='L' && !shift && this.handAttacksL.length == 0) {
            side = 'R';
        } else if (side=='R' && shift && this.kickAttacksR.length == 0) {
            side = 'L';
        } else if (side=='L' && shift && this.kickAttacksL.length == 0) {
            side = 'R';
        }
        
        // this.handAttacksR = [];
        // this.kickAttacksR = [];
        // this.handAttacksL = [];
        // this.kickAttacksL = [];

        if (this.kickAttacks.length == 0) shift = false;
        let possibleAttacks = shift ? "kickAttacks" + side: "handAttacks" + side;
        
        // Choose an attack
        let attack = this[possibleAttacks][getRndInteger(0,this[possibleAttacks].length-1)];
    
        /** During action runtime, this.handAttack==true */
        this.fadeToAction(attack, 0.2);

    }

}