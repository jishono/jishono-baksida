import md5 from 'md5'

export default {
    methods: {
        randomFarge (brukernavn) {
            return '#' + md5(brukernavn).slice(0, 6);
        },
        initialer (brukernavn) {
            return brukernavn.slice(0, 2).toUpperCase();
        },
        escapeHTML (str) {
            return new Option(str).innerHTML;
        },
        addRuby (str) {
            const kanji = str.match(/.*?(?=\[)/)
            const furigana = str.match(/(?<=\[).*(?=\])/)
            return `<ruby>${kanji}<rp>(</rp><rt>${furigana}</rt><rp>)</rp></ruby>`
        },
        addFurigana (str) {
            let escaped = this.escapeHTML(str)
            const regex = new RegExp(/[^）、]*?\]/g)
            const array = escaped.match(regex)
            let final_string = escaped
            if (array) {
                array.forEach(element => {
                    final_string = final_string.replace(element, this.addRuby(element))
                })
            }
            return final_string
        }
    }
}