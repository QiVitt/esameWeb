<script>

import {getLike, getUser, isMe, like, unlike} from "@/plugins/api";
import router from "@/router";
import {useAppStore} from "@/store/app";

export default {
  name: "Message",
  props:{
    message: Object,
  },
  data() {
    return {
      user: {},
      like: {
        like:false
      },
      state:{}
    }
  },
  async created() {
    this.user = await getUser(this.message.utente)
    this.like = await getLike(this.message._id),
    this.state = useAppStore()

  },
  methods: {
    isMe,
    share(){
      router.push("/message/"+
        this.user._id+"/"+
        this.message._id)
    },
    openProfile(e){
      router.push("/user/"+this.user._id)
    },
    async addlike(){
      if (await like(this.message._id)){
        this.like.like=true;
        this.like.count++;
      }
    },
    async unlike(){
      if (await unlike(this.message._id)){
        this.like.like=false;
        this.like.count--;
      }
    }
  }
}
</script>

<template>
  <v-card style="padding: 20px; margin: 10px" class="text-left">
    <template v-slot:title class="title"  >
      <v-btn ref="id_click" elevation="0" style="margin: 0; padding: 3px;" v-on:click="openProfile($event)">
        <span v-if="isMe(message.utente)"><v-icon icon="mdi-human-greeting"></v-icon></span>
        <span>{{user.nome}} {{user.cognome}}</span>
      </v-btn>
    </template>
    <template v-slot:subtitle>
      <a><span>@{{user.username}}  in data  {{new Date(message.creationDate).toLocaleString()}}</span></a>
    </template>
    <template v-slot:text >
      {{message.msg}}
    </template>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="like.like" size="small" color="surface-variant" variant="text" append-icon="mdi-heart" v-on:click="unlike" :disabled="state.logged === false">{{like.count}}</v-btn>
      <v-btn v-else size="small" color="surface-variant" variant="text" append-icon="mdi-heart-outline" v-on:click="addlike" :disabled="state.logged === false">{{like.count}}</v-btn>
      <v-btn v-if="!$route.fullPath.startsWith('/message')" size="small" color="surface-variant" variant="text" icon="mdi-open-in-new" v-on:click="share"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.title {
  font-size: 6px;
}
</style>
