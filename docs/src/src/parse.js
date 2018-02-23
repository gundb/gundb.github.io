export function parse (markdown) {
  var renderer = new marked.Renderer({ langPrefix: 'lang-' })
  var base = new marked.Renderer({ langPrefix: 'lang-' })

  renderer.strong = text => text === 'Note' ? `<span class="uk-label">${text}</span>` : `<strong>${text}</strong>`
  renderer.list = text => `<ul class="uk-list uk-list-bullet">${text}</ul>`
  renderer.image = (href, title, text) => href.match(/modal$/) ? modal(href, text) : base.image(href, title, text)
  renderer.link = (href, title, text) => href.match(/\.md/) ? base.link(href.replace(/.md(.*)/, '$1'), title, text) : base.link(href, title, text)
  renderer.code = (code, lang, escaped) => rendererCode(code, lang, escaped)
  renderer.hr = () => `<hr>`
  renderer.table = (header, body) => `<div class="uk-overflow-auto"><table class="uk-table uk-table-divider"><thead>${header}</thead><tbody>${body}</tbody></table></div>`
  renderer.heading = (text, level) => `<h${level} id="${sluggify(text)}" class="uk-h${level > 1 ? level + 1 : level} tm-heading-fragment">${text} <a href="#${sluggify(text)}">#</a></h${level}>`

  markdown = processBlocks(markdown)

  return getSteps(markdown, renderer)
}

function sluggify (text) {
  return text.toLowerCase().trim().replace(/(&amp;| & )/g, '-and-').replace(/&(.+?);/g, '').replace(/[\s\W-]+/g, '-')
}

