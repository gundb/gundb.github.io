import uniqueid from 'unique-id'
import { escape } from 'he'

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
  var examplejs = (code, lang, showCodepenIcon, defs) => {
    let id = uniqueid(4)
    let ret = `<div class="uk-position-relative qqquk-margin-medium gn-code">
              <pre><code id="${id}" class="lang-${lang}">${escape(code)}</code></pre>
              <div class="uk-position-top-right">
                  <ul class="uk-iconnav">`
    if (showCodepenIcon) {
      ret += `      <li><a class="js-codepen" uk-tooltip="Edit on Codepen" rel="#${id}" gn-lang="${lang}" gn-defs="${defs}"><span uk-icon="icon: file-edit"></span></a></li>`
    }
    ret += `        <li><a class="js-copy" uk-tooltip="Copy to Clipboard" rel="#${id}"><span uk-icon="icon: copy"></span></a></li>
                  </ul>
              </div>
          </div>`
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

    let defs = {
      addHtmlBefore: '',
      addHtmlAfter: '',
      deleteLinesAtEnd: 0
    }
    var regex = /<!-- docDef([\s\S]*?)docDef -->/g
    var m
    while ((m = regex.exec(code))) {
      let modAddHtmlBefore = false
      let modAddHtmlAfter = false
      let lines = m[1].split('\n')
      for (let i in lines) {
        switch (lines[i]) {
          case 'endAddHtmlBefore':
            modAddHtmlBefore = false
            break
          case 'endAddHtmlAfter':
            modAddHtmlAfter = false
            break
        }
        if (lines[i].indexOf('deleteLinesAtEnd') >= 0) {
          defs.deleteLinesAtEnd = parseInt(lines[i].split('deleteLinesAtEnd ')[1])
        }
        if (modAddHtmlBefore) {
          defs.addHtmlBefore += lines[i] + '\n'
        }
        if (modAddHtmlAfter) {
          defs.addHtmlAfter += lines[i] + '\n'
        }
        switch (lines[i]) {
          case 'startAddHtmlBefore':
            modAddHtmlBefore = true
            break
          case 'startAddHtmlAfter':
            modAddHtmlAfter = true
            break
        }
      }
      code = code.replace('<!-- docDef' + m[1] + 'docDef -->\n', '')
    }
    defs = JSON.stringify(defs)
    defs = encodeURIComponent(defs)

    let showCodepenIcon = false
    // if (lang === 'javascript' || lang === 'html') {
    //   showCodepenIcon = true
    // }
    if (lang && lang.indexOf('showCodePen') > 0) {
      showCodepenIcon = true
    }

    lang = lang && lang.split('#')[0]

    return examplejs(code, lang, showCodepenIcon, defs)
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
export function openOnCodepen (code, lang, defs) {
  // var regexp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  // var scripts = (code.match(regexp) || []).join('\n').replace(/<\/?script>/g, '')

  code = code
    // .replace(regexp, '')
    .replace(/<img[^>]+src="(.*?)"|url\((.*?)\)"/g, (match, src) => src.indexOf('../docs/') === 0 ? match.replace(src, `${location.href.split('/docs/')[0]}/docs/${src.replace('../docs/', '')}`) : match)

  if (defs && defs.deleteLinesAtEnd > 0) {
    // console.log('bbb')
    let lines = code.split('\n')
    lines.splice(-defs.deleteLinesAtEnd, defs.deleteLinesAtEnd)
    code = lines.join('\n')
  }

  let html = ''
  let js = code
  if (lang === 'html') {
    html = code
    js = ''
  }

  if (defs && defs.addHtmlBefore) {
    html = defs.addHtmlBefore + '\n' + html
  }
  if (defs && defs.addHtmlAfter) {
    html += '\n' + defs.addHtmlAfter
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
