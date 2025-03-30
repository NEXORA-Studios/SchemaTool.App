import { type Store, load } from "@tauri-apps/plugin-store";

let SettingsStore: Store;
(async () => {
    SettingsStore = await load("settings.json");
})();
export { SettingsStore };

export const GetAndIfEmptyInit = async (store: Store, key: string, value: any) => {
    if (!(await store.get(key))) await store.set(key, value);
    return await store.get(key);
};
