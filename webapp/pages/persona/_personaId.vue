<template>
  <v-card v-if="persona">
    <v-card-title>
      <h2>{{ persona.name }}</h2>
    </v-card-title>
    <v-card-subtitle>by User Userman</v-card-subtitle>

    <v-card-text>
      <h3 class="mb-2 white--text">Persona Preview</h3>
      <div class="white--text">
        <p class="mb-0"><b>{{ persona.name }}:</b> How can I help you today?</p>
        <p class="mb-0"><b>User:</b> You can start by making the Persona Preview actually show something useful.</p>
        <p class="mb-0"><b>{{ persona.name }}:</b> Yeah, sorry about that. It's still in development. You can add it to your collection, though, and try it for yourself.</p>
        <p class="mb-0"><b>User:</b> Fair enough. What about the Try Me button?</p>
        <p class="mb-0"><b>{{ persona.name }}:</b> Yeah, that doesn't work yet either...</p>
        <p class="mb-0"><b>User:</b> You sure have a lot of work to do.</p>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn disabled @click="tryMe"><v-icon left>mdi-test-tube</v-icon>Try Me</v-btn>
      <v-spacer />
      <v-btn :loading="accepting" color="primary" @click="accept"><v-icon left>mdi-check-bold</v-icon>Add to My Collection</v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="mt-8" v-else-if="error">
    <v-card-title><v-icon color="error" left>mdi-alert-box</v-icon>{{ error }}</v-card-title>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AddPersona",
  data: () => ({
    persona: undefined,
    error: undefined,
    accepting: false
  }),
  computed: {
    personaId() {
      return this.$route.params.personaId;
    }
  },
  methods: {
    ...mapActions(["setPersonas"]),
    tryMe() {
      // TODO: implement this
      console.log("tryMe not implemented");
    },
    accept() {
      this.accepting = true;
      this.$getFirebaseFunction("copySharedPersona")(this.personaId)
        .then(() => {
          this.setPersonas().then(() => {
            this.$router.push("/personas");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSharedPersona(personaId) {
      this.$getFirebaseFunction("getSharedPersona")(personaId)
        .then(({ data }) => {
          this.persona = data;
        })
        .catch((error) => {
          // if 403, then persona is not shared
          if (error.code === "functions/permission-denied") {
            this.error = "Persona Not Shared";
          }
          // // if 404, then persona does not exist
          else if (error.code === "functions/not-found") {
            this.error = "Persona Not Found";
          }
          else {
            this.error = "Unknown Error";
          }
        });
    },
  },
  mounted() { // XXX: should this be called in mounted() or something else
    this.getSharedPersona(this.personaId);
  }
}
</script>
