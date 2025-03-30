<script lang="ts" setup>
    import { TItemCount } from "../modules/ModFileAnalyzer";

    const props = defineProps<{
        count: TItemCount;
        highlight?: boolean;
    }>();
</script>

<template>
    <section class="flex items-center gap-2">
        <img
            alt="shulker_box image"
            class="w-6 h-6"
            src="data:image/jpeg;base64,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" />
        <span
            :class="{
                'text-error': props.highlight && props.count.shulker_box != 0,
            }">
            {{ props.count.shulker_box }}
        </span>
        <img
            alt="chest iamge"
            class="w-7 h-7"
            src="data:image/jpeg;base64,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" />
        <span
            :class="{
                'text-error': props.highlight && props.count.stack != 0,
            }">
            {{ props.count.stack }}
        </span>
        <img
            alt="single item image"
            class="w-6 h-6"
            src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuElEQVR4XmP8//8/w0ACJoYBBqMOYCE3BtTV1VESz82bNxnJMWvAowCeC55emgX20bt3L8EeERISx+shXOrQxWF8mGEP7t8HM30T54FDbMBDAJ4GYC7dv3c/TTKmopIC2Nz79x6gmD94QgA9zh8efoE1JPg5UIU//oDwcYnDVHPx8IOZT59/GKQhgCviYT4ThKYWAU52VKW8EO5PY18wI7G0Hky3euuCaVgIiYsJgvnfvnwcpCGAnl8J+pwBu8/ndzeCJWAhxgBNMy9fvR/kaQBXyYce522nboN9UpxZhBLnMJ9/P7IGLA7T9/7zTzAflgZu3344RNIALPUy8DJgBbDUDvP5swMQnyvyouYSuDlQU6QlBQZpCKCnAVgu+PAdEocPvqAGhI4SP4pAlq4cCh+mj3/I5AL0cgAed1AfbLv/COxDL0WITxV4UEMEluphPn//ByIPM0cKe1JiGDy1IQ4HMsB8EKmJGsewNAGLY1h+x1U7Dv5yANZWg9XbDvEKKIECK8thPoHxYYpg4rhCEl09TN3gSQOwthqsxQKrt2F8WAl2H1qfo7dsYGU8TB26PMNgzQWjvWMAEKivyrkevT8AAAAASUVORK5CYII=" />
        <span
            :class="{
                'text-error': props.highlight && props.count.single != 0,
            }">
            {{ props.count.single }}
        </span>
    </section>
</template>

<style lang="scss" scoped>
    section span {
        width: 38px;
    }
</style>
