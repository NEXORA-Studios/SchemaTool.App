<script lang="ts" setup>
    const props = defineProps<{
        text: string,
        handler?: any,
        dis?: boolean
    }>();
</script>

<template>
    <button :class="{'btn-disabled': props.dis}"
            class="btn btn-ghost  w-full h-16"
            @click="props.handler()">
        <slot></slot>
        <span class="text-xl font-normal ml-2">{{ props.text }}</span>
        <svg class="ml-auto w-6 h-6" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.176 2.164C2.988 1.57 1.671 2.7 2.077 3.965l2.858 8.883a1 1 0 0 0 .787.68l11.869 1.979c.557.093.557.893 0 .986L5.723 18.471a1 1 0 0 0-.788.68l-2.858 8.886c-.407 1.265.91 2.395 2.099 1.801L29.17 17.343c1.106-.553 1.106-2.13 0-2.684z"
                fill="currentColor" />
        </svg>
    </button>
</template>

<style lang="scss" scoped>

</style>