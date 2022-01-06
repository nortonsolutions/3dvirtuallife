import { IntelligentForm } from './intelligent.js'

/**
 * The Hero is a significant extension of the
 * IntelligentForm which has hooks for all the
 * Hero interactions, saved games, etc.
 * 
 * It keeps track of its own template for caching,
 * including inventory, spells, equipped items,
 * and attributes/statistics.
 */
export class Hero extends IntelligentForm {

    constructor(heroTemplate, eventDepot, loader, floorModel) {

        super(heroTemplate, eventDepot, loader, floorModel);

        this.name = heroTemplate.name;
        this.type = heroTemplate.type;
        this.gltf = heroTemplate.gltf;
        this.model = heroTemplate.model;
        this.inventory = heroTemplate.inventory;
        this.spells = heroTemplate.spells;
        this.equipped = heroTemplate.equipped;
        this.eventDepot = eventDepot;
        
        this.selectedObject = null;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

        // Actually just a starting/saved location
        this.location = heroTemplate.location? heroTemplate.location : { x: 0, y: 0, z: 0 };

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.cacheHero();
        

    }

    cacheHero() {
        localStorage.setItem('gameHeroTemplate', JSON.stringify(this.returnTemplate()));
    }

    addEventListeners() {

        this.eventDepot.addListener('updateHeroLocation', data => {
            this.location.x = data.x;
            this.location.y = data.y;
            this.location.z = data.z;

            this.velocity.x = 0;
            this.velocity.z = 0;
            this.cacheHero();
        })

        this.eventDepot.addListener('swapInventoryPositions', (data) => {
            this.swapInventoryPositions(data.first, data.second);
            this.cacheHero();
        });

        this.eventDepot.addListener('unequipItem', (data) => {
            this.unequip(data);
            this.cacheHero();
        });

        this.eventDepot.addListener('equipItem', (data) => {
            this.equip(data.bodyPart, data.itemName);
            this.cacheHero();
        });

        this.eventDepot.addListener('placeItem', (data) => {
            this.addToInventory(data.itemName, data.desiredIndex);
            this.cacheHero();
        });

        this.eventDepot.addListener('takeItemFromScene', (data) => {
            this.addToInventory(data.itemName);
            this.cacheHero();
        });

        this.eventDepot.addListener('removeItem', (itemName) => {
            this.removeFromInventory(itemName);
            this.cacheHero();
        });

        this.eventDepot.addListener('setHeroStat', (data) => {
            this.attributes.stats[data.type] = data.points + this.attributes.stats[data.type].substring(2);
            this.cacheHero();
        })

        this.eventDepot.addListener('setHeroStatMax', (data) => {
            this.attributes.stats[data.type] = this.attributes.stats[data.type].substring(0,3) + data.points;
            this.cacheHero();
        })

        this.eventDepot.addListener('dropItemToScene', (data) => {
            
            if (data.source.length < 3) {  // inventory
                this.removeFromInventory(data.itemName);
            } else { // equipped
                this.unequip(data.source);
            }
            this.cacheHero();
        });

        this.eventDepot.addListener('unlockControls', () => {
            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
        })

    }

    dispose(item) {
        if (item.children.length == 0) {
            if (item.dispose) item.dispose();
            return;
        } else {
            item.children.forEach(child => {
                this.dispose(child);
            })
        }
        if (item.dispose) item.dispose();
    }

    stop(callback) {
        
        this.eventDepot.removeListeners('updateHeroLocation');
        this.eventDepot.removeListeners('swapInventoryPositions');
        this.eventDepot.removeListeners('unequipItem');
        this.eventDepot.removeListeners('equipItem');
        this.eventDepot.removeListeners('placeItem');
        this.eventDepot.removeListeners('takeItemFromScene');
        this.eventDepot.removeListeners('removeItem');
        this.eventDepot.removeListeners('dropItemToScene');
        this.dispose(this.model);
        callback();
    }

    firstInventorySlot() {
        let max = this.inventory.length;
        for (let i = 0; i < this.inventory.length; i++ ) {
            if (!this.inventory[i] || !this.inventory[i].itemName) return i;
        }
        return max;
    }
    


