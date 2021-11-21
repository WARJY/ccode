<template>
    <flex-col class="generator-container">
        <el-card class="full-width" header shadow="never" :body-style="{padding:'10px'}">
            <flex-row row="right">
                <el-button size="mini" type="primary" @click="handlePreset">添加预设</el-button>
                <el-button size="mini" type="primary" @click="handleGenerate">生成代码</el-button>
            </flex-row>
        </el-card>

        <flex-row class="full-width flex1">
            <el-tabs class="tree-panel" type="border-card" v-model="currentTree">
                <!-- 组件树 -->
                <el-tab-pane class="tree-panel-content" label="组件" name="component">
                    <el-input class="tree-panel-search" size="mini" v-model="search" placeholder="请输入组件名称" @input="handleSearch" />
                    <el-tree class="tree-panel-tree" :data="dataSource" node-key="id">
                        <template #default="{ node, data }">
                            <flex-row
                                col="center"
                                class="custom-tree-node"
                                @click="handleAdd(data, selected)"
                            >
                                <svg
                                    class="icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 1024 1024"
                                    data-v-394d1fd8
                                >
                                    <path
                                        fill="currentColor"
                                        d="M128 192v640h768V320H485.76L357.504 192H128zm-32-64h287.872l128.384 128H928a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32z"
                                    />
                                </svg>
                                <span>{{ data.name }}</span>
                            </flex-row>
                        </template>
                    </el-tree>
                </el-tab-pane>

                <!-- 页面树 -->
                <el-tab-pane class="tree-panel-content" label="页面" name="page">
                    <el-tree
                        class="tree-panel-tree"
                        :data="content"
                        node-key="uid"
                        :expand-on-click-node="false"
                        default-expand-all
                    >
                        <template #default="{ node, data }">
                            <flex-row
                                col="center"
                                class="custom-tree-node"
                                @click="handleSelected(data)"
                            >
                                <span>{{data.uid}}: &lt;{{ data.content.name }}&gt; ({{data.name}})</span>
                            </flex-row>
                        </template>
                    </el-tree>
                </el-tab-pane>
            </el-tabs>

            <!-- 内容 -->
            <div class="flex1 content-panel">
                <div class="screen-panel">
                    <children
                        v-model:content="content"
                        :selected="selected"
                        @select="handleSelected"
                        @props="handleProps"
                        @my-drag="handleDrag"
                    ></children>
                </div>
            </div>

            <!-- 属性 -->
            <el-tabs class="props-panel" type="border-card" v-model="currentTab">
                <!-- 样式 -->
                <el-tab-pane class="props-panel-content" label="样式" name="style">
                    <el-form
                        v-show="selected"
                        size="mini"
                        class="props-panel-form"
                        label-width="50px"
                        label-position="left"
                    >
                        <el-form-item label-width="200px" :label="selectedName"></el-form-item>
                        <el-form-item
                            v-for="(item,index) in styleList"
                            :key="index"
                            :label="item.key+'：'"
                        >
                            <el-input
                                v-model="item.value"
                                placeholder="请输入"
                                @input="handleChange($event, item)"
                            />
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <!-- 属性 -->
                <el-tab-pane class="props-panel-content" label="属性" name="prop">
                    <el-form
                        v-show="selected"
                        size="mini"
                        class="props-panel-form"
                        label-width="50px"
                        label-position="left"
                    >
                        <el-form-item label-width="200px" :label="selectedName"></el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="selected.name" placeholder="请输入组件名称" />
                        </el-form-item>
                        <el-form-item v-for="(item,index) in propList" :key="index">
                            <template #label>
                                <el-tooltip placement="left" :content="item.key">
                                    <span>{{getFormLabel(item.key, 6)}}</span>
                                </el-tooltip>
                            </template>
                            <flex-row>
                                <el-input
                                    v-show="!item.option"
                                    v-model="item.value"
                                    class="flex1"
                                    placeholder="请输入"
                                    @input="handleChange($event, item)"
                                />
                                <el-select
                                    v-show="item.option"
                                    v-model="item.value"
                                    class="flex1"
                                    placeholder="请选择"
                                    @change="handleChange($event, item)"
                                >
                                    <el-option
                                        v-for="(item,index) in item.option"
                                        :key="index"
                                        :label="item"
                                        :value="item"
                                    ></el-option>
                                </el-select>
                                <el-checkbox
                                    v-model="item.use"
                                    class="props-panel-form-check"
                                    @change="handlePropSelect($event, item)"
                                ></el-checkbox>
                            </flex-row>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <!-- 事件 -->
                <el-tab-pane class="props-panel-content" label="事件" name="event">
                    <el-form
                        v-show="selected"
                        size="mini"
                        class="props-panel-form"
                        label-width="180px"
                        label-position="left"
                    >
                        <el-form-item label-width="200px" :label="selectedName"></el-form-item>
                        <el-form-item label="名称" label-width="50px">
                            <el-input v-model="selected.name" placeholder="请输入组件名称" />
                        </el-form-item>
                        <el-form-item v-for="(item,index) in eventList" :key="index">
                            <template #label>
                                <el-tooltip placement="left" :content="item.event">
                                    <span>{{getFormLabel(item.event, 20)}}</span>
                                </el-tooltip>
                            </template>
                            <el-checkbox
                                v-model="item.use"
                                @change="handleEventSelect($event, item)"
                            ></el-checkbox>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </flex-row>
    </flex-col>
