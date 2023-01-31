import {createRouter, createWebHistory} from 'vue-router'
import NotFound from '../components/NotFound.vue'
import VueCompte from '../components/VueCompte.vue'
import VueCompteDetail from '../components/VueCompteDetail.vue'
import VueUtilisateur from "@/components/VueUtilisateur.vue";


const routes = [

    {name:'Index', path: '/',component: VueCompte},
    {name:'Compte', path: '/compte/:id',component: VueCompteDetail},
    {name:'Utilisateur', path: '/compte/:idcompte/:id',component: VueUtilisateur},
    {name:'404', path: '/:pathMatch(.*)*', component: NotFound},
]

const index = createRouter({
    history: createWebHistory(),
    routes
})

export default index;