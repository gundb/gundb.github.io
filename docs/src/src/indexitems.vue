<template>
  <ul class="uk-nav uk-nav-default tm-nav gn-ul">
    <li class="gn-menu-section" v-for="(item, index) in items">
      <span v-if="item.pages">
        <div class="gn-cat">{{item.name}}</div>
        <indexitems :items="item.pages" :ids="ids" :showanch="showanch"></indexitems>
      </span>
      <router-link v-else class="qqqgn-indent" tag="div" :to="url" :key="url" v-for="(url, name) in item" qqqexact>
        <a>{{name}}</a><br>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'indexitems',

  props: [
    'items', 'ids', 'showanch'
  ]
}
</script>