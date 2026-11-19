export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Mercadinho OS',
      meta: [
        { name: 'description', content: 'Gestão simples e confiável para mercadinhos.' },
      ],
    },
  },
})
