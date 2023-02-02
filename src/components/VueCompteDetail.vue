<template>
  <div class="left">
    <a class="btn btn-sm btn-primary" href="/"><i class="bi bi-arrow-left"></i> Accueil</a>
  </div>

  <h1>{{compte.label}}</h1>
  <h5>{{compte.description}} <br> <small>Créé le {{new Date(compte.createdAt).toLocaleDateString()}} à {{new Date(compte.createdAt).toLocaleTimeString()}}</small></h5>
<br>
  <div class="errors">
    <div v-for="(error,index) in errors" :key="index" class="alert" :class="{'alert-danger' : error.type==='danger', 'alert-success' : error.type==='success', 'alert-warning':error.type === 'warning'}">{{error.msg}}
    </div>
  </div>

  <br>
  <fieldset>
    <legend>Ajouter un utilisateur</legend>
    <div class="separator"></div>
    <label>Pseudo:</label>
    <input v-model="user.pseudo" type="text" />
    <br>
    <button @click="addUser" class="btn btn-success">Ajouter</button>
  </fieldset>
  <h5>Total des dépenses et des apports : <br><br> <span class="surrounded"><span style="color:red">{{totalDep}}€</span> + <span style="color:green">{{totalApp}}€</span> = <span  :class="{'red':total<0, 'green' : total>=0}">{{total}}€</span></span></h5>
  <br>
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
          <td><a :href="'/compte/'+id+'/'+user.id">{{user.pseudo}}</a></td>
          <td><span class="red">{{depToStr(user.depense)}}€</span> + <span class="green">{{appToStr(user.depense)}}€</span> = <span :class="{'red':totalToStr(user.depense)<0, 'green' : totalToStr(user.depense)>0}">{{ totalToStr(user.depense) }}€</span>  </td>
          <td>
            <button class="btn btn-success" @click="toggleModal(user)"><i class="bi bi-currency-dollar"></i></button>

            &nbsp;
            <button class="btn btn-danger" @click="deleteUser(user.id)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="modal" :style="{'display' : disp}" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Régularisation du solde</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="toggleModal"></button>
        </div>
        <div class="modal-body">
          <p>Cette action permet d'ajouter le remboursement d'une dette ou d'un apport. </p>
          <p>Vous confirmez le remboursement de <span :class="{'red':modal.diffModal<0, 'green' : modal.diffModal>0}">{{modal.diffModal}}€</span> pour <strong>{{modal.username}}</strong> ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="toggleModal" data-bs-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-primary" @click="balanceDep">Continuer</button>
        </div>
      </div>
    </div>
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
      disp : "none", // affichage du modal
      modal : {
        username : "", // nom de l'utilisateur
        diffModal : 0,// difference entre les depenses et les apports (pour le modal)
        user : {} // id de l'utilisateur
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
      if (this.user.pseudo.trim() !== "") { // si le compte existe et que le pseudo n'est pas vide
        this.user.id = "u" + Date.now(); // on ajoute un id unique
        this.compte.users.push(this.user); // on ajoute l'utilisateur
        this.logError({msg: 'Utilisateur ajouté avec succès', 'type': 'success'}); // on affiche un message de succès

        this.user = { // on réinitialise l'utilisateur
          id: "",
          pseudo: "",
          depense: []
        }
        localStorage.setItem("sharedAccounts", JSON.stringify(this.comptes)); // on sauvegarde les comptes
      }else{
        this.logError({msg: 'Le pseudo ne peut pas être vide', 'type': 'danger'}); // on affiche un message d'erreur
      }
    },
    // Retourne le total des depenses et des apports d'un utilisateur
    totalToStr(depenses){
      let dep = 0;
      depenses.forEach(d => {
          dep += d.montant;
      });
      return dep;
    },
    //Retourne les depenses d'un utilisateur
    depToStr(depenses){
      let dep = 0;
      depenses.forEach(d => {
        if(d.montant < 0){
          dep += d.montant;
        }
      });
      return dep;
    },
    //Retourne les apports d'un utilisateur
    appToStr(depenses){
      let dep = 0;
      depenses.forEach(d => {
        if(d.montant > 0){
          dep += d.montant ;
        }
      });
      return dep;
    },
    // Affiche le modal
    toggleModal(user = {}){
      if(this.disp === "none"){
        this.modal = { // on initialise le modal
          username : user.pseudo,
          diffModal : this.totalToStr(user.depense)*-1,
          user : user
        }
        if(this.modal.diffModal !== 0){
          this.disp = "block";
        }else{
          this.logError({msg: 'Aucune différence à régulariser', 'type': 'warning'});
        }
      }else{
        this.disp = "none";
        this.modal = {
          username : "",
          diffModal : 0,
          user : ""
        }
      }
    },

    // Gere la balance des depenses
    balanceDep(){
//si l'utilisateur existe
          this.depense = { //réinitialisation de l'objet dépense
            montant : this.modal.diffModal,
            date : new Date().toDateInputValue(),
            libelle : "Régularisation"
          };
          this.modal.user.depense.push(this.depense); //ajout de la dépense
          this.logError({type: 'success', msg: 'Régularisation effectuée'}); //message de succès
          localStorage.setItem('sharedAccounts', JSON.stringify(this.comptes)); //sauvegarde dans le localstorage
          this.toggleModal();
    },
//Supprime un utilisateur
    deleteUser(userid) {// si le compte existe
        let idxUser = this.compte.users.findIndex(u => u.id == userid); // recherche de l'utilisateur
        if (idxUser !== -1) { // si l'utilisateur existe
          if (this.compte.users[idxUser].depense.length === 0) { // si l'utilisateur n'a pas de depense
            this.compte.users.splice(idxUser, 1); // on supprime l'utilisateur
            localStorage.setItem("sharedAccounts", JSON.stringify(this.comptes)); // on sauvegarde les comptes
            this.logError({msg: 'Utilisateur supprimé avec succès', 'type': 'success'}); // on affiche un message de succès
          }
          else {
            this.logError({msg: 'Impossible de supprimer un utilisateur avec des dépenses', 'type': 'danger'}); // on affiche un message d'erreur
          }
      }else{
        this.logError({msg: 'Utilisateur introuvable', 'type': 'danger'}); // on affiche un message d'erreur
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
      if (this.compte === null || this.compte === undefined){
        document.location.href = "/404";
      }

    }
  }
</script>

<style scoped>

</style>