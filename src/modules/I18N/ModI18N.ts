import EnglishUS from "./en.json";
import ChineseCN from "./zh.json";
import { SettingModule } from "../ModSetting.ts";

interface Translations {
    [key: string]: string;
}

const TrEnglishUS: Translations = EnglishUS;
const TrChineseCN: Translations = ChineseCN;

export const $t = async (key: string) => {
    switch (await SettingModule.get("language")) {
        case "en":
        default:
            return TrEnglishUS[key] ?? key;
        case "zh":
            return TrChineseCN[key] ?? key;
    }
};