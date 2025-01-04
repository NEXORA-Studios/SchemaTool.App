<script lang="ts" setup>
    import { ref } from "vue";
    import EventBus from "../modules/ModEventBus.ts";
    import { TData } from "../modules/ModFileHandler.ts";
    import ItemCount from "../components/ItemCount.vue";
    import { $t } from "../modules/I18N/ModI18N.ts";
    import { SettingModule } from "../modules/ModSetting.ts";
    
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
        language: await SettingModule.get("language"),
        table: {
            item_name: await $t("table.home.item_name"),
            total: await $t("table.home.total"),
            available: await $t("table.home.available"),
            need: await $t("table.home.need")
        },
        text: {
            title: await $t("text.home.title"),
            instruction: await $t("text.home.instruction"),
            encoding_warning: await $t("text.home.encoding_warning")
        }
    });
    let translatedComps = await _GenTranslatedText();
    EventBus.on("I18N:RELOAD", async () => {
        translatedComps = await _GenTranslatedText();
    });
</script>

<template>
    <main id="AppHome" class="w-screen h-screen overflow-hidden">
        <div class="fixed top-16 w-full h-full overflow-x-hidden overflow-y-auto">
            <section v-if="loaded && !busy">
                <div v-if="encodingIssue" class="alert bg-base-200 rounded-none text-warning" role="alert">
                    <svg
                        class="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2" />
                    </svg>
                    <span>{{ translatedComps.text.encoding_warning }}</span>
                </div>
                <table class="table table-pin-rows table-zebra mb-2">
                    <thead>
                    <tr>
                        <th style="width: 64px"></th>
                        <th style="width: 28%">{{ translatedComps.table.item_name }}</th>
                        <th style="width: auto">{{ translatedComps.table.total }}</th>
                        <th style="width: auto">{{ translatedComps.table.available }}</th>
                        <th style="width: auto">{{ translatedComps.table.need }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="r in data?.recipe" :key="r.item.registerName"
                        :class="{
                            'text-success': r.need.single === 0 && r.need.stack === 0 && r.need.shulker_box === 0,
                    }">
                        <th>
                            <img :alt="r.item.registerName + `_icon`"
                                 :src="`data:image/jpeg;base64,${r.item.smallIcon}`" />
                        </th>
                        <th>
                            <span>{{ translatedComps.language == "zh" ? r.item.name : r.item.englishName }}</span>
                        </th>
                        <th>
                            <ItemCount :count="r.total" />
                        </th>
                        <th>
                            <ItemCount :count="r.available" />
                        </th>
                        <th>
                            <ItemCount :count="r.need" :highlight="true" />
                        </th>
                    </tr>
                    </tbody>
                </table>
            </section>
            <section v-if="!loaded" class="w-full h-[calc(100%-64px)] flex flex-col justify-center items-center">
                <img alt="" class="w-72" src="/logo.png" />
                <div class="alert w-[75%] flex flex-col justify-center items-center rounded-md p-4"
                     role="alert">
                    <h1 class="text-lg">{{ translatedComps.text.title }}</h1>
                    <h2 class="text-sm mt-1">{{ translatedComps.text.instruction }}</h2>
                </div>
            </section>
        </div>
    </main>
</template>
