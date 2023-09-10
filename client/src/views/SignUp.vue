<script>
import router from "@/router";
import {signUp} from "@/plugins/api";

export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      password: "",
      nome:"",
      cognome:"",
      bio:"",
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
    signIn: function () {
      router.push("/login/signin")

    },
    signUp: async function () {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return;
      let ok = await signUp({
        username:this.username,
        password:this.password,
        nome:this.nome,
        cognome:this.cognome,
        bio:this.bio
      })
      if (ok===true){
        router.push("/login/signin")
      }else{
        this.error = true;
        this.error_message = ok;
      }
    }
  }
}
</script>

<template>
  <div class="d-flex align-center flex-column text-center">
    <v-card style="padding: 60px">
      <v-form ref="form" @submit.prevent style="width: 40vw">
        <h2>Vitt Social SignUp</h2>
        <v-alert
            v-if="error"
            color="error"
            icon="$error"
            title="Errore nel creare un account"
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
            label="Password"
            :rules="ruleNotEmpty"
            required
            type="password"
        ></v-text-field>
        <v-text-field
            v-model="nome"
            label="Nome"
            :rules="ruleNotEmpty"
            required
        ></v-text-field>
        <v-text-field
            v-model="cognome"
            label="Cognome"
            :rules="ruleNotEmpty"
            required
        ></v-text-field>
        <v-textarea
            v-model="bio"
            label="Bio Descrittiva"
            :rules="ruleNotEmpty"
            required
        ></v-textarea>
        <v-btn type="submit" block class="mt-2" v-on:click="signUp()">SignUp</v-btn>
        <v-btn type="submit" block class="mt-2" v-on:click="signIn()">Hai già un account?</v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>

</style>
