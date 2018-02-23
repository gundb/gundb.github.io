<template>
  <ul class="uk-nav uk-nav-default tm-nav gn-ul">
    <li class="qqquk-nav-header gn-menu-section" v-for="(item, index) in items">
      <span v-if="item.pages">
        <div class="gn-cat" @click="clickCat(item, $event)">{{item.name}}</div>
        <navitems v-if="item.expanded" :items="item.pages" :ids="ids" :showanch="showanch"></navitems>
      </span>
      <router-link v-else class="qqqgn-indent" tag="div" :to="url" :key="url" v-for="(url, name) in item" qqqexact>
        <a>{{name}}</a><br>
        <ul class="uk-nav uk-nav-default tm-nav gn-indent" v-if="showanch && $route.params.page === decodeURIComponent(url)">
          <li class="gn-menu-bookmark-link" v-for="(id, subject) in ids">
              <a :href="id">{{ subject }}</a>
          </li>
        </ul>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'navitems',

  props: [
    'items', 'ids', 'showanch'
  ],

  methods: {
    clickCat: function (item, event) {
      this.$root.$emit('catClicked', item)
    }
  }
}
</script>