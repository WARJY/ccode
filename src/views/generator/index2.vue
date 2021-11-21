<template>
    <div class="main-container">
        <child :content="content" :selected="selected" @select="handleSelected" @props="handleProps"></child>

        <div class="tool-bar">
            <div
                v-for="(item,index) in toolList"
                :key="index"
                class="tool-item"
                @click="handleComponents(item)"
            >{{item.name}}</div>
            <div class="flex1"></div>
            <!-- <div class="tool-item" @click="presetDrawerOpen=true">预设</div> -->
            <div class="tool-item" @click="generateDrawerOpen=true">生成</div>
        </div>

        <!-- 组件列表 -->
        <div class="component-list">
            <div
                v-show="item.name"
                v-for="(item,index) in currentTool.child"
                :key="index"
                class="component-item"
                @click="handleAdd(item)"
            >
                <div class="mention">{{item.name}}</div>
            </div>
        </div>

        <!-- 样式列表 -->
        <div class="drop-list">
            <el-form class="detail" :inline="true" label-width="1.5rem" label-position="left">
                <el-form-item :label="selectedName"></el-form-item>
                <div v-for="(item,index) in styleList" :key="index">
                    <el-form-item :label="item.key+'：'">
                        <el-input
                            v-model="item.value"
                            placeholder="请输入"
                            @input="handleChange($event, item)"
                        />
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import Child from '@/components/child'
import { tool, preset, styleBase } from "./butler.config";
import { is } from "cutil"

let uid = 0
let components = {}
let toolList = Object.keys(tool).map((item, index) => {
    return {
        name: item,
        child: Object.keys(tool[item]).map((cpt, index) => {
            if (is(tool[item][cpt]) === Object) {
                components[tool[item][cpt].name] = tool[item][cpt]
                return tool[item][cpt];
            }
            return false;
        }).filter((item, index) => {
            return item !== false
        })
    };
});
let presetList = Object.keys(preset).map((key, index) => {
    return {
        ...preset[key],
        type: key
    }
})

