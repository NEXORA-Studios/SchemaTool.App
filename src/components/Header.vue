<script lang="ts" setup>
    import { getCurrentWindow } from "@tauri-apps/api/window";
    const $Window = getCurrentWindow();
</script>

<template>
    <header class="bg-base-300 h-16 flex items-center px-4" data-tauri-drag-region>
        <section class="flex items-center gap-2">
            <h1 class="text-2xl font-bold">SchemaTool.App</h1>
            <span class="badge bg-[#FCB700] border-[#FCB700] rounded-sm translate-y-0.5 text-black font-bold text-[16px] px-2">
                Dev
            </span>
        </section>
        <section class="ml-auto flex gap-2">
            <button
                class="btn btn-ghost h-8 p-1 rounded-full border-none hover:bg-base-content/20 transition-colors duration-150 ease-in-out"
                @click="$Window.minimize()">
                <!-- SVG Minimize -->
                <svg class="w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 14H4v-4h16" fill="white" />
                </svg>
            </button>
            <button
                class="btn btn-ghost h-8 p-1 rounded-full border-none hover:bg-base-content/20 transition-colors duration-150 ease-in-out"
                @click="$Window.close()">
                <!-- SVG Close -->
                <svg class="w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12z"
                        fill="white" />
                </svg>
            </button>
        </section>
    </header>
</template>
