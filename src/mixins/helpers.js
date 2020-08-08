import md5 from 'md5'

export default {
    methods: {
        randomFarge (brukernavn) {
            return '#' + md5(brukernavn).slice(0, 6);
        },
        initialer (brukernavn) {
            return brukernavn.slice(0, 2).toUpperCase();
        }
    }
}