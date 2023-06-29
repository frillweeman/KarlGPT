<template>
  <v-dialog max-width="600" :value="value" @click:outside="$emit('close', false)">
    <v-card>
      <v-card-title style="word-break: break-word;">
        Are you sure you want to obliterate "{{ persona.name }}"
      </v-card-title>
      <v-card-actions>
        <v-btn text @click="$emit('close', false)">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="$emit('close', { action: 'DELETE', persona })"><v-icon left>mdi-nuke</v-icon>Destroy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </template>
  
  <script>
  export default {
    name: "PersonaDialog",
    props: {
      persona: {
        type: Object,
        required: true,
      },
      value: {
        type: Boolean,
        required: true,
      },
    },
  }
  </script>
  
  