<script>
import router from "@/router";
import {signIn, whoAmI} from "@/plugins/api";
import {useAppStore} from "@/store/app";

export default {
  name: "SignIn",
  data() {
    return {
      username: "",
      password: "",
      error: false,
      error_message:"",
      ruleNotEmpty: [
        value => {
          if (value?.length > 0) return true

          return 'Non può essere vuoto'
        },
      ],
    }
  },
  methods: {
    signIn: async function () {
      const { valid } = await this.$refs.form.validate()
      let state = useAppStore();
      if (!valid) return;
      let ok = await signIn({
        username:this.username,
        password:this.password
      })
      if (ok===true){
        state.user = await whoAmI();
        state.logged = true;
        router.push("/home")
      }else{
        this.error = true;
        this.error_message = ok;
      }
    },
    signUp: function () {
      router.push("/login/signup")
    }
  }
}
</script>

<template>
  <div class="d-flex align-center flex-column text-center">
  <v-card style="padding: 60px">

    <v-form @submit.prevent style="width: 40vw" ref="form">
      <h2>Vitt Social Login</h2>
      <v-alert
          v-if="error"
          color="error"
          icon="$error"
          title="Errore nel login"
          :text="error_message"
      ></v-alert>
      <v-text-field
          v-model="username"
          label="Username"
          :rules="ruleNotEmpty"
          required
      ></v-text-field>
      <v-text-field
          v-model="password"
          :rules="ruleNotEmpty"
          label="Password"
          required
          type="password"
      ></v-text-field>
      <v-btn type="submit" block class="mt-2" v-on:click="signIn()">Login</v-btn>
      <v-btn type="submit" block class="mt-2" v-on:click="signUp()">Non hai un account?</v-btn>
    </v-form>
  </v-card>
  </div>
</template>

<style scoped>

</style>
