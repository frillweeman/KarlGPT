<template>
  <div class="chat-window">
    <div class="chat-messages">
      <div class="d-flex justify-center my-2">
        <v-select prepend-icon="mdi-robot" disabled @change="handlePersonaChange" :items="[...availablePersonas, CreateMorePersona]" v-model="persona" hide-details :item-text="p => p.name" :item-value="p => p" outlined label="Persona" class="persona-switcher" />
      </div>
      <v-divider class="my-4" />
      <div v-for="(message, i) in messages" :key="i" :class="message.role">
        <div class="message">
          <chat-message :ref="'msg' + i" :role="message.role" :htmlContent="message.content" />
        </div>
      </div>
    </div>
    <v-app-bar bottom absolute class="message-bar">
      <v-text-field
        autocomplete="off"
        ref="prompt"
        id="prompt"
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

const CreateMorePersona = {
  name: "Create a persona...",
  _id: "create",
};

export default {
  name: 'IndexPage',
  components: {
    ChatMessage,
  },
  data: () => ({
    CreateMorePersona,
    persona: {
      name: "Karl",
      _id: "60f3b0a0c9b0a3b4b4f1e2a0",
    },
    availablePersonas: [ // TODO: retrieve this from Vuex store
      {
        name: "Karl",
        _id: "60f3b0a0c9b0a3b4b4f1e2a0",
      },
      {
        name: "Walter White",
        _id: "60f3b0a0c9b0a3b4b4f1e2a1",
      },
    ],
    prompt: "",
    messages: [{
      role: "assistant",
      content: "Hi, I'm Karl, a homeless assistant. How can I help?"
    }],
    loading: false,
  }),
  methods: {
    handlePersonaChange(persona){
      if (persona._id === "create") {
        this.$router.push("/personas");
      } else {
        this.persona = persona;
      }
    },
    onKeyPress(e) {
      if (e.key === "/" && document.activeElement.id !== "prompt") {
        e.preventDefault();
        this.$refs.prompt.focus();
      }
    },
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
      getGPTResponse({ messages: this.messages.slice(1, -1) })
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
  },
  mounted() {
    window.addEventListener("keypress", this.onKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener("keypress", this.onKeyPress);
  }
}
</script>

<style scoped>
.chat-window {
  overflow: hidden;
}
.chat-messages > .assistant {
  text-align: right;
}
.chat-messages > .user {
  text-align: left;
}

.chat-messages {
  padding-bottom: 8px;
  max-height: calc(100vh - 128px);
  overflow-y: auto;
}

.persona-switcher {
  max-width: 250px;
}

.message-bar {
  /* position: sticky; */
}
</style>
