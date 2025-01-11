import { appLocalDataDir } from "@tauri-apps/api/path";
import { read, write } from "./ModFileSystem.ts";

class Setting {

    async get(key?: string): Promise<any> {
        const _cfg = <string>await read(`${await appLocalDataDir()}\\config.json`, false, false, true, {
            "language": "zh"
        });
        const _cfgObj = JSON.parse(JSON.parse(_cfg));
        return key ? _cfgObj[key] : _cfgObj;
    }

    async set(key: string, value: any) {
        const _cfg = await this.get();
        await write(`${await appLocalDataDir()}\\config.json`, JSON.stringify({
            ..._cfg,
            [key]: value
        }), false);
    }

    async override_set(data: any) {
        await write(`${await appLocalDataDir()}\\config.json`, JSON.stringify(data), false);
    }
}

const SettingModule = new Setting();

export { SettingModule };