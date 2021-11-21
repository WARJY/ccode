import * as Element from 'element-plus'

import flexRow from '@/components/layer/flex-row.vue'
import flexCol from '@/components/layer/flex-col.vue'

import preset from '@/preset/index.js'

const styleBase = {
    "width": "",
    "height": "",
    "flex": "",
    "text": ""
}

const componentsMap = {
    
}

const components = [
    {
        name: "layout", children: [
            flexRow,
            flexCol,
        ]
    },
    {
        name: "element-ui", children: Object.keys(Element).filter((key,index)=>{
            return key.indexOf("El") === 0
        }).map((item,index)=>{
            componentsMap[item] = Element[item]
            return Element[item]
        })
    },
    {
        name: "preset", children: preset
    }
]

export {
    styleBase,
    components,
    componentsMap
}