<template>
  <div class="left">
    <a class="btn btn-sm btn-primary" href="/"><i class="bi bi-arrow-left"></i> Accueil</a>
  </div>

  <h1>{{compte.label}}</h1>
  <p>{{compte.description}} <br> <small>Créé le {{new Date(compte.createdAt).toLocaleDateString()}} à {{new Date(compte.createdAt).toLocaleTimeString()}}</small></p>
<br>
  <h3 >Total des dépenses et des apports : <br><br> <span class="surrounded"><span style="color:red">{{totalDep}}€</span> + <span style="color:green">{{totalApp}}€</span> = <span  :class="{'red':total<0, 'green' : total>=0}">{{total}}€</span></span></h3>
  <br>
  <div class="errors">

    <div v-for="(error,index) in errors" :key="index" class="alert" :class="{'alert-danger' : error.type==='danger', 'alert-success' : error.type==='success'}">{{error.msg}}
    </div>
  </div>
  <fieldset>
    <legend>Ajouter un utilisateur</legend>
    <div class="separator"></div>
    <label>Pseudo:</label>
    <input v-model="user.pseudo" type="text" />
    <br>
    <button @click="addUser" class="btn btn-success">Ajouter</button>
  </fieldset>
  <h2>Utilisateurs</h2>
  <div class="separator"></div>
  <div v-if="compte.users.length === 0">Aucun utilisateur</div>
  <div v-else class="list">
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">Dépense / Apport</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in compte.users" :key="user.id">
          <td>{{user.pseudo}}</td>
          <td><span :class="{'red':depensesToStr(user.depense)<0, 'green' : depensesToStr(user.depense)>0}">{{depensesToStr(user.depense)}}€</span>  </td>
          <td>
            <a class="btn btn-success" :href="'/compte/'+id+'/'+user.id"><i class="bi bi-currency-dollar"></i></a>
            &nbsp;
            <button class="btn btn-danger" @click="deleteUser(user.id)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
export default {
  name: "VueCompteDetail",
  data() {
    return {
    id : 0, // id du compte courant
      user : { // user a ajouter
        id :  "",
       pseudo : "",
       depense : []
      },
      errors: [], // liste des erreurs
      compte : null, // compte courant
    comptes : null // liste des comptes

    }
  },
  computed: {
    // total des depenses et des apports
    total(){
      return this.totalDep + this.totalApp;
    },
    // total des depenses
  totalDep() {
    let total = 0;
    this.compte.users.forEach(user => {
      user.depense.forEach(dep => {
        if(dep.montant <0){

        total += dep.montant;
        }
      });
    });
    return total;
  },
  // total des apports
  totalApp() {
    let total = 0;
    this.compte.users.forEach(user => {
      user.depense.forEach(dep => {
        if(dep.montant>0){
          total += dep.montant;
        }
      });
    });
    return total;
  },


  },
  methods: {
    // ajoute d'un utilisateur
    addUser() {
      let idx = this.comptes.findIndex(c => c.id == this.id); // recherche du compte courant
      if (idx !== -1 && this.user.pseudo.trim() !== "") { // si le compte existe et que le pseudo n'est pas vide
        this.user.id = "u" + Date.now(); // on ajoute un id unique
        this.comptes[idx].users.push(this.user); // on ajoute l'utilisateur
        this.logError({msg: 'Utilisateur ajouté avec succès', 'type': 'success'}); // on affiche un message de succès

        this.user = { // on réinitialise l'utilisateur
          id: "",
          pseudo: "",
          depense: []
        }
        localStorage.setItem("sharedAccounts", JSON.stringify(this.comptes)); // on sauvegarde les comptes
      }else{
        this.logError({msg: 'Erreur lors de l\'ajout de l\'utilisateur', 'type': 'danger'}); // on affiche un message d'erreur
      }
    },
    // Retourne le total des depenses et des apports d'un utilisateur
    depensesToStr(depenses){
      let dep = 0;
      depenses.forEach(d => {
          dep += d.montant;
      });
      return dep;
    },
//Supprime un utilisateur
    deleteUser(userid) {
      let idx = this.comptes.findIndex(c => c.id == this.id); // recherche du compte courant
      if (idx !== -1) { // si le compte existe
        let idxUser = this.comptes[idx].users.findIndex(u => u.id == userid); // recherche de l'utilisateur
        if (idxUser !== -1) { // si l'utilisateur existe
          if (this.compte.users[idxUser].depense.length === 0) { // si l'utilisateur n'a pas de depense
            this.comptes[idx].users.splice(idxUser, 1); // on supprime l'utilisateur
            localStorage.setItem("sharedAccounts", JSON.stringify(this.comptes)); // on sauvegarde les comptes
            this.logError({msg: 'Utilisateur supprimé avec succès', 'type': 'success'}); // on affiche un message de succès
          }
          else {
            this.logError({msg: 'Impossible de supprimer un utilisateur avec des dépenses', 'type': 'danger'}); // on affiche un message d'erreur
          }
        }else{
          this.logError({msg: 'Une erreur est survenue', 'type': 'danger'}); // on affiche un message d'erreur

        }
      }
    },
    // affiche un message d'erreur
    logError(error) {
      error.id = Date.now()+" "+Math.random(); // on ajoute un id unique
      this.errors.push(error); // on ajoute l'erreur
      setTimeout(() => { // on supprime l'erreur au bout de 3 secondes
        this.errors = this.errors.filter(e => e.id !== error.id);
      }, 3000);
    }
  },
    created() {
    // on recupere les comptes
      this.comptes = window.localStorage.getItem('sharedAccounts') ? JSON.parse(window.localStorage.getItem('sharedAccounts')) : [];
      // on recupere l'id du compte courant
      this.id = this.$route['params'].id;
// on recupere le compte courant
      this.compte = this.comptes.find(c => c.id == this.id);

// si le compte n'existe pas on redirige vers la page 404
      if (this.compte == null) {
        document.location.href = "/404";
      }

    }
  }
</script>

<style scoped>

</style>