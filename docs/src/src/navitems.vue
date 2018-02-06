<template>
  <ul class="uk-nav uk-nav-default tm-nav gn-ul">
    <li class="qqquk-nav-header gn-menu-section" v-for="(pages, category, index) in items">
      <span v-if="typeof pages === 'object'">
        {{category}}<br>
        <navitems :items="pages" :ids="ids" :showanch="showanch"></navitems>
      </span>
      <router-link v-else class="qqqgn-indent" tag="div" :to="pages" :key="pages" qqqexact>
        <a>{{category}}</a><br>
        <ul class="uk-nav uk-nav-default tm-nav gn-indent" v-if="showanch && $route.params.page === decodeURIComponent(pages)">
          <li class="gn-menu-bookmark-link" v-for="(id, subject) in ids">
              <a :href="'#'+id">{{ subject }}</a>
          </li>
        </ul>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "navitems",

  props: [
    'items', 'ids',  'showanch'
  ]
}
</script>