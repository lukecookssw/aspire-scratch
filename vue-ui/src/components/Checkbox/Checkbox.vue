<script setup lang="ts">
defineProps<{
  label: string;
  checked: boolean;
}>();

const emit = defineEmits<{
  changed: [value: boolean];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('changed', target.checked);
};
</script>

<template>
  <label class="flex items-center cursor-pointer">
    <input
      type="checkbox"
      :checked="checked"
      @change="handleChange"
      class="w-4 h-4 border border-gray-300 rounded cursor-pointer"
    />
    <span class="pl-2">{{ label }}</span>
  </label>
</template>

<style scoped>
input[type="checkbox"] {
  accent-color: #3b82f6;
}
</style>
