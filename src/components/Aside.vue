<script setup lang="ts">
    import { ref, h } from "vue";

    // 侧边栏展开状态
    const isExpanded = ref(false);

    // 切换侧边栏展开/收起
    const toggleSidebar = () => {
        isExpanded.value = !isExpanded.value;
    };

    // 菜单项数据
    interface IMenuItem {
        title: string;
        icon?: any;
        iconClass?: string | string[];
        active: boolean;
        navigateTo?: string;
    }
    const menuItems = ref<IMenuItem[]>([
        {
            title: "材料浏览器",
            icon: () => h("img", { src: "/apps/ST.RecipeBrowser.png" }),
            iconClass: "translate-y-0.25",
            active: false,
            navigateTo: "/apps/recipe",
        },
    ]);
</script>

<template>
    <div class="h-full flex">
        <!-- 侧边栏 -->
        <div :class="['transition-all duration-300 bg-base-200 h-full flex flex-col', isExpanded ? 'w-64' : 'w-20']">
            <!-- 顶部标题区域 -->
            <div
                :class="[
                    'transition-all duration-300 overflow-x-hidden p-4 border-b border-base-300 flex items-center justify-between',
                    isExpanded ? 'w-64' : 'w-20',
                ]">
                <h2 class="font-bold text-lg overflow-hidden whitespace-nowrap translate-x-1">子应用菜单</h2>
                <button class="btn btn-sm btn-neutral z-10" @click="toggleSidebar">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                        :class="{ 'rotate-180': !isExpanded }">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            <!-- 菜单项 -->
            <div class="overflow-y-auto flex-1">
                <ul class="menu w-full">
                    <li
                        v-for="(item, index) in menuItems"
                        :key="index"
                        class="overflow-hidden whitespace-nowrap"
                        @click="item.navigateTo ? $router.push(item.navigateTo) : null">
                        <a :class="{ 'justify-center': !isExpanded, active: item.active }">
                            <span class="flex items-center">
                                <component :is="item.icon" v-if="item.icon" :class="['w-8 h-8', item.iconClass]" />
                                <span v-show="isExpanded" class="ml-2">{{ item.title }}</span>
                            </span>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- 底部区域 -->
            <div class="p-4 border-t border-base-300">
                <button
                    class="btn btn-primary w-full overflow-hidden whitespace-nowrap"
                    :class="{ 'btn-square': !isExpanded }"
                    @click="$router.push('/settings')">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span v-show="isExpanded" class="ml-2">设置</span>
                </button>
            </div>
        </div>
    </div>
</template>
