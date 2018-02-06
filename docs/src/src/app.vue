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

            <ul class="uk-nav uk-nav-default tm-nav" :class="{ 'uk-margin-top': index }" v-for="(pages, category, index) in navigation">
                <li class="qqquk-nav-header gn-menu-section">{{category}}</li>
                <router-link class="gn-indent" tag="li" :to="p" :key="p" v-for="(p, label) in pages" qqqexact>
                  <a>{{label}}</a>
                  <ul class="uk-nav uk-nav-default tm-nav gn-indent" v-if="$route.params.page === decodeURIComponent(p)">
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

                    <ul class="uk-nav uk-nav-default tm-nav uk-margin-top" v-for="(pages, category, index) in navigation">
                        <li class="uk-nav-header">{{category}}</li>
                        <li v-for="(p, label) in pages" exact>
                          <a :href="'./'+p">{{label}}</a>
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
      navigation: {},
      ids: {},
      page: false,
      // component: false
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
      for(let item in this.navigation) {
        for(let itm in this.navigation[item]) {
          if (urlPart === decodeURIComponent(this.navigation[item][itm])) {
            this.pageTitle = itm
          }
        }
      }
    }
  },

  mounted() {
    // UIkit.offcanvas('#offcanvas', {}).show()

    new Promise((resolve, reject) => {
      ajax(`http://gun.js.org/docs/navigation.json?nc=${Math.random()}`).then(page => {
        try {
          let json = JSON.parse(page.response)
          this.navigation = json
          this.setPageTitle(this.$route.params.page)
        } catch(e) {}
      })
    })
  }
}
</script>