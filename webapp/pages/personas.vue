<template>
  <v-container>
    <v-alert color="orange" icon="mdi-alert">This page does absolutely nothing. It's coming soon, though!</v-alert>
    <v-card>
      <v-card-title>Personas</v-card-title>
      <v-card-subtitle>Create your own personas you'd like to chat with.</v-card-subtitle>
      <v-card-text>
        <v-data-table
          disable-sort
          disable-pagination
          hide-default-footer
          :headers="headers"
          :items="personas"
        >
          <template #[`item.actions`]="{item}">
            <v-btn @click="selectedPersona = item" text><v-icon left>mdi-eye</v-icon>View</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <persona-dialog @close="selectedPersona = undefined" :value="selectedPersona !== undefined" :persona="selectedPersona" v-if="selectedPersona !== undefined" />
    </v-card>
  </v-container>
</template>

<script>
import PersonaDialog from '@/components/PersonaDialog.vue'
export default {
  name: "PersonasPage",
  components: {
    PersonaDialog,
  },
  data: () => ({
    selectedPersona: undefined,
    personas: [
      {
        name: "Will",
        type: "celebrity",
        parameters: {
          character: "Walter White",
          from: "Breaking Bad",
        },
      },
      {
        name: "Karl",
        type: "custom",
        parameters: {
          default: "I am a homeless assistant. I am here to help you.",
        },
      }
    ],
    headers: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Type",
        value: "type",
      },
      {
        text: "Actions",
        value: "actions",
        width: 150,
        align: "center",
      }
    ]
  }),
}
</script>
