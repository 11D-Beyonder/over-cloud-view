<template>
    <div class="mode-selector" v-if="fileType===1||fileType===3">
        <el-radio-group v-model="currentMode" size="mini">
            <el-radio-button :label="0">
                <i class="el-icon-tickets"/>
            </el-radio-button>
            <el-radio-button :label="1">
                <i class="el-icon-s-grid"/>
            </el-radio-button>
        </el-radio-group>
    </div>
</template>

<script>
    export default {
        name: "DisplayModeChanger",
        props: {
            fileType: {
                type: Number,
                required: true
            }
        },
        computed: {
            currentMode: {
                get() {
                    return this.$store.getters.displayMode;
                },
                set(val) {
                    this.$store.commit("changeDisplayMode", val);
                }
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .mode-selector
        margin-right 14px
</style>