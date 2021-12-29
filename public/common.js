// TODO: simplify and consolidate?  Some overlap here.

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function getRnd(min,max) {
    return Math.random() * ((max - min) + min);
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
        method: 'GET',
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

