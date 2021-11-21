<template>
    <div :class="flexClass">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "flex-col",
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
            return [`flex-cols`, `row-${this.row}`, `col-${this.col}`]
        }
    }
}
</script>

<style lang="scss" scoped>
.flex-cols {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    &.row-left {
        align-items: flex-start;
    }
    &.row-right {
        align-items: flex-end;
    }
    &.row-center {
        align-items: center;
    }
    &.col-top {
        justify-content: flex-start;
    }
    &.col-bottom {
        justify-content: flex-end;
    }
    &.col-center {
        justify-content: center;
    }
}
</style>