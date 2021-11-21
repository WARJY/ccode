let presetMap = {}

const fieldsPresets = require.context(
  "@/preset",
  true,
  /\.js/
)

fieldsPresets.keys().forEach(async preset => {
    if(preset === "./index.js") return
    let current = fieldsPresets(preset).default
    let name = current.name
    presetMap[name] = current
})

let preset = Object.keys(presetMap).map((key,index)=>{
    presetMap[key].preset = true
    return presetMap[key]
})

export default preset