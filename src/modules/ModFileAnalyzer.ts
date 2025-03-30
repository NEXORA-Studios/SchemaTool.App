import { Item, queryItemByName, queryItemByRegisterName } from "./ItemData/ModItemDB.ts";
import { ModEventBus as EventBus } from "./ModEventBus.ts";
import { JsonValue } from "deepslate";

interface TLitematicaEnclosingSize {
    x: number;
    y: number;
    z: number;
}

interface TLitematicaMetadata {
    TimeCreated: number[];
    TimeModified: number[];
    EnclosingSize: TLitematicaEnclosingSize;
    Description: string;
    RegionCount: number;
    TotalBlocks: number;
    Author: string;
    TotalVolume: number;
    Name: string;
}

interface TLitematicaPosition {
    x: number;
    y: number;
    z: number;
}

interface TLitematicaBlockState {
    Name: {type: number; value: string};
    Properties?: { type: number; value: any };
}

interface TLitematicaBlockStatePalette {
    type: number;
    items: TLitematicaBlockState[];
}

interface TLitematicaTileEntity {
    ScrollValue: number;
    id: string;
}

interface TLitematicaEntity {
    Motion: number[];
    FallDistance: number;
    Pos: number[];
    Fire: number;
    Invulnerable: number;
    Air: number;
    OnGround: number;
    id: string;
    PortalCooldown: number;
    Controller?: {
        StallData?: {
            Motion: number[];
            Pos: number[];
            Pitch: number;
            Yaw: number;
        };
    };
    UUID: number[];
    Rotation: number[];
}

interface TLitematicaRegion {
    BlockStates: { type: number; value: number[][] };
    Position: TLitematicaPosition;
    BlockStatePalette: { type: number; values: TLitematicaBlockStatePalette };
    Size: TLitematicaEnclosingSize;
    TileEntities: TLitematicaTileEntity[];
    Entities: TLitematicaEntity[];
}

interface TLitematicaNbtObject {
    MinecraftDataVersion: number;
    Version: number;
    Metadata: TLitematicaMetadata;
    Regions: { type: number; value: Record<string, TLitematicaRegion> };
    SubVersion: number;
}

export interface TCreateNbtObject {
    blocks: {
        type: number;
        value: {
            type: number;
            items: {
                pos: {
                    type: number;
                    value: [number, number, number];
                };
                state: {
                    type: number;
                    value: number;
                };
            }[];
        };
    };
    entities: { type: number; value: object[] };
    palette: {
        type: number;
        value: {
            type: number;
            items: {
                Name: {
                    type: number;
                    value: string;
                };
                Properties?: object;
            }[];
        };
    };
    size: {
        type: number;
        value: [number, number, number];
    };
    DataVersion: {
        type: number;
        value: number;
    };
    Railways_DataVersion?: {
        type: number;
        value: number;
    };
}

export interface TItemCount {
    shulker_box: number;
    stack: number;
    single: number;
}

interface TRecipeItem {
    item: Item;
    total: TItemCount;
    need: TItemCount;
    available: TItemCount;
}

export interface TData {
    filename: string;
    filetype: "litematic" | "nbt" | "csv" | "txt" | "unknown";
    recipe: TRecipeItem[];
}

class Utils {
    private static UnitCount = {
        shulker_box: 3 * 9 * 64,
        stack: 64,
    };

    private static _divide(origin: number, divider: number) {
        return [Math.floor(origin / divider), origin % divider];
    }

    public static generateDataTemplate(): TData {
        return {
            filename: "",
            filetype: "unknown",
            recipe: [],
        };
    }

    public static convertNumberToItemCount(n: number): TItemCount {
        const [shulker_box, _afterSkb] = this._divide(n, Utils.UnitCount.shulker_box);
        const [stack, single] = this._divide(_afterSkb, Utils.UnitCount.stack);
        return {
            shulker_box,
            stack,
            single,
        };
    }

    public static convertListToKeyCount(list: string[]) {
        const stringCounts: { [key: string]: number } = {};
        list.forEach((str) => {
            if (stringCounts[str]) {
                stringCounts[str]++;
            } else {
                stringCounts[str] = 1;
            }
        });
        return stringCounts;
    }
}

