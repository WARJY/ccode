const fs = require('fs');
const { is } = require('cutil')
const { tf } = require('./utils/index')

const getChild = function (parent) {
    if (parent.length === 0) return {
        template: "",
        data: "",
        methods: ""
    }
    let template = ""
    let data = ""
    let methods = ""
    parent.forEach((child, index) => {
        let propTemplate = ""
        let styleTemplate = ""
        let methodsTemplate = ""
        let childTemplate = ""

        // 处理style
        let style = child.props.style
        if (style) {
            styleTemplate = Object.keys(style).filter((key, index) => {
                return style[key]
            }).map((key, index) => {
                return `${key}:${style[key]}`
            }).join(";")
            if (styleTemplate) styleTemplate = `style='${styleTemplate}'`
        }

        // 处理props
        let prop = {
            ...child.props
        }
        delete prop.style
        if (prop) {
            propTemplate = Object.keys(prop).filter((key, index) => {
                return child.propsOption[key].use === true || prop[key]
            }).map((key, index) => {

                let propType = is(prop[key])
                let propValue = prop[key]

                // 添加额外的data
                if (child.propsOption[key].use === true) {
                    let dataField = [child.content.name, key]
                    if (child.name) dataField.unshift(child.name)
                    dataField = tf(dataField)
                    data += `${dataField}:${JSON.stringify(propValue)},
                    `
                    propValue = dataField
                }

                // 属性模板生成
                let propBind = ""
                if (propType === Object || propType === Boolean || propType === Number || propType === Array) propBind = ":"
                if(key==="modelValue") return `v-model='${propValue}'`

                return `${propBind}${key}='${propValue}'`
            }).join(" ")
        }

        // 处理methods
        if (child.eventOption) {
            methodsTemplate = Object.keys(child.eventOption).filter((event, index) => {
                return child.eventOption[event].use === true
            }).map((event, index) => {

                // 添加额外的methods
                if (child.eventOption[event].use === true) {
                    let dataField = ["handle", child.content.name, event]
                    if (child.name) dataField.unshift(child.name)
                    dataField = tf(dataField)
                    methods += `${dataField}(){},
                    `
                    return `@${event}='${dataField}'`
                }

            }).join("\r")
        }

        // 处理child
        if (child.children.length > 0) childTemplate = getChild(child.children)

        template += `<${child.content.name} ${styleTemplate} ${propTemplate} ${methodsTemplate}>${childTemplate.template || ""}</${child.content.name}>`

        data += childTemplate.data || ""

        methods += childTemplate.methods || ""
    })
    return { template, data, methods }
}

module.exports = {
    add: async function (config) {
        // 内容生成
        let temp = getChild(config.content)

        let template = `
<template>
    <div class="container">
        ${temp.template}
    </div>
</template>
    
<script>
export default {
    data() {
        return {
        ${temp.data}
        }
    },
    mounted() {
        
    },
    methods: {
        ${temp.methods}
    },
};
</script>

<style scoped>
.container{

}
</style>

<style>
</style>
`

        // 文件生成
        let fileName = `${__dirname}/../src/views/pages/${config.name}.vue`
        fs.writeFileSync(fileName, template)
        console.log("文件生成成功")

        return Promise.resolve(config.name)
    }
}