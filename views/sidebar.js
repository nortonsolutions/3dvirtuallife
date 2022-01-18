class Sidebar {

    constructor(eventDepot) {
        this.sidebarElement = document.getElementById('sidebar');
        this.sidebarElement.style.paddingTop = document.querySelector('.navbar').clientHeight + "px";
        this.eventDepot = eventDepot;
        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
    }

    addEventListeners() {
        this.eventDepot.addListener('toggleSidebar', data => {
            this.sidebarElement.style.display = data.show? 'flex' : 'none';
        })

        // data: { show: Boolean, equipped: ... }
        this.eventDepot.addListener('refreshSidebar', data => {
            this.refreshSidebar(data);
        })
    }

    refreshSidebar = (data) => {

        var context = {equipped: {}};
        var gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        
        Object.keys(data.equipped).forEach(key => {
            
            let objectName = data.equipped[key][0];
            context.equipped[key] = {
                name: objectName,
                description: gameObjects[objectName].description,
                image: gameObjects[objectName].image
            };
        });

        this.loadTemplate(context, () => {})
    }

    loadTemplate = (data, callback) => {

        
        handleGet(`/views/sidebar.hbs`, response => {
            let template = Handlebars.compile(response);
            this.sidebarElement.innerHTML = template(data);
            if (callback) callback();
        });
    }

}

export { Sidebar }