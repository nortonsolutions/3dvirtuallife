export class CutSceneScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
    }

    playVideo() {
        let myModal = document.querySelector('#myModal');
        let video = document.querySelector('video');
        
        myModal.style.overflow = "hidden";

        video.addEventListener('ended', () => {
            myModal.style.overflow = "auto";
            this.eventDepot.fire('closeModal', {});
        });

        video.play();

        setTimeout(() => {
            this.eventDepot.fire('enableCloser', {}); 
        }, 5000);
    }
}