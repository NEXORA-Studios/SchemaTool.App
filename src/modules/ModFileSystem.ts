import {
    create,
    exists,
    readFile,
    readTextFile,
    readTextFileLines,
    writeFile,
    writeTextFile
} from "@tauri-apps/plugin-fs";


export const read = async (fp: string, large: boolean, bin: boolean, initWhenNotExist: boolean, initObject?: any) => {
    if (!await exists(fp)) {
        if (initWhenNotExist) {
            await write(fp, JSON.stringify(initObject), false);
        } else throw new Error("No such file");
    }

    if (bin) return await readFile(fp);
    else {
        if (large) {
            const lines = await readTextFileLines(fp);
            let data = "";
            for await (const line of lines) {
                data += line + "\n";
            }
            return data;
        } else return await readTextFile(fp);
    }
};

export const write = async (fp: string, data: any, bin: boolean) => {
    if (!await exists(fp)) {
        await create(fp);
    }

    if (bin) {
        await writeFile(fp, data);
    } else {
        const contents = JSON.stringify(data);
        await writeTextFile(fp, contents);
    }
};