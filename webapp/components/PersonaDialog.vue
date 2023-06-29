<template>
<v-dialog max-width="600" :value="value" @click:outside="$emit('close', false)">
  <v-card>
    <v-card-title>
      <span class="headline">{{ personaCopy.name || "New Persona" }}</span>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-select
          class="text-input"
          v-model="personaCopy.type"
          :items="Object.keys(personaTemplates)"
          label="Type"
          required
          persistent-hint
          :hint="personaTemplates[personaCopy.type].description"
        ></v-select>
        <v-text-field
          class="text-input"
          v-model="personaCopy.name"
          label="Persona Name"
          required
          hint="Your name for the persona."
          persistent-hint
        ></v-text-field>
        <v-text-field
          class="text-input"
          v-for="param in personaTemplates[personaCopy.type].parameters"
          :key="param.name"
          v-model="personaCopy.parameters[param.name]"
          :label="param.name"
          required
          :hint="param.hint"
          persistent-hint
        ></v-text-field>
        <v-text-field
          class="text-input"
          v-model="personaCopy.greeting"
          label="Greeting"
          required
          hint="The greeting message used by this persona."
          persistent-hint
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="error" @click="$emit('close', { action: 'DELETE', persona: personaCopy })" :disabled="!personaCopy.id">Delete</v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('close', false)">Cancel</v-btn>
      <v-btn color="primary" @click="$emit('close', { action: 'UPDATE', persona: personaCopy })">Save</v-btn>
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
  data: () => ({
    personaCopy: undefined,
    personaTemplates: {
      Celebrity: {
        parameters: [{
          name: "character",
          hint: "The name of the character.",
        }, {
          name: "from",
          hint: "The name of the show or movie.",
        }],
        description: "With a Celebrity Persona, you can chat with a famous character.",
      },
      Custom: {
        parameters: [{
          "name": "prompt",
          hint: "The prompt to use for the persona.",
        }],
        description: "With a Custom Persona, you can manually enter the prompt sent to ChatGPT.",
      }
    },
  }),
  watch: {
    persona: {
      handler: function (newVal) {
        this.personaCopy = JSON.parse(JSON.stringify(newVal));
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
.text-input {
  max-width: 450px;
}
</style>
