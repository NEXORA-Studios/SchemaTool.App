<script setup lang="ts">
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { ref, onMounted } from "vue";
    import { ModEventBus } from "../../modules/ModEventBus";
    import {
        litematicHandler,
        csvHandler,
        nbtHandler,
        textHandler,
        dragHandler,
        type TExts,
    } from "../../modules/ModFileHandler";
    import { type TData } from "../../modules/ModFileAnalyzer";
    import CompItemCount from "../../components/ItemCount.vue";

    type IStatus = "nothing" | "loading" | "loaded";
    const status = ref<IStatus>("nothing");

    const text = {
        table: {
            item_name: "物品名",
            total: "总数",
            available: "可用",
            need: "需要",
        },
        filedialog: {
            litematic: "投影文件 (*.litematic)",
            nbt: "机械动力蓝图文件 (*.nbt)",
            csv: "CSV 材料表文件 (*.csv)",
            txt: "ASCII 艺术表达材料表文件 (*.txt)",
        },
    };
    const handlers = {
        schematic: {
            litematic: litematicHandler(text),
            nbt: nbtHandler(text),
        },
        recipe: {
            csv: csvHandler(text),
            txt: textHandler(text),
        },
    };

    const encodingIssue = ref<boolean>(false);
    const data = ref<TData>({
        filename: "",
        filetype: "unknown",
        recipe: [],
    });
    const dataItemAmount = ref<number>(0);
    const loadList = (event: TData) => {
        data.value = event;
        let _c = 0;
        for (const _d of data.value.recipe) {
            const _n = _d.item.englishName;
            if (/^[^a-zA-Z\u4e00-\u9fa5\s]*$/.test(_n)) _c += 1;
            dataItemAmount.value += _d.total.shulker_box * 64 * 27 + _d.total.stack * 64 + _d.total.single;
        }
        encodingIssue.value = _c > 10;
        setTimeout(() => {
            status.value = "loaded";
        }, 1);
    };
    ModEventBus.on("LOADER:FULFILLED", (e: TData) => loadList(e));

    const handleCloseFile = async () => {
        data.value = {
            filename: "",
            filetype: "unknown",
            recipe: [],
        };
        status.value = "nothing";
        encodingIssue.value = false;
        dataItemAmount.value = 0;
    };

    const AppWindow = getCurrentWindow();
    onMounted(() => {
        if (status.value === "nothing") {
            // 实现监听拖动文件到窗口打开
            AppWindow.onDragDropEvent((event) => {
                if (event.payload.type === "drop" && status.value === "nothing") {
                    const ext = event.payload.paths[0].split(".").pop()?.toLowerCase();
                    dragHandler(event.payload.paths[0], ext as TExts);
                }
            });
        }
    });
</script>