export function analyzeLitematicRecipe(fn: string, data: TLitematicaNbtObject) {
    const jsonData = data;
    console.log("完整 NBT 数据：", jsonData);

    // 获取 `Regions`
    const regions = jsonData?.Regions;
    if (!regions) {
        throw new Error("未找到 Regions 数据！");
    }

    let parsedRegion: TLitematicaRegion | null = null;
    const _r = regions.value;
    for (const regionName in _r) {
        parsedRegion = _r[regionName] as TLitematicaRegion;
        break; // 只取第一个区域
    }

    if (!parsedRegion) throw new Error("Regions 解析失败！");

    // 解析材料清单

    const materialList: string[] = [];
    const _palette = parsedRegion.BlockStatePalette.values.items;
    const _blocks = parsedRegion.BlockStates.value;

    // 统计材料数量
    // const materialCounts = Utils.convertListToKeyCount(materialList);
    // const recipe: TRecipeItem[] = Object.entries(materialCounts).map(([name, count]) => ({
    //     item: { name },
    //     total: Utils.convertNumberToItemCount(count),
    //     need: Utils.convertNumberToItemCount(count),
    //     available: { shulker_box: 0, stack: 0, single: 0 },
    // }));

    // ModEventBus.emit("LOADER:FULFILLED", {
    //     filename,
    //     filetype: "litematic",
    //     recipe,
    // });
}

export const analyzeNBTRecipe = (fn: string, nbtObject: TCreateNbtObject) => {
    const _palette = nbtObject.palette.value.items;
    const _blocks = nbtObject.blocks.value.items;

    const data: TData = Utils.generateDataTemplate();
    const _data = [];
    for (const block of _blocks) {
        const _state = block.state;
        const _real_block = _palette[_state.value];
        _data.push(_real_block.Name.value);
    }
    const _dc = Utils.convertListToKeyCount(_data);
    for (const [_item, _count] of Object.entries(_dc)) {
        const _uc = Utils.convertNumberToItemCount(_count);
        data.recipe.push({
            item: queryItemByRegisterName(_item),
            total: _uc,
            available: Utils.convertNumberToItemCount(0),
            need: _uc,
        });
    }

    data.filename = fn;
    data.filetype = "nbt";

    EventBus.emit("LOADER:FULFILLED", data);
};

export const analyzeCSVRecipe = (fn: string, recipeString: string) => {
    const data: TData = Utils.generateDataTemplate();
    const recipeLines = recipeString.trim().split("\n");
    const _l = recipeLines.length;

    for (let _i = 1; _i < _l; _i++) {
        const line = recipeLines[_i];
        const _data = line.split(",");
        data.recipe.push({
            item: queryItemByName(_data[0].replace(/"/g, "")),
            total: Utils.convertNumberToItemCount(Number(_data[1])),
            available: Utils.convertNumberToItemCount(Number(_data[3])),
            need: Utils.convertNumberToItemCount(Number(_data[2])),
        });
    }

    data.filename = fn;
    data.filetype = "csv";

    EventBus.emit("LOADER:FULFILLED", data);
};

export const analyzeTextRecipe = (fn: string, recipeString: string) => {
    const data: TData = Utils.generateDataTemplate();
    const recipeLines = recipeString.split("\n");
    const _l = recipeLines.length;

    for (let _i = 0; _i < _l - 4; _i++) {
        if (![0, 2, 3, 4].includes(_i)) {
            // 抛弃无用行
            const line = recipeLines[_i].replace(/ /g, "");
            if (line.includes("'")) {
                const _m = line.match(/(?<=')[^']*(?=')/);
                data.filename = _m ? _m[0] : "Unknown";
            } else {
                const _data = line.split("|");
                data.recipe.push({
                    item: queryItemByName(_data[1]),
                    total: Utils.convertNumberToItemCount(Number(_data[2])),
                    available: Utils.convertNumberToItemCount(Number(_data[4])),
                    need: Utils.convertNumberToItemCount(Number(_data[3])),
                });
            }
        }
    }

    data.filename = fn;
    data.filetype = "txt";

    EventBus.emit("LOADER:FULFILLED", data);
};
