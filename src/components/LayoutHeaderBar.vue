<script lang="ts" setup>
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { $t } from "../modules/I18N/ModI18N.ts";
    import EventBus from "../modules/ModEventBus.ts";
    import ModEventBus from "../modules/ModEventBus.ts";
    import { ModSetting } from "../modules/ModSetting.ts";
    import { ModCache } from "../modules/ModCache.ts";
    
    const $appWindow = getCurrentWindow();
    
    const _GenTranslatedText = async () => ({
        btn: {
            quit: await $t("button.quit")
        }
    });
    let translatedTexts = await _GenTranslatedText();
    EventBus.on("I18N:RELOAD", async () => {
        translatedTexts = await _GenTranslatedText();
    });
    
    const handleQuitApp = async () => {
        if (!await ModSetting.get("long_lasting_cache")) {
            await ModCache.resetCache();
        }
        await $appWindow.close();
    };
</script>

<template>
    <div class="navbar bg-base-300 fixed z-10" data-tauri-drag-region>
        <div class="flex-1 px-2 lg:flex-none" data-tauri-drag-region>
            <a class="text-xl font-bold cursor-pointer" @click="ModEventBus.emit(`SIDEBAR:TOGGLE`)">
                SchemaTool
            </a>
        </div>
        <div class="flex flex-1 justify-end px-2" data-tauri-drag-region>
            <button class="btn btn-ghost rounded-btn" @click=handleQuitApp>
                <span class="text-[1rem]">{{ translatedTexts.btn.quit }}</span>
            </button>
        </div>
    </div>
</template>
