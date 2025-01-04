import { getMinecraftItem, MinecraftItem } from "./ItemData/ModItemDB.ts";
import EventBus from "./ModEventBus.ts";

export interface TItemCount {
    shulker_box: number;
    stack: number;
    single: number;
}

interface TRecipeItem {
    item: MinecraftItem;
    total: TItemCount;
    need: TItemCount;
    available: TItemCount;
}

export interface TData {
    filename: string;
    recipe: TRecipeItem[];
}

class Utils {
    private static UnitCount = {
        shulker_box: 3 * 9 * 64,
        stack: 64
    };

    private static _divide(origin: number, divider: number) {
        return [Math.floor(origin / divider), origin % divider];
    };

    public static generateDataTemplate(): TData {
        return {
            filename: "",
            recipe: []
        };
    };


    public static convertNumberToItemCount(n: number): TItemCount {
        const [shulker_box, _afterSkb] = this._divide(n, Utils.UnitCount.shulker_box);
        const [stack, single] = this._divide(_afterSkb, Utils.UnitCount.stack);
        return {
            shulker_box,
            stack,
            single
        };
    };
}

export const handleCSVRecipe = (recipeString: string) => {
    const data: TData = Utils.generateDataTemplate();
    const recipeLines = recipeString.split("\n");
    const _l = recipeLines.length;

    for (let _i = 1; _i < _l; _i++) {
        const line = recipeLines[_i];
        const _data = line.split(",");
        data.recipe.push({
            item: getMinecraftItem(_data[0].replace(/"/g, "")),
            total: Utils.convertNumberToItemCount(Number(_data[1])),
            available: Utils.convertNumberToItemCount(Number(_data[3])),
            need: Utils.convertNumberToItemCount(Number(_data[2]))
        });
    }

    EventBus.emit("LOADER:FULFILLED", data);
};

export const handleTextRecipe = (recipeString: string) => {
    const data: TData = Utils.generateDataTemplate();
    const recipeLines = recipeString.split("\n");
    const _l = recipeLines.length;

    for (let _i = 0; _i < _l - 4; _i++) {
        if (![0, 2, 3, 4].includes(_i)) { // 抛弃无用行
            const line = recipeLines[_i].replace(/ /g, "");
            if (line.includes("'")) {
                const _m = line.match(/(?<=')[^']*(?=')/);
                data.filename = _m ? _m[0] : "Unknown";
            } else {
                const _data = line.split("|");
                data.recipe.push({
                    item: getMinecraftItem(_data[1]),
                    total: Utils.convertNumberToItemCount(Number(_data[2])),
                    available: Utils.convertNumberToItemCount(Number(_data[4])),
                    need: Utils.convertNumberToItemCount(Number(_data[3]))
                });
            }
        }
    }

    EventBus.emit("LOADER:FULFILLED", data);
};