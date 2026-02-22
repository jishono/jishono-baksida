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
            let furigana = str.match(/(?=\[).*(\])/)
            furigana = furigana[0].replace(/\[|\]/g, "")
            return `<ruby>${kanji}<rp>(</rp><rt>${furigana}</rt><rp>)</rp></ruby>`
        },
        maruSuji (n) {
            return `${n}.`;
        },
        addFurigana (str) {
            let escaped = this.escapeHTML(str)
            if (!escaped.match(/\[/)) {
                return escaped
            }
            const regex = new RegExp(/[^）、]*?\]/g)
            const matches = escaped.match(regex)
            let final_string = escaped
            if (matches) {
                matches.forEach(match => {
                    final_string = final_string.replace(match, this.addRuby(match))
                })
            }
            return final_string
        }
    }
}