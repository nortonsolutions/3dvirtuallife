const applyIndexListeners = (level, callback) => {
    
    Array.from(document.querySelectorAll('.startCurrentLevel')).forEach(el =>{
        el.addEventListener('click', e => {

            handleGet(`/scene/${level}`, response => {
                document.querySelector('main').innerHTML = response;
                callback();
            })
            e.preventDefault();
        })
    })
    
}

export {applyIndexListeners};