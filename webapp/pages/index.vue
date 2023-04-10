<template>
  <div class="chat-window">
    <div ref="messages" class="chat-messages">
      <div v-for="(message, i) in messages" :key="i" :class="message.role">
        <div class="message">
          <chat-message :ref="'msg' + i" :role="message.role" :htmlContent="message.content" />
        </div>
      </div>
    </div>
    <v-app-bar bottom fixed class="message-bar">
      <v-text-field
        autofocus
        v-model="prompt"
        hide-details
        dense
        outlined
        @keypress.enter="send"
        placeholder="Type a message..."
      />
      <v-btn icon :disabled="loading" @click="send" ><v-icon>mdi-send</v-icon></v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import * as marked from "marked";
import ChatMessage from '@/components/ChatMessage.vue'

export default {
  name: 'IndexPage',
  components: {
    ChatMessage,
  },
  data: () => ({
    prompt: "",
    messages: [],
    loading: false,
  }),
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs['msg' + (this.messages.length - 1)][0].$el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    send() {
      if (this.loading) return;

      this.loading = true;
      this.messages.push({ role: "user", content: this.prompt }, { role: "assistant", content: "..." });
      this.scrollToBottom();
      this.prompt = "";

      const getGPTResponse = this.$getFirebaseFunction("getResponse");
      getGPTResponse({ messages: this.messages.slice(0, -1) })
        .then(result => {
          const htmlContent = marked.parse(result.data.content);
          this.messages.splice(this.messages.length - 1, 1, { role: "assistant", content: htmlContent });
          this.scrollToBottom();
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
  }
}
</script>

<style scoped>
.chat-messages > .assistant {
  text-align: right;
}
.chat-messages > .user {
  text-align: left;
}

.chat-messages {
  padding-bottom: 64px;
}
</style>
