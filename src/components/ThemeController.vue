<script setup lang="ts">
    import { ref } from "vue";
    import { ModEventBus } from "../modules/ModEventBus";
    import { type IOption } from "../modules/ModVariables";
    import { SettingsStore, GetAndIfEmptyInit } from "../modules/ModStore";

    const theme = ref<string>(await GetAndIfEmptyInit(SettingsStore, "theme", "dark") as string);
    ModEventBus.on("theme:change", (e: string) => {
        theme.value = e;
        SettingsStore.set("theme", e);
    });
    defineProps<{ options: IOption[] }>();
</script>

<template>
    <input
        v-for="option in $props.options"
        type="checkbox"
        :name="option.text"
        :value="option.value"
        class="toggle hidden theme-controller"
        :checked="theme === option.value" />
</template>
