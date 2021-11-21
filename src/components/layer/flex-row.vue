<template>
    <div :class="flexClass">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "flex-row",
    props: {
        row: {
            type: String,
            default: "left",
            option: ["left", "center", "right"],
        },
        col: {
            type: String,
            default: "top",
            option: ["top", "center", "bottom"]
        }
    },
    computed: {
        flexClass() {
            return [`flex-rows`, `row-${this.row}`, `col-${this.col}`]
        }
    }
}
</script>

<style lang="scss" scoped>
.flex-rows {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    &.row-left {
        justify-content: flex-start;
    }
    &.row-right {
        justify-content: flex-end;
    }
    &.row-center {
        justify-content: center;
    }
    &.col-top {
        align-items: flex-start;
    }
    &.col-bottom {
        align-items: flex-end;
    }
    &.col-center {
        align-items: center;
    }
}
</style>