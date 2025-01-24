<script lang="ts" setup>
    import { $t } from "../../modules/I18N/ModI18N.ts";
    import EventBus from "../../modules/ModEventBus.ts";
    import CompFileSelectButton from "../../components/CompFileSelectButton.vue";
    import IconExcel from "../../components/IconExcel.vue";
    import CompItemCount from "../../components/CompItemCount.vue";
    import { csvHandler, nbtHandler, textHandler } from "../../modules/ModFileHandlers.ts";
    import { ref } from "vue";
    import { type TData } from "../../modules/ModFileAnalyzer.ts";
    import { SettingModule } from "../../modules/ModSetting.ts";
    
    const _GenTranslatedText = async () => {
        const [item_name, total, available, need] = await $t("text.liteview.table_title");
        return {
            language: await SettingModule.get("language"),
            text: {
                title: await $t("text.liteview.title"),
                instruction: await $t("text.liteview.instruction"),
                encoding_warning: await $t("text.liteview.encoding_warning")
            },
            table: {
                item_name,
                total,
                available,
                need
            },
            filedialog: {
                litematic: await $t("filedialog.litematic"),
                nbt: await $t("filedialog.nbt"),
                csv: await $t("filedialog.csv"),
                txt: await $t("filedialog.txt")
            }
        };
    };
    let translatedComps = await _GenTranslatedText();
    EventBus.on("I18N:RELOAD", async () => {
        translatedComps = await _GenTranslatedText();
    });
    
    const handlers = {
        schematic: {
            litematic: () => null,
            nbt: nbtHandler(translatedComps)
        },
        recipe: {
            csv: csvHandler(translatedComps),
            txt: textHandler(translatedComps)
        }
    };
    
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
</script>

<template>
    <main id="FrmLiteView">
        <div v-if="loaded && !busy">
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
                        <CompItemCount :count="r.total" />
                    </th>
                    <th>
                        <CompItemCount :count="r.available" />
                    </th>
                    <th>
                        <CompItemCount :count="r.need" :highlight="true" />
                    </th>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-if="!loaded" id="FrmLiteView_BeforeLoad" class="w-[95%] mx-auto">
            <section
                class="h-48 mt-5 flex gap-12 justify-center items-center bg-base-200 rounded-lg py-4">
                <img alt="" class="w-48" src="/miniapps/liteview/app_logo.png" />
                <article>
                    <h1 class="text-4xl">{{ translatedComps.text.title }}</h1>
                    <br>
                    <h2 class="text-xl">{{ translatedComps.text.instruction[0] }}</h2>
                    <h2 class="text-sm opacity-75">{{ translatedComps.text.instruction[1] }}</h2>
                </article>
            </section>
            <br>
            <section class="flex flex-col gap-4 justify-center items-center bg-base-200 rounded-lg px-8 py-6">
                <CompFileSelectButton :handler="handlers.schematic.nbt" :text="`${translatedComps.filedialog.nbt} (.nbt)`">
                    <img alt="" class="w-12 translate-y-[1px]" src="/miniapps/liteview/schematic-128px.png" />
                </CompFileSelectButton>
                <hr class="w-[101%] opacity-25">
                <CompFileSelectButton :dis="true" :text="`${translatedComps.filedialog.litematic} (.litematic)`">
                    <div class="w-12">
                        <img alt="" class="scale-110 translate-y-[1px] opacity-25"
                             src="/miniapps/liteview/litematica.png" />
                    </div>
                </CompFileSelectButton>
                <hr class="w-[101%] opacity-25">
                <CompFileSelectButton :handler="handlers.recipe.csv" :text="`${translatedComps.filedialog.csv} (.csv)`">
                    <IconExcel class="w-12 -translate-x-[4px]" />
                </CompFileSelectButton>
                <hr class="w-[101%] opacity-25">
                <CompFileSelectButton :handler="handlers.recipe.txt" :text="`${translatedComps.filedialog.txt} (.txt)`">
                    <svg class="w-12 -translate-x-[1px]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17 9V2H8a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V12h-7a3 3 0 0 1-3-3m-6 14h10a1 1 0 1 1 0 2H11a1 1 0 1 1 0-2m-1-3a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H11a1 1 0 0 1-1-1m1-5h10a1 1 0 1 1 0 2H11a1 1 0 1 1 0-2m8-6V2.117a3 3 0 0 1 1.293.762l5.828 5.828A3 3 0 0 1 26.883 10H20a1 1 0 0 1-1-1"
                            fill="currentColor" />
                    </svg>
                </CompFileSelectButton>
            </section>
        </div>
    </main>
</template>

<style lang="scss" scoped>

</style>