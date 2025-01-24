<script lang="ts" setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import ModEventBus from "../modules/ModEventBus.ts";
    import EventBus from "../modules/ModEventBus.ts";
    import { $t } from "../modules/I18N/ModI18N.ts";
    import CompSideButton from "./CompSideButton.vue";
    
    const isOpen = ref<boolean>(false);
    const $router = useRouter();
    
    ModEventBus.on("SIDEBAR:TOGGLE", () => {
        isOpen.value = !isOpen.value;
    });
    ModEventBus.on("SIDEBAR:CLOSE", () => {
        isOpen.value = false;
    });
    
    const $push = (path: string) => {
        ModEventBus.emit("SIDEBAR:CLOSE");
        $router.push(path);
    };
    
    const _GenTranslatedText = async () => ({
        home: await $t("button.miniapps.home"),
        miniapps: {
            liteview: await $t("button.miniapps.liteview")
        },
        settings: await $t("button.miniapps.settings")
    });
    let translatedComps = await _GenTranslatedText();
    EventBus.on("I18N:RELOAD", async () => {
        translatedComps = await _GenTranslatedText();
    });
</script>

<template>
    <div :class="{'open': isOpen}" class="sidebar">
        <CompSideButton :text="translatedComps.home"
                        @click="$push('/')">
            <svg class="w-6 h-6" viewBox="0 0 32 32"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13.895 2.777a3.25 3.25 0 0 1 4.21 0l9.75 8.287A3.25 3.25 0 0 1 29 13.54V26.5a2.5 2.5 0 0 1-2.5 2.5h-4a2.5 2.5 0 0 1-2.5-2.5V20a2 2 0 0 0-1.991-2H13.99A2 2 0 0 0 12 20v6.5A2.5 2.5 0 0 1 9.5 29h-4A2.5 2.5 0 0 1 3 26.5V13.54a3.25 3.25 0 0 1 1.145-2.476z"
                    fill="currentColor" />
            </svg>
        </CompSideButton>
        <hr>
        <CompSideButton :text="translatedComps.miniapps.liteview"
                        @click="$push('/app/liteview')">
            <img alt="" class="scale-[60%]" src="/miniapps/liteview/app_logo.png" />
        </CompSideButton>
        <hr class="mt-auto">
        <CompSideButton :text="translatedComps.settings"
                        @click="$push('/settings')">
            <svg class="w-6 h-6 -translate-x-[1px] -translate-y-[1px]" viewBox="0 0 32 32"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M28.832 18.472a1.48 1.48 0 0 1 .537 1.634a14.3 14.3 0 0 1-3.156 5.443a1.48 1.48 0 0 1-1.671.347l-1.955-.858a1.5 1.5 0 0 0-.68-.128a1.5 1.5 0 0 0-.66.2a1.47 1.47 0 0 0-.727 1.124l-.235 2.13a1.48 1.48 0 0 1-1.13 1.276c-2.076.495-4.24.495-6.316 0a1.48 1.48 0 0 1-1.125-1.27l-.235-2.126a1.48 1.48 0 0 0-.485-.94a1.5 1.5 0 0 0-1.58-.255l-1.955.859a1.48 1.48 0 0 1-1.668-.343a14.3 14.3 0 0 1-3.16-5.45a1.48 1.48 0 0 1 .536-1.632l1.725-1.275a1.488 1.488 0 0 0 0-2.4l-1.725-1.273a1.48 1.48 0 0 1-.536-1.623A14.25 14.25 0 0 1 5.79 6.467c.14-.151.31-.271.5-.351a1.5 1.5 0 0 1 1.17 0l1.947.858a1.493 1.493 0 0 0 2.073-1.206l.236-2.122a1.48 1.48 0 0 1 1.148-1.281a15.5 15.5 0 0 1 3.146-.362c1.052.012 2.1.133 3.127.362a1.48 1.48 0 0 1 1.147 1.284l.236 2.12a1.483 1.483 0 0 0 2.067 1.2l1.946-.857a1.48 1.48 0 0 1 1.674.346a14.2 14.2 0 0 1 3.157 5.44a1.48 1.48 0 0 1-.537 1.63l-1.72 1.273a1.48 1.48 0 0 0-.004 2.395zM16 20a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                    fill="currentColor" />
            </svg>
        </CompSideButton>
    </div>
</template>

<style lang="scss" scoped>
    div {
        transition: all .2s ease-in-out;
    }
    
    div.sidebar {
        @apply relative w-14 h-[calc(100vh-64px)] bg-base-200 z-40;
        @apply overflow-hidden py-1 flex flex-col gap-[0.375rem];
        
        &.open {
            @apply w-72;
        }
        
        hr {
            @apply opacity-30;
        }
    }
</style>