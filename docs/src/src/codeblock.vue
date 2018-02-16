<template>
  <div>
    <div class="uk-position-relative qqquk-margin-medium gn-code">
      <div v-if="showTabs">
        <ul uk-tab class="gn-code-tabs">
          <li><a href="#">Code</a></li>
          <li v-if="showSecondTab"><a href="#">Preview</a></li>
        </ul>
        <ul class="uk-switcher uk-margin gn-code-block" ref="gnul">
          <li>
            <codeblocknormal v-if="showNormal" :lang="lang" :code="code"></codeblocknormal>
            <codeblockcodesandbox v-else :lang="lang" :codefull="codefull" :showcodesandbox="showcodesandbox"></codeblockcodesandbox>
          </li>
          <li v-if="showSecondTab" ref="gnil">
            <codeblocknormal v-if="!showNormal" :lang="lang" :code="code"></codeblocknormal>
            <codeblockcodesandbox v-if="showNormal && li2activated" :lang="lang" :codefull="codefull" :showcodesandbox="showcodesandbox"></codeblockcodesandbox>
          </li>
        </ul>
      </div>
      <div v-else>
        <codeblocknormal v-if="showNormal" :lang="lang" :code="code"></codeblocknormal>
        <codeblockcodesandbox v-else :lang="lang" :codefull="codefull" :showcodesandbox="showcodesandbox"></codeblockcodesandbox>
      </div>
      <!-- Icons -->
      <div class="uk-position-top-right">
        <ul class="uk-iconnav gn-code-tabs-ul">
          <li v-if="showcodepenicon"><a class="js-codepen" uk-tooltip="Edit on Codepen" :gn-lang="lang" v-on:click="clickCodepenIcon"><span uk-icon="icon: file-edit"></span></a></li>
          <li><a ref="gncopy" class="js-copy" uk-tooltip="Copy to Clipboard"><span uk-icon="icon: copy"></span></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import CodeBlockNormal from './codeblocknormal.vue'
import CodeBlockCodeSandbox from './codeblockcodesandbox.vue'
import { openOnCodepen } from "./util"

export default {
  name: 'codeblock',

  data: () => ({
    li2activated: false
  }),

  props: [
    'code',
    'codefull',
    'lang',
    'showcodepenicon',
    'showcodesandbox'
  ],

  computed: {
    showNormal() {
      return !this.showcodesandbox || this.showcodesandbox !== 'show'
    },
    showCodeSandbox() {
      return this.showcodesandbox === 'show' || this.showcodesandbox === 'tab'
    },
    showTabs() {
      return this.showCodeSandbox
    },
    showSecondTab() {
      return this.showcodesandbox === 'tab'
    }
  },

  components: {
    codeblocknormal: CodeBlockNormal,
    codeblockcodesandbox: CodeBlockCodeSandbox
  },

  mounted() {
    let that = this
    new Clipboard(this.$refs.gncopy, {
      text: function(trigger) {
        return decodeURIComponent(that.code)
      }
    })
    .on("success", _ => {
      UIkit.notification({ message: "Copied!", pos: "bottom-right" })
    })
    .on("error", _ => {
      UIkit.notification({
        message: "Copy failed!",
        status: "danger",
        pos: "bottom-right"
      })
    })

    if (this.$refs.gnul && this.$refs.gnil) {
      UIkit.util.on(this.$refs.gnul, 'show', function () {
        if (that.$refs.gnil.classList.contains('uk-active')) {
          that.li2activated = true
        }
      })
    }
  },

  methods: {
    clickCodepenIcon: function (event) {
      openOnCodepen(decodeURIComponent(this.codefull), this.lang)
    }
  }
}
</script>
