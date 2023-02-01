<template>
  <h1>Gestion des comptes</h1>
  <br>
  <div class="errors">

    <div v-for="(error,index) in errors" :key="index" class="alert" :class="{'alert-danger' : error.type==='danger', 'alert-success' : error.type==='success'}">{{error.msg}}

    </div>
  </div>
    <fieldset>
      <legend>Compte</legend>
      <div class="separator"></div>
      <label>Libellé:</label>
      <input v-model="sharedAccount.label" type="text" />
      <label>Description:</label>
      <textarea v-model="sharedAccount.description"></textarea>
      <br>
      <button @click="createSharedAccount" class="btn btn-success">Créer</button>
    </fieldset>
    <div class="list">
      <h2>Comptes partagés existants</h2>
      <div class="separator"></div>
      <div v-if="sharedAccounts.length === 0">Aucun compte partagé</div>

      <table v-else class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Libellé</th>
              <th scope="col">Description</th>
              <th scope="col">Date de création</th>
              <th scope="col">Actions</th>
            </tr>

          </thead>
        <tbody>
            <tr v-for="account in sharedAccounts" :key="account.id">
              <td><a :href="'/compte/'+account.id">{{ account.label }}</a></td>
              <td>{{ account.description }}</td>
              <td>{{ new Date(account.createdAt).toLocaleDateString() }}</td>
              <td>
                <button class="btn btn-danger" @click="deleteSharedAccount(account.id)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
        </tbody>
      </table>

    </div>
</template>

<script>
export default {
  name: "VueCompte",
  data() {
    return {
      errors: [], //Erreurs ou messages à afficher
      sharedAccount: { //Compte partagé à créer
        id: 0,
        label: '',
        description: '',
        createdAt: null,
        users: []

      },
      sharedAccounts: [] //Liste des comptes partagés, issu du localStorage
    }
  },
  created() {
    //Récupération des comptes partagés existants dans le localStorage
    this.sharedAccounts = window.localStorage.getItem('sharedAccounts') ? JSON.parse(window.localStorage.getItem('sharedAccounts')) : [];
  },
  methods: {
    //Création d'un compte partagé
    createSharedAccount() {
      //Vérification des champs
      if(this.sharedAccount.label.trim() !== '' && this.sharedAccount.description.trim() !== '') {
        //On rajoute la date de création
        this.sharedAccount.createdAt = new Date();
        //On génère un id unique pour le compte partagé (ici on utilise la date actuelle au format timestamp)
        this.sharedAccount.id = Date.now();
        //On ajoute le compte partagé à la liste des comptes partagés
        this.sharedAccounts.push(this.sharedAccount);
        //On sauvegarde la liste des comptes partagés dans le localStorage
        window.localStorage.setItem('sharedAccounts', JSON.stringify(this.sharedAccounts));
        //On réinitialise le compte partagé
        this.sharedAccount = {
          label: '',
          description: '',
          createdAt: null,
        }
        //On affiche un message de succès
        this.logError({msg: 'Compte créé avec succès', 'type': 'success'});
      }else{
        //Sinon on affiche un message d'erreur
        this.logError({msg: 'Veuillez remplir tous les champs', 'type': 'danger'});
      }
    },
    //Suppression d'un compte partagé
    deleteSharedAccount(id) {
      //On filtre la liste des comptes partagés pour ne garder que ceux qui ne correspondent pas à l'id du compte partagé à supprimer
      this.sharedAccounts = this.sharedAccounts.filter(account => account.id !== id);
      window.localStorage.setItem('sharedAccounts', JSON.stringify(this.sharedAccounts));
      //On affiche un message de succès
      this.logError({msg: 'Compte supprimé avec succès', 'type': 'success'});
    },
    //Affichage d'un message d'erreur ou de succès
    logError(error) {
      //On génère un id unique pour le message d'erreur
      error.id = Date.now()+" "+Math.random();
      //On ajoute le message d'erreur à la liste des messages d'erreurs
      this.errors.push(error);
      //On supprime le message d'erreur après 3 secondes
      setTimeout(() => {
        this.errors = this.errors.filter(e => e.id !== error.id);
      }, 3000);
    }
  },

}
</script>

<style scoped>





</style>