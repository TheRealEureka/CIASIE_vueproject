import {createRouter, createWebHistory} from 'vue-router'
import NotFound from '../components/NotFound.vue'
import VueCompte from '../components/VueCompte.vue'
import VueCompteDetail from '../components/VueCompteDetail.vue'


const routes = [

    {name:'Index', path: '/',component: VueCompte},
    {name:'Compte', path: '/compte/:id',component: VueCompteDetail},
    {name:'404', path: '/:pathMatch(.*)*', component: NotFound},
]

const index = createRouter({
    history: createWebHistory(),
    routes
})

export default index;