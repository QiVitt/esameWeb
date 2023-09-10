<script>
import { getUserFollowers, getUserMessages} from "@/plugins/api";
import Message from "@/views/component/MessageCard.vue";
import UserCard from "@/views/component/UserCard.vue";

export default {
  name: "User",
  components: {UserCard, Message},
  data() {
    return {
      user: {
        _id: this.$route.params.id
      },
      items:[],
      offset:0
    }
  },
  async created() {
    this.user = await getUserFollowers(this.$route.params.id)
  },
  methods: {
    async loadData({done}){
      let messages = await getUserMessages(this.user._id,this.offset);
      for (let m of messages) this.items.push(m)
      if (messages.length<20){
        done('empty')
      }else{
        done('ok')
      }
      this.offset+=messages.length;
    }
  },
  async beforeRouteUpdate(to, from, next){
    if (to.fullPath.startsWith("/user/")){
      this.user = await getUserFollowers(to.params.id)
      this.items = [];
      this.offset=0;
    }
    next()
  }
}
</script>

<template>
  <v-infinite-scroll :items="items" :onLoad="loadData" style="max-width: 600px; width: 90%">
    <user-card :user="user"></user-card>
    <template  v-for="(item, index) in items" :key="item">
      <message v-if="user.nome" :link="true" :message="item"></message>
    </template>
    <template v-slot:empty>
      <v-alert type="warning">Non ci sono altri messaggi da visualizzare</v-alert>
    </template>
  </v-infinite-scroll>

</template>

<style scoped>

</style>
