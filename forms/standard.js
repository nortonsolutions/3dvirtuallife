
/** 
 * StandardForm is a base class for all forms,
 * inanimate or animate (structures, items, entities)
 * provides basic positioning and template information;
 * subclasses include Animated.
 * 
 * Knows how to create its own model based on template.
 */

var upRaycasterTestLength = 1600; 
var downRaycasterTestLength = 80;


export class StandardForm {
    
    constructor(template, sceneController) {

        this.template = template;
        this.sceneController = sceneController;

        this.upRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, upRaycasterTestLength);
        this.downRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength );

        this.objectName = this.template.name;
        this.objectType = this.template.type;
        this.objectSubtype = this.template.subtype;
        
        this.inventory = this.template.inventory ? this.template.inventory : [];
        this.attributes = this.template.attributes;
        this.random = Math.random();
        
        this.model = null;

        this.setRoofToSingleSided = this.setRoofToSingleSided.bind(this);
        this.load = this.load.bind(this);

        this.firstMaterial = null;
    }

    /** load is for loading the model and animations specifically */
    load(callback) {
        
        if (typeof this.template.attributes.stage == "number") {
            this.template.gltf = this.template.attributes.gltfs[this.template.attributes.stage];
        }

        this.sceneController.loader.load( '/models/3d/gltf/' + this.template.gltf, (gltf) => {
        
            let model = gltf.scene;
            
            model.objectName = this.template.name;
            model.objectType = this.template.type;
            model.objectSubtype = this.template.subtype;
            model.attributes = this.template.attributes;

            model.scale.x = this.template.attributes.scale;
            model.scale.y = this.template.attributes.scale;
            model.scale.z = this.template.attributes.scale;

            if (this.template.attributes.rotateY) model.rotateY(degreesToRadians(this.template.attributes.rotateY));
            if (this.template.attributes.rotateX) model.rotateX(degreesToRadians(this.template.attributes.rotateX));
            if (this.template.attributes.rotateZ) model.rotateZ(degreesToRadians(this.template.attributes.rotateZ));
            this.model = model;
            this.animations = gltf.animations;
           
            if (this.template.location) {
                this.model.position.x = this.template.location.x * multiplier;
                this.model.position.z = this.template.location.z * multiplier;

                if (!this.template.attributes.staticStartingElevation) {
                    if (this.template.attributes.floats) {
                        this.model.position.y = this.determinePondElevation();     
                    } else {
                        this.model.position.y = this.determineElevationFromBase() + this.attributes.elevation;     
                    }
                   
                } else {
                    this.model.position.y = this.template.location.y * multiplier;
                }
                // this.tweakPosition();

                
            } else if (this.objectName == "floor") { // floor is the only form without location
                this.setRoofToSingleSided();
                this.setFloorToReceiveShadow();
            }

            if (this.objectName == "balloon") {
                this.setToFrontSided(this.model);
            }

            if (this.attributes.transparentWindows) {
                let windows = this.model.getObjectByName('windows');
                this.setMaterialRecursive(windows, "transparent", true);
                this.setMaterialRecursive(windows, "opacity", 0.1);
            } else if (this.objectName == 'orb') {
                this.model.children[1].material.opacity = 0.5;
            } else if (this.model.objectName == 'ghostGhoul') {
                this.model.children[0].children[1].material.opacity = 0.3;
            } else if (this.attributes.emissiveIntensity) {
                this.setMaterialRecursive(this.model, "emissiveIntensity", this.attributes.emissiveIntensity);
            }

            // this.computeVertexNormals(this.model);
            // this.setToCastShadows();
            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    setMaterialRecursive(el, property, value) {
        if (el.material) {
            el.material[property] = value;
        } else if (el.children && el.children.length > 0) {
            for (let i = 0; i < el.children.length; i++) {
                this.setMaterialRecursive(el.children[i], property, value);
            }
        }
    }

    findFirstMaterial(el) {
        if (!this.firstMaterial && el.material) {
            this.firstMaterial = el.material;
        } else if (!this.firstMaterial) {
            for (let i = 0; i < el.children.length; i++) {
                this.findFirstMaterial(el.children[i]);
            }
        }
    }

    /** 
     * Test the position to ensure it is not inside a wall;
     * test all four directions (+/- x, +/- z); if three intersect,
     * then move some distance in the direction of the shortest vector.
     * 
     */
    tweakPosition() {
        
        let directions = [
            new THREE.Vector3( 1, 0, 0 ),
            new THREE.Vector3( -1, 0, 0 ),
            new THREE.Vector3( 0, 0, 1 ),
            new THREE.Vector3( 0, 0, -1 )
        ]

        let tweakRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 40 );
        tweakRaycaster.ray.origin.copy(this.model.position);

        let hits = 0;
        let result = null;
        let minDist = Infinity;

        for (let d = 0; d < 4; d++) {
            tweakRaycaster.ray.direction = directions[d];

            let tweakIntersections = tweakRaycaster.intersectObject( this.sceneController.floor.model, true );
            if (tweakIntersections && tweakIntersections.length>0) {
                hits++;
                if (tweakIntersections[0].distance < minDist) {
                    minDist = tweakIntersections[0].distance;
                    result = directions[d];
                };
            }
        }

        hits = 0;
        result = null;
        minDist = Infinity;

        if (hits>=3) {
            // Move the item in the direction of the shortest vector (min)
            this.model.translateOnAxis(result, minDist);
            console.log(`Tweaking ${this.objectName} ${minDist} on axis ${result.x},${result.z}`);
        }

    }

    computeVertexNormals(el) {

        if (el.geometry) {
            el.geometry.computeVertexNormals();
        } 
        
        if (el.children) {
            el.children.forEach(child => {
                this.computeVertexNormals(child);
            })
        }
    }

    determinePondElevation() {
        let yOffset = 40;

        this.upRaycaster.ray.origin.copy(this.model.position);
        this.upRaycaster.ray.origin.y = -200;
        
        if (this.upRaycaster.intersectObjects(this.sceneController.ponds, true)[0]) {
            
            let distanceFromBase = this.upRaycaster.intersectObjects(this.sceneController.ponds, true)[0].distance;
            this.downRaycaster.ray.origin.copy (this.upRaycaster.ray.origin);
            this.downRaycaster.ray.origin.y += (distanceFromBase + yOffset);
            
            let distanceFromAbove = this.downRaycaster.intersectObjects(this.sceneController.ponds, true)[0].distance;
            let elevation = this.downRaycaster.ray.origin.y - distanceFromAbove + 5; 
            return (elevation);
        } else {
            return this.determineElevationFromBase();
        }
    }

    determineElevationFromBase() {

        let yOffset = 40;

        this.upRaycaster.ray.origin.copy(this.model.position);
        this.upRaycaster.ray.origin.y = -200;
        
        if (this.upRaycaster.intersectObject(this.sceneController.floor.model, true)[0]) {
            
            let distanceFromBase = this.upRaycaster.intersectObject(this.sceneController.floor.model, true)[0].distance;
            this.downRaycaster.ray.origin.copy (this.upRaycaster.ray.origin);
            this.downRaycaster.ray.origin.y += (distanceFromBase + yOffset);
            
            let distanceFromAbove = this.downRaycaster.intersectObject(this.sceneController.floor.model, true)[0].distance;
            let elevation = this.downRaycaster.ray.origin.y - distanceFromAbove + 5; 
            return (elevation);
        } else {
            // console.error(`DEBUG for 'Cannot read property 'distance'...  FLOOR:`)
            // console.error(this.sceneController.floor);
            // console.error(`${this.objectName} = ${this.model.position.x},${this.model.position.z}`);
            return -1;
        }

    }
    
    setRoofToSingleSided(root) {

        if (!root) root = this.model;
        if (root.material && root.material.name == "Roof") { 
                root.material.side = THREE.FrontSide;
        }

        if (root.children) {
            root.children.forEach(e => this.setRoofToSingleSided(e)); 
        }
    }

    setToDoubleSided(root) {
        
        if (!root) root = this.model;
        if (root.material) { 
                root.material.side = THREE.DoubleSide;
        }

        if (root.children) {
            root.children.forEach(e => this.setToDoubleSided(e)); 
        }
    }

    setToFrontSided(root) {
        
        if (!root) root = this.model;
        if (root.material) { 
                root.material.side = THREE.FrontSide;
        }

        if (root.children) {
            root.children.forEach(e => this.setToFrontSided(e)); 
        }
    }

    setToCastShadows(root) {
        if (!root) root = this.model;
        if (typeof root.castShadow == "boolean") {
            
            if (root.name.match(new RegExp('pointlight|torch|torso|head|table|house|body|boy|cube|Icosphere', 'i'))) {  //
                root.castShadow = true;

                let showShadowCamera = false;
                if (root.shadow) {

                    // root.decay = 2;
                    // root.intensity = 10;
                    // root.distance = 600;

                    root.shadow.bias = - 0.005;  
                    root.shadow.camera.fov = 70;
                    root.shadow.camera.far = 600;
                    
                    if (showShadowCamera) {
                        var shadowCameraHelper = new THREE.CameraHelper( root.shadow.camera );
                        shadowCameraHelper.visible = true;
                        this.sceneController.scene.add( shadowCameraHelper );
                    }

                };
            }
        }

        if (root.children) {
            root.children.forEach(e => this.setToCastShadows(e)); 
        }
    }

    setFloorToReceiveShadow() {
        if (this.model.getObjectByName("Floor")) this.model.getObjectByName("Floor").receiveShadow = true;
    }


    // sample payload: {locked: newLockstateControlled, position: newPositionControlled, animations}
    updateAttributes(payload, local = true) {
        this.attributes = {...this.attributes, ...payload};
        this.model.attributes = {...this.attributes, ...payload};
        this.sceneController.eventDepot.fire('updateAttributes', {layoutId: this.model.attributes.layoutId, attributes: payload, type: this.objectType});

        if (payload.animations && payload.animations.length > 0 && this.activeAction) {
            let animations = payload.animations.split('+');
            animations.forEach(animation => {
                let [animationName,timeScale,autoRestore,concurrent,loopRepeat,downCallback,upCallback] = animation.split('/');
                this.runAction(animationName, timeScale, autoRestore, concurrent, loopRepeat, downCallback, upCallback);
            })
        } 
        
        if (this.attributes.defaultSingleAction && this.activeAction) {
            this.runAction(this.activeAction._clip.name, this.attributes.timeScale? this.attributes.timeScale : 1);
        }

        if (local) this.sceneController.socket.emit('updateAttributes', {layoutId: this.model.attributes.layoutId, payload, level: this.sceneController.level, type: this.objectType });
    }

    addWaterSource() {
        let p = { x: this.model.position.x, y: this.model.position.y, z: this.model.position.z };
        let radius = 100; // make variable?
        this.sceneController.addWaterSource(p, radius);
    }

    /** Intermittently recharge mana and health for the player based on strength and agility */
    intermittentRecharge() {
            
        let chance = this.getEffectiveStat("strength") + this.getEffectiveStat("agility");

        if (Math.random()*100 < chance) {
            this.changeStat("health", 0.01);
            this.changeStat("mana", 0.01);
        }
    }

    /** returns the new value */
    changeStat(stat, change, changeMax = false) {
        
        change = Number(change);
        let currentStat = this.attributes.stats[stat].split('/');
        let cur = Number(currentStat[0]);
        let max = Number(currentStat[1]);
        let newvalue = 0;

        if (changeMax) max = max + change;

        if (change > 0) {
            newvalue = Math.min(max, cur + change);
        } else {
            newvalue = cur + change;

            if (stat == "health") { 

                if (this.alive && newvalue <= 0) {
                    this.death();
                }
            }
        }

        this.attributes.stats[stat] = Number(newvalue).toFixed(2) + "/" + Number(max).toFixed(2) + "/" + this.getStatBoost(stat); //.toLocaleString('en-US',{minimumIntegerDigits:2})
        
        if (this.objectSubtype == "local") this.updateHeroStats(stat);

        // this.sceneController.eventDepot.fire('statusUpdate', { 
        //     // message: `${this.objectName} ${stat} stat updated: ${this.attributes.stats[stat]}` 
        // }); 

        switch (stat) {
            case "health":
                if (this.healthSprite) this.healthSprite.scale.x = this.spriteScaleX("health");
                break;
            case "mana":
                if (this.manaSprite) this.manaSprite.scale.x = this.spriteScaleX("mana");
                break;
        }


        return newvalue;
    }


    changeStatBoost(stat, change) {
        change = Number(change);
        let currentBoost = this.getStatBoost(stat);

        this.attributes.stats[stat] = this.getStat(stat) + "/" + this.getStatMax(stat) + "/" + (Number(currentBoost) + Number(change));

        if (this.objectSubtype == "local") this.updateHeroStats(stat);
        
        // this.sceneController.eventDepot.fire('statusUpdate', { 
        //     message: `${this.objectName} ${stat} stat boosted: ${this.attributes.stats[stat]}` 
        // }); 
    }

    getStatAll(stat) {
        return Number(this.attributes.stats[stat]);
    }

    getStat(stat) {
        return Number(this.attributes.stats[stat].split('/')[0]);
    }

    getStatMax(stat) {
        return Number(this.attributes.stats[stat].split('/')[1]);
    }

    getStatBoost(stat) { // statBoost effectively raises the stat for runtime
        return Number(this.attributes.stats[stat].split('/')[2]);
    }

    getEffectiveStat(stat) {
        return Math.max(this.getStat(stat) + this.getStatBoost(stat),0);
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
}