</template>

<script>
import { toRaw } from 'vue'
import { ElMessageBox } from 'element-plus'
import Children from '@/components/children.vue'
import { components, styleBase, componentsMap } from './butler.config.js'
import { is } from 'cutil'

let uid = 0

export default {
    name: "",
    components: {
        Children,
    },
    data() {
        return {
            dataSource: [].concat(components),
            content: [],
            selected: "",
            styleList: [],
            propList: [],
            eventList: [],
            currentTab: "prop",
            currentTree: "component",
            history: [],
            historyIndex: -1,
            search: ""
            /* DATA APPEND FLAG, dont del this line */
        }
    },
    computed: {
        selectedName() {
            if (!this.selected) return ""
            return `${this.selected.content.name} （uid：${this.selected.uid}）`
        }
        /* COMPUTED APPEND FLAG, dont del this line */
    },
    watch: {
        content: {
            deep: true,
            immediate: true,
            handler(val, old) {
                if (!val) reutrn
                if (this.history.length === this.historyIndex + 1) {
                    this.history.push(this.formatContent(toRaw(this.content), true))
                }
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            document.addEventListener("keyup", e => {
                if (e.key === "Delete") return this.handleDelete(e)
                if (e.key === "c" && e.ctrlKey === true && !e.target.value) return this.handleCopy(e)
                if (e.key === "v" && e.ctrlKey === true && !e.target.value) return this.handlePaste(e)
                if (e.key === "z" && e.ctrlKey === true) return this.handleBack(e)
                if (e.key === "y" && e.ctrlKey === true) return this.handleForward(e)
            })
        },
        // 搜索
        handleSearch(value){
            if(!value) return this.dataSource = [].concat(components)
            this.dataSource = components.reduce((total,item,index)=>{
                return total.concat(item.children.filter((cpt,index)=>{
                    return cpt.name?.toLowerCase().indexOf(value.toLowerCase()) > -1
                }))
            },[])
        },
        // 获取父组件
        getParent(parent, uid) {
            let target = null
            let current = parent === this.content ? parent : parent.children
            current.forEach((item, index) => {
                if (item.uid === uid) {
                    if (parent === this.content) return target = ""
                    return target = parent
                }
                if (item.children.length > 0 && target === null) {
                    let result = this.getParent(item, uid)
                    if (result !== null) target = result
                }
            })
            return target
        },
        // 添加组件
        async handleAdd(item, target, root) {
            let parent = root ? "" : target
            let current = []

            if (item.preset === true) {
                current = this.formatPreset(item.content[0], parent)
            } else {
                if (item.children?.length > 0) return
                uid += 1
                current = {
                    uid: uid,
                    content: item,
                    props: this.getProps(item.props),
                    propsOption: this.getPropsOption(item),
                    eventOption: this.getEventOption(item),
                    children: [],
                    parent,
                    name: ""
                }
                current = [current]
            }

            current.forEach((item, index) => {
                if (root) return this.content.push(item)
                let children = target?.children || this.selected?.children || this.content
                children.push(item)
            })

            this.handleSelected(current[0])
        },
        // 格式化预设
        formatPreset(children, parent) {
            return children.map((item, index) => {
                uid += 1
                let child = {
                    ...item,
                    uid,
                    parent,
                    content: componentsMap[item.content.name],
                    props: {
                        ...this.getProps(componentsMap[item.content.name].props),
                        ...item.props
                    },
                    propsOption: {
                        ...this.getPropsOption(componentsMap[item.content.name]),
                        ...item.propsOption
                    },
                    eventOption: {
                        ...this.getEventOption(componentsMap[item.content.name]),
                        ...item.eventOption
                    },
                    children: [],
                    parent,
                    name: ""
                }
                child.children = item.children?.length > 0 ? this.formatPreset(item.children, child) : []
                return child
            })
        },
        // 删除组件
        handleDelete() {
            let parent = this.selected.parent?.children || this.content
            parent.forEach((item, index) => {
                if (item.uid === this.selected.uid) parent.splice(index, 1);
            })
            this.selected = ""
            this.styleList = []
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
            if (!item.emits) return {}
            let eventOption = {}
            Object.keys(item.emits).forEach((key, index) => {
                let event = item.emits[key].toString()
                eventOption[event] = {
                    use: false
                }
            })
            return eventOption
        },
        // 单击选择
        handleSelected(item, index) {
            if (this.selected.uid === item.uid) {
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
            this.handleProps(item, index)
        },
        // 双击属性
        handleProps(item, index) {
            // this.handleSelected(item, index, true)
            let propList = []
            let eventList = []
            Object.keys(item.props).forEach((key, index) => {
                if (key == "style") return
                propList.push({
                    key: key,
                    value: item.props[key] ? item.props[key].toString() : "",
                    dataType: item.content.props?.[key].type,
                    option: item.content.props?.[key].option || false,
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
        },
        // 拖拽元素
        handleDrag(changeList) {
            if (!changeList) return
            changeList.forEach((el, index) => {
                let parent = this.getParent(this.content, el.uid)
                el.parent = parent
            })
            console.log(this.content)
        },
        // 属性改变
        handleChange(e, item) {
            if (item.type === "style") this.selected.props.style[item.key] = e
            if (item.type === "prop") this.selected.props[item.key] = is(item.dataType) === Function ? item.dataType(e) : item.value
        },
        // 属性选择
        handlePropSelect(e, item) {
            this.selected.propsOption[item.key].use = e
        },
        // 获取formLabel
        getFormLabel(label, len) {
            if (label.length <= len) return label
            return label?.substring(0, len) + ".."
        },
        // 复制
        handleCopy(e) {
            if (!this.selected) return
            let frag = {
                content: [this.formatContent([this.selected])],
                preset: true
            }
            this.clip = frag
        },
        // 粘贴
        handlePaste(e) {
            if (!this.clip) return
            if (this.selected.parent) return this.handleAdd(this.clip, this.selected.parent)
            this.handleAdd(this.clip, "", true)
        },
        // 添加预设
        handlePreset() {
            ElMessageBox.prompt('为你的预设取个响亮的名字', '添加预设', {
            }).then(({ value }) => {
                let content = [this.formatContent([toRaw(this.selected)])]
                let params = {
                    name: value,
                    content
                }

                this.$store.dispatch("createPreset", params).then(data => {
                    this.$message.success("生成成功")
                })
            }).catch(() => { })
        },
        // 格式化请求参数
        formatContent(children, uid) {
            return children.map((item, index) => {
                let props = {}
                if (item.props.style) props.style = item.props.style
                Object.keys(item.props).forEach((key, index) => {
                    if (key === "style") return
                    let value = item.props[key] || item.propsOption[key].default
                    if (JSON.stringify(item.props[key]) !== JSON.stringify(item.propsOption[key].default)) props[key] = value
                    if (item.propsOption[key].use) props[key] = value
                })
                let params = {
                    name: item.name,
                    content: {
                        name: item.content.name
                    },
                    props,
                    propsOption: item.propsOption,
                    eventOption: item.eventOption,
                    children: item.children.length > 0 ? this.formatContent(item.children, uid) : []
                }
                if (uid === true) params.uid = item.uid
                return params
            })
        },
        // 后退
        handleBack(e) {
            this.selected = ""
            let next = this.historyIndex - 1
            if (next >= 0) {
                this.historyIndex -= 1
                this.content = this.history[this.historyIndex]
                console.log(this.history)
                console.log(this.historyIndex)
            }
        },
        // 前进
        handleForward(e) {
            this.selected = ""
            let next = this.historyIndex + 1
            if (this.history[next]) {
                this.historyIndex += 1
                this.content = this.history[this.historyIndex]
            }
        },
        // 生成代码 
        handleGenerate() {
            ElMessageBox.prompt('为你的页面取个响亮的名字', '生成代码', {
            }).then(({ value }) => {
                let content = this.formatContent(toRaw(this.content))
                let params = {
                    name: value,
                    content
                }

                this.$store.dispatch("createPage", params).then(data => {
                    this.$message.success("生成成功")
                    let path = `/${data}`
                    window.open(path)
                })
            }).catch(() => { })
        },
        /* METHOD APPEND FLAG, dont del this line */
    },
    /* OPTION APPEND FLAG, dont del this line */
}
</script>

<style lang="scss" scoped>
.generator-container {
    width: 100%;
    height: 100vh;
    .tree-panel {
        width: 280px;
        box-shadow: none;
        &-search{
            position: sticky;
            top: 0;
        }
        &-tree{
            height: calc(100vh - 160px);
            overflow-y: scroll;
            margin-top: 10px;
        }
        .custom-tree-node {
            font-size: 12px;
            .icon {
                width: 14px;
                margin-right: 4px;
            }
        }
    }
    .content-panel {
        padding: 10px;
        .screen-panel {
            width: 100%;
            height: calc(100vh - 70px);
            background-color: #fff;
            overflow: scroll;
        }
    }
    .props-panel {
        width: 240px;
        height: 100%;
        box-shadow: none;
        &-content {
            height: calc(100vh - 100px);
            overflow-y: scroll;
        }
        &-form {
            padding: 10px 10px 0 20px;
            .el-form-item--mini {
                margin-bottom: 10px;
            }
            &-check {
                margin-left: 4px;
            }
        }
    }
}
</style>

<style lang="scss">
.generator-container {
    .el-form-item__label {
        font-size: 12px;
    }
    .props-panel {
        .el-tabs__content {
            padding: 0;
        }
    }
}
</style>

