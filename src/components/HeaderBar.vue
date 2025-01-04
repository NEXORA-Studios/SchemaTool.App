<script lang="ts" setup>
    import { reactive } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { NbtFile } from "deepslate";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { askFileDialog } from "../modules/ModDialog.ts";
    import { read } from "../modules/ModFileSystem.ts";
    import { handleCSVRecipe, handleNBTRecipe, handleTextRecipe, TNbtObject } from "../modules/ModFileHandler.ts";
    import { $t } from "../modules/I18N/ModI18N.ts";
    import EventBus from "../modules/ModEventBus.ts";
    
    interface TBaseNbtObject {
        bedrockHeader: any;
        compression: string;
        littleEndian: boolean;
        name: string;
        root: TNbtObject;
    }
    
    const $appWindow = getCurrentWindow();
    const $route = useRoute();
    const $router = useRouter();
    
    const _GenTranslatedText = async () => ({
        text: {
            file: await $t("text.global_headerbar.file"),
            coming_soon: await $t("text.global_headerbar.coming_soon"),
            schematic: await $t("text.global_headerbar.schematic"),
            material_list: await $t("text.global_headerbar.material_list")
        },
        btn: {
            load_a_file: await $t("button.global_headerbar.load_a_file"),
            home: await $t("button.global_headerbar.home"),
            settings: await $t("button.global_headerbar.settings"),
            quit: await $t("button.global_headerbar.quit")
        },
        filedialog: {
            litematic: await $t("filedialog.global_headerbar.litematic"),
            nbt: await $t("filedialog.global_headerbar.nbt"),
            csv: await $t("filedialog.global_headerbar.csv"),
            text: await $t("filedialog.global_headerbar.text")
        }
    });
    let translatedTexts = await _GenTranslatedText();
    EventBus.on("I18N:RELOAD", async () => {
        translatedTexts = await _GenTranslatedText();
    });
    
    const routeMap = reactive<{ [key: string]: { "text": string, "path": string } }>({
        "/": {
            "text": translatedTexts.btn.settings,
            "path": "/settings"
        },
        "/settings": {
            "text": translatedTexts.btn.home,
            "path": "/"
        }
    });
    
    const handlers = {
        schematic: {
            litematic: () => {
            },
            // litematic: async () => {
            //     const fp = await askFileDialog([{
            //         name: translatedTexts.filedialog.litematic,
            //         extensions: ["litematic"]
            //     }]);
            //     if (!fp) return;
            //     const data = <Uint8Array>await read(fp, false, true, false);
            //     console.log(NbtFile.read(data).toJson());
            // },
            nbt: async () => {
                const fp = await askFileDialog([{
                    name: translatedTexts.filedialog.nbt,
                    extensions: ["nbt"]
                }]);
                if (!fp) return;
                const data = <Uint8Array>await read(fp, false, true, false);
                handleNBTRecipe(fp, <TNbtObject>(<TBaseNbtObject><unknown>NbtFile.read(data).toJson())["root"]);
            }
        },
        recipe: {
            csv: async () => {
                const fp = await askFileDialog([{
                    name: translatedTexts.filedialog.csv,
                    extensions: ["csv"]
                }]);
                if (!fp) return;
                const data = <string>await read(fp, false, false, false);
                handleCSVRecipe(fp, data);
            },
            txt: async () => {
                const fp = await askFileDialog([{
                    name: translatedTexts.filedialog.text,
                    extensions: ["txt"]
                }]);
                if (!fp) return;
                const data = <string>await read(fp, false, false, false);
                handleTextRecipe(fp, data);
            }
        },
        handleNavigate: () => {
            $router.push(routeMap[$route.path].path);
        }
    };
</script>

<template>
    <div class="navbar bg-base-300 fixed z-10" data-tauri-drag-region>
        <div class="flex-1 px-2 lg:flex-none" data-tauri-drag-region>
            <a class="text-lg font-bold">
                LiteView
            </a>
        </div>
        <div class="flex flex-1 justify-end px-2" data-tauri-drag-region>
            <div class="flex items-stretch gap-x-1">
                <div v-if="$route.path === '/'" class="dropdown dropdown-end dropdown-hover">
                    <div class="btn btn-ghost" role="button" tabindex="0">{{ translatedTexts.btn.load_a_file }}</div>
                    <section
                        class="dropdown-content menu bg-base-200 rounded-box z-[1] w-[17rem] p-2 border border-info"
                        tabindex="0">
                        <span class="ml-2 my-2">{{ translatedTexts.text.schematic }}</span>
                        <ul>
                            <li class="disabled" @click=handlers.schematic.litematic>
                                <a>
                                    <kbd class="kbd kbd-xs">.litematic</kbd>
                                    {{ translatedTexts.text.file }} {{ translatedTexts.text.coming_soon }}
                                </a>
                            </li>
                            <li @click=handlers.schematic.nbt>
                                <a>
                                    <kbd class="kbd kbd-xs">.nbt</kbd>
                                    {{ translatedTexts.text.file }}
                                </a>
                            </li>
                        </ul>
                        <span class="ml-2 my-2">{{ translatedTexts.text.material_list }}</span>
                        <ul>
                            <li @click=handlers.recipe.csv>
                                <a>
                                    <kbd class="kbd kbd-xs">.csv</kbd>
                                    {{ translatedTexts.text.file }}
                                </a>
                            </li>
                            <li @click=handlers.recipe.txt>
                                <a>
                                    <kbd class="kbd kbd-xs">.txt</kbd>
                                    {{ translatedTexts.text.file }}
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
                <button class="btn btn-ghost rounded-btn" @click=handlers.handleNavigate>
                    {{ routeMap[$route.path].text }}
                </button>
                <button class="btn btn-ghost rounded-btn" @click=$appWindow.close>{{ translatedTexts.btn.quit }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>