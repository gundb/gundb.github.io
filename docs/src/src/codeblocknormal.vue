<template>
  <pre><code :class="'lang-' + lang">{{dcode}}</code></pre>
</template>

<script>
export default {
  props: [
    'code',
    'lang'
  ],

  computed: {
    dcode() {
      return decodeURIComponent(this.code)
    }
  }
}
</script>
