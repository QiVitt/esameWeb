<script>
import {postMessage} from "@/plugins/api";

export default {
  name: "Post",
  props:{
    onPost: Function
  },
  data() {
    return {
      postText:"",
      ruleNotEmpty: [
        value => {
          if (value?.length > 0) return true

          return 'Non può essere vuoto'
        },
      ],
    }
  },
  methods: {
    async post(){
      const { valid } = await this.$refs.form.validate()
      if (!valid) return;
      let post = await postMessage({
        message: this.postText
      })
      await this.$refs.form.reset()
      this.onPost(post);
    }
  }
}
</script>

<template>
  <v-card style="padding: 20px; margin: 10px">
    <v-form @submit.prevent ref="form">
      <h4>Posta un messaggio</h4>
      <v-textarea
        v-model="postText"
        label="Messaggio"
        :rules="ruleNotEmpty"
        required
      ></v-textarea>
      <div class="pa-4 text-end">
        <v-btn type="submit" class="mt-2" v-on:click="post()">Posta</v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<style scoped>

</style>
