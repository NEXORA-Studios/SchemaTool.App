import { NbtFile } from "deepslate";
import { askFileDialog } from "./ModDialog.ts";
import { read } from "./ModFileSystem.ts";
import {
    analyzeCSVRecipe,
    analyzeLitematicRecipe,
    analyzeNBTRecipe,
    analyzeTextRecipe,
    TCreateNbtObject,
} from "./ModFileAnalyzer.ts";

interface TBaseNbtObject {
    bedrockHeader: any;
    compression: string;
    littleEndian: boolean;
    name: string;
    root: TCreateNbtObject;
}

interface TTranslatedTexts {
    filedialog: { litematic: string; nbt: string; csv: string; txt: string };
}

export const litematicHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([
        {
            name: translatedTexts.filedialog.litematic,
            extensions: ["litematic"],
        },
    ]);
    if (!fp) return;
    const data = <Uint8Array>await read(fp, false, true, false);
    analyzeLitematicRecipe(fp, (<Record<string, any>>NbtFile.read(data).toJson())["root"]);
};

export const nbtHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([
        {
            name: translatedTexts.filedialog.nbt,
            extensions: ["nbt"],
        },
    ]);
    if (!fp) return;
    const data = <Uint8Array>await read(fp, false, true, false);
    analyzeNBTRecipe(fp, <TCreateNbtObject>(<TBaseNbtObject>(<unknown>NbtFile.read(data).toJson()))["root"]);
};

export const csvHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([
        {
            name: translatedTexts.filedialog.csv,
            extensions: ["csv"],
        },
    ]);
    if (!fp) return;
    const data = <string>await read(fp, false, false, false);
    analyzeCSVRecipe(fp, data);
};

export const textHandler = (translatedTexts: TTranslatedTexts) => async () => {
    const fp = await askFileDialog([
        {
            name: translatedTexts.filedialog.txt,
            extensions: ["txt"],
        },
    ]);
    if (!fp) return;
    const data = <string>await read(fp, false, false, false);
    analyzeTextRecipe(fp, data);
};

export type TExts = "litematic" | "nbt" | "csv" | "txt";
export const dragHandler = async (fp: string, type: TExts) => {
    switch (type) {
        case "litematic":
            analyzeLitematicRecipe(
                fp,
                (<Record<string, any>>NbtFile.read(<Uint8Array>await read(fp, false, true, false)).toJson())["root"]
            );
            break;
        case "nbt":
            analyzeNBTRecipe(
                fp,
                <TCreateNbtObject>(
                    (<TBaseNbtObject>(<unknown>NbtFile.read(<Uint8Array>await read(fp, false, true, false)).toJson()))[
                        "root"
                    ]
                )
            );
            break;
        case "csv":
            analyzeCSVRecipe(fp, <string>await read(fp, false, false, false, false));
            break;
        case "txt":
            analyzeTextRecipe(fp, <string>await read(fp, false, false, false, false));
            break;
    }
};
