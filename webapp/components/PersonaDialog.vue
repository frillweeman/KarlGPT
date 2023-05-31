<template>
<v-dialog :value="value" @click:outside="$emit('close', false)">
  <v-card>
    <v-card-title>
      <span class="headline">{{ persona.name }}</span>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-select
          class="type-select"
          v-model="persona.type"
          :items="Object.keys(personaTemplates)"
          label="Type"
          required
        ></v-select>
        <v-text-field
          v-for="param in personaTemplates[persona.type].params"
          :key="param"
          v-model="persona.parameters[param]"
          :label="param"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('close', false)">Cancel</v-btn>
      <v-btn disabled color="primary" @click="$emit('close', false)">Save</v-btn>
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
    personaTemplates: {
      celebrity: {
        params: ["character", "from"],
        tempalte: "I want you to act like {character} from {from}. I want you to respond and answer like {character} using the tone, manner and vocabulary {character} would use. Do not write any explanations. Only answer like {Walter White}. You must know all of the knowledge of {character}."
      },
      custom: {
        params: ["default"],
        template: "{default}"
      }
    },
  }),
}
</script>

<style scoped>
.type-select {
  max-width: 250px;
}
</style>