function rendererCode (code, lang, escaped) {
  let {codeClean, codePen, editorName, options} = processCodes(code, {
    showCodepenIcon: false,
    tabs: [
      {tp: 'code', title: 'Code'}
    ],
    hides: []
  })

  return `<codeblock
    :lang="'${lang}'"
    :showcodepenicon="${options.showCodepenIcon}"
    :code="'` + encodeURIComponent(codeClean).replace(/'/g, '%27') + `'"
    :codefull="'` + encodeURIComponent(codePen).replace(/'/g, '%27') + `'"
    :options="'` + encodeURIComponent(JSON.stringify(options)).replace(/'/g, '%27') + `'"
    :editorname="'${editorName}'"
    ></codeblock>\n`
}

function modal (href, text) {
  var slug = 'modal-' + sluggify(text)
  return `<a href="#${slug}" uk-toggle><p class="uk-margin-large-bottom"><img src="${href}" alt="${text}"></p></a>
                <div id="${slug}" class="uk-modal-full" uk-modal>
                <div class="uk-modal-dialog uk-flex uk-flex-center uk-flex-middle uk-height-viewport">
                <button class="uk-modal-close-full" type="button" uk-close></button>
                <img src="${href}" alt="${text}">
                </div></div>`
}

function processCodes (code, options) {
  let codeClean = ''
  let codePen = ''
  let hideCode = false
  let hideStart = 0
  let editorName = ''
  let lineNr = 0
  let lines = code.split('\n')
  for (let i in lines) {
    if (lines[i].indexOf(getRegexStart()) >= 0 && lines[i].indexOf(getRegexEnd()) >= 0) {
      var lin = lines[i].match(getRegex('(.*?)', 'i'))
      if (lin && lin.length > 1) {
        if (lin[1].indexOf('codepen: \'link\'') >= 0) {
          options.showCodepenIcon = true
        }

        if (lin[1].indexOf('hide: \'start\'') >= 0) {
          hideCode = true
          hideStart = lineNr
        }
        if (lin[1].indexOf('hide: \'end\'') >= 0) {
          hideCode = false
          options.hides.push({start: hideStart, end: lineNr - 1})
        }

        for (let j = 0; j < 9; j++) {
          if (lin[1].indexOf('tab' + (j + 1) + ': \'codemirror\'') >= 0) {
            options.tabs[j] = {tp: 'codemirror', title: 'EDITOR / PREVIEW'}
          }
          if (lin[1].indexOf('tab' + (j + 1) + ': \'codesandbox\'') >= 0) {
            options.tabs[j] = {tp: 'codesandbox', title: 'LIVE EDIT'}
          }
          if (lin[1].indexOf('tab' + (j + 1) + ': \'code\'') >= 0) {
            options.tabs[j] = {tp: 'code', title: 'CODE'}
          }
        }

        let matches = decodeURIComponent(lin[1]).match(new RegExp('.*editor: \'(.*)\'.*', 'm'))
        if (matches && matches.length > 1) {
          editorName = matches[1]
        }
      }
    } else {
      codePen = checkAddLineEnd(codePen, lines[i])
      if (!hideCode) {
        codeClean = checkAddLineEnd(codeClean, lines[i])
      }
      lineNr++
    }
  }

  return {codeClean, codePen, editorName, options}
}

function processBlocks (markdown) {
  let blocks = {}
  let lines = markdown.split('\n')
  for (let i = 0; i < lines.length; i++) {
    let lin = lines[i].match(getRegex('(.*?)', 'i'))
    if (lin && lin.length > 1) {
      let matches = decodeURIComponent(lin[1]).match(new RegExp('.*startblock: \'(.*)\'.*', 'm'))
      if (matches && matches.length > 1) {
        blocks[matches[1]] = {active: true, content: []}
        lines.splice(i--, 1)
      }
      matches = decodeURIComponent(lin[1]).match(new RegExp('.*endblock: \'(.*)\'.*', 'm'))
      if (matches && matches.length > 1) {
        try {
          blocks[matches[1]].active = false
        } catch (e) {
          console && console.error('!!! Error parsing block: ' + matches[1] + '!!!', e)
        }
        lines.splice(i--, 1)
      }
      matches = decodeURIComponent(lin[1]).match(new RegExp('.*insertblock: \'(.*)\'.*', 'm'))
      if (matches && matches.length > 1) {
        lines.splice(i--, 1, ...blocks[matches[1]].content)
      }
    } else {
      for (let blk in blocks) {
        if (blocks[blk].active) {
          blocks[blk].content.push(lines[i])
        }
      }
    }
  }
  markdown = lines.join('\n')

  return markdown
}

function getSteps (markdown, renderer) {
  let steps = [{name: '_default_', content: '', nextCompare: '', nextconditionsmet: 0}]
  let inCompare = false
  let lines = markdown.split('\n')
  for (let i in lines) {
    let useLine = true
    let lin = lines[i].match(getRegex('(.*?)', 'i'))
    if (lin && lin.length > 1) {
      let matches = decodeURIComponent(lines[i]).match(new RegExp('step: \'(.*)\'', 'm'))
      if (matches && matches.length > 1) {
        steps.push({name: matches[1], content: '', nextCompare: '', nextconditionsmet: 0})
        useLine = false
      }

      if (lin[1].indexOf('nextstepcompare: \'start\'') >= 0) {
        inCompare = true
        useLine = false
      }
      if (lin[1].indexOf('nextstepcompare: \'end\'') >= 0) {
        inCompare = false
        useLine = false
      }
      if (lin[1].indexOf('nextstepcompare: \'none\'') >= 0) {
        steps[steps.length - 1].nextCompare = '_NONE_'
        useLine = false
      }
    }

    if (useLine) {
      if (inCompare) {
        if (lines[i].indexOf('```') !== 0) {
          steps[steps.length - 1].nextCompare = checkAddLineEnd(steps[steps.length - 1].nextCompare, lines[i])
        }
      } else {
        steps[steps.length - 1].content = checkAddLineEnd(steps[steps.length - 1].content, lines[i])
      }
    }
  }

  for (let i in steps) {
    marked(steps[i].content, { renderer }, (e, content) => {
      steps[i].content = content
    })
  }

  return steps
}

function checkAddLineEnd (s, l) {
  if (s.length) {
    s += '\n'
  }
  s += l
  return s
}

function getRegexStart () {
  // return '<!-- {'
  return '::: {'
}

function getRegexEnd () {
  // return '} -->'
  return '} :::'
}

function getRegex (r, f) {
  return new RegExp(getRegexStart() + r + getRegexEnd(), f)
}
