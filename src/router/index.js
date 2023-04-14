//import des methodes du router
import {createRouter, createWebHistory} from 'vue-router'

//import des components
import NotFound from '@/components/NotFound.vue'
import VueCompte from '@/components/VueCompte.vue'
import VueCompteDetail from '@/components/VueCompteDetail.vue'
import VueUtilisateur from "@/components/VueUtilisateur.vue";

//On défini les routes
const routes = [
    {name:'Index', path: '/',component: VueCompte}, //la route par défaut
    {name:'Compte', path: '/compte/:id',component: VueCompteDetail}, //Voir un compte
    {name:'Utilisateur', path: '/compte/:idcompte/:id',component: VueUtilisateur}, //Voir un utilisateur
    {name:'404', path: '/:pathMatch(.*)*', component: NotFound}, //la route 404
]

//On crée le router
const index = createRouter({
    base: '/CIASIE_vueproject/',
    history: createWebHistory(), //On utilise le mode history
    routes
})
//On exporte le router pour pouvoir l'utiliser dans main.js
export default index;