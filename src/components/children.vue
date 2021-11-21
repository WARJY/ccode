<template>
    <draggable class="draggable" :list="content" :group="{ name: 'content'}" :sort="false" @change="handleDragChange">
        <component
            v-for="(item, index) in content"
            :key="item.uid"
            v-bind:is="item.content.name"
            v-bind="{'class':['outline',{'selected':selected.uid===item.uid}],...item.props}"
            @click.native.stop="handleSelected(item, index)"
            @dblclick.native.stop="handleProps(item, index)"
        >
            <span v-if="item.props.style.text">{{item.props.style.text}}</span>
            <children
                :content="content[index].children"
                :selected="selected"
                @select="handleSelected"
                @props="handleProps"
                @my-drag="handleDrag"
            >
            </children>
        </component>
    </draggable>
</template>

<script>
import frag from 'vue-frag';
import { VueDraggableNext } from 'vue-draggable-next'

export default {
    name: "children",
    directives: {
        frag,
    },
    components: {
        draggable: VueDraggableNext
    },
    props: {
        content: {
            type: Array,
            default: () => {
                return []
            }
        },
        selected: {
            type: [Object, String],
            require: false,
            default: () => {
                return {}
            }
        }
    },
    watch: {
        content: {
            deep: true,
            immediate: true,
            handler(val, old) {
                this.$emit("update:content", val)
            }
        }
    },

    methods: {
        handleSelected(item, index) {
            this.$emit("select", item, index)
        },
        handleProps(item, index) {
            this.$emit("props", item, index)
        },
        handleDragChange({ added, removed, moved }) {
            let changeList = [added?.element, removed?.removed, moved?.element].filter((item, index) => {
                return item
            })
            if (changeList.length > 0) this.$emit("my-drag", changeList)
        },
        handleDrag(changeList) {
            this.$emit("my-drag", changeList)
        }
    }
}
</script>

<style scoped lang="scss">
.outline {
    min-width: 20px;
    min-height: 12px;
    border: dashed 0.5px #ccc;
    box-sizing: border-box;
    cursor: pointer;
    &:hover,
    &.selected {
        border: dashed 0.5px #000;
    }
}

.draggable{
    display: inherit;
}
</style>