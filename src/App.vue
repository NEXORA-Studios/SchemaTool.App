<script setup lang="ts">
    import { RouterView } from "vue-router";
    import { ThemeOptions } from "./modules/ModVariables";
    import STHeader from "./components/Header.vue";
    import STAside from "./components/Aside.vue";
    import ThemeController from "./components/ThemeController.vue";
</script>

<template>
    <div class="h-screen overflow-hidden">
        <STHeader />
        <section class="flex h-[calc(100%-calc(var(--spacing)*16))]">
            <STAside />
            <div id="main-content" class="w-full h-full p-4 overflow-auto">
                <RouterView />
            </div>
        </section>
    </div>
    <Suspense>
        <ThemeController :options="ThemeOptions" />
    </Suspense>
</template>
