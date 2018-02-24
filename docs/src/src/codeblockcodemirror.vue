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
let myEditor = null

export default {
  props: [
    'code',
    'codefull',
    'lang',
    'xlang',
    'hides',
    'editorname'
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
        mode: that.lang === 'html' ? 'htmlmixed' : this.lang,
        lineNumbers: true,
        styleSelectedText: true
        // foldGutter: true,
        // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        // extraKeys: {'Ctrl-Q': function (cm) { console.log('aaa'); cm.foldCode(cm.getCursor()) }}
        // theme: 'dracula'
      })

      myEditor = editor

      if (this.hides) {
        for (let hide of this.hides) {
          editor.foldCode(CodeMirror.Pos(hide.start, 0), function (cm, start) {
            var end = hide.end
            return {
              from: CodeMirror.Pos(start.line, 0),
              to: CodeMirror.Pos(end, cm.getLine(end).length)
            }
          })
          editor.markText({line: hide.start, ch: 0}, {line: hide.end, ch: editor.getLine(hide.end).length}, {className: 'styled-background'})
        }
      }

      editor.on('change', function () {
        clearTimeout(delay)
        delay = setTimeout(updatePreview, 300)
        that.$root.$emit('gn-editor-changed', {name: that.editorname, content: editor.getValue(), originalContent: that.dcodefull})
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

      that.$root.$on('gn-editor-update', (data) => {
        if (data.name === that.editorname) {
          if (myEditor) {
            let mergeResult = Diff.diff3_merge(data.content.replace(/[^\S\r\n]+$/gm, ''), data.originalContent.replace(/[^\S\r\n]+$/gm, ''), myEditor.getValue().replace(/[^\S\r\n]+$/gm, ''), true)
            if (mergeResult.length === 1 && Array.isArray(mergeResult[0].ok)) {
              myEditor.setValue(mergeResult[0].ok.join(''))
            }
          }
        }
      })

      that.$root.$on('gn-editor-update-from-storage', (data) => {
        if (data.name === that.editorname) {
          if (myEditor) {
            myEditor.setValue(data.content)
          }
        }
      })

      that.$root.$emit('gn-editor-request', {name: that.editorname})
    }, 1)
  }
}
</script>
