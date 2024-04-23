<template>
  <button class="btn">
    <span>{{ Text }}</span>
  </button>
</template>

<script>
export default {
  name: "ButtonComponent",
  props: {
    Text: String,
  },
  methods: {},
};
</script>

<style scoped>
.btn {
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}
</style>
