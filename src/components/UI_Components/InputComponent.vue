<template>
  <div class="input-box">
    <input
      :placeholder="PlaceholderText"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    PlaceholderText: String,

    modelValue: {
      type: String,
      required: true,
    },
  },
  data() {},
  methods: {},
};
</script>

<style scoped>
.input-box {
  width: 100%;
  margin-bottom: 30px;
}

.input-box input {
  width: 100%;
  min-height: 50px;
  border: 1px solid #dde0e4;
  border-radius: 8px;
  outline: none;
  background-color: #fafbfc;
  transition: all 0.3s ease;
}

.input-box input:focus {
  border-color: #007bff;
  background-color: #ffffff;
}
</style>
