import { parse } from 'node-html-parser';

let emojiMap: any = {
  'ninja': '\uD83D\uDE0E',
  'regular_smile': '\uD83D\uDE42',
  'sad_smile': '☹',
  'wink_smile': '\uD83D\uDE09',
  'teeth_smile': '\uD83D\uDE01',
  'confused_smile': '\uD83D\uDE15',
  'tongue_smile': '\uD83D\uDE1B',
  'embarrassed_smile': '\uD83D\uDE1F',
  'whatchutalkingabout_smile': '\uD83D\uDE10',
  'angry_smile': '\uD83D\uDE20',
  'angel_smile': '\uD83D\uDE07',
  'shades_smile': '\uD83E\uDD13',
  'devil_smile': '\uD83D\uDE08',
  'cry_smile': '\uD83D\uDE2D',
  'lightbulb': '\uD83D\uDCA1',
  'thumbs_down': '\uD83D\uDC4E',
  'thumbs_up': '\uD83D\uDC4D',
  'heart': '❤',
  'broken_heart': '\uD83D\uDC94',
  'kiss': '\uD83D\uDE18',
  'envelope': '✉',
  'alien': '\uD83D\uDC7D',
  'blink': '\uD83E\uDD74',
  'cheerful': '\uD83D\uDE03',
  'dizzy': '\uD83D\uDE35',
  'ermm': '\uD83D\uDE12',
  'getlost': '\uD83D\uDE41',
  'pinch': '\uD83D\uDE16',
  'sick': '\uD83E\uDD27',
  'sideways': '\uD83D\uDE06',
  'silly': '\uD83D\uDE43',
  'sleeping': '\uD83D\uDE34',
  'unsure': '\uD83D\uDE33',
  'wassat': '\uD83E\uDD28',
  'whistling': '\uD83C\uDFB6',
  'w00t': '\uD83D\uDE2E',
  'omg_smile': '\uD83D\uDE2F'
}

let emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/;

function linkify(inputText: string) {
  let replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
  replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$)(?![\w\s?&.\/;#~%"=-]*>))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+(?![\w\s?&.\/;#~%"=-]*>))/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
}

function extractName(file: string) {
  if (file != null && file.length > 0) {
    while (file.includes(".")) {
      file = file.substr(0, file.lastIndexOf('.'));
    }
  }
  return file;
}

export function reworkMessageHTML(content: string | undefined): string|undefined {
  if (content != undefined) {
    let parsedHTML = parse(content);
    /**
     * Parsing Visma's own emojis
     */
    let imgElements = parsedHTML.querySelectorAll('img[src]');
    imgElements.forEach(item => {
      if (item.attrs.src.includes("smiley/images/")) {
        let name = extractName(item.attrs.src.split("smiley/images/")[1]);
        if (name in emojiMap && content !== undefined) {
          content = content.replace(item.outerHTML, emojiMap[name]);
        }
      }
    });

    // Parse again if emojis changed
    if (imgElements.length > 0)
      parsedHTML = parse(content);

    /**
     * Changing size depending of emoji count
     */
    let emojiMatch = parsedHTML.textContent.match(emojiRegex);
    if (parsedHTML.textContent.trim().length < 6 && emojiMatch !== null && emojiMatch.length < 5 && !parsedHTML.textContent.match(/[a-zA-Z]+/)) {
      let fontSize = 25/emojiMatch.length;
      return '<p style="font-size: '+fontSize+'px">'+parsedHTML.textContent+'</p>';
    }
  }
  if (!content?.includes('<p>'))
    content = '<p>'+content+'</p>';

  content = linkify(content);
  return content;
}
