<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Dropdown from "./components/Dropdown/Dropdown.vue";
import { onMounted, ref } from "vue";
import Checkbox from "./components/Checkbox/Checkbox.vue";
import Calendar from "./components/Calendar/Calendar.vue";

import { useUserService } from "./composables/useUserService";
import type { UserDto } from "./composables/useUserService";

const user = ref<UserDto | null>(null);
const userService = useUserService();

onMounted(async () => {
  user.value = await userService.getUserById(1);
});

const dropdownOptions = [
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
];
const filteredOptions = ref(dropdownOptions);

const selectedOption = ref<{ label: string; value: any } | null>(null);

const valueSelected = (value: { label: string; value: any } | null) => {
  selectedOption.value = value;
};

const handleSearch = (query: string) => {
  filteredOptions.value = dropdownOptions.filter((option: { label: string; value: any }) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );
};
</script>

<template>
  <pre>
    {{ user }}
  </pre>
  <Dropdown
    :options="filteredOptions"
    v-model="selectedOption"
    @selected="valueSelected"
    @search="handleSearch"
  />
  <Checkbox :label="'Some label'" :checked="true" />
  <Calendar />

  Value: {{ selectedOption?.value }}

  <RouterView />
</template>
