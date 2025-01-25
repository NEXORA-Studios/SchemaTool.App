import EnglishUS from "./en.json";
import ChineseCN from "./zh.json";
import { ModSetting } from "../ModSetting.ts";

interface Translations {
    [key: string]: any;
}

const TrEnglishUS: Translations = EnglishUS;
const TrChineseCN: Translations = ChineseCN;

export const $t = async (key: string) => {
    switch (await ModSetting.get("language")) {
        case "en":
        default:
            return TrEnglishUS[key] ?? key;
        case "zh":
            return TrChineseCN[key] ?? key;
    }
};