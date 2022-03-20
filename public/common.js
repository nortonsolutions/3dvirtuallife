// TODO: simplify and consolidate?  Some overlap here.

var multiplier = 100;

function degreesToRadians(degrees) {
    return Number(degrees) * Math.PI / 180;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRnd(min,max) {
    // return Math.random() * ((max - min) + min);
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomArbitrary(min, max) {
    // return Math.random() * (max - min) + min;
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRootObject3D(obj) {
    if (obj.objectName) {
        return obj;
    } else if (obj.parent == null) {
        return null;
    } else {
        return getRootObject3D(obj.parent);
    }
}

function getObjectName(obj) {
    if (obj.objectName) {
        return obj.objectName;
    } else if (obj.parent == null) {
        return null;
    } else {
        return getObjectName(obj.parent);
    }
}

function getObjectType(obj) {
    if (obj.objectType) {
        return obj.objectType;
    } else if (obj.parent == null) {
        return null;
    } else {
        return getObjectType(obj.parent);
    }
}

function shiftTowardCenter(value, factor) {
    if (value != 0) {
        if (value > 0) {
            return value - (5 * factor);
        } else return value + (5 * factor);
    } else return value;
}

postOptions = (data) => {
    return {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json; charset=utf-8" }
    }
}

handlePost = (url, data, callback) => {
    fetch(url, postOptions(data))
    .then(response => response.json())
    .catch(error => {
        callback(JSON.stringify(error.message));
    })
    .then(response => { 
        callback(JSON.stringify(response));
    })
}

putOptions = (data) => {
    return {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json; charset=utf-8" }
    }
}

handlePut = (url, data, callback) => {
    fetch(url, putOptions(data))
    .then(response => response.json())
    .catch(error => {
        callback(JSON.stringify(error.message));
    })
    .then(response => { 
        callback(JSON.stringify(response));
    })
}

handlePutTextResponse = (url, data, callback) => {
    fetch(url, putOptions(data))
    .then(response => response.text())
    .catch(error => {
        callback(error.message);
    })
    .then(response => { 
        callback(response);
    })
}


formPostOptions = (data) => {
    return {
        method: 'POST',
        body: data
    }
}

handleFormPost = (url, data, callback) => {
    fetch(url, formPostOptions(data))
    .then(response => response.json())
    .catch(error => {
        callback(JSON.stringify(error.message));
    })
    .then(response => { 
        callback(JSON.stringify(response));
    })
}

handlePostTextResponse = (url, data, callback) => {
    fetch(url, postOptions(data))
    .then(response => response.text())
    .catch(error => {
        callback(error.message);
    })
    .then(response => { 
        callback(response);
    })
}

getOptions = () => {
    return {
        method: 'GET'
    }
}

handleGet = (url, callback) => {
    fetch(url, getOptions())
    .then(response => response.text())
    .catch(error => {
        callback(error.message);
    })
    .then(response => { 
        callback(response);
    })
}

deleteOptions = (data) => {
    return {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json; charset=utf-8" }
    }
}

handleDelete = (url, data, callback) => {
    fetch(url, deleteOptions(data))
    .then(response => response.text())
    .catch(error => {
        callback(error.message);
    })
    .then(response => { 
        callback(response);
    })
}

queryGame = async function(queryName, eventDepot, args) {
        
    let key = getRndInteger(1,100000);

    let result = await new Promise((resolve, reject) => {
        eventDepot.addListener('gameResponse' + key, response => {
            resolve(response);
        })
        eventDepot.fire('queryGame', { key, queryName, args });
    })

    eventDepot.removeListeners('gameResponse' + key);
    return result;
    
}

querySC = async function(queryName, eventDepot, args) {
        
    let key = getRndInteger(1,100000);

    let result = await new Promise((resolve, reject) => {
        eventDepot.addListener('SCResponse' + key, response => {
            resolve(response);
        })
        eventDepot.fire('querySC', { key, queryName, args });
    })

    eventDepot.removeListeners('SCResponse' + key);
    return result;
    
}

createMaterial = (vertexShader, fragmentShader) => {
    var vertexShader = document.getElementById(vertexShader).innerHTML;
    var fragmentShader = document.getElementById(fragmentShader).innerHTML;

    var attributes = {};
    var uniforms = {
        time: {type: 'f', value: 0.2 },
        scale: {type: 'f', value: 0.2 },
        alpha: {type: 'f', value: 0.6 },
        resolution: {type: 'v2', value: new THREE.Vector2() }
    };
    
    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;

    var meshMaterial = new THREE.ShaderMaterial({
        uniforms,
        attributes,
        vertexShader,
        fragmentShader,
        transparent: true
    });

    return meshMaterial;
}
