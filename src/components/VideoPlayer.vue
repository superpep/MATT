<template>
  <div class="q-pa-sm q-gutter-s row">
    <div class="text-center">
      <video ref="videoRef" style="max-width: 100%; max-height: 50%" src="" id="video-container" controls/>
      <q-file filled v-model="video" class="bg-primary" :label="$t('click_to_select_video')" @input="videoReader" counter max-files="1">
        <template v-slot:append>
          <q-icon v-if="video !== null" name="close" :title="$t('remove_video')" @click="removeVideo" class="cursor-pointer"/>
        </template>
      </q-file>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      video: null
    }
  },
  methods: {
    videoReader () {
      const preview = document.getElementById('video-container')
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        // convert image file to base64 string
        preview.src = reader.result
      }, false)

      if (this.video) {
        reader.readAsDataURL(this.video)
      }
    },
    removeVideo () {
      this.video = null
      const preview = document.getElementById('video-container')
      preview.src = ''
    }
  }
}
</script>
