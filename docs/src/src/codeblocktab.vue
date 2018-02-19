<template>
  <div>
    <codeblockcodemirror v-if="isCodeMirror" :lang="lang" :code="code" :codefull="codefull" :xlang="xlang" :hides="hides"></codeblockcodemirror>
    <codeblocknormal v-if="isCodeNormal" :lang="lang" :code="code" :codefull="codefull" :xlang="xlang"></codeblocknormal>
    <codeblockcodesandbox v-if="isCodeSandbox" :lang="lang" :codefull="codefull" :xlang="xlang"></codeblockcodesandbox>
  </div>
</template>

<script>
import CodeBlockNormal from './codeblocknormal.vue'
import CodeBlockCodeSandbox from './codeblockcodesandbox.vue'
import CodeBlockCodeMirror from './codeblockcodemirror.vue'

export default {
  props: [
    'code',
    'codefull',
    'lang',
    'xlang',
    'tab',
    'hides'
  ],

  computed: {
    dcode () {
      return decodeURIComponent(this.code)
    },
    isCodeMirror () {
      return this.tab.tp === 'codemirror'
    },
    isCodeSandbox () {
      return this.tab.tp === 'codesandbox'
    },
    isCodeNormal () {
      return !this.isCodeMirror && !this.isCodeSandbox
    }
  },

  components: {
    codeblocknormal: CodeBlockNormal,
    codeblockcodesandbox: CodeBlockCodeSandbox,
    codeblockcodemirror: CodeBlockCodeMirror
  }
}
</script>
