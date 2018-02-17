<template>
  <div>
    <codeblockcodemirror v-if="isCodeMirror" :lang="lang" :code="code" :codefull="codefull"></codeblockcodemirror>
    <codeblocknormal v-if="isCodeNormal" :lang="lang" :code="code"></codeblocknormal>
    <codeblockcodesandbox v-if="isCodeSandbox" :lang="lang" :codefull="codefull"></codeblockcodesandbox>
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
    'tab'
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
