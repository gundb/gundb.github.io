<template>
    <div>
        <h1 class="gn-main-title">{{$parent.pageTitle || $route.params.page}}</h1>
        <div class="uk-alert uk-alert-danger" v-if="error">{{ error }}</div>
        <div ref="container"></div>
    </div>

</template>

<script>
import { parse, openOnCodepen } from "./util";

var { $, $$, ajax, attr, offset, on, Promise, startsWith } = UIkit.util;

// var components = Object.keys(navigation["Components"]).map(
//   label => navigation["Components"][label]
// );

export default {
  data: () => ({
    error: null,
    cache: {}
  }),

  mounted() {
    new Clipboard("a.js-copy", {
      text: trigger => $(attr(trigger, "rel")).innerText
    })

      .on("success", _ => {
        UIkit.notification({ message: "Copied!", pos: "bottom-right" });
      })
      .on("error", _ => {
        UIkit.notification({
          message: "Copy failed!",
          status: "danger",
          pos: "bottom-right"
        });
      });

    on(this.$refs.container, "click", "a.js-codepen", e => {
      e.preventDefault();
      e.stopImmediatePropagation();

      openOnCodepen($(attr(e.current, "rel")).innerText, attr(e.current, "gn-lang"));
    });

    on(this.$refs.container, "click", '[href="#"]', e => e.preventDefault());

    on(
      this.$refs.container,
      "click",
      'a:not([href^="http"]):not([href^="#"]):not([href^="/"]):not([href^="../"])',
      e => {
        e.preventDefault();
        // DocsApp.$router.replace(e.target.pathname + e.target.hash);
      }
    );

    on(document, "click", 'a[href^="#"]:not([href="#"])', e =>
      history.pushState({}, "", e.target.href)
    );

    on(window, "popstate", () => {
      setTimeout(() => {
        if (location.hash && $(location.hash)) {
          scrollTo(0, offset($(location.hash)).top - 100);
        }
      });
    });
  },

  watch: {
    $route: {
      handler() {
        let oc = UIkit.offcanvas('#offcanvas', {})
        if (oc) {
          oc.hide()
        }

        var page = this.$route.params.page;

        this.error = null;

        this.$parent.page = page;

        new Promise((resolve, reject) => {
          if (this.cache[page]) {
            resolve(this.cache[page]);
            return;
          }

          ajax(`https://raw.githubusercontent.com/wiki/amark/gun/${page}.md?nc=${Math.random()}`).then(
            ({ response }) => {
              if (startsWith(response.trim(), "<!DOCTYPE html>")) {
                response = `<div class="uk-text-center">
                                                <h1>404</h1>
                                                <p class="uk-text-large">Page not found!</p>
                                            </div>`;
              }

              this.cache[page] = response;
              resolve(response);
            },
            err => reject(err)
          );
        }).then(page => {
          parse(page, (err, content) => {
            if (err) {
              this.page = null;
              this.error = err;
            } else {
              this.setPage(content);
            }
          });
        }, () => (this.error = "Failed loading page"));
      },

      immediate: true
    }
  },

  methods: {
    setPage(page) {
      document.title = `${this.$parent.page
        .split("-")
        .map(UIkit.util.ucfirst)
        .join(" ")} - GUN`;

      html(this.$refs.container, page);

      // this.$parent.component = ~components.indexOf(this.$route.params.page)
      //   ? this.$route.params.page
      //   : false;

      this.$parent.ids = $$('> h1 a[href^="#"],> h2 a[href^="#"]', this.$refs.container).reduce(
        (ids, el) => {
          ids[el.parentNode.innerText] = attr(el, "href").substr(1);
          return ids;
        },
        {}
      );

      if (location.hash && $(location.hash)) {
        scrollTo(0, offset($(location.hash)).top - 100);
      } else {
        scrollTo(0, 0);
      }

      setTimeout(() => $$('pre code', this.$refs.container).forEach(block => hljs.highlightBlock(block)));
    }
  }
};

function html(el, html) {
  el.innerHTML = "";
  var range = document.createRange();
  range.selectNode(el);
  el.appendChild(range.createContextualFragment(html));
}
</script>
