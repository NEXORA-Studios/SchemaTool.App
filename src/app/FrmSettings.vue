<script lang="ts" setup>
    import { ref } from "vue";
    import { ModSetting } from "../modules/ModSetting.ts";
    import { $t } from "../modules/I18N/ModI18N.ts";
    import EventBus from "../modules/ModEventBus.ts";
    
    const setting = ref(await ModSetting.get());
    const settingMap: { [key: string]: any } = {
        "language": {
            "en": "English",
            "zh": "中文 (简体)"
        }
    };
    
    const _GenTranslatedText = async () => ({
        text: {
            setting_title: await $t("text.settings.title"),
            setting_customization: await $t("text.settings.customization"),
            setting_customization_language: await $t("text.settings.customization.language"),
            setting_system: await $t("text.settings.system"),
            setting_system_longlastingcache: await $t("text.settings.system.longlastingcache"),
            setting_system_longlastingcache_tooltip: await $t("text.settings.system.longlastingcache.tooltip")
        },
        btn: {
            undo: await $t("button.settings.undo"),
            apply: await $t("button.settings.apply")
        }
    });
    
    let translatedTexts = await _GenTranslatedText();
    
    const handleUndo = async () => {
        setting.value = await ModSetting.get();
    };
    const handleApply = async () => {
        await ModSetting.override_set(setting.value);
        translatedTexts = await _GenTranslatedText();
        EventBus.emit("I18N:RELOAD");
        location.reload();
    };
    const handleSettingChange = (key: string, value: any) => {
        setting.value[key] = value;
    };
</script>

<template>
    <main id="FrmSettings"
          class="fixed top-16 left-[5%] w-[95%] h-full overflow-x-hidden overflow-y-auto p-8 flex flex-col gap-2">
        <section class="flex items-center justify-end gap-2 mx-2">
            <h1 class="text-3xl mr-auto">{{ translatedTexts.text.setting_title }}</h1>
            <button class="btn btn-warning" @click=handleUndo>{{ translatedTexts.btn.undo }}</button>
            <button class="btn btn-success" @click=handleApply>{{ translatedTexts.btn.apply }}</button>
        </section>
        <div class="divider mb-2"></div>
        <div class="flex flex-col gap-0">
            <h2 class="collapse-title text-2xl font-medium">{{ translatedTexts.text.setting_customization }}</h2>
            <section class="SettingItem">
                <span class="SettingItemText">{{ translatedTexts.text.setting_customization_language }}</span>
                <div class="dropdown dropdown-end">
                    <div class="btn m-1" role="button" tabindex="0">{{ settingMap["language"][setting["language"]] }}
                    </div>
                    <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 border border-info"
                        tabindex="0">
                        <li @click="handleSettingChange('language', 'en')"><a>English</a></li>
                        <li @click="handleSettingChange('language', 'zh')"><a>中文 (简体)</a></li>
                    </ul>
                </div>
            </section>
        </div>
        <br>
        <div class="flex flex-col gap-0">
            <h2 class="collapse-title text-2xl font-medium">{{ translatedTexts.text.setting_system }}</h2>
            <section class="SettingItem">
                <span class="SettingItemText">{{ translatedTexts.text.setting_system_longlastingcache }}</span>
                <div :data-tip="translatedTexts.text.setting_system_longlastingcache_tooltip"
                     class="tooltip tooltip-right ml-2 mr-auto">
                    <svg class="w-4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.5 22a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M14 12c0-.537.18-1.041.497-1.398c.301-.339.774-.602 1.503-.602c1.308 0 2.382 1.348 2.03 2.758c-.18.722-.61 1.135-1.257 1.756l-.178.17C15.866 15.39 15 16.328 15 18a1 1 0 1 0 2 0c0-.827.353-1.267.985-1.877l.191-.182c.614-.58 1.466-1.385 1.794-2.698C20.618 10.653 18.692 8 16 8c-1.271 0-2.298.487-2.997 1.273C12.32 10.041 12 11.037 12 12a1 1 0 1 0 2 0M2 16C2 8.268 8.268 2 16 2s14 6.268 14 14s-6.268 14-14 14S2 23.732 2 16M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12s12-5.373 12-12S22.627 4 16 4"
                            fill="currentColor" />
                    </svg>
                </div>
                <input v-model="setting['long_lasting_cache']" class="checkbox checkbox-info mr-10" type="checkbox" />
            </section>
        </div>
    </main>
</template>

<style lang="scss" scoped>
    main#FrmSettings {
        section.SettingItem {
            @apply flex items-center justify-between w-[90%] ml-16 text-xl;
        }
    }
</style>