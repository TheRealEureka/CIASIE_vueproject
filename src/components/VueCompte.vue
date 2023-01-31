<template>
  <h1>Gestion des comptes</h1>
  <br>
  <div class="errors">

    <div v-for="(error,index) in errors" :key="index" class="alert" :class="{'alert-danger' : error.type==='danger', 'alert-success' : error.type==='success'}">{{error.msg}}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

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
      errors: [],
      sharedAccount: {
        id: 0,
        label: '',
        description: '',
        createdAt: null,
        users: []

      },
      sharedAccounts: []
    }
  },
  created() {
    this.sharedAccounts = window.localStorage.getItem('sharedAccounts') ? JSON.parse(window.localStorage.getItem('sharedAccounts')) : [];
  },
  methods: {
    createSharedAccount() {
      if(this.sharedAccount.label.trim() !== '' && this.sharedAccount.description.trim() !== '') {
        this.sharedAccount.createdAt = new Date();
        this.sharedAccount.id = Date.now();
        this.sharedAccounts.push(this.sharedAccount);
        window.localStorage.setItem('sharedAccounts', JSON.stringify(this.sharedAccounts));
        this.sharedAccount = {
          label: '',
          description: '',
          createdAt: null,
        }
        this.logError({msg: 'Compte créé avec succès', 'type': 'success'});
      }else{
        this.logError({msg: 'Veuillez remplir tous les champs', 'type': 'danger'});
      }
    },
    deleteSharedAccount(id) {
      this.sharedAccounts = this.sharedAccounts.filter(account => account.id !== id);
      window.localStorage.setItem('sharedAccounts', JSON.stringify(this.sharedAccounts));
      this.logError({msg: 'Compte supprimé avec succès', 'type': 'success'});
    },
    logError(error) {
      error.id = Date.now()+" "+Math.random();
      this.errors.push(error);
      setTimeout(() => {
        this.errors = this.errors.filter(e => e.id !== error.id);
      }, 3000);
    }
  },

}
</script>

<style scoped>





</style>