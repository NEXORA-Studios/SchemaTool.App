<script lang="ts" setup>
    import { ref } from "vue";
    import { SettingModule } from "../modules/ModSetting.ts";
    import { $t } from "../modules/I18N/ModI18N.ts";
    import EventBus from "../modules/ModEventBus.ts";
    
    const setting = ref(await SettingModule.get());
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
            setting_customization_language: await $t("text.settings.customization.language")
        },
        btn: {
            undo: await $t("button.settings.undo"),
            apply: await $t("button.settings.apply")
        }
    });
    
    let translatedTexts = await _GenTranslatedText();
    
    const handleUndo = async () => {
        setting.value = await SettingModule.get();
    };
    const handleApply = async () => {
        await SettingModule.override_set(setting.value);
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
    </main>
</template>

<style lang="scss" scoped>
    main#FrmSettings {
        section.SettingItem {
            @apply flex items-center justify-between w-[90%] ml-12 text-xl;
        }
    }
</style>