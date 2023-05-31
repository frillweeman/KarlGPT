<template>
  <div :style="`display: flex; justify-content: ${isAssistant ? 'flex-start' : 'flex-end'}; align-items: center;`">
    <v-avatar v-if="isAssistant" image="/apple-touch-icon.png" :size="36"><v-img src="/apple-touch-icon.png"></v-img></v-avatar>
    <v-card :loading="isLoading" class="mx-2 my-4 chat text-left" :class="role">
      <v-card-text class="message">
        <div v-if="isAssistant" v-html="htmlContent" class="assistant"></div>
        <div v-else>{{ htmlContent }}</div>
      </v-card-text>
    </v-card>
    <v-avatar v-if="!isAssistant" color="primary" :size="36"><v-icon>mdi-pirate</v-icon></v-avatar>
  </div>
</template>

<script>
export default {
  name: "ChatMessage",
  props: {
    role: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
  },
  computed: {
    isLoading: function () {
      return this.htmlContent === "...";
    },
    isAssistant: function () {
      return this.role === "assistant";
    },
  }
}
</script>

<style scoped>
.chat {
  width: 400px;
  max-width: 100%;
}

.message {
  font-weight: 500;
}

.chat.user {
  background-color: #2486e8;
  margin-left: auto;
}

.assistant ::v-deep p:last-child {
  margin-bottom: 0;
}
</style>