<template>
    <section class="w-full h-full">
        <div v-if="status === 'nothing'" class="w-full h-full flex flex-col justify-center items-center">
            <img src="/apps/ST.RecipeBrowser-1024x1024.png" width="240" />
            <br />
            <h1 class="text-3xl font-bold">ST.RecipeBrowser 材料浏览器</h1>
            <p class="text-lg mt-2">快速查看你所需要的材料</p>
            <br />
            <p class="flex gap-2">
                目前支持的文件格式：
                <!-- <button class="btn-link cursor-pointer" @click="handlers.schematic.litematic()">
                    <span class="flex items-center">
                        <img class="w-6 h-6 translate-y-0.5" src="/apps/ST.RecipeBrowser/Litematica.png" />
                        .litematic
                    </span>
                </button> -->
                <button class="btn-link cursor-pointer" @click="handlers.schematic.nbt()">
                    <span class="flex items-center">
                        <img
                            class="w-6 h-6 translate-y-0.5"
                            src="data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAG1BMVEUAAADo7/3D0vWfsOh7leRddbtSYI48QWguIk9Kq2NyAAAAAXRSTlMAQObYZgAAAFtJREFUeNpjQAZMMIagGpThmJQAkXErVoPIqBcbJYBlBIuFQUJpLmKFgkAhNmWXdEF1swYGjqCQcqfyDKBUq2p5eFkDkMERVGwOFAAJKacBBUBCYR1QK0A0AgAAMyURC9PJVSoAAAAASUVORK5CYII=" />
                        .nbt
                    </span>
                </button>
                <button class="btn-link cursor-pointer" @click="handlers.recipe.csv()">
                    <span class="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="translate-y-0.5"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32">
                            <defs>
                                <linearGradient
                                    id="vscodeIconsFileTypeExcel0"
                                    x1="4.494"
                                    x2="13.832"
                                    y1="-2092.086"
                                    y2="-2075.914"
                                    gradientTransform="translate(0 2100)"
                                    gradientUnits="userSpaceOnUse">
                                    <stop offset="0" stop-color="#18884f" />
                                    <stop offset=".5" stop-color="#117e43" />
                                    <stop offset="1" stop-color="#0b6631" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="#185c37"
                                d="M19.581 15.35L8.512 13.4v14.409A1.19 1.19 0 0 0 9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5Z" />
                            <path
                                fill="#21a366"
                                d="M19.581 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5L19.581 16l5.861 1.95L30 16V9.5Z" />
                            <path fill="#107c41" d="M8.512 9.5h11.069V16H8.512Z" />
                            <path
                                d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2"
                                opacity=".1" />
                            <path
                                d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                                opacity=".2" />
                            <path
                                d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                                opacity=".2" />
                            <path
                                d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                                opacity=".2" />
                            <path
                                fill="url(#vscodeIconsFileTypeExcel0)"
                                d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85" />
                            <path
                                fill="#fff"
                                d="m5.7 19.873l2.511-3.884l-2.3-3.862h1.847L9.013 14.6c.116.234.2.408.238.524h.017q.123-.281.26-.546l1.342-2.447h1.7l-2.359 3.84l2.419 3.905h-1.809l-1.45-2.711A2.4 2.4 0 0 1 9.2 16.8h-.024a1.7 1.7 0 0 1-.168.351l-1.493 2.722Z" />
                            <path fill="#33c481" d="M28.806 3h-9.225v6.5H30V4.191A1.19 1.19 0 0 0 28.806 3" />
                            <path fill="#107c41" d="M19.581 16H30v6.5H19.581Z" />
                        </svg>
                        .csv
                    </span>
                </button>
                <button class="btn-link cursor-pointer" @click="handlers.recipe.txt()">
                    <span class="flex items-center">
                        <img class="w-8 -mx-2 translate-y-0.25" src="/apps/ST.RecipeBrowser/Notepad.png" />
                        .txt
                    </span>
                </button>
            </p>
            <p>也可直接拖动文件进入窗口</p>
        </div>
        <div v-if="status === 'loading'"></div>
        <div v-if="status == 'loaded'">
            <section class="flex justify-center items-center gap-12">
                <div class="stats w-full">
                    <div class="stat place-items-center">
                        <div class="stat-figure text-primary">
                            <svg
                                class="inline-block h-8 w-8 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"></path>
                            </svg>
                        </div>
                        <div class="stat-title">基本信息</div>
                        <div class="stat-value text-[1.75em]">
                            {{ text.filedialog[data?.filetype as "litematic" | "nbt" | "csv" | "txt"].split(" ")[0] }}
                        </div>
                        <div class="stat-desc">
                            {{ data?.filename.split("\\")[data?.filename.split("\\").length - 1] }}
                        </div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-figure text-secondary">
                            <svg
                                class="inline-block h-8 w-8 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"></path>
                            </svg>
                        </div>
                        <div class="stat-title">共计</div>
                        <div class="stat-value text-3xl">
                            {{ data?.recipe.length }}
                        </div>
                        <div class="stat-desc">种物品</div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-figure text-accent">
                            <svg
                                class="inline-block h-8 w-8 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"></path>
                            </svg>
                        </div>
                        <div class="stat-title">总计</div>
                        <div class="stat-value text-3xl">
                            {{ dataItemAmount }}
                        </div>
                        <div class="stat-desc">块方块</div>
                    </div>
                </div>
                <button class="btn btn-error btn-outline my-auto mr-6" @click="handleCloseFile()">关闭文件</button>
            </section>
            <div class="divider"></div>
            <div v-if="encodingIssue" class="alert bg-base-200 rounded-none text-warning" role="alert">
                <svg
                    class="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2" />
                </svg>
                <span>提示：检测到文件编码问题，请尝试将材料清单保存为纯文本（ASCII 艺术表达文件）后再次加载</span>
                <br />
            </div>
            <table class="table table-zebra mb-2">
                <thead>
                    <tr>
                        <th
                            class="whitespace-nowrap overflow-hidden text-ellipsis"
                            style="min-width: 64px; max-width: 64px"></th>
                        <th class="whitespace-nowrap overflow-hidden text-ellipsis" style="width: 28%">
                            {{ text.table.item_name }}
                        </th>
                        <th class="whitespace-nowrap overflow-hidden text-ellipsis" style="width: auto">
                            {{ text.table.total }}
                        </th>
                        <th class="whitespace-nowrap overflow-hidden text-ellipsis" style="width: auto">
                            {{ text.table.need }}
                        </th>
                        <th class="whitespace-nowrap overflow-hidden text-ellipsis" style="width: auto">
                            {{ text.table.available }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="r in data?.recipe"
                        :key="r.item.registerName"
                        :class="{
                            'text-success': r.need.single === 0 && r.need.stack === 0 && r.need.shulker_box === 0,
                        }">
                        <th>
                            <img
                                class="w-8 h-8"
                                :alt="r.item.registerName + `_icon`"
                                :src="`data:image/jpeg;base64,${r.item.smallIcon}`" />
                        </th>
                        <th>
                            <span>{{ r.item.name }}</span>
                        </th>
                        <th>
                            <CompItemCount :count="r.total" />
                        </th>
                        <th>
                            <CompItemCount :count="r.available" />
                        </th>
                        <th>
                            <CompItemCount :count="r.need" :highlight="true" />
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
