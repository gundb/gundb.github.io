import uniqueid from 'unique-id'
import { escape } from 'he'

import { getParameters } from 'codesandbox/lib/api/define'

var { append, remove } = UIkit.util

export function sluggify (text) {
  return text.toLowerCase().trim().replace(/(&amp;| & )/g, '-and-').replace(/&(.+?);/g, '').replace(/[\s\W-]+/g, '-')
}

export function parse (markdown, cb) {
  var renderer = new marked.Renderer({ langPrefix: 'lang-' })
  var base = new marked.Renderer({ langPrefix: 'lang-' })
  var modal = (href, text) => {
    var slug = 'modal-' + sluggify(text)
    return `<a href="#${slug}" uk-toggle><p class="uk-margin-large-bottom"><img src="${href}" alt="${text}"></p></a>
                  <div id="${slug}" class="uk-modal-full" uk-modal>
                  <div class="uk-modal-dialog uk-flex uk-flex-center uk-flex-middle uk-height-viewport">
                  <button class="uk-modal-close-full" type="button" uk-close></button>
                  <img src="${href}" alt="${text}">
                  </div></div>`
  }
  // var example = code => {
  //   let id = uniqueid(4)

  //   return `<div class="uk-position-relative uk-margin-medium">

  //                     <ul uk-tab>
  //                         <li><a href="#">Preview</a></li>
  //                         <li><a href="#">Markup</a></li>
  //                     </ul>

  //                     <ul class="uk-switcher uk-margin">
  //                         <li>${code}</li>
  //                         <li><pre><code id="${id}" class="lang-html">${escape(code)}</code></pre></li>
  //                     </ul>

  //                     <div class="uk-position-top-right qqquk-margin-small-top">
  //                         <ul class="uk-iconnav">
  //                             <li><a class="js-copy" uk-tooltip="Copy to Clipboard" rel="#${id}"><span uk-icon="icon: copy"></span></a></li>
  //                             <li><a class="js-codepen" uk-tooltip="Edit on Codepen" rel="#${id}"><span uk-icon="icon: file-edit"></span></a></li>
  //                         </ul>
  //                     </div>
  //                 </div>`
  // }
  var examplejs = (code, lang, options, defs, codeFull) => {
    // https://github.com/Rob--W/cors-anywhere/#documentation
    const parameters = getParameters({
      files: {
        'package.json': {
          content: {
            name: 'GUN',
            main: 'index.html',
            dependencies: {
            }
          }
        },
        'index.html': {
          content: codeFull
        },
        'hide1.me': { content: '' },
        'hide2.me': { content: '' },
        'hide3.me': { content: '' },
        'hide4.me': { content: '' },
        'hide5.me': { content: '' }
      }
    })

    let id = 'cod' + uniqueid(4)

    let codeBlock = `<pre><code id="${id}" class="lang-${lang}">${escape(code)}</code></pre>`
    let icons = `<div class="uk-position-top-right">
            <ul class="uk-iconnav gn-code-tabs-ul" gn-defs="${defs}">`
    if (options.showCodepenIcon) {
      icons += `<li><a class="js-codepen" uk-tooltip="Edit on Codepen" rel="#${id}" gn-lang="${lang}"><span uk-icon="icon: file-edit"></span></a></li>`
    }
    icons += `<li><a class="js-copy" uk-tooltip="Copy to Clipboard" rel="#${id}"><span uk-icon="icon: copy"></span></a></li>
            </ul>
        </div>`

    let codesandboxBlock = `
      <div>
        <iframe id="ifr_${id}" name="ifr_${id}" style="width:100%; height:500px; border:0; overflow:hidden; border: 1px solid black; background-color: black;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
        <div id="spn_${id}" style="width:100%; height:500px; position: absolute; top: 0; color: white; display: flex; align-items: center; justify-content: center;"><div uk-spinner></div></div>
      </div>`

    let getCodesandboxScript = function (par) {
      return `
        <script>
          function loadCodesandbox_${id} () {
            var xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                // console.log('ajax2', this.responseText, document.getElementById('frm_${id}'), JSON.parse(this.responseText).sandbox_id)
                document.getElementById('ifr_${id}').src = 'https://codesandbox.io/embed/' + JSON.parse(this.responseText).sandbox_id + '${par}'
                var el = document.getElementById('spn_${id}')
                el.parentNode.removeChild(el)
              }
            };
            xhttp.open("POST", "https://cors-anywhere.herokuapp.com/https://codesandbox.io/api/v1/sandboxes/define?&json=1", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("parameters=${parameters}");
      //console.log('LOAD CODE')
          }
        </script>`
    }

    let getTabs = function (li1, li2, t1, t2) {
      let ret = `
        <ul uk-tab class="gn-code-tabs">
          <li><a href="#">${t1}</a></li>`
      if (li2) {
        ret += `<li id="cli_${id}"=><a href="#">${t2}</a></li>`
      }
      ret += `</ul>
        <ul id="swi_${id}" class="uk-switcher uk-margin gn-code-block">
          <li>${li1}</li>`
      if (li2) {
        ret += `<li>${li2}</li>`
      }
      ret += `</ul>`
      ret += icons
      if (li2) {
        ret += `<script>
          UIkit.util.on('#swi_${id}', 'beforeshow', function () {
            var x = document.getElementById('cli_${id}')
            if (x.classList.contains('uk-active')) {
              loadCodesandbox_${id}()
            }
          })
        </script>`
      }
      return ret
    }

    let ret = codeBlock + icons

    if (options.showCodesandbox === 'show') {
      ret = getCodesandboxScript('?codemirror=1&runonclick=1') + getTabs(codesandboxBlock, null, 'Code'/* 'Preview' */, null) + `
        <script>
          loadCodesandbox_${id}()
        </script>`
    }

    if (options.showCodesandbox === 'tab') {
      ret = getCodesandboxScript('?codemirror=1') + getTabs(codeBlock, codesandboxBlock, 'Code', 'Preview')
    }

    ret = '<div class="uk-position-relative qqquk-margin-medium gn-code">' + ret + '</div>'
    return ret
  }

  renderer.strong = text => text === 'Note' ? `<span class="uk-label">${text}</span>` : `<strong>${text}</strong>`
  renderer.list = text => `<ul class="uk-list uk-list-bullet">${text}</ul>`
  renderer.image = (href, title, text) => href.match(/modal$/) ? modal(href, text) : base.image(href, title, text)
  renderer.link = (href, title, text) => href.match(/\.md/) ? base.link(href.replace(/.md(.*)/, '$1'), title, text) : base.link(href, title, text)
  renderer.code = (code, lang, escaped) => {
    // if (lang === 'example') {
    //   return example(code)
    // }

    let options = {
      showCodepenIcon: false,
      showCodesandbox: ''
    }

    let defs = {}
    let codeClean = ''
    let codePen = ''
    let hideCode = false
    let lines = code.split('\n')
    for (let i in lines) {
      if (lines[i].indexOf('<!-- {') >= 0 && lines[i].indexOf('} -->') >= 0) {
        var lin = lines[i].match(/<!-- {(.*?)} -->/i)
        if (lin && lin.length > 1) {
          if (lin[1].indexOf('codepen: \'link\'') >= 0) {
            options.showCodepenIcon = true
          }
          if (lin[1].indexOf('codesandbox: \'tab\'') >= 0) {
            options.showCodesandbox = 'tab'
          }
          if (lin[1].indexOf('codesandbox: \'show\'') >= 0) {
            options.showCodesandbox = 'show'
          }
          if (lin[1].indexOf('hide: \'start\'') >= 0) {
            hideCode = true
          }
          if (lin[1].indexOf('hide: \'end\'') >= 0) {
            hideCode = false
          }
          // TODO Add option to define and insert blocks; something like: <!-- {id: 'first', blocks: ['second']} -->
        }
      } else {
        codePen += lines[i] + '\n'
        if (!hideCode) {
          codeClean += lines[i] + '\n'
        }
      }
    }
    code = codeClean
    defs.codePen = codePen

    defs = JSON.stringify(defs)
    defs = encodeURIComponent(defs)

    lang = lang && lang.split('#')[0]

    return examplejs(code, lang, options, defs, codePen)
    // return '<div class="uk-margin-medium">' + base.code(code, lang, escaped) + '</div>'
  }
  // renderer.hr = () => `<hr class="uk-margin-large">`
  renderer.hr = () => `<hr>`
  renderer.table = (header, body) => `<div class="uk-overflow-auto"><table class="uk-table uk-table-divider"><thead>${header}</thead><tbody>${body}</tbody></table></div>`
  // renderer.heading = (text, level) => `<h${level} id="${sluggify(text)}" class="uk-h${level > 1 ? level + 1 : level} tm-heading-fragment"><a href="#${sluggify(text)}">${text}</a></h${level}>`
  renderer.heading = (text, level) => `<h${level} id="${sluggify(text)}" class="uk-h${level > 1 ? level + 1 : level} tm-heading-fragment">${text} <a href="#${sluggify(text)}">#</a></h${level}>`

  return marked(markdown, { renderer }, (err, content) => {
    if (content.indexOf('{%isodate%}') !== -1) {
      content = content.replace(/{%isodate%}/g, (new Date(Date.now() + 864e5 * 7)).toISOString().replace(/\.(\d+)Z/, '+00:00'))
    }

    if (cb) {
      cb.apply(this, [err, content])
    }
  })
}

