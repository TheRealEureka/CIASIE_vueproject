<template>
  <div class="left">
    <a class="btn btn-sm btn-primary" href="/"><i class="bi bi-arrow-left"></i> Accueil</a>
  </div>
  <h1>{{compte.label}}</h1>
  <p>{{compte.description}} <br> <small>Créé le {{new Date(compte.createdAt).toLocaleDateString()}} à {{new Date(compte.createdAt).toLocaleTimeString()}}</small></p>
<br><br>
  <fieldset>
    <legend>Ajouter un utilisateur</legend>
    <div class="separator"></div>
    <label>Pseudo:</label>
    <input v-model="email" type="text" />
    <label>Email:</label>
    <input v-model="email" type="text" />
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
          <th scope="col">Email</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in compte.users" :key="user.id">
          <td>{{user.name}}</td>
          <td>{{user.email}}</td>
          <td>
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
    compte : null
    }
  },
  created() {
    let comptes = window.localStorage.getItem('sharedAccounts') ? JSON.parse(window.localStorage.getItem('sharedAccounts')) : [];
    this.id = this.$route.params.id;

    this.compte = comptes.find(c => c.id == this.id);


    if(this.compte == null)
    {
      document.location.href = "/404";
    }

  }
}
</script>

<style scoped>

</style>