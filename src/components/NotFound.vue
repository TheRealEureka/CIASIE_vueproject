<template>
  <div class="error-page">
    <h1>404</h1>
    <img src="../assets/chat.gif" alt="cat loading" />
    <br>
    <h2>Page not found</h2>
    <p>Désolé, la page que vous cherchez n'a pas été trouvée.</p>

    <router-link to="/">Retour à l'accueil</router-link>

  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
}
h1 {
  font-size: 10rem;
  margin-bottom: 0;
}
h2 {
  font-size: 3rem;
  margin-top: 0;
}
p{
  font-size: 1.5rem;
}
a{
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5em;
}
img{
  display: block;
  margin: 0 auto;
  width: 50%;

}
</style>
