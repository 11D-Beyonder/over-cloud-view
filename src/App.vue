<template>
    <div id="app">
        <Header/>
        <router-view/>
    </div>
</template>

<style lang="stylus">
    #app
        font-family Avenir, Helvetica, Arial, sans-serif
        -webkit-font-smoothing antialiased
        -moz-osx-font-smoothing grayscale
</style>
<script>
    import Header from "@/components/Header";
    export default {
        components: {Header}
    };
</script>