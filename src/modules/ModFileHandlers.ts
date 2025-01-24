import { NbtFile } from "deepslate";
import { askFileDialog } from "./ModDialog.ts";
import { read } from "./ModFileSystem.ts";
import { analyzeCSVRecipe, analyzeNBTRecipe, analyzeTextRecipe, TNbtObject } from "./ModFileAnalyzer.ts";

interface TBaseNbtObject {
    bedrockHeader: any;
    compression: string;
    littleEndian: boolean;
    name: string;
    root: TNbtObject;
}

interface TTranslatedTexts {
    text: { title: string, instruction: string, },
    filedialog: { litematic: string, nbt: string, csv: string, txt: string }
}

export const litematicHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([{
        name: translatedTexts.filedialog.litematic,
        extensions: ["litematic"]
    }]);
    if (!fp) return;
    const data = <Uint8Array>await read(fp, false, true, false);
    console.log(NbtFile.read(data).toJson());
};

export const nbtHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([{
        name: translatedTexts.filedialog.nbt,
        extensions: ["nbt"]
    }]);
    if (!fp) return;
    const data = <Uint8Array>await read(fp, false, true, false);
    analyzeNBTRecipe(fp, <TNbtObject>(<TBaseNbtObject><unknown>NbtFile.read(data).toJson())["root"]);
};

export const csvHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([{
        name: translatedTexts.filedialog.csv,
        extensions: ["csv"]
    }]);
    if (!fp) return;
    const data = <string>await read(fp, false, false, false);
    analyzeCSVRecipe(fp, data);
};

export const textHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([{
        name: translatedTexts.filedialog.txt,
        extensions: ["txt"]
    }]);
    if (!fp) return;
    const data = <string>await read(fp, false, false, false);
    analyzeTextRecipe(fp, data);
};