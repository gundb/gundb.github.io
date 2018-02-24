<template>

    <div class="uk-offcanvas-content">

        <div class="uk-navbar-container tm-navbar-container" qqquk-sticky="media: 960">
            <div class="uk-container uk-container-expand">
                <nav class="uk-navbar">
                    <div class="uk-navbar-left">
                        <a :href="settings.logo.targetUrl" class="uk-navbar-item uk-logo" target="_blank">
                            <img class="uk-margin-small-right gn-logo" uk-svg :src="settings.logo.url">
                        </a>
                    </div>
                    <div class="uk-navbar-right">
                        <ul class="uk-navbar-nav uk-visible@m">
                            <li v-for="item in settings.topmenu.items" :key="item.name" class="qqquk-active"><a :href="item.url" target="_blank">{{item.name}}</a></li>
                        </ul>
                        <a class="uk-navbar-toggle uk-hidden@m" uk-navbar-toggle-icon href="#offcanvas" uk-toggle></a>
                    </div>
                </nav>
            </div>
        </div>

        <div id="gn-bar-left" class="tm-sidebar-left uk-visible@m gn-style-scroll">
            <div class="gn-expnd" @click="clickExpand"><span v-if="allCollapsed">Expand all</span><span v-else>Collapse all</span></div>
            <h3>Documentation</h3>
            <navitems :items="navigation" :ids="ids" :showanch="true"></navitems>
        </div>

        <div class="tm-main uk-section uk-section-default">
            <div class="uk-container qqquk-container-small uk-position-relative gn-main">

                <router-view></router-view>

                <div id="gn-bar-right" class="tm-sidebar-right uk-visible@l">
                    <div qqquk-sticky="offset: 60" class="gn-sideright">

                        <ul class="uk-nav uk-nav-default tm-nav uk-nav-parent-icon" uk-scrollspy-nav="closest: li; scroll: true; offset: 100">
                            <li id="gn-src"><a><gcse:search v-pre></gcse:search></a></li>

                            <li v-for="item in settings.quickmenu.items" :key="item.name">
                                <a :href="replaceParts(item.url)" target="_blank">
                                    <span class="uk-margin-small-right" :uk-icon="'icon: ' + item.icon"></span>
                                    <span class="uk-text-middle">{{item.name}}</span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>

            </div>
        </div>

        <div id="offcanvas" uk-offcanvas="mode: push; overlay: true">
            <div class="uk-offcanvas-bar">
                <div class="uk-panel tm-sidebar-left gn-left-panel">
                  <navitems :items="navigation" :ids="ids" :showanch="false"></navitems>
                </div>
            </div>
        </div>

    <div id="gn-site-index">
      <div class="gn-index">
        <indexitems :items="navigation" :ids="ids" :showanch="false"></indexitems>
      </div>
    </div>
  </div>
</template>

<script>
import NavItems from './navitems.vue'
import IndexItems from './indexitems.vue'
import CodeBlock from './codeblock.vue'

var {ajax, Promise} = UIkit.util

export default {
  name: 'app',

  data () {
    return {
      navigation: [],
      settings: {},
      redirects: [],
      ids: {},
      page: false,
      pageTitle: '',
      allCollapsed: true
    }
  },

  components: {
    navitems: NavItems,
    indexitems: IndexItems,
    codeblock: CodeBlock
  },

  watch: {
    $route: {
      handler () {
        this.setPageTitle(this.$route.params.page, this.navigation)
      }
    }
  },

  methods: {
    setPageTitle (urlPart, nav) {
      for (let item in nav) {
        if (typeof nav[item] === 'object') {
          this.setPageTitle(urlPart, nav[item])
        } else if (urlPart === decodeURIComponent(nav[item])) {
          this.pageTitle = item
        }
      }
    },

    updateExpanded (nav, rout) {
      let ret = false
      for (let item in nav) {
        if (typeof nav[item] === 'object' && nav[item].pages) {
          let ue = this.updateExpanded(nav[item].pages, rout)
          ue = ue || nav[item].expanded
          ret = ret || ue
          this.$set(nav[item], 'expanded', ue)
        }
        if (rout) {
          for (let itm in nav[item]) {
            if (this.$route.params.page === decodeURIComponent(nav[item][itm])) {
              ret = true
            }
          }
        }
      }
      return ret
    },

    allCollapse (nav, st) {
      for (let item in nav) {
        if (typeof nav[item] === 'object' && nav[item].pages) {
          this.$set(nav[item], 'expanded', !st)
          this.allCollapse(nav[item].pages, st)
        }
      }

      // Always expand the first level.
      this.expandFirstLevel()
    },

    expandFirstLevel () {
      for (let item in this.navigation) {
        this.$set(this.navigation[item], 'expanded', true)
      }
    },

    clickExpand () {
      this.allCollapsed = !this.allCollapsed
      if (this.allCollapsed) {
        this.allCollapse(this.navigation, true)
        // this.updateExpanded(this.navigation, true)
      } else {
        this.allCollapse(this.navigation, false)
      }
    },

    setNavigation (json) {
      this.navigation = json.navigation
      this.redirects = json.redirects
      this.settings = json.settings

      this.$router.addRoutes(this.redirects)

      this.setPageTitle(this.$route.params.page, this.navigation)
      this.updateExpanded(this.navigation, true)
      this.expandFirstLevel()
    },

    replaceParts (s) {
      return s.replace(/\{%slug%\}/, this.page)
    }
  },

  created () {
    this.$root.$on('catClicked', (item) => {
      this.allCollapse(this.navigation, true)
      this.$set(item, 'expanded', true)
      this.updateExpanded(this.navigation, false)
      this.expandFirstLevel()
    })

    this.menuPromise = new Promise((resolve, reject) => {
      if (window.location.host.indexOf('breasy.site') >= 0) {
        const localNav = require('../../navigation.json')
        this.setNavigation(localNav)
        resolve()
      } else {
        ajax(`navigation.json?nc=${Math.random()}`).then(page => {
          try {
            let s = page.response
            // s = s.replace(/:\/\//g, '_:_/_/_')
            // s = s.replace(/\/\*(.|[\r\n])*?\*\//g, '').replace(/\/\/.*/gm, '')
            // s = s.replace(/_:_\/_\/_/g, '://')
            s = s.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
            let json = JSON.parse(s)
            this.setNavigation(json)
            resolve()
          } catch (e) {
            console && console.error('!!! Failed loading navigation !!!', e)
          }
        })
      }
    })
  },

  mounted () {
    let that = this

    // UIkit.offcanvas('#offcanvas', {}).show()

    window.addEventListener('scroll', function (e) {
      var doc = document.documentElement
      var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      let el = document.getElementById('gn-bar-right')
      let y = 96 - top
      if (y < 0) {
        y = 0
      }
      el.setAttribute('style', 'top:' + y + 'px')

      el = document.getElementById('gn-bar-left')
      y = 80 - top
      if (y < 0) {
        y = 0
      }
      el.setAttribute('style', 'top:' + y + 'px')
    })

    setTimeout(() => {
      // Google search
      (function () {
        var cx = that.settings.search.google.cx
        var gcse = document.createElement('script')
        gcse.type = 'text/javascript'
        gcse.async = true
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx
        var s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(gcse, s)
      })()
    }, 1000)
  }
}
</script>