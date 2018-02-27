<template>
  <div class="gn-md-wrapper">
    <h1 class="gn-main-title">{{$parent.pageTitle || $route.params.page}}</h1>
    <h2 v-if="_stepName">{{_stepName}}</h2>
    <div class="uk-alert uk-alert-danger" v-if="error">{{ error }}</div>
    <div v-if="hasStoredCode && currentStep === 0" class="gn-reset-tut-wrapper">
      <div>
      You have previously changed code in this tutorial. Feel free to continue where you left of. Or click this reset button if you want to start all over.
      </div>
      <div><button @click="clickResetTutorial" class="uk-button uk-button-default">Reset&nbsp;tutorial</button></div>
    </div>
    <component v-if="steps.length > 0 && steps[0].content !== ''" :is="pageHTML"/>
    <span v-if="steps.length > 1" class="gn-step-block">
      <hr class="gn-hr-thin">
      <div class="gn-step-result">
        <!-- <div v-if="!nextStepValid" class="gn-step-invalid" key="111">
          <span uk-icon="icon: triangle-right; ratio: 1.5" key="11a"></span> <span class="gn-step-msg">Please take the required action...</span>
        </div> -->
        <div v-if="nextStepValidState === 1" class="gn-step-valid" key="222">
          <span uk-icon="icon: check; ratio: 2" key="22a"></span> {{getCompliment()}}
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
    editors: {},
    editorNames: {}
  }),

  components: {
    codeblock: CodeBlock
  },

  mounted () {
    let that = this

    this.$root.$on('gn-editor-changed', (data) => {
      let content = data.content

      that.$set(that.editors, data.name, {content: content, originalContent: data.originalContent})
      that.$set(that.editorNames, data.name, {name: data.name})

      that.checkValid(content, data.originalContent)

      if (content !== data.originalContent) {
        let ky = that.getStorageKey(data.name, this.steps[this.currentStep].name)
        localStorage.setItem(ky, data.content)
        let chk = localStorage.getItem(ky)
        if (chk !== data.content) {
          localStorage.removeItem(ky)
        }
      }

      that.showNextWarning = false
    })

    this.$root.$on('gn-editor-request', (data) => {
      let chkd = false

      that.$set(that.editorNames, data.name, {name: data.name})

      if (that.lastStepAction === 'next') {
        that.lastStepAction = ''
        for (let name in this.editors) {
          that.$root.$emit('gn-editor-update', {name: name, content: that.editors[name].content, originalContent: that.editors[name].originalContent})
        }
      } else {
        let ky = that.getStorageKey(data.name, this.steps[this.currentStep].name)
        let cntnt = localStorage.getItem(ky)
        if (cntnt && cntnt !== '') {
          that.$root.$emit('gn-editor-update-from-storage', {name: data.name, content: cntnt, originalContent: ''})
          that.checkValid(cntnt, that.editors[data.name].originalContent)
          chkd = true
        }
      }

      if (!chkd) {
        that.checkValid('', '') // So debug is shown if needed.
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
      handler (to, from) {
        if (!to || !from || to.path !== from.path) {
          let that = this

          // this.$parent.ids = {}

          let oc = UIkit.offcanvas('#offcanvas', {})
          if (oc) {
            oc.hide()
          }

          var page = this.$route.params.page

          this.error = null

          this.$parent.page = page

          this.$parent.menuPromise && this.$parent.menuPromise.then(() => {
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
                ajax(that.replaceParts(that.$parent.settings.page.requestUrl + '?nc=' + Math.random())).then(
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

              that.setPage(steps)

              that.checkValid('', '')

              that.checkHash()
            }, () => (this.error = 'Failed loading page'))
          })
        } else {
          this.checkHash()
        }
      },

      immediate: true
    }
  },

  computed: {
    pageHTML () {
      let that = this
      return Vue.component('docmd', {
        template: '<div>' + this.steps[this.currentStep].content + '</div>',
        components: {
          codeblock: CodeBlock
        },
        mounted () {
          var ids = {}
          if (that.steps.length > 1) {
            for (let step of that.steps) {
              if (step.name !== '_default_') {
                ids[step.name] = '#step=' + encodeURIComponent(step.name)
              }
            }
          } else {
            var els = document.querySelectorAll('.gn-md-wrapper h1 a[href^="#"], .gn-md-wrapper h2 a[href^="#"]')
            for (var el of els) {
              ids[el.parentNode.innerText] = attr(el, 'href')
            }
          }
          this.$parent.$parent.ids = ids
        }
      })
    },

    nextStepValid () {
      return this.steps && this.steps[this.currentStep] && this.steps[this.currentStep].nextconditionsmet > 0
    },

    nextStepValidState () {
      return this.steps && this.steps[this.currentStep] && this.steps[this.currentStep].nextconditionsmet
    },

    _stepName () {
      if (this.steps && this.steps[this.currentStep]) {
        let name = this.steps[this.currentStep].name
        if (name !== '_default_') {
          return name
        }
      }
      return false
    },

    hasStoredCode () {
      let ret = false
      if (this.steps) {
        for (let name in this.editorNames) {
          for (let step of this.steps) {
            let ky = this.getStorageKey(name, step.name)
            let cntnt = localStorage.getItem(ky)
            if (cntnt && cntnt !== '') {
              ret = true
            }
          }
        }
      }
      return ret
    }
  },

  methods: {
    setPage (steps) {
      document.title = `${this.$parent.page
        .split('-')
        .map(UIkit.util.ucfirst)
        .join(' ')}` + this.$parent.settings.page.title.add

      this.steps = steps
      this.currentStep = 0
      this.lastStepAction = ''
      this.showNextWarning = false

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
      if (this.nextStepValidState <= 0 && !this.showNextWarning) {
        this.showNextWarning = true
      } else {
        this.showNextWarning = false
        this.lastStepAction = 'next'
        this.currentStep++
        this.addStepToRoute()
      }
    },

    clickPreviousStep () {
      this.showNextWarning = false
      this.lastStepAction = 'previous'
      this.currentStep--
      this.addStepToRoute()
    },

    clickResetTutorial () {
      if (this.steps) {
        for (let name in this.editorNames) {
          for (let step of this.steps) {
            let ky = this.getStorageKey(name, step.name)
            localStorage.removeItem(ky)
          }
          this.$root.$emit('gn-editor-update-from-storage', {name: name, content: this.editors[name].originalContent, originalContent: this.editors[name].originalContent})
        }
        this.$set(this.editorNames, '_' + Math.random(), {name: ''}) // Force Reset button recalc.
      }
    },

    addStepToRoute () {
      this.$router.push({hash: this.steps[this.currentStep].name === '_default_' ? '' : 'step=' + this.steps[this.currentStep].name})
    },

    getCompliment () {
      let items = [
        'Well done!',
        'Good job!',
        'You rock!',
        'Awesome!'
      ]
      return items[Math.floor(Math.random() * items.length)]
    },

    replaceParts (s) {
      return s.replace(/\{%slug%\}/, this.$parent.page)
    },

    checkValid (content, originalContent) {
      let that = this

      if (that.steps[that.currentStep].nextCompare !== '_NONE_') {
        that.steps[that.currentStep].nextconditionsmet = Diff.diff3_file2_no_effect(
          content.replace(/\n/g, ' ').replace(/\s\s+/g, ' '),
          originalContent.replace(/\n/g, ' ').replace(/\s\s+/g, ' '),
          that.steps[that.currentStep].nextCompare.replace(/\n/g, ' ').replace(/\s\s+/g, ' '), true) ? 1 : -1
      } else {
        that.steps[that.currentStep].nextconditionsmet = 2
      }

      if (that.$route.query && that.$route.query.debug === '1') {
        let el = document.getElementById('gn-debug')
        if (!el) {
          el = document.createElement('div')
          el.setAttribute('id', 'gn-debug')
          document.body.appendChild(el)
        }
        el.innerHTML = 'Debug:<br><br>' + 'nextstepcompare:<br><br>' + that.steps[that.currentStep].nextCompare
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/'/g, '&quot;')
          .replace(/'/g, '&#039;')
          .replace(/\n/g, '<br>')
          .replace(/ /g, '&nbsp;')
      }
    },

    checkHash () {
      let that = this

      setTimeout(startWaitForAnchor, 100)
      setTimeout(startWaitForAnchor, 300)

      if (that.steps && that.steps.length > 1) {
        document.documentElement.scrollTop = 0
      }

      if (that.$route.hash && that.$route.hash.indexOf('#step=') === 0 && that.steps) {
        for (let i in that.steps) {
          if (that.steps[i].name === decodeURIComponent(that.$route.hash.substr('#step='.length))) {
            that.currentStep = i
          }
        }
      } else if (that.steps && that.steps.length > 1) {
        that.currentStep = 0
      }
    },

    getStorageKey (n, n2) {
      return encodeURIComponent('GUNdoc_code_' + this.$route.params.page + '_EDT_' + n + '_STEP_' + n2)
    }
  }
}
</script>
