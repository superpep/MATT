<template>
  <q-select
    v-model="lang"
    :options="langOptions"
    :label="$t('language')"
    dense
    borderless
    emit-value
    map-options
    options-dense
    style="min-width: 150px"
  />
</template>

<script>
export default {
  name: 'LanguageSelector',
  data () {
    return {
      lang: this.$i18n.locale,
      langOptions: [
        { value: 'en-us', label: this.$t('english') },
        { value: 'es-es', label: this.$t('spanish') }
      ]
    }
  },
  watch: {
    lang (lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
