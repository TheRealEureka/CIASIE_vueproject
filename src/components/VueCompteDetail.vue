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
    id : 0,
      user : {
        id :  "",
       pseudo : "",
       depense : []
      },
      errors: [],
      compte : null,
    comptes : null
    }
  },
  computed: {
    total(){
      return this.totalDep + this.totalApp;
    },
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
    addUser() {
      let idx = this.comptes.findIndex(c => c.id == this.id);
      if (idx !== -1 && this.user.pseudo.trim() !== "") {
        this.user.id = "u" + Date.now();
        this.comptes[idx].users.push(this.user);
        this.logError({msg: 'Utilisateur ajouté avec succès', 'type': 'success'});

        this.user = {
          id: "",
          pseudo: "",
          depense: []
        }
        localStorage.setItem("sharedAccounts", JSON.stringify(this.comptes));
      }else{
        this.logError({msg: 'Erreur lors de l\'ajout de l\'utilisateur', 'type': 'danger'});
      }
    },
    depensesToStr(depenses){
      let dep = 0;
      depenses.forEach(d => {
          dep += d.montant;
      });
      return dep;
    },
    totalToStr(depenses){
      let total = 0;
      depenses.forEach(d => {
        total += d.montant;
      });
      return total;
    },
    deleteUser(userid) {
      let idx = this.comptes.findIndex(c => c.id == this.id);
      if (idx !== -1) {
        let idxUser = this.comptes[idx].users.findIndex(u => u.id == userid);
        if (idxUser !== -1) {
          if (this.compte.users[idxUser].depense.length === 0) {
            this.comptes[idx].users.splice(idxUser, 1);
            localStorage.setItem("sharedAccounts", JSON.stringify(this.comptes));
            this.logError({msg: 'Utilisateur supprimé avec succès', 'type': 'success'});
          }
          else {
            this.logError({msg: 'Impossible de supprimer un utilisateur avec des dépenses', 'type': 'danger'});
          }
        }else{
          this.logError({msg: 'Une erreur est survenue', 'type': 'danger'});

        }
      }
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
      this.comptes = window.localStorage.getItem('sharedAccounts') ? JSON.parse(window.localStorage.getItem('sharedAccounts')) : [];
      this.id = this.$route.params.id;

      this.compte = this.comptes.find(c => c.id == this.id);


      if (this.compte == null) {
        document.location.href = "/404";
      }

    }
  }
</script>

<style scoped>

</style>