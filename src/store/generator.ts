import axios from 'axios'

const generator = {
    state: {},
    mutations: {},
    actions: {
        createPreset(store: any, config: any) {
            return axios.post("/generate/preset", config)
        },
        createPage(store: any, config: any) {
            return axios.post("/generate/page", config)
        }
    }
}

export default generator