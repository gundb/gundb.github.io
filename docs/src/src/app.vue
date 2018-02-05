<template>

    <div class="uk-offcanvas-content">

        <div class="uk-navbar-container tm-navbar-container" uk-sticky="media: 960">
            <div class="uk-container uk-container-expand">
                <nav class="uk-navbar">

                    <div class="uk-navbar-left">

                        <a href="../" class="uk-navbar-item uk-logo">
                            <img width="76" height="42" class="uk-margin-small-right" uk-svg :src="'http://gun.js.org/images/gun_logo-01.svg'" style="margin-top: 14px;">
                            <span class="gn-head-title">&nbsp; A realtime, decentralized, offline-first, graph database engine.</span>
                        </a>

                    </div>

                    <div class="uk-navbar-right">

                        <ul class="uk-navbar-nav uk-visible@m">
                            <li><a href="http://gun.js.org/">Home</a></li>
                            <li class="uk-active"><a href="/docs">Documentation</a></li>
                            <li><a href="https://github.com/amark/gun">Github</a></li>
                        </ul>

                        <a class="uk-navbar-toggle uk-hidden@m" uk-navbar-toggle-icon href="#offcanvas" uk-toggle></a>

                    </div>

                </nav>
            </div>
        </div>

        <div class="tm-sidebar-left uk-visible@m">

            <h3>Documentation</h3>

            <ul class="uk-nav uk-nav-default tm-nav" :class="{ 'uk-margin-top': index }" v-for="(item, index) in navigation">
                <li class="qqquk-nav-header gn-menu-section">{{item.title}}</li>
                <router-link class="gn-indent" tag="li" :to="itm.ky" :key="itm.ky" v-for="(itm) in item.pages" qqqexact>
                  <a>{{itm.vl}}</a>
                  <ul class="uk-nav uk-nav-default tm-nav gn-indent" v-if="$route.params.page === decodeURIComponent(itm.ky)">
                    <li class="gn-menu-bookmark-link" v-for="(id, subject) in ids">
                        <a :href="'#'+id">{{ subject }}</a>
                    </li>
                  </ul>
                </router-link>
            </ul>

        </div>

        <div class="tm-main uk-section uk-section-default">
            <div class="uk-container qqquk-container-small uk-position-relative gn-main">

                <router-view></router-view>

                <div class="tm-sidebar-right uk-visible@l">
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
                <div class="uk-panel">

                    <!-- <ul class="uk-nav uk-nav-default tm-nav">
                        <li class="uk-nav-header">General</li>
                        <li><a href="../index">Home</a></li>
                        <li><a href="../pro">Pro</a></li>
                        <li><a href="../changelog">Changelog</a></li>
                        <li><a href="../download">Download</a></li>
                    </ul> -->

                    <ul class="uk-nav uk-nav-default tm-nav uk-margin-top" v-for="(item, index) in navigation">
                        <li class="uk-nav-header">{{item.title}}</li>
                        <li v-for="(itm) in item.pages" exact>
                          <a :href="'./'+itm.ky">{{itm.vl}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
var { $, $$, ajax, attr, offset, on, Promise, startsWith } = UIkit.util;

export default {
  name: "app",
  data() {
    return {
      navigation: [], // navigation
      ids: {},
      page: false,
      // component: false
      cache: {},
      pageTitle: ''
    }
  },

  watch: {
    $route: {
      handler() {
        this.setPageTitle(this.$route.params.page)
      }
    }
  },

  methods: {
    setPageTitle(urlPart) {
      for(let item of this.navigation) {
        for(let itm of item.pages) {
          if (urlPart === decodeURIComponent(itm.ky)) {
            this.pageTitle = itm.vl
          }
        }
      }
    }
  },

  mounted() {
    // UIkit.offcanvas('#offcanvas', {}).show()

    var page = '_MENU_'
    new Promise((resolve, reject) => {
      if (this.cache[page]) {
        resolve(this.cache[page]);
        return;
      }

      ajax(`https://raw.githubusercontent.com/wiki/amark/gun/${page}.md?nc=${Math.random()}`).then(
        ({ response }) => {
          if (startsWith(response.trim(), "<!DOCTYPE html>")) {
            response = ``;
          }
          this.cache[page] = response;
          resolve(response);
        },
        err => reject(err)
      );
    }).then(page => {
      var menuItems = page.split('\n')
      let nav = []
      let l1i = -1
      for(let item of menuItems) {
        let level = 0
        if (item.substr(0, 2) === '# ') {
          level = 1
        }
        if (item.substr(0, 3) === '## ') {
          level = 2
        }
        if (level > 0) {
          let s = item.substr(level + 1)
          if (level === 1) {
            l1i++
            nav.push({title: s, pages: []})
          } else {
            let [vl, ky] = s.split(/:(.+)/)
            ky = ky.trim()
            nav[l1i].pages.push({ky: ky, vl: vl})
          }
        }
      }
      this.navigation = nav
      this.setPageTitle(this.$route.params.page)
    }, () => (this.error = "Failed loading page"));

  }
};
</script>