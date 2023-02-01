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
  <h2>Dépenses</h2>
  <div class="separator"></div>
  <p>Total des dépenses et des apports : <br><br> <span class="surrounded"><span style="color:red">{{totalDep}}€</span> + <span style="color:green">{{totalApp}}€</span> = <span  :class="{'red':total<0, 'green' : total>=0}">{{total}}€</span></span></p>

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
      id : "",
      compteid: "",
      errors:[],
      depense : {
        montant : 0,
        date : new Date().toDateInputValue(),
        libelle : ""
      },
      user : null,
      compte : null,
      comptes : null,
    }
  },
  computed:{
    totalDep(){
      let total = 0;
      this.user.depense.forEach(d => {
        if(d.montant < 0) total += d.montant;
      });
      return total;
    },
    totalApp(){
      let total = 0;
      this.user.depense.forEach(d => {
        if(d.montant > 0) total += d.montant;
      });
      return total;
    },
    total(){
      return this.totalApp + this.totalDep;
    }
  },
  methods:{
    addDepense(){
      if(this.depense.libelle === "") {
        this.logError({type: 'danger', msg: 'Veuillez remplir tous les champs'});
        return;
      }
      let idxcompte = this.comptes.findIndex(c => c.id == this.compteid);
      if(idxcompte !== -1) {
        let idxuser = this.comptes[idxcompte].users.findIndex(u => u.id == this.id);
        if(idxuser !== -1) {
          this.comptes[idxcompte].users[idxuser].depense.push(this.depense);
          this.depense = {
            montant : 0,
            date : new Date().toDateInputValue(),
            libelle : ""
          };
          this.logError({type: 'success', msg: 'Dépense ajoutée'});
          localStorage.setItem('sharedAccounts', JSON.stringify(this.comptes));
          return;
        }
      }
      this.logError({type: 'danger', msg: 'Erreur lors de l\'ajout de la dépense'});

    },
    deleteDepense(id){
      let idxcompte = this.comptes.findIndex(c => c.id == this.compteid);
      if(idxcompte !== -1) {
        let idxuser = this.comptes[idxcompte].users.findIndex(u => u.id == this.id);
        if(idxuser !== -1) {
          let idxdepense = this.comptes[idxcompte].users[idxuser].depense.findIndex(d => d.id == id);
          if(idxdepense !== -1) {
            this.comptes[idxcompte].users[idxuser].depense.splice(idxdepense, 1);
            this.logError({type: 'success', msg: 'Dépense supprimée'});
            localStorage.setItem('sharedAccounts', JSON.stringify(this.comptes));
            return;
          }
        }
      }
      this.logError({type: 'danger', msg: 'Erreur lors de la suppression de la dépense'});
    },
    logError(error) {
      error.id = Date.now()+" "+Math.random();
      this.errors.push(error);
      setTimeout(() => {
        this.errors = this.errors.filter(e => e.id !== error.id);
      }, 3000);
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.compteid = this.$route.params.idcompte;
    this.comptes = window.localStorage.getItem('sharedAccounts') ? JSON.parse(window.localStorage.getItem('sharedAccounts')) : [];
    this.compte = this.comptes.find(c => c.id == this.compteid);
    this.user = this.compte.users.find(u => u.id == this.id);
    if(this.user === null){
      document.location.href = "/compte/"+this.compteid;
    }

  }

}
</script>

<style scoped>

</style>