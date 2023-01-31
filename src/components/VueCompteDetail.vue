<template>
{{ id}}
</template>

<script>
export default {
  name: "VueCompteDetail",
  data() {
    return {
   id : 0,
    }
  },
  created() {
    this.id = this.$route.params.id;

  }
}
</script>

<style scoped>

</style>