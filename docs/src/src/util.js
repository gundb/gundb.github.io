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
  var examplejs = (code, lang, options, codeFull) => {
    return `<codeblock
      :lang="'${lang}'"
      :showcodepenicon="${options.showCodepenIcon}"
      :code="'` + encodeURIComponent(code).replace(/'/g, '%27') + `'"
      :codefull="'` + encodeURIComponent(codeFull).replace(/'/g, '%27') + `'"
      :options="'` + encodeURIComponent(JSON.stringify(options)).replace(/'/g, '%27') + `'"
      ></codeblock>`
  }

  renderer.strong = text => text === 'Note' ? `<span class="uk-label">${text}</span>` : `<strong>${text}</strong>`
  renderer.list = text => `<ul class="uk-list uk-list-bullet">${text}</ul>`
  renderer.image = (href, title, text) => href.match(/modal$/) ? modal(href, text) : base.image(href, title, text)
  renderer.link = (href, title, text) => href.match(/\.md/) ? base.link(href.replace(/.md(.*)/, '$1'), title, text) : base.link(href, title, text)
  renderer.code = (code, lang, escaped) => {
    let options = {
      showCodepenIcon: false,
      tabs: [
        {tp: 'code', title: 'Code'}
      ]
    }

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
          if (lin[1].indexOf('hide: \'start\'') >= 0) {
            hideCode = true
          }
          if (lin[1].indexOf('hide: \'end\'') >= 0) {
            hideCode = false
          }
          for (let j = 0; j < 9; j++) {
            if (lin[1].indexOf('tab' + (j + 1) + ': \'codemirror\'') >= 0) {
              options.tabs[j] = {tp: 'codemirror', title: 'Live edit'}
            }
            if (lin[1].indexOf('tab' + (j + 1) + ': \'codesandbox\'') >= 0) {
              options.tabs[j] = {tp: 'codesandbox', title: 'Live edit'}
            }
            if (lin[1].indexOf('tab' + (j + 1) + ': \'code\'') >= 0) {
              options.tabs[j] = {tp: 'code', title: 'Code'}
            }
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

    lang = lang && lang.split('#')[0]

    return examplejs(code, lang, options, codePen)
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
export function openOnCodepen (code, lang) {
  // var regexp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  // var scripts = (code.match(regexp) || []).join('\n').replace(/<\/?script>/g, '')

  code = code
    // .replace(regexp, '')
    .replace(/<img[^>]+src="(.*?)"|url\((.*?)\)"/g, (match, src) => src.indexOf('../docs/') === 0 ? match.replace(src, `${location.href.split('/docs/')[0]}/docs/${src.replace('../docs/', '')}`) : match)

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
