<script>

import {getMessage} from "@/plugins/api";
import Message from "@/views/component/MessageCard.vue";

export default {
  name: "Message-Page",
  components: {Message},
  data() {
    return {
      message: {}
    }
  },
  async created() {
    this.message = await getMessage(this.$route.params.user, this.$route.params.id)
  },
  methods: {

  }
}
</script>

<template>
<v-responsive style="max-width: 600px; width: 90%">
  <message v-if="message.utente" :message="message" :link="false"></message>
</v-responsive>
</template>

<style scoped>

</style>
