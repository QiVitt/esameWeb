<template>

  <v-infinite-scroll :items="items" :onLoad="loadData" style="max-width: 600px; width: 90%">
    <post :on-post="addPost"></post>
    <template  v-for="(item, index) in items" :key="item">
      <message :message="item" :link="true"></message>
    </template>
    <template v-slot:empty>
      <v-alert type="warning">Non ci sono altri messaggi da visualizzare, cerca nuove persone</v-alert>
    </template>
  </v-infinite-scroll>
</template>

<script>
import Post from "@/views/component/Post.vue";
import {cacheUsers, feed} from "@/plugins/api";
import Message from "@/views/component/MessageCard.vue";

export default {
  name: "Home",
  components: {Message, Post},
  data() {
    return {
      offset: 0,
      items:[],
    }
  },
  methods: {
    async loadData({ done }){
      let messages = await feed(this.offset);
      await cacheUsers(messages.users)
      for (let m of messages.messages) this.items.push(m)
      if (messages.messages.length<20){
        done('empty')
      }else{
        done('ok')
      }
      this.offset+=messages.messages.length;
    },
    async addPost(post){
      this.items.splice(0,0,post)
      this.offset++;
    }
  }
}
</script>
