<template>
  <div style="position: relative;">
    <iframe ref="gniframe" style="width:100%; height:500px; border:0; overflow:hidden; border: 1px solid black; background-color: black;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
    <div v-if="loading" style="width:100%; height:500px; position: absolute; top: 0; color: white; display: flex; align-items: center; justify-content: center;"><div uk-spinner></div></div>
  </div>

</template>

<script>
import { getParameters } from 'codesandbox/lib/api/define'

export default {
  data: () => ({
    loading: true
  }),

  props: [
    'codefull',
    'lang'
  ],

  computed: {
    dcodefull () {
      return decodeURIComponent(this.codefull)
    }
  },

  mounted () {
    // if (this.showcodesandbox === 'show') {
    //   this.loadCodesandbox('?codemirror=1&runonclick=1')
    // }
    // if (this.showcodesandbox === 'tab') {
    this.loadCodesandbox('?codemirror=1')
    // }
  },

  methods: {
    loadCodesandbox (par) {
      let that = this

      const parameters = getParameters({
        files: {
          'package.json': {
            content: {
              name: 'Main',
              main: 'index.html',
              dependencies: {
              }
            }
          },
          'index.html': {
            content: this.dcodefull
          },
          'hide1.me': { content: '' },
          'hide2.me': { content: '' },
          'hide3.me': { content: '' },
          'hide4.me': { content: '' },
          'hide5.me': { content: '' }
        }
      })

      var xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          that.$refs.gniframe.src = 'https://codesandbox.io/embed/' + JSON.parse(this.responseText).sandbox_id + par
          that.loading = false
        }
      }
      // https://github.com/Rob--W/cors-anywhere/#documentation
      xhttp.open('POST', 'https://cors-anywhere.herokuapp.com/https://codesandbox.io/api/v1/sandboxes/define?&json=1', true)
      xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhttp.send('parameters=' + parameters)
      // console.log('LOAD CODE')
    }
  }
}
</script>
