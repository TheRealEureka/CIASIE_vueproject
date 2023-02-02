<template>
  <div class="left">
    <a class="btn btn-sm btn-primary" :href="'/compte/'+compteid"><i class="bi bi-arrow-left"></i> Retour</a>
  </div>
  <h1>Gestion des dépenses de : {{user.pseudo}}</h1>
  <div class="errors">
    <div v-for="(error,index) in errors" :key="index" class="alert" :class="{'alert-danger' : error.type==='danger', 'alert-success' : error.type==='success'}">{{error.msg}}</div>
  </div>
  <fieldset>
    <legend>Ajouter une dépense</legend>
    <div class="separator"></div>
    <label>Libellé:</label>
    <input v-model="depense.libelle" type="text" />
    <br>
    <label>Montant:</label>
    <small>(Négatif pour une dépense, positif pour un apport)</small>
    <input v-model="depense.montant" type="number" />
    <br>
    <label>Date:</label>
    <input v-model="depense.date" type="date" />
    <br>
    <button @click="addDepense" class="btn btn-success">Ajouter</button>
  </fieldset>
  <br>
  <h5>Total des dépenses et des apports : <br><br> <span class="surrounded"><span style="color:red">{{totalDep}}€</span> + <span style="color:green">{{totalApp}}€</span> = <span  :class="{'red':total<0, 'green' : total>=0}">{{total}}€</span></span></h5>
<br>
  <h2>Dépenses</h2>
  <div class="separator"></div>
  <br>
  <div v-if="user.depense.length === 0">Aucune dépense</div>
  <div v-else class="list">
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Libellé</th>
          <th scope="col">Montant</th>
          <th scope="col">Date</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="depense in user.depense" :key="depense.id">
          <td>{{depense.libelle}}</td>
          <td><span :class="{'red':depense.montant<0, 'green' : depense.montant>0}">{{depense.montant}}€</span></td>
          <td>{{depense.date}}</td>
          <td>
            <button class="btn btn-danger" @click="deleteDepense(depense.id)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//Rajouter un apercu des depense ici et dans VueCompteDetail.vue
export default {
  name: "VueUtilisateur",
  data(){
    return{
      id : "", //id de l'utilisateur
      compteid: "", //id du compte
      errors:[], //tableau d'erreurs
      depense : { //objet depense a ajouter
        id : "",
        montant : 0,
        date : new Date().toDateInputValue(), //date du jour convertie en format date input
        libelle : ""
      },
      user : null, //objet utilisateur
      compte : null, //objet compte
      comptes : null, // tableau de comptes
    }
  },
  computed:{
    //total des depenses
    totalDep(){
      let total = 0;
      this.user.depense.forEach(d => {
        if(d.montant < 0) total += d.montant;
      });
      return total;
    },
    //total des apports
    totalApp(){
      let total = 0;
      this.user.depense.forEach(d => {
        if(d.montant > 0) total += d.montant;
      });
      return total;
    },
    //total des depenses et des apports
    total(){
      return this.totalApp + this.totalDep;
    }
  },
  methods:{

    addDepense(){
      if(this.depense.libelle === "") { //si le libelle est vide
        this.logError({type: 'danger', msg: 'Veuillez remplir tous les champs'});
        return;
      }
      this.depense.id = "d"+Date.now(); //id de la dépense
      this.user.depense.push(this.depense); //ajout de la dépense
      this.depense = { //réinitialisation de l'objet dépense
        montant : 0,
        date : new Date().toDateInputValue(),
        libelle : ""
      };
      this.logError({type: 'success', msg: 'Dépense ajoutée'}); //message de succès
      localStorage.setItem('sharedAccounts', JSON.stringify(this.comptes)); //sauvegarde dans le localstorage
    },
    //Suppression d'une dépense
    deleteDepense(id){
      console.log(id)
      let idxdepense = this.user.depense.findIndex(d => d.id === id); //recherche de l'index de la dépense
      if(idxdepense !== -1){
            this.user.depense.splice(idxdepense, 1); //suppression de la dépense
            this.logError({type: 'success', msg: 'Dépense supprimée'}); //message de succès
            localStorage.setItem('sharedAccounts', JSON.stringify(this.comptes)); //sauvegarde dans le localstorage
      return;
      }
      this.logError({type: 'danger', msg: 'Erreur lors de la suppression de la dépense'}); //message d'erreur
    },
    //Affichage d'un message d'erreur
    logError(error) {
      error.id = Date.now()+" "+Math.random(); //id unique
      this.errors.push(error); //ajout de l'erreur dans le tableau d'erreurs
      setTimeout(() => { //suppression de l'erreur après 3 secondes
        this.errors = this.errors.filter(e => e.id !== error.id);
      }, 3000);
    }
  },
  created() {
    this.id = this.$route['params'].id; //récupération de l'id de l'utilisateur
    this.compteid = this.$route['params']['idcompte']; //récupération de l'id du compte
    this.comptes = window.localStorage.getItem('sharedAccounts') ? JSON.parse(window.localStorage.getItem('sharedAccounts')) : []; //récupération des comptes
    this.compte = this.comptes.find(c => c.id == this.compteid); //recherche du compte
    this.user = this.compte.users.find(u => u.id == this.id); //recherche de l'utilisateur
    if(this.user === null || this.user === undefined){ //si l'utilisateur n'existe pas on redirige vers la page du compte, qui affichera un message d'erreur si le compte n'existe pas
      document.location.href = "/compte/"+this.compteid;
    }

  }

}
</script>

<style scoped>

</style>