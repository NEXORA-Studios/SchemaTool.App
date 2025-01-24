<script lang="ts" setup>
    const props = defineProps<{
        imageUrl?: string,
        text: string,
    }>();
</script>

<template>
    <div class="btn w-full h-14 px-0 relative" role="button">
        <section class="w-14 h-14 absolute left-0 flex justify-center items-center">
            <img v-if="props.imageUrl" :src="props.imageUrl" alt="" />
            <slot v-else />
        </section>
        <span class="absolute left-16 text-lg text-nowrap">{{ props.text}}</span>
    </div>
</template>

<style lang="scss" scoped>

</style>