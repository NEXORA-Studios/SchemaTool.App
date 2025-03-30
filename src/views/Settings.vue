<script setup lang="ts">
    import { ref, watch, onMounted } from "vue";
    import Dropdown from "../components/Dropdown.vue";
    import { ModEventBus } from "../modules/ModEventBus";
    import { ThemeOptions } from "../modules/ModVariables";
    import { SettingsStore, GetAndIfEmptyInit } from "../modules/ModStore";

    const theme = ref<string>();
    watch(theme, (newVal, _oldVal) => {
        ModEventBus.emit("theme:change", newVal);
    });

    onMounted(async () => {
        GetAndIfEmptyInit(SettingsStore, "theme", "auto");
        theme.value = (await SettingsStore.get("theme")) as string;
        console.debug(theme.value);
    });
</script>

<template>
    <section class="w-full h-full flex flex-col gap-4">
        <h1 class="text-2xl font-bold">工具箱设置</h1>
        <section class="w-full flex flex-col gap-2 px-4">
            <h2 class="text-xl font-bold">个性化</h2>
            <div class="flex justify-between items-center px-4">
                <span>主题颜色</span>
                <Dropdown class="w-3/10" :options="ThemeOptions" v-model="theme" />
            </div>
        </section>
    </section>
</template>
