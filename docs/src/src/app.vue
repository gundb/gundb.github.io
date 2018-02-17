<template>

    <div class="uk-offcanvas-content">

        <div class="uk-navbar-container tm-navbar-container" qqquk-sticky="media: 960">
            <div class="uk-container uk-container-expand">
                <nav class="uk-navbar">
                    <div class="uk-navbar-left">
                        <a href="../" class="uk-navbar-item uk-logo">
                            <img width="76" height="42" class="uk-margin-small-right gn-logo" uk-svg :src="'http://gun.js.org/images/gun_logo-01.svg'">
                        </a>
                    </div>
                    <div class="uk-navbar-right">
                        <ul class="uk-navbar-nav uk-visible@m">
                            <li><a href="http://gun.js.org/">Home</a></li>
                            <li class="qqquk-active"><a href="Site-Index">Index</a></li>
                            <li><a href="https://github.com/amark/gun">Github</a></li>
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
                            <!-- <li v-for="(id, subject) in ids"> -->
                                <!-- <a :href="'#'+id">{{ subject }}</a> -->
                            <!-- </li> -->
                            <!-- <li class="uk-nav-divider"></li> -->
                            <!-- <li v-if="component">
                                <a :href="'../assets/uikit/tests/'+component+'.html'" target="_blank">
                                    <span class="uk-margin-small-right" uk-icon="icon: push"></span>
                                    <span class="uk-text-middle">Open test</span>
                                </a>
                            </li> -->

                            <li id="gn-src"><a><gcse:search v-pre></gcse:search></a></li>

                            <li>
                                <a :href="'https://github.com/amark/gun/wiki/'+page+'/_edit'" target="_blank">
                                    <span class="uk-margin-small-right" uk-icon="icon: pencil"></span>
                                    <span class="uk-text-middle">Edit this page</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://gitter.im/amark/gun" target="_blank">
                                    <span class="uk-margin-small-right" uk-icon="icon: commenting"></span>
                                    <span class="uk-text-middle">Get help</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/amark/gun/issues" target="_blank">
                                    <span class="uk-margin-small-right" uk-icon="icon: warning"></span>
                                    <span class="uk-text-middle">Report an issue</span>
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

                    <!-- <ul class="uk-nav uk-nav-default tm-nav">
                        <li class="uk-nav-header">General</li>
                        <li><a href="../index">Home</a></li>
                        <li><a href="../pro">Pro</a></li>
                        <li><a href="../changelog">Changelog</a></li>
                        <li><a href="../download">Download</a></li>
                    </ul> -->

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
var { $, $$, ajax, attr, offset, on, Promise, startsWith } = UIkit.util;
import NavItems from './navitems.vue'
import IndexItems from './indexitems.vue'
import CodeBlock from './codeblock.vue'

export default {
  name: "app",

  data() {
    return {
      navigation: [],
      redirects: [],
      ids: {},
      page: false,
      // component: false
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
      handler() {
        this.setPageTitle(this.$route.params.page, this.navigation)
      }
    }
  },

  methods: {
    setPageTitle(urlPart, nav) {
      for(let item in nav) {
        if (typeof nav[item] === 'object') {
          this.setPageTitle(urlPart, nav[item])
        } else if (urlPart === decodeURIComponent(nav[item])) {
          this.pageTitle = item
        }
      }
    },

    updateExpanded(nav, rout) {
      let ret = false
      for(let item in nav) {
        if (typeof nav[item] === 'object' && nav[item].pages) {
          let ue = this.updateExpanded(nav[item].pages, rout)
          ue = ue || nav[item].expanded
          ret = ret || ue
          this.$set(nav[item], 'expanded', ue)
        }  if(rout) {
          for(let itm in nav[item]) {
            if (this.$route.params.page === decodeURIComponent(nav[item][itm])) {
              ret = true
            }
          }
        }
      }
      return ret
    },

    allCollapse(nav, st) {
      for(let item in nav) {
        if (typeof nav[item] === 'object' && nav[item].pages) {
          this.$set(nav[item], 'expanded', !st)
          this.allCollapse(nav[item].pages, st)
        }
      }
    },

    clickExpand() {
      this.allCollapsed = !this.allCollapsed
      if (this.allCollapsed) {
        this.allCollapse(this.navigation, true)
        // this.updateExpanded(this.navigation, true)
      } else {
        this.allCollapse(this.navigation, false)
      }
    },

    setNavigation(json) {
      this.navigation = json.navigation
      this.redirects = json.redirects

      this.$router.addRoutes(this.redirects)

      this.setPageTitle(this.$route.params.page, this.navigation)
      this.updateExpanded(this.navigation, true)
    }
  },

  created() {
    let that = this

    this.$root.$on('catClicked', (item) => {
      this.allCollapse(this.navigation, true)
      this.$set(item, 'expanded', true)
      this.updateExpanded(this.navigation, false)
    })

    this.menuPromise = new Promise((resolve, reject) => {
      if(window.location.host.indexOf('breasy.site') >= 0) {
        const localNav = require("../../navigation.json")
        this.setNavigation(localNav)
        resolve()
      } else {
        ajax(`http://gun.js.org/docs/navigation.json?nc=${Math.random()}`).then(page => {
          try {
            let s = page.response
            s = s.replace(/\/\*(.|[\r\n])*?\*\//g, '').replace(/\/\/.*/gm, '');
            let json = JSON.parse(s)
            this.setNavigation(json)
            resolve()
          } catch(e) {
            // console.error(e)
          }
        })
      }
    })
  },

  mounted() {
    // UIkit.offcanvas('#offcanvas', {}).show()

    window.addEventListener('scroll', function(e) {
      var doc = document.documentElement
      var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
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
      (function() {
        var cx = "018061041148283299270:yzadbgjxtxu"
        var gcse = document.createElement("script")
        gcse.type = "text/javascript"
        gcse.async = true
        gcse.src = "https://cse.google.com/cse.js?cx=" + cx
        var s = document.getElementsByTagName("script")[0]
        s.parentNode.insertBefore(gcse, s)
      })()
    }, 1000)
  }
}
</script>