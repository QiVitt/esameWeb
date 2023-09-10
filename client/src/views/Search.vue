<script>
import {search, signIn} from "@/plugins/api";
import router from "@/router";

export default {
  name: "Search",
  data() {
    return {
      name: "",
      results:[],
      ruleNotEmpty: [
        value => {
          if (value?.length > 0) return true

          return 'Non può essere vuoto'
        },
      ],
    }
  },
  methods: {
    search: async function () {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return;
      this.results = await search(this.name)
    }
  }
}
</script>

<template>
  <div class="d-flex align-center flex-column">
    <v-card style="padding: 60px">
      <h4 style="padding: 20px">Cerca qui nuove persone</h4>
      <v-form @submit.prevent style="width: 40vw" ref="form">
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="name"
              label="Nome"
              :rules="ruleNotEmpty"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn type="submit" class="mt-2" v-on:click="search()">Cerca</v-btn>
          </v-col>
        </v-row>
        <v-virtual-scroll
          :height="500"
          :items="results"
          class="text-left"
        >
          <template v-slot:default="{ item }" >
            <v-list-item height="20px" prepend-icon="mdi-account" :title="item.nome +' ' + item.cognome" :subtitle="'@'+item.username" :to="'/user/'+item._id">
              <template v-slot:append>
                {{item.bio.substr(0,20)}}
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>

</style>
