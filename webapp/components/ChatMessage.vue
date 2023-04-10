<template>
  <v-card :loading="isLoading" class="my-4 chat text-left" :class="role">
    <v-card-text>
      <div v-html="htmlContent"></div>
    </v-card-text>
  </v-card>
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
  }
}
</script>

<style scoped>
.chat {
  max-width: 400px;
}

.chat.user {
  background-color: #2486e8;
  margin-left: auto;
}
</style>
