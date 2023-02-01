//Import bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
//Import Vue
import { createApp } from 'vue'
//Import App
import App from './App.vue'
//Import router
import  router  from './router'

//Creation d'une methode pour convertoir une date en format yyyy-mm-dd (pour les input type date)
Date.prototype.toDateInputValue = (function() {
    let local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
//Creation de l'application Vue et utilisation du router
createApp(App).use(router).mount('#app');
