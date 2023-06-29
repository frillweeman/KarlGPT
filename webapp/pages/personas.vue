<template>
  <v-card>
    <v-card-title>Personas</v-card-title>
    <v-card-subtitle>Create your own characters you'd like to chat with.</v-card-subtitle>
    <v-card-text>
      <v-data-table
        disable-sort
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="promisePending ? [] : personas"
        :loading="promisePending"
      >
        <template #[`item.actions`]="{item}">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" :disabled="item.id === -1" @click="selectedPersona = item" icon><v-icon>mdi-file-edit</v-icon></v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" :disabled="item.id === -1" @click="stagedForDeletion = item" icon><v-icon>mdi-delete</v-icon></v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" :disabled="item.id === -1" @click="sharePersona(item)" icon><v-icon>mdi-share</v-icon></v-btn>
            </template>
            <span>Share</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="newPersona">New Persona</v-btn>
      </v-card-actions>
    </v-card-text>
    <persona-dialog @close="handleDialogClose" :value="selectedPersona !== undefined" :persona="selectedPersona" v-if="selectedPersona !== undefined" />
    <delete-confirmation @close="handleDialogClose" :value="stagedForDeletion !== undefined" :persona="stagedForDeletion" v-if="stagedForDeletion !== undefined" />
    <v-snackbar :value="copied" color="green"><v-icon left>mdi-content-paste</v-icon>Copied to Clipboard</v-snackbar>
  </v-card>
</template>

<script>
import PersonaDialog from '@/components/PersonaDialog.vue'
import DeleteConfirmation from "@/components/DeleteConfirmation.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "PersonasPage",
  components: {
    PersonaDialog,
    DeleteConfirmation,
  },
  data: () => ({
    promisePending: false,
    selectedPersona: undefined,
    stagedForDeletion: undefined,
    copied: false,
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
    ...mapMutations(["mutatePersonas"]),
    sharePersona(persona) {
      this.$getFirebaseFunction("sharePersona")(persona.id)
        .then(({ data }) => {
          this.$copyText(data.url);
          this.copied = true;
          setTimeout(() => {
            this.copied = false;
          }, 5000);
        })
        .catch((error) => {
          console.error(error);
        });
    },
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
        this.selectedPersona = undefined;
        this.stagedForDeletion = undefined;
        this.mutatePersonas([]);
        this.promisePending = true;
        console.log("promise pending: ", this.promisePending);
        promise
          .then(() => {
            this.setPersonas()
              .finally(() => {
                this.promisePending = false;
              });
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.promisePending = false;
          });
      } else {
        this.selectedPersona = undefined;
        this.stagedForDeletion = undefined;
      }
      // TODO: clean this mess up
    },
    newPersona() {
      this.selectedPersona = {
        name: "",
        type: "Celebrity",
        parameters: {},
        greeting: ""
      };
    },
    createPersona(persona) {
      return this.$getFirebaseFunction("createPersona")(persona)
    },
    updatePersona(persona) {
      return this.$getFirebaseFunction("updatePersona")(persona)
    },
    deletePersona(personaId) {
      return this.$getFirebaseFunction("deletePersona")(personaId)
    },
  }
}
</script>
