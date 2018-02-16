<template>
  <div class="gn-md-wrapper">
    <h1 class="gn-main-title">{{$parent.pageTitle || $route.params.page}}</h1>
    <div class="uk-alert uk-alert-danger" v-if="error">{{ error }}</div>
    <component v-if="rawHTML !== ''" :is="pageHTML"/>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.esm.js'
import CodeBlock from './codeblock.vue'
import { parse } from "./util"

var { $, $$, ajax, attr, offset, on, Promise, startsWith } = UIkit.util

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function convertDefs (defs) {
    defs = decodeURIComponent(defs)
    defs = JSON.parse(defs)
    return defs
}

export default {
  data: () => ({
    error: null,
    cache: {},
    rawHTML: ''
  }),

  components: {
    codeblock: CodeBlock
  },

  mounted() {
    on(this.$refs.container, "click", '[href="#"]', e => e.preventDefault())

    // on(
    //   this.$refs.container,
    //   "click",
    //   'a:not([href^="http"]):not([href^="#"]):not([href^="/"]):not([href^="../"])',
    //   e => {
    //     e.preventDefault()
    //     // DocsApp.$router.replace(e.target.pathname + e.target.hash)
    //   }
    // )

    on(document, "click", 'a[href^="#"]:not([href="#"])', e =>
      history.pushState({}, "", e.target.href)
    )

    on(window, "popstate", () => {
      setTimeout(() => {
        if (location.hash && $(location.hash)) {
          scrollTo(0, offset($(location.hash)).top - 100)
        }
      })
    })
  },

  watch: {
    $route: {
      handler() {
        this.$parent.ids = {}

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
                  if (startsWith(response.trim(), "<!DOCTYPE html>")) {
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
            parse(page, (err, content) => {
              if (err) {
                this.page = null
                this.error = err
              } else {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                this.setPage(content)
                
                let waitCount = 0
                function waitForAnchor() {
                  let el = document.getElementById(window.location.hash.substr(1))
                  if (!el) {
                    el = document.getElementsByName(window.location.hash.substr(1))[0]
                  }
                  if (el) {
                    let y = el.offsetTop /* + 112 */
                    document.documentElement.scrollTop = document.body.scrollTop = y
                  } else {
                    if ((waitCount += 100) < 3000) {
                      setTimeout(waitForAnchor, 100)
                    }
                  }
                }
                if (window.location.hash) {
                  waitForAnchor()
                }
              }
            })
          }, () => (this.error = "Failed loading page"))
        })
      },

      immediate: true
    }
  },

  computed: {
    pageHTML() {
      return Vue.component('docmd', {
        template: this.rawHTML,
        components: {
          codeblock: CodeBlock
        },
        mounted() {
          var ids = {}
          var els = document.querySelectorAll('.gn-md-wrapper h1 a[href^="#"], .gn-md-wrapper h2 a[href^="#"]')
          for (var el of els) {
            ids[el.parentNode.innerText] = attr(el, "href").substr(1)
          }
          this.$parent.$parent.ids = ids
        }
      })
    }
  },

  methods: {
    setPage(page) {
      document.title = `${this.$parent.page
        .split("-")
        .map(UIkit.util.ucfirst)
        .join(" ")} - GUN`

      this.rawHTML = '<div>' + page + '</div>'

      if (location.hash && $(location.hash)) {
        scrollTo(0, offset($(location.hash)).top - 100)
      } else {
        scrollTo(0, 0)
      }

      setTimeout(() => $$('pre code', this.$refs.container).forEach(block => hljs.highlightBlock(block)))
    }
  }
}
</script>
