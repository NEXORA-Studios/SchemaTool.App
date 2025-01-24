<script lang="ts" setup>
    import { RouterView } from "vue-router";
    import LayoutHeaderBar from "./components/LayoutHeaderBar.vue";
    import LayoutSideBar from "./components/LayoutSideBar.vue";
    import { ref } from "vue";
    import ModEventBus from "./modules/ModEventBus.ts";
    
    const isOpen = ref<boolean>(false);
    ModEventBus.on("SIDEBAR:TOGGLE", () => {
        isOpen.value = !isOpen.value;
    });
    ModEventBus.on("SIDEBAR:CLOSE", () => {
        isOpen.value = false;
    });
</script>

<template>
    <Suspense>
        <LayoutHeaderBar />
    </Suspense>
    <div class="relative z-0 left-14 top-16 p-4 w-[calc(100vw-3.5rem)] h-[calc(100vh-4rem)]">
        <Suspense>
            <RouterView />
        </Suspense>
        <div :class="{'z-10': isOpen, 'opacity-100': isOpen}"
             class="-z-10 absolute top-0 left-0 w-[calc(100vw-3.5rem)] h-[calc(100vh-4rem)] backdrop-blur-[2px] bg-[#0005] opacity-0 transition-all duration-200 ease-in-out"
             @click="ModEventBus.emit('SIDEBAR:CLOSE')"></div>
    </div>
    <div class="fixed top-16">
        <Suspense>
            <LayoutSideBar />
        </Suspense>
    </div>
</template>