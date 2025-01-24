<script lang="ts" setup>
    import { ref } from "vue";
    import EventBus from "../modules/ModEventBus.ts";
    import { TData } from "../modules/ModFileAnalyzer.ts";
    import { $t } from "../modules/I18N/ModI18N.ts";
    import packageJson from "../../package.json";
    
    const loaded = ref<boolean>(false);
    const busy = ref<boolean>(false);
    const encodingIssue = ref<boolean>(false);
    const data = ref<TData>();
    
    EventBus.on("LOADER:FULFILLED", (event: TData): void => {
        data.value = event;
        let _c = 0;
        for (const _d of data.value.recipe) {
            const _n = _d.item.englishName;
            if (/^[^a-zA-Z\u4e00-\u9fa5\s]*$/.test(_n)) _c += 1;
        }
        encodingIssue.value = _c > 10;
        busy.value = true;
        setTimeout(() => {
            loaded.value = true;
            busy.value = false;
        }, 1);
    });
    
    const _GenTranslatedText = async () => ({
        text: {
            title: await $t("text.home.title"),
            instruction: await $t("text.home.instruction")
        }
    });
    let translatedComps = await _GenTranslatedText();
    EventBus.on("I18N:RELOAD", async () => {
        translatedComps = await _GenTranslatedText();
    });
</script>

<template>
    <main id="FrmHome" class="w-full h-full flex flex-col gap-8 justify-center items-center">
        <img alt="" class="w-72" src="/logo_v2.png" />
        <div class="alert w-[75%] flex flex-col justify-center items-center rounded-md p-4"
             role="alert">
            <h1 class="text-2xl">{{ translatedComps.text.title }}{{ packageJson.version }}</h1>
            <h2 class="text-lg mt-1">{{ translatedComps.text.instruction }}</h2>
        </div>
    </main>
</template>
