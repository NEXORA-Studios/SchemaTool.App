import { DialogFilter, open as openFile } from "@tauri-apps/plugin-dialog";

export const askFileDialog = async (filters: DialogFilter[]) => {
    return await openFile({
        multiple: false,
        directory: false,
        filters
    });
};