export default {
    name: "Generator",
    components: {
        ...components,
        Child
    },
    data() {
        return {
            content: [],
            toolList: toolList,
            currentTool: [],
            selected: "",
            propList: [],
            styleList: [],
            eventList: [],
            presetList: presetList,
            presetDrawerOpen: false,
            generateDrawerOpen: false,
            generateForm: {
                type: "",
                name: "",
                floder: "",
                router: "",
                cache: false,
                parent: ""
            },
            presetOpt: [
                { label: "列表预设", value: "list" },
                { label: "详情预设", value: "detail" },
            ],
            propsModalOpen: false
        };
    },
    mounted() {
        document.addEventListener("keydown", this.keyDown)
        // window.open('http://localhost:80/#/home/butler/tool', 'newwindow', `width=400, height=${window.innerHeight}, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
    },
    computed:{
        selectedName(){
            if(!this.selected) return ""
            return `${this.selected.content.name} （uid：${this.selected.uid}）`
        }
    },
    methods: {
        // 组件库选择
        handleComponents(item) {
            this.currentTool = item
        },
        // 添加组件
        handleAdd(item) {
            uid += 1
            let current = {
                uid: uid,
                type: this.currentTool.name,
                content: item,
                props: this.getProps(item.props),
                propsOption: this.getPropsOption(item),
                eventOption: this.getEventOption(item),
                child: [],
                parent: this.selected || "",
                name: ""
            }
            console.log(current)

            if (this.selected) return this.selected.child.push(current);
            this.content.push(current);
        },
        // 获取属性默认值
        getPropDefault(props, key) {
            if (is(props[key].default) === Function) return props[key].default()
            return props[key].default
        },
        // 获取属性
        getProps(props) {
            let currentProp = {}
            Object.keys(props).forEach((key, index) => {
                currentProp[key] = this.getPropDefault(props, key)
            })
            return {
                ...currentProp,
                style: {
                    ...styleBase
                },
            }
        },
        // 获取属性配置
        getPropsOption(item) {
            let propOption = {}
            Object.keys(item.props).forEach((key, index) => {
                propOption[key] = {
                    default: this.getPropDefault(item.props, key),
                    use: false,
                }
            })
            return propOption
        },
        // 获取事件配置
        getEventOption(item) {
            if (!item.methods) return {}
            let eventOption = {}
            Object.keys(item.methods).forEach((key, index) => {
                let str = item.methods[key].toString()
                let event = str.match(/this.\$emit\(["|'](\S*?)["|']/g)
                if (event === null) return
                event = event.map(c => c.substring(12, c.length - 1))
                if (event.length > 0) event.forEach((e, index) => {
                    if (e.indexOf("update:") === -1) eventOption[e] = {
                        use: false
                    }
                })
            })
            return eventOption
        },
        // 属性改变
        handleChange(e, item) {
            if (item.type === "style") this.selected.props.style[item.key] = e
            if (item.type === "prop") this.selected.props[item.key] = is(item.dataType) === Function ? item.dataType(e) : item.dataType[0](e)
            console.log(this.selected)
        },
        // 删除
        handleDelete() {
            let child = this.selected.parent ? this.selected.parent.child : this.content
            child.forEach((item, index) => {
                if (item.uid === this.selected.uid) child.splice(index, 1);
            })
            this.selected = ""
            this.styleList = []
        },
        keyDown(e) {
            if (e.keyCode === 68) this.handleDelete()
        },
        // 单击选择
        handleSelected(item, index, flag) {
            if (this.selected.uid === item.uid && !flag) {
                this.selected = ""
                this.styleList = []
                return
            }
            this.selected = item;
            let styleList = []
            Object.keys(item.props).forEach((key, index) => {
                // 处理style
                if (key === "style") Object.keys(item.props.style).forEach((styleKey, index) => {
                    styleList.push({
                        key: styleKey,
                        value: item.props.style[styleKey].toString(),
                        type: "style"
                    })
                })
            })
            this.styleList = styleList
        },
        // 双击属性
        handleProps(item, index) {
            this.handleSelected(item, index, true)
            let propList = []
            let eventList = []
            Object.keys(item.props).forEach((key, index) => {
                if (key == "style") return
                propList.push({
                    key: key,
                    value: item.props[key] ? item.props[key].toString() : "",
                    dataType: item.content.props[key].type,
                    option: item.content.props[key].option || false,
                    type: "prop",
                    use: this.selected.propsOption[key].use || false,
                })
            })
            Object.keys(item.eventOption).forEach((event, index) => {
                eventList.push({
                    event: event,
                    use: this.selected.eventOption[event].use || false,
                })
            })
            this.propList = propList
            this.eventList = eventList
            this.propsModalOpen = true
            console.log(eventList)
        },
        // 属性选择
        handlePropSelect(e, item) {
            this.selected.propsOption[item.key].use = e
        },
        // 事件选择
        handleEventSelect(e, item) {
            this.selected.eventOption[item.event].use = e
        },
        // 页面名改变
        nameChange(e) {
            this.generateForm.router = `/home/${this.generateForm.floder}/${this.generateForm.name}`
        },
        // 文件路径改变
        floderChange(e) {
            this.generateForm.router = `/home/${this.generateForm.floder}/${this.generateForm.name}`
        },
        // 生成
        handleGenerate() {
            let para = {
                ...this.generateForm,
                menuItem: "",
            }
            if (!this.generateForm.preset) para.content = this.getChild(this.content)
            this.$store.dispatch("generagePage", para).then(data => {
                this.$message("生成成功")
            })
        },
        // 获取子元素
        getChild(child) {
            console.log(child)
            return child.map((item, index) => {
                let props = {}
                if (item.props.style) props.style = item.props.style
                Object.keys(item.props).forEach((key, index) => {
                    if (key === "style") return
                    let value = item.props[key] || item.propsOption[key].default
                    if (JSON.stringify(item.props[key]) !== JSON.stringify(item.propsOption[key].default)) props[key] = value
                    if (item.propsOption[key].use) props[key] = value
                })
                return {
                    name: item.name,
                    content: item.content,
                    props,
                    propsOption: item.propsOption,
                    eventOption: item.eventOption,
                    child: item.child.length > 0 ? this.getChild(item.child) : []
                }
            })
        }
    },
};
</script>

<style scoped lang="scss">

.main-container{
    width: 100%;
}

.outline {
    min-width: 20px;
    min-height: 20px;
    border: dashed 0.5px #ccc;
    box-sizing: border-box;
    cursor: pointer;
    &:hover,
    &.selected {
        border: dashed 0.5px #000;
    }
}
.tool {
    &-bar {
        width: 100vw;
        height: 48px;
        line-height: 48px;
        box-sizing: border-box;
        font-size: 18px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #fff;
        z-index: 1000;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    &-item {
        background-color: #1261c8;
        color: #fff;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        border-radius: 6px;
        margin-right: 10px;
        cursor: pointer;
        transition: all 300ms ease;
        &:hover {
            transform: scale(1.1);
        }
        &:active {
            transform: scale(1);
        }
    }
}
.component {
    &-list {
        width: 200px;
        height: calc((100vh - 60px) / 2);
        padding: 20px;
        box-sizing: border-box;
        overflow-y: scroll;
        position: fixed;
        top: 48px;
        left: 0;
        z-index: 10;
        background-color: #fff;
        &::-webkit-scrollbar {
            width: 0px;
        }
    }

    &-item {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-size: 14px;
        margin-bottom: 10px;
        background-color: #1261c8;
        color: #fff;
        border-radius: 6px;
        padding: 6px 0;
        cursor: pointer;
        transition: all 300ms ease;
        &-img {
            width: 240px;
            height: 140px;
        }
        &-title {
            width: 240px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
        }
        &:hover {
            transform: scale(1.1);
        }
        &:active {
            transform: scale(1);
        }
    }
}
.drop-list {
    width: 200px;
    height: calc((100vh - 60px) / 2);
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    background-color: #fff;
    border-top: solid 10px #eee;
    &::-webkit-scrollbar {
        width: 0px;
    }
}
.preset {
    &-list {
        height: calc(100vh - 60px);
        padding: 20px;
        box-sizing: border-box;
        overflow-y: scroll;
        margin-left: 20px;
        &::-webkit-scrollbar {
            width: 0px;
        }
    }

    &-item {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-size: 14px;
        margin-bottom: 10px;
        padding: 6px 0;
        cursor: pointer;
        transition: all 300ms ease;
        &-img {
            width: 240px;
            height: 140px;
        }
        &-title {
            width: 240px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
        }
        &:hover {
            transform: scale(1.1);
        }
        &:active {
            transform: scale(1);
        }
    }
}
.props-list {
    position: relative;

    .total {
        border-bottom: solid 1px #eee;
        padding-bottom: 10px;
    }

    .detail {
        max-height: 60vh;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            width: 0px;
        }
        &:first-child {
            border-right: solid 1px #eee;
            padding-right: 20px;
        }
    }

    .close {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        line-height: 10px;
        position: absolute;
        right: -20px;
        top: -10px;
        cursor: pointer;
    }
}
</style>