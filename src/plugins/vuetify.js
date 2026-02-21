import { createVuetify } from 'vuetify'
import 'vuetify/styles'

const vuetify = createVuetify({ theme: {
    defaultTheme: 'light',
    themes: {
        light: {
            colors: {
                primary: '#1565c0',
                secondary: '#b0bec5',
                accent: '#d50000',
                error: '#b71c1c',
            },
        },
        dark: {
            colors: {
                primary: '#1565c0',
                secondary: '#b0bec5',
                accent: '#d50000',
                error: '#b71c1c',
            },
        },
    },
}, })

export { vuetify }
