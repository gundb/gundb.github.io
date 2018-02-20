<template>
  <div>
    <div class="uk-position-relative qqquk-margin-medium gn-code">
      <div v-if="showTabs">
        <ul uk-tab class="gn-code-tabs">
          <li v-for="tab in doptions.tabs"><a href="#">{{tab.title}}</a></li>
        </ul>
        <ul class="uk-switcher uk-margin gn-code-block" ref="gnul">
          <li v-for="tab in doptions.tabs">
            <codeblocktab v-if="tab.activated" :lang="lang" :code="code" :codefull="codefull" :tab="tab" :xlang="xlang" :hides="doptions.hides" :editorname="editorname"></codeblocktab>
          </li>
        </ul>
      </div>
      <div v-else>
        <codeblocktab :lang="lang" :code="code" :codefull="codefull" :tab="doptions.tabs[0]" :xlang="xlang" :editorname="editorname"></codeblocktab>
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
import CodeBlockTab from './codeblocktab.vue'
import CodeBlockNormal from './codeblocknormal.vue'
import CodeBlockCodeSandbox from './codeblockcodesandbox.vue'
import CodeBlockCodeMirror from './codeblockcodemirror.vue'
import { openOnCodepen } from './util'

export default {
  name: 'codeblock',

  data: function () {
    return {
      optionsdata: this.options
    }
  },

  props: [
    'code',
    'codefull',
    'lang',
    'showcodepenicon',
    'options',
    'editorname'
  ],

  computed: {
    doptions () {
      return JSON.parse(decodeURIComponent(this.optionsdata))
    },
    showTabs () {
      let ret = this.doptions.tabs.length > 1
      for (let tab of this.doptions.tabs) {
        if (tab.tp === 'codemirror' || tab.tp === 'codesandbox') {
          ret = true
        }
      }
      return ret
    },
    xlang () {
      if (this.code === this.codefull) {
        return this.lang
      }
      if (this.lang === 'html') {
        let matches = decodeURIComponent(this.code).match(new RegExp('[\\s]*(.).*', 'm'))
        if (matches.length > 1 && matches[1] !== '<') {
          // lang = js, if html but first non-whitespace char != '<'
          return 'javascript'
        }
      }
      return this.lang
    }
  },

  components: {
    codeblocktab: CodeBlockTab,
    codeblocknormal: CodeBlockNormal,
    codeblockcodesandbox: CodeBlockCodeSandbox,
    codeblockcodemirror: CodeBlockCodeMirror
  },

  mounted () {
    let that = this

    new Clipboard(this.$refs.gncopy, {
      text: function (trigger) {
        return decodeURIComponent(that.code)
      }
    })
    .on('success', _ => {
      UIkit.notification({ message: 'Copied!', pos: 'bottom-right' })
    })
    .on('error', _ => {
      UIkit.notification({
        message: 'Copy failed!',
        status: 'danger',
        pos: 'bottom-right'
      })
    })

    if (this.$refs.gnul) {
      UIkit.util.on(this.$refs.gnul, 'show', function () {
        let els = that.$refs.gnul.childNodes
        for (let i in els) {
          if (els[i] && els[i].classList && els[i].classList.contains('uk-active')) {
            let opt = that.doptions
            opt.tabs[i].activated = true
            that.optionsdata = encodeURIComponent(JSON.stringify(opt)).replace(/'/g, '%27')
          }
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
