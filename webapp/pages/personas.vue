<template>
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
          <v-btn :disabled="item.id === -1" @click="selectedPersona = item" text><v-icon left>mdi-eye</v-icon>View</v-btn>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="newPersona">New Persona</v-btn>
      </v-card-actions>
    </v-card-text>
    <persona-dialog @close="handleDialogClose" :value="selectedPersona !== undefined" :persona="selectedPersona" v-if="selectedPersona !== undefined" />
  </v-card>
</template>

<script>
import PersonaDialog from '@/components/PersonaDialog.vue'
import { mapState, mapActions } from "vuex";
export default {
  name: "PersonasPage",
  components: {
    PersonaDialog,
  },
  data: () => ({
    selectedPersona: undefined,
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
  computed: {
    ...mapState(["personas"]),
  },
  methods: {
    ...mapActions(["setPersonas"]),
    handleDialogClose({ action, persona }) {
      let promise = null;
      if (action === "UPDATE") {
        if (persona.id) {
          // update
          promise = this.updatePersona(persona);
        } else {
          // create
          promise = this.createPersona(persona);
        }
      } else if (action === "DELETE") {
        promise = this.deletePersona(persona.id);
      }
      if (promise) {
        promise
          .then(() => {
            this.selectedPersona = undefined;
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.promisePending = false;
          });
      } else {
        this.selectedPersona = undefined;
      }
      // TODO: clean this mess up
    },
    newPersona() {
      this.selectedPersona = {
        name: "",
        type: "Celebrity",
        parameters: { prompt: "" },
        greeting: ""
      };
    },
    createPersona(persona) {
      this.$getFirebaseFunction("createPersona")(persona)
        .then(() => {
          this.setPersonas();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updatePersona(persona) {
      this.$getFirebaseFunction("updatePersona")(persona)
        .then(() => {
          this.setPersonas();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deletePersona(personaId) {
      this.$getFirebaseFunction("deletePersona")(personaId)
        .then(() => {
          this.setPersonas();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  }
}
</script>
