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
      <div class="uk-position-top-right gn-code-tabs-wrapper">
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
let { append, remove } = UIkit.util

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
      // https://blog.codepen.io/documentation/api/prefill/
      let code = decodeURIComponent(this.codefull)
      let lang = this.lang
      // var regexp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
      // var scripts = (code.match(regexp) || []).join('\n').replace(/<\/?script>/g, '')

      code = code
        // .replace(regexp, '')
        .replace(/<img[^>]+src="(.*?)"|url\((.*?)\)"/g, (match, src) => src.indexOf('../docs/') === 0 ? match.replace(src, `${location.href.split('/docs/')[0]}/docs/${src.replace('../docs/', '')}`) : match)

      let html = ''
      let js = code
      if (lang === 'html') {
        html = code
        js = ''
      }

      let data = {
        title: '',
        description: '',
        html: html,
        html_pre_processor: 'none',
        css: '',
        css_pre_processor: 'none',
        css_starter: 'neither',
        css_prefix_free: false,
        js: js, // scripts || '',
        js_pre_processor: 'none',
        js_modernizr: false,
        html_classes: '',
        css_external: '',
        js_external: this.replaceParts(this.$parent.$parent.$parent.settings.editor.codepen.jsExternal)
      }

      data = JSON.stringify(data)
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

      var form = append(document.body, `<form action="https://codepen.io/pen/define" method="POST" target="_blank">
                <input type="hidden" name="data" value='${data}'>
            </form>`)[0]

      form.submit()
      remove(form)
    },

    replaceParts (s) {
      return s.replace(/\{%random%\}/, Date.now() % 9999)
    }
  }
}
</script>
