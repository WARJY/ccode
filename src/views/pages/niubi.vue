
<template>
    <div class="container">
        <ElTable  :data='instanceElTableData' @select='instanceHandleElTableSelect'></ElTable><ElInput  v-model='field1ElInputModelValue' @input='field1HandleElInputInput'></ElInput>
    </div>
</template>
    
<script>
export default {
    data() {
        return {
        instanceElTableData:[],
                    field1ElInputModelValue:"",
                    
        }
    },
    mounted() {
        
    },
    methods: {
        instanceHandleElTableSelect(){},
                    field1HandleElInputInput(){},
                    
    },
};
</script>

<style scoped>
.container{

}
</style>

<style>
</style>
