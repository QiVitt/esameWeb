<template>
  <v-navigation-drawer permanent rail expand-on-hover>
    <v-list>
      <v-list-item
          v-if="state.logged===true"
          prepend-icon="mdi-account"
          :title="state.user.nome + ' ' + state.user.cognome"
          :subtitle="name"
          value="profile"
          :to="'/user/'+state.user._id"
      ></v-list-item>
      <v-list-item v-else prepend-icon="mdi-account" title="Login" to="/login/signin"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-format-line-style" title="Feed" to="/home"></v-list-item>
      <v-list-item prepend-icon="mdi-account-search" title="Cerca" to="/search"></v-list-item>
      <v-list-item v-if="state.logged" prepend-icon="mdi-logout" title="Logout" v-on:click="logout"></v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {useAppStore} from "@/store/app";
import {signOut} from "@/plugins/api";
export default {
  name: "AppBar",
  data() {
    return {
      name: "",
      state: {}
    }
  },
  mounted() {
    let state = useAppStore()
    this.state = state;
    console.log(state)
    this.name= state.user.username
  },
  methods:{
    async logout(){
      await signOut();
      document.location.reload()
    }
  }
}
</script>
