<script setup lang="ts">
    import { type IOption } from "../modules/ModVariables";
    import { ref } from "vue";

    const props = defineProps<{
        label?: string;
        legend?: string;
        options: IOption[];
        placeholder?: string;
    }>();

    const model = defineModel<string, "modelValue">();
    const selectRef = ref<HTMLSelectElement>();

    const update = (event: Event) => {
        model.value = (<HTMLSelectElement>event.target).value;
    };
</script>

<template>
    <fieldset class="fieldset relative">
        <select
            class="input input-sm w-full cursor-pointer"
            ref="selectRef"
            :placeholder="props.placeholder"
            @change="update">
            <option
                v-for="option in props.options"
                :key="option.value ?? ''"
                :value="option.value"
                :selected="option.value === model">
                {{ option.text }}
            </option>
        </select>
    </fieldset>
</template>

<style lang="scss" scoped>
    select {
        outline: none;
    }
</style>
