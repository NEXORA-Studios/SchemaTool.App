import { read, write } from "./ModFileSystem.ts";
import packageJson from "../../package.json";
import { appLocalDataDir } from "@tauri-apps/api/path";

interface TCaches {
    __version__: string;
    caches: {
        [key: string]: any;
    };
}

const defaultCaches: TCaches = {
    "__version__": packageJson.version,
    "caches": {
        "liteview": null
    }
};
const deprecatedOptionKeys: string[] = [];

export class ModCache {
    public static async initCheck() {
        const _cache = <string>await read(`${await appLocalDataDir()}\\cache.json`, false, false, true, defaultCaches);
        const _cacheObj = JSON.parse(_cache);
        if (_cacheObj["__version__"] !== packageJson.version) {
            const _newCacheObj = Object.assign(defaultCaches, _cacheObj);
            _newCacheObj["__version__"] = packageJson.version;
            if (deprecatedOptionKeys.length > 0) {
                deprecatedOptionKeys.forEach(key => {
                    if (_newCacheObj.hasOwnProperty(key)) {
                        delete _newCacheObj[key];
                    }
                });
            }
            await write(`${await appLocalDataDir()}\\cache.json`, JSON.stringify(_newCacheObj), false);
        }
    }

    public static async hasCache(identifier: string): Promise<boolean> {
        const _cache = <string>await read(`${await appLocalDataDir()}\\cache.json`, false, false, true, defaultCaches);
        const _cacheObj = JSON.parse(_cache);
        return Boolean(_cacheObj.caches[identifier]);
    }

    public static async readCache(identifier: string): Promise<any> {
        const _cache = <string>await read(`${await appLocalDataDir()}\\cache.json`, false, false, true, defaultCaches);
        const _cacheObj = JSON.parse(_cache);
        return _cacheObj.caches[identifier] ?? null;
    }

    /**
     * 修改对应缓存
     * @param identifier 缓存标识符
     * @param data 新的数据，设置为 null 来表示清除
     */
    public static async modifyCache(identifier: string, data: any): Promise<void> {
        const _cache = <string>await read(`${await appLocalDataDir()}\\cache.json`, false, false, true, defaultCaches);
        const _cacheObj = JSON.parse(_cache);
        _cacheObj.caches[identifier] = data;
        await write(`${await appLocalDataDir()}\\cache.json`, JSON.stringify(_cacheObj), false);
    }

    public static async resetCache(): Promise<void> {
        await write(`${await appLocalDataDir()}\\cache.json`, JSON.stringify(defaultCaches), false);
    }
}
