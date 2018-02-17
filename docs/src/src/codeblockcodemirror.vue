<template>
  <div class="gn-cm-wrapper">
    <div>
      <textarea class="gn-cm-ta" ref="gnta">{{dcodefull}}</textarea>
    </div>
    <div>
      <div class="gn-browserbar">
        <span class="uk-icon-button" uk-icon="icon: arrow-left; ratio: 1.5"></span>
        <span class="uk-icon-button" uk-icon="icon: arrow-right; ratio: 1.5"></span>
        <span class="gn-adr">https://www.testingtesting123.org</span>
        <span class="uk-icon-button gn-rfr" uk-icon="icon: refresh; ratio: 1"></span>
      </div>
      <iframe class="gn-cm-iframe" ref="gnifr" qqqscrolling="no" width="1040" height="1000" frameborder="0"></iframe>
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
    },
    dcodefull () {
      return decodeURIComponent(this.codefull)
    }
  },

  mounted () {
    var that = this

    setTimeout(() => {
      var delay
      var editor = CodeMirror.fromTextArea(this.$refs.gnta, {
        mode: that.lang === 'html' ? 'htmlmixed' : this.lang
        // theme: 'dracula'
      })

      editor.on('change', function () {
        clearTimeout(delay)
        delay = setTimeout(updatePreview, 300)
      })

      function updatePreview () {
        let stl = `<style>body{font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}` +
          `body::-webkit-scrollbar{width: 8px;}body::-webkit-scrollbar-thumb{background-color: rgba(0, 0, 0, 0.1);}</style>`
        var previewFrame = that.$refs.gnifr
        var preview = previewFrame.contentDocument || previewFrame.contentWindow.document
        preview.open()
        preview.write(editor.getValue() + stl)
        preview.close()
      }
      setTimeout(updatePreview, 300)
    }, 1)
  }
}
</script>
