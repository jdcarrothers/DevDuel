<template>
    <div class="input-box">
        <input 
            :value="value"
            @input="$emit('update:value', $event.target.value)" 
            :placeholder="PlaceholderText"
        >
    </div>
</template>

<script>
export default {
    name: 'InputComponent',
    props: {
        PlaceholderText: String,
        value: String,
    },
    data() {
        return {};
    }
};
</script>

<style scoped>
.input-box {
  position: relative;
  margin-bottom: 30px;
}

.input-box input {
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #DDE0E4;
  border-radius: 8px;
  outline: none;
  background-color: #FAFBFC; 
  transition: all 0.3s ease;
}

.input-box input:focus {
  border-color: #007BFF; 
  background-color: #FFFFFF;
}
</style>