    addToInventory(itemName, desiredIndex) {

        var quantity;
        var itemIndex = this.inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1) {
            quantity = this.inventory[itemIndex].quantity + 1;
        } else {

            // If desiredIndex is already defined, use the first inventory slot
            if (desiredIndex == undefined || this.inventory[desiredIndex]) {
                itemIndex = this.firstInventorySlot();
            } else itemIndex = desiredIndex;

            quantity = 1;
        }

        this.inventory[itemIndex] = {
            itemName: itemName,
            quantity: quantity
        }

        return {itemIndex, quantity};
    }

    /**
     * returns the remaining quantity
     */
    removeFromInventory(itemName) {

        let index = this.inventory.findIndex(el => {
            return el != undefined && el.itemName == itemName
        });
        
        if (this.inventory[index].quantity > 1) {
            this.inventory[index].quantity--;
            return this.inventory[index].quantity;
        } else {
            this.inventory[index] = null;
            return 0;
        }
    }

    swapInventoryPositions(first,second) {
        let temp = {...this.inventory[first]};
        let temp2 = {...this.inventory[second]};
        this.inventory[first] = temp2;
        this.inventory[second] = temp;
    }

    getInventory() {
        return this.inventory;
    }

    equip(area, itemName) {
        this.equipped[area] = itemName;
    }

    unequip(area) {
        delete this.equipped[area];
        let thisArea = this.model.getObjectByName(area);
        thisArea.children.forEach(child => {
            thisArea.remove(child);
        })
    }

    returnTemplate() {

        return {
            name: this.name,
            type: "hero",
            location: this.location,
            attributes: this.attributes,
            gltf: this.gltf,
            model: null,
            inventory: this.inventory,
            spells: this.spells,
            equipped: this.equipped
        }
    }

    updateHeroStats = () => {

        Object.keys(this.attributes.stats).forEach(stat => {
            
            let points = this.attributes.stats[stat].split('/')
            let cur = points[0];
            let max = points[1];

            this.eventDepot.fire('setHeroStatMax', { type: stat, points: max});
            this.eventDepot.fire('setHeroStat', { type: stat, points: cur});

        })

        this.eventDepot.fire('showHeroStats', {});
        
    }

    // Calculate hero location using grid coordinates
    updateHeroLocation = (location, offset = false) => {

        let { x, y, z } = location;
        
        if (offset) {
            z = z + (z < 0) ? 20 : -20;
            x = x + (x < 0) ? 20 : -20;
        }

        this.eventDepot.fire('updateHeroLocation', { x: x / multiplier, y, z: z / multiplier });
    }

    move(otherForms, delta) {
        // super.move(worldDirection, delta);

        let otherModels = otherForms.map(el => el.model);

        // INERTIA
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
        this.direction.x = Number( this.moveLeft ) - Number( this.moveRight );
        this.direction.normalize(); // this ensures consistent movements in all directions
        
        let agility = this.attributes.stats.agility.substring(0,2);

        if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 1000.0 * agility * delta;
        if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 1000.0 * agility * delta;

        // var yAxisRotation;
        // if (uniqueId = "hero") {
        //     yAxisRotation = new THREE.Euler( 0, entity.rotation.y, 0, 'YXZ' );
        // } else {
        //     yAxisRotation = new THREE.Euler( 0, -entity.rotation.y, 0, 'YXZ' );
        // }

        let worldDirection = new THREE.Vector3().copy(this.direction).applyEuler( this.controls.rotation );
        
        let mRaycaster = this.movementRaycaster;
        mRaycaster.ray.origin.copy( this.model.position );
        mRaycaster.ray.origin.y += this.attributes.height;
        mRaycaster.ray.direction.x = -worldDirection.x; // -worldDirection.x;
        mRaycaster.ray.direction.z = -worldDirection.z; // -worldDirection.z;

        // Essentially set Lx = -wDz and Lz = wDx, then Rx = wDz and Rz = -wDx
        // let worldDirectionL = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, -Math.PI/2, 0, 'YXZ' ));
        // let worldDirectionR = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, Math.PI/2, 0, 'YXZ' ));

        // if (worldDirection.x != 0 || worldDirection.z != 0) {
        //     console.log(`${uniqueId} rc: ${mRaycaster.ray.direction.x},${mRaycaster.ray.direction.z}`);
        //     console.log(`${uniqueId} mixerV: ${this.mixers[uniqueId].velocity.x},${this.mixers[uniqueId].velocity.z}`);
        //     console.log(`${uniqueId} mixerD: ${this.mixers[uniqueId].direction.x},${this.mixers[uniqueId].direction.z}`);
        //     console.log(`${uniqueId} rotationY: ${entity.rotation.y}`);
        // }
        
        // let mRaycasterL = this.mixers[uniqueId].movementRaycasterL;
        // mRaycasterL.ray.origin.copy( entity.position );
        // mRaycasterL.ray.origin.y += entity.attributes.height;
        // mRaycasterL.ray.direction.x = worldDirectionL.x;
        // mRaycasterL.ray.direction.z = worldDirectionL.z;

        // let mRaycasterR = this.mixers[uniqueId].movementRaycasterR;
        // mRaycasterR.ray.origin.copy( entity.position );
        // mRaycasterR.ray.origin.y += entity.attributes.height;
        // mRaycasterR.ray.direction.x = worldDirectionR.x;
        // mRaycasterR.ray.direction.z = worldDirectionR.z;

        // Can I avoid the filter here using object attributes.length and width as the starting point for the ray?
        let fIntersects = mRaycaster.intersectObjects(otherModels, true);
        // let rIntersects = mRaycasterR.intersectObjects(this.objects3D, true).filter(el => getRootObject3D(el.object) != entity);
        // let lIntersects = mRaycasterL.intersectObjects(this.objects3D, true).filter(el => getRootObject3D(el.object) != entity);

        if (fIntersects.length == 0) { // Nothing is in the front, so move forward at given velocity
            
            this.model.translateX( this.velocity.x * delta );
            this.model.translateY( this.velocity.y * delta );
            this.model.translateZ( this.velocity.z * delta );

            // if (rIntersects.length != 0) { // intersections on the right?
            //     entity.position.x += mRaycasterL.ray.direction.x;
            //     entity.position.z += mRaycasterL.ray.direction.z;
            //     this.scene.helper.position.copy(rIntersects[0].point);
            //     this.scene.helper.material.color = { r: 1, g: 0, b: 0 };
            // }

            // if (lIntersects.length != 0) { // intersections on the left?
            //     entity.position.x += mRaycasterR.ray.direction.x;
            //     entity.position.z += mRaycasterR.ray.direction.z;       
            //     // console.log(`${entity.objectName} lIntersects:`);
            //     // console.dir(lIntersects[0]);
            //     this.scene.helper.position.copy(lIntersects[0].point);
            //     this.scene.helper.material.color = { r: 0, g: 0, b: 1 };
            // }  


        } else { // Something is blocking, so stop without moving
            
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;

            this.model.translateX( -this.velocity.x * delta );
            this.model.translateY( -this.velocity.y * delta );
            this.model.translateZ( -this.velocity.z * delta );

            this.eventDepot.fire('updateHelper', { position: fIntersects[0].point, color: { r: 0, g: 1, b: 0 }});


            
        }

        // entity.translateY( this.mixers[uniqueId].velocity.y * delta );
        this.setElevation( otherModels );
        
        
        
        
        if (this.standingUpon && this.standingUpon.attributes.routeTo && typeof this.standingUpon.attributes.routeTo.level == "number") {
            if (this.standingUpon.attributes.unlocked) {
                
                this.eventDepot.fire('cacheLayout', {});

                let loadData = {

                    level: this.standingUpon.attributes.routeTo.level,
                    location: this.standingUpon.attributes.routeTo.location,
                }

                this.eventDepot.fire('loadLevel', loadData);
            }
        }
    }

    animate(delta) {

    }




}