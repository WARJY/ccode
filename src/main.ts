import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import flexCol from '@/components/layer/flex-col.vue'
import flexRow from '@/components/layer/flex-row.vue'

const app = createApp(App)

app.use(store).use(router).use(ElementPlus)

app.component('flex-row', flexRow)
app.component('flex-col', flexCol)

app.mount('#app')
