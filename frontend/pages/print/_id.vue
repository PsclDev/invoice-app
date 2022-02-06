<template>
  <h1>{{ id }}</h1>
</template>

<script>
export default {
  async asyncData({ params }) {
    const id = params.id
    return { id }
  },
}
</script>