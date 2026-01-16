<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps<{
  options: Array<{ label: string; value: any }>;
  modelValue: { label: string; value: any } | null;
  width?: string;
}>();

const emit = defineEmits(["selected", "search"]);

const isExpanded = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const lastSearchQuery = ref<string>("");
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
const searchText = ref("");

const containerWidth = computed(() => props.width || "100%");

const toggleDropdown = () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    // Focus the search input when dropdown expands
    setTimeout(() => {
      const input = document.querySelector(
        ".dropdown-expanded input"
      ) as HTMLInputElement;
      input?.focus();
    }, 0);

    // highlight existing search text
    setTimeout(() => {
      const input = document.querySelector(
        ".dropdown-expanded input"
      ) as HTMLInputElement;
      if (input) {
        input.select();
      }
    }, 0);
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isExpanded.value = false;
    emit("search", ""); // Clear search on close
    lastSearchQuery.value = "";
    searchText.value = "";
  }
};

const selectItem = (option: { label: string; value: any }) => {
  // Emit the selected value
  emit("selected", option);
  isExpanded.value = false;
};

const search = () => {
  // Clear existing timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Debounce the search with 300ms delay
  debounceTimeout = setTimeout(() => {
    // Only emit if the query is different from the last one (distinct check)
    if (searchText.value !== lastSearchQuery.value) {
      lastSearchQuery.value = searchText.value;
      emit("search", searchText.value);
    }
  }, 300);
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  // Clean up debounce timeout on unmount
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
});
</script>

<template>
  <!-- dropdown main box -->
  <div ref="dropdownRef" class="dropdown-container" :style="{ width: containerWidth }">
    <!-- dropdown collapsed content -->
    <div
      @click="toggleDropdown"
      class="dropdown flex justify-between items-center w-full p-2 cursor-pointer"
    >
      <div>{{ modelValue?.label }}</div>
      <ChevronDownIcon v-if="!isExpanded" class="icon" />
      <ChevronUpIcon v-else class="icon" />
    </div>
    <!-- dropdown expanded content -->
    <div
      v-show="isExpanded"
      :style="{ width: containerWidth }"
      class="dropdown-expanded absolute bg-white border mt-1 z-10"
    >
      <div class="p-2 border-b">
        <div class="flex justify-between">
          <input
            type="text"
            placeholder="Search..."
            class="w-full p-1"
            v-model="searchText"
            @input="search"
          />
          <MagnifyingGlassIcon class="icon icon-grey ml-2 absolute right-3 top-3" />
        </div>

        <!-- options list -->
        <div class="options-list max-h-60 overflow-y-auto mt-2">
          <div
            v-for="option in options"
            :key="option.value"
            class="option p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
            @click="selectItem(option)"
          >
            <span :class="{ 'selected-option': modelValue?.value === option.value }">{{
              option.label
            }}</span>
            <CheckIcon v-if="modelValue?.value === option.value" class="icon-check" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  color: black;
}
.icon-grey {
  color: grey;
}
.icon-check {
  width: 1.5rem;
  height: 1.5rem;
  color: #d34f4f;
  flex-shrink: 0;
}
.selected-option {
  color: #d34f4f;
}
.dropdown-container {
  position: relative;
}
.dropdown-container .icon {
  width: 1.5rem;
  height: 1.5rem;
}
.dropdown-container * {
  font-size: 1rem;
}
.dropdown {
  background-color: white;
  border: solid 1px #ccc;
  color: black;
}
</style>
