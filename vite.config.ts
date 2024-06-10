import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import CssInspect from './src/tool/core/src/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), CssInspect(
    {
        toggleButtonVisibility: "never",
        toggleComboKey: "meta-shift",
    }
  )],
})
