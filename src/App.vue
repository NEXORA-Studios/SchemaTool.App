<script lang="ts" setup>
    import { RouterView } from "vue-router";
    import HeaderBar from "./components/HeaderBar.vue";
</script>

<template>
    <Suspense>
        <HeaderBar />
    </Suspense>
    <Suspense>
        <RouterView />
    </Suspense>
</template>