<script>
import {follow, getFollowers, getUser, isMe, unfollow} from "@/plugins/api";
import {useAppStore} from "@/store/app";
import router from "@/router";

export default {
  name: "UserCard",
  props: {
    user: Object
  },
  data() {
    return {
      isMe: false,
      state: {},
      userList: [],
      modalOpen: false
    }
  },
  mounted() {
    this.state = useAppStore()
    this.isMe = isMe(this.user._id)
  },
  methods: {
    async follow() {
      if (await follow(this.user._id)) {
        this.user.hasMyFollow = true;
      }
    },
    async unfollow() {
      if (await unfollow(this.user._id)) {
        this.user.hasMyFollow = false;
      }
    },
    async openFollowers() {
      let followers = await getFollowers(this.user._id)
      if (followers !== false) {
        this.userList = followers.followers
        this.modalOpen = true;
      }
    },
    async openFollowing() {
      let followers = await getFollowers(this.user._id)
      if (followers !== false) {
        this.userList = followers.following
        this.modalOpen = true;
      }
    },
    openUser(id){
      this.modalOpen=false;
      router.push('/user/'+id)
    }
  }
}
</script>

<template>
  <div>
    <v-card class="mx-auto" variant="outlined" style="margin: 20px; width: 90%; max-width: 600px; ">
      <v-card-item>
        <div>
          <div class="text-overline mb-1">
            @{{ user.username }}
          </div>
          <div class="text-h6 mb-1">
            {{ user.nome }} {{ user.cognome }}
          </div>
          <div class="text-caption">{{ user.bio }}</div>
        </div>
      </v-card-item>
      <v-row>
        <v-col md="6" cols="12">
          <v-btn elevation="0" v-on:click="openFollowing">Seguiti: {{ user.following }}</v-btn>
        </v-col>
        <v-col md="6" cols="12">
          <v-btn elevation="0" v-on:click="openFollowers">Seguaci: {{ user.followers }}</v-btn>
        </v-col>
      </v-row>
      <div class="pa-4 text-end" v-if="!isMe && state.logged === true">
        <v-btn v-if="user.hasMyFollow===false" color="medium-emphasis" variant="outlined" v-on:click="follow()">
          Segui
        </v-btn>
        <v-btn v-else color="medium-emphasis" variant="outlined" v-on:click="unfollow()">
          Non seguire più
        </v-btn>
      </div>
    </v-card>
    <v-dialog
      v-model="modalOpen"
      width="auto"
    >
      <v-card class="pa-10">
        <v-virtual-scroll
          :height="500"
          :items="userList"
          min-width="600"
        >
          <template v-slot:default="{ item }" >
            <v-list-item height="20px" prepend-icon="mdi-account" :title="item.nome +' ' + item.cognome" :subtitle="'@'+item.username" v-on:click="openUser(item._id)">
              <template v-slot:append>
                {{item.bio.substr(0,20)}}
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>
        <v-card-actions>
          <v-btn color="primary" block @click="modalOpen = false">Chiudi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>
