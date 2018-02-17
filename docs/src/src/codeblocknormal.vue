<template>
  <!-- <pre><code :class="'lang-' + lang">{{dcode}}</code></pre> -->
  <div class="gn-cm-wrapper gn-cm-single">
    <div>
      <textarea class="gn-cm-ta" ref="gnta">{{dcode}}</textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'code',
    'codefull',
    'lang',
    'xlang'
  ],

  computed: {
    dcode () {
      return decodeURIComponent(this.code)
    }
  },

  mounted () {
    let that = this
    setTimeout(() => {
      CodeMirror.fromTextArea(this.$refs.gnta, {
        mode: that.xlang === 'html' ? 'htmlmixed' : this.xlang,
        readOnly: true // 'nocursor'
      })
    }, 1)
  }
}
</script>
