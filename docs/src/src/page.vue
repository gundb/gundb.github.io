<template>
  <div class="gn-md-wrapper">
    <h1 class="gn-main-title">{{$parent.pageTitle || $route.params.page}}</h1>
    <div class="uk-alert uk-alert-danger" v-if="error">{{ error }}</div>
    <component v-if="steps.length > 0 && steps[0].content !== ''" :is="pageHTML"/>
    <span v-if="steps.length > 1" class="gn-step-block">
      <hr class="gn-hr-thin">
      <div class="gn-step-result">
        <!-- <div v-if="!nextStepValid" class="gn-step-invalid" key="111">
          <span uk-icon="icon: triangle-right; ratio: 1.5" key="11a"></span> <span class="gn-step-msg">Please take the required action...</span>
        </div> -->
        <div v-if="nextStepValid" class="gn-step-valid" key="222">
          <span uk-icon="icon: check; ratio: 2" key="22a"></span> Good job!
        </div>
      </div>
      <button v-if="currentStep > 0" @click="clickPreviousStep" class="uk-button uk-button-default">Previous step</button>
      <span v-if="showNextWarning" class="gn-next-warning"><span uk-icon="icon: warning; ratio: 1" key="33a"></span>This step is not yet finished. Continue anyway?</span>
      <button v-if="currentStep < steps.length - 1" @click="clickNextStep" :class="'uk-button uk-button-primary ' + (nextStepValid ? 'gn-valid' : '')">Next step</button>
    </span>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.esm.js'
import CodeBlock from './codeblock.vue'
import { parse } from './parse'

var { $/* , $$ */, ajax, attr, offset, on, Promise, startsWith } = UIkit.util

let waitCount = 0

let waitForAnchor = function () {
  let el = document.getElementById(window.location.hash.substr(1))
  if (!el) {
    el = document.getElementsByName(window.location.hash.substr(1))[0]
  }
  if (el) {
    let y = el.offsetTop + 112 - 16
    document.documentElement.scrollTop = document.body.scrollTop = y
  } else {
    if ((waitCount += 100) < 3000) {
      setTimeout(waitForAnchor, 100)
    }
  }
}

let startWaitForAnchor = function () {
  waitCount = 0
  waitForAnchor()
}

export default {
  data: () => ({
    error: null,
    cache: {},
    steps: [],
    currentStep: 0,
    lastStepAction: '',
    showNextWarning: false,
    editors: {}
  }),

  components: {
    codeblock: CodeBlock
  },

  mounted () {
    let that = this

    this.$root.$on('gn-editor-changed', (data) => {
      let content = data.content

      that.editors[data.name] = {content: content, originalContent: data.originalContent}

      that.steps[that.currentStep].nextconditionsmet = Diff.diff3_file2_no_effect(
        content.replace(/\s\s+/g, ' '),
        data.originalContent.replace(/\s\s+/g, ' '),
        that.steps[that.currentStep].nextCompare.replace(/\s\s+/g, ' '), true)
    })

    this.$root.$on('gn-editor-request', (data) => {
      if (this.lastStepAction === 'next') {
        this.lastStepAction = ''
        for (let name in this.editors) {
          that.$root.$emit('gn-editor-update', {name: name, content: that.editors[name].content, originalContent: that.editors[name].originalContent})
        }
      }
    })

    on(this.$refs.container, 'click', '[href="#"]', e => e.preventDefault())

    // on(
    //   this.$refs.container,
    //   'click',
    //   'a:not([href^="http"]):not([href^="#"]):not([href^="/"]):not([href^="../"])',
    //   e => {
    //     e.preventDefault()
    //     // DocsApp.$router.replace(e.target.pathname + e.target.hash)
    //   }
    // )

    on(document, 'click', 'a[href^="#"]:not([href="#"])', e =>
      history.pushState({}, '', e.target.href)
    )

    on(window, 'popstate', () => {
      setTimeout(() => {
        if (location.hash && $(location.hash)) {
          scrollTo(0, offset($(location.hash)).top - 100)
        }
      })
    })
  },

  watch: {
    $route: {
      handler () {
        // this.$parent.ids = {}

        let oc = UIkit.offcanvas('#offcanvas', {})
        if (oc) {
          oc.hide()
        }

        var page = this.$route.params.page

        this.error = null

        this.$parent.page = page

        this.$parent.menuPromise.then(() => {
          new Promise((resolve, reject) => {
            if (this.cache[page]) {
              resolve(this.cache[page])
              return
            }

            for (let i in this.$parent.redirects) {
              if (page === this.$parent.redirects[i].path) {
                window.location.replace(this.$parent.redirects[i].redirect)
                return
              }
            }

            if (page === 'Site-Index') {
              setTimeout(() => {
                let el = document.getElementById('gn-site-index')
                resolve(el.innerHTML)
              }, 1)
            } else {
              ajax(`https://raw.githubusercontent.com/wiki/amark/gun/${page}.md?nc=${Math.random()}`).then(
                ({ response }) => {
                  if (startsWith(response.trim(), '<!DOCTYPE html>')) {
                    response = `<div class="uk-text-center">
                                                    <h1>404</h1>
                                                    <p class="uk-text-large">Page not found!</p>
                                                </div>`
                  }

                  this.cache[page] = response
                  resolve(response)
                },
                err => reject(err)
              )
            }
          }).then(page => {
            let steps = parse(page)
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual'
            }
            this.setPage(steps)

            setTimeout(startWaitForAnchor, 100)
            setTimeout(startWaitForAnchor, 300)
          }, () => (this.error = 'Failed loading page'))
        })
      },

      immediate: true
    }
  },

  computed: {
    pageHTML () {
      return Vue.component('docmd', {
        template: '<div>' + this.steps[this.currentStep].content + '</div>',
        components: {
          codeblock: CodeBlock
        },
        mounted () {
          var ids = {}
          var els = document.querySelectorAll('.gn-md-wrapper h1 a[href^="#"], .gn-md-wrapper h2 a[href^="#"]')
          for (var el of els) {
            ids[el.parentNode.innerText] = attr(el, 'href').substr(1)
          }
          this.$parent.$parent.ids = ids
        }
      })
    },

    nextStepValid () {
      return this.steps && this.steps[this.currentStep] && this.steps[this.currentStep].nextconditionsmet
    }
  },

  methods: {
    setPage (steps) {
      document.title = `${this.$parent.page
        .split('-')
        .map(UIkit.util.ucfirst)
        .join(' ')} - GUN documentation`

      this.steps = steps

      // setTimeout(() => {
      //   if (location.hash && $(location.hash)) {
      //     scrollTo(0, offset($(location.hash)).top/*  - 100 */)
      //   } else {
      //     scrollTo(0, 0)
      //   }
      // }, 1)

      // setTimeout(() => $$('pre code', this.$refs.container).forEach(block => hljs.highlightBlock(block)))
    },

    clickNextStep () {
      if (!this.nextStepValid && !this.showNextWarning) {
        this.showNextWarning = true
      } else {
        this.showNextWarning = false
        this.lastStepAction = 'next'
        this.currentStep++
      }
    },

    clickPreviousStep () {
      this.showNextWarning = false
      this.lastStepAction = 'previous'
      this.currentStep--
    }
  }
}
</script>
