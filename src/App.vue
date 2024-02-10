<template>
  <div>
    <ConnectComponent />
    <HostComponent />
  </div>
</template>

<script>
// Import your components
import ConnectComponent from './components/ConnectComponent.vue'
import HostComponent from './components/HostComponent.vue'

export default {
  name: 'App',
  components: {
    ConnectComponent,
    HostComponent
  }
}
</script>

<style>
/* Your component styles go here */
</style>
