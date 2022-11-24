interface YoudaoTransRes {
  type: string
  errorCode: number
  isWord: boolean
  query: string
  elapsedTime: number
  translation: string[]
}
interface GoogleTransRes {
  sentences: { trans: string; orig: string; backend: number }[]
  src: string
  confidence: number
  spell: {}
  ld_result: {
    srclangs: string[]
    srclangs_confidences: number[]
    extended_srclangs: string[]
  }
}
interface Options {
  to: string
  from: string
}

// youdao 翻译
export async function youdaoTrans(queryStr: string): Promise<string> {
  const url = `http://aidemo.youdao.com/trans?q=${queryStr}&from=Auto&to=Auto`
  const res = await fetch(url)
  const data: YoudaoTransRes = await res.json()
  return data.translation[0]
}

// google 翻译
export async function googleTrans(
  text: string,
  options: Options = {
    from: 'auto',
    to: 'zh-CN',
  },
): Promise<string> {
  const { from, to } = options
  const plainText = encodeURI(text)
  const url = `https://translate.google.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&q=${plainText}&sl=${from}&tl=${to}`

  const res = await fetch(url)
  try {
    // JSON.parse(JSON.stringify(res))
    const data: GoogleTransRes = await res.json()
    return data.sentences.map((it) => it.trans).join('')
  } catch (error) {
    console.log('🚀🚀🚀', error)
    // return ''
  }
  // const data: GoogleTransRes = await res.json()
  // return data.sentences.map((it) => it.trans).join('')
}
// 测试 google 翻译联通情况
export async function testGoogleTrans() {
  try {
    const res = await fetch(`https://translate.google.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&q=hello&sl=auto&tl=zh-CN`)
    const data: GoogleTransRes = await res.json()
    console.log('🚀请求成功', data)
    return true
  } catch (e) {
    console.log('❌请求失败', e)
    return false
  }
}

// const testUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&dj=1&dt=t&dt=at&dt=bd&dt=ex&dt=md&dt=rw&dt=ss&dt=rm&sl=auto&tl=zh-cn&tk=886650.730963&q=why%20you%20so%20builty`
// const testUrl =
//   'https://translate.googleapis.com/translate_a/t?anno=3&client=te_lib&format=html&v=1.0&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&logld=vTE_20221023&sl=en&tl=zh-CN&tc=2&sr=1&tk=406349.74544&mode=1'
