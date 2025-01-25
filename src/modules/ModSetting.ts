import { appLocalDataDir } from "@tauri-apps/api/path";
import { read, write } from "./ModFileSystem.ts";
import packageJson from "../../package.json";

const defaultOptions = {
    "__version__": packageJson.version,
    "language": "zh",
    "long_lasting_cache": false
};
const deprecatedOptionKeys: string[] = [];

export class ModSetting {

    public static async initCheck(): Promise<void> {
        const _cfg = <string>await read(`${await appLocalDataDir()}\\config.json`, false, false, true, defaultOptions);
        const _cfgObj = JSON.parse(_cfg);
        if (_cfgObj["__version__"] !== packageJson.version) {
            const _newCfgObj = Object.assign(defaultOptions, _cfgObj);
            _newCfgObj["__version__"] = packageJson.version;
            if (deprecatedOptionKeys.length > 0) {
                deprecatedOptionKeys.forEach(key => {
                    if (_newCfgObj.hasOwnProperty(key)) {
                        delete _newCfgObj[key];
                    }
                });
            }
            await write(`${await appLocalDataDir()}\\config.json`, JSON.stringify(_newCfgObj), false);
        }
    }

    public static async get(key?: string): Promise<any> {
        const _cfg = <string>await read(`${await appLocalDataDir()}\\config.json`, false, false, true, defaultOptions);
        const _cfgObj = JSON.parse(_cfg);
        return key ? _cfgObj[key] : _cfgObj;
    }

    public static async set(key: string, value: any) {
        const _cfg = await this.get();
        await write(`${await appLocalDataDir()}\\config.json`, JSON.stringify({
            ..._cfg,
            [key]: value
        }), false);
    }

    public static async override_set(data: any) {
        await write(`${await appLocalDataDir()}\\config.json`, JSON.stringify(data), false);
    }
}

