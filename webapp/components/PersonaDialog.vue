<template>
<v-dialog :value="value" @click:outside="$emit('close', { action: null, persona: null })">
  <v-card>
    <v-card-title>
      <span class="headline">{{ personaCopy.name }}</span>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-select
          class="type-select"
          v-model="personaCopy.type"
          :items="Object.keys(personaTemplates)"
          label="Type"
          required
        ></v-select>
        <v-text-field
          v-model="personaCopy.name"
          label="Persona Name"
          required
        ></v-text-field>
        <v-text-field
          v-for="param in personaTemplates[personaCopy.type].parameters"
          :key="param"
          v-model="personaCopy.parameters[param]"
          :label="param"
          required
        ></v-text-field>
        <v-text-field
          v-model="personaCopy.greeting"
          label="Greeting"
          required
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
        parameters: ["character", "from"],
      },
      Custom: {
        parameters: ["prompt"],
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
.type-select {
  max-width: 250px;
}
</style>