// https://blog.codepen.io/documentation/api/prefill/
export function openOnCodepen (/* code,  */lang, defs) {
  // var regexp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  // var scripts = (code.match(regexp) || []).join('\n').replace(/<\/?script>/g, '')

  let code = ''

  code = code
    // .replace(regexp, '')
    .replace(/<img[^>]+src="(.*?)"|url\((.*?)\)"/g, (match, src) => src.indexOf('../docs/') === 0 ? match.replace(src, `${location.href.split('/docs/')[0]}/docs/${src.replace('../docs/', '')}`) : match)

  if (defs && defs.codePen) {
    code = defs.codePen
  }

  let html = ''
  let js = code
  if (lang === 'html') {
    html = code
    js = ''
  }

  let nc = Date.now() % 9999
  let data = {
    title: '',
    description: '',
    html: html,
    html_pre_processor: 'none',
    css: '',
    css_pre_processor: 'none',
    css_starter: 'neither',
    css_prefix_free: false,
    js: js, // scripts || '',
    js_pre_processor: 'none',
    js_modernizr: false,
    html_classes: '',
    css_external: '', // `https://getuikit.com/assets/uikit/dist/css/uikit.css?nc=${nc}`,
    js_external: `https://cdn.rawgit.com/amark/gun/master/gun.js?nc=${nc}`
  }

  data = JSON.stringify(data)
    // Quotes will screw up the JSON
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

  var form = append(document.body, `<form action="https://codepen.io/pen/define" method="POST" target="_blank">
            <input type="hidden" name="data" value='${data}'>
        </form>`)[0]

  form.submit()
  remove(form)
}
