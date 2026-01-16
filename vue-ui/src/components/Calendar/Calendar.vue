<script setup lang="ts">
import { ref } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { useCalendarService } from "../../composables/useCalendarService";
import { useDateService } from "../../composables/useDateService";

const calendarService = useCalendarService();
const dateService = useDateService();

const currentDate = dateService.getCurrentDate();
const currentYear = ref(currentDate.year);
const currentMonth = ref(currentDate.month);

const calendarData = ref(calendarService.getCalendarData(currentYear.value, currentMonth.value));

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  calendarData.value = calendarService.getCalendarData(currentYear.value, currentMonth.value);
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  calendarData.value = calendarService.getCalendarData(currentYear.value, currentMonth.value);
};

const getColorClass = (color: string | null, isOverflow: boolean) => {
  if (isOverflow) {
    return "bg-transparent text-gray-300";
  }
  
  switch (color) {
    case "black":
      return "bg-[#2D3739] text-white"; // Dark slate/charcoal
    case "green":
      return "bg-[#00BFA5] text-white"; // Teal/Green from image
    case "red":
      return "bg-[#D34F4F] text-white"; // Soft Red
    case "gray":
      return "bg-[#717171] text-white"; // Selected/Active gray
    default:
      return "bg-transparent text-gray-800 hover:bg-gray-100";
  }
};
</script>

<template>
  <div
    class="max-w-sm p-6 bg-white border border-gray-100 shadow-sm font-sans"
  >
    <div class="flex items-center justify-between mb-8">
      <a class="text-2xl font-semibold tracking-wide text-gray-800 uppercase">
        {{ calendarData.monthName }} {{ calendarData.year }}
      </a>
      <div class="flex space-x-8 text-gray-500">
        <button
          @click="previousMonth"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 hover:text-black transition-all"
        >
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <button
          @click="nextMonth"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 hover:text-black transition-all"
        >
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center pb-1">
      <div
        v-for="day in ['M', 'T', 'W', 'T', 'F', 'S', 'S']"
        :key="day"
        class="text-sm text-gray-400 font-medium"
      >
        {{ day }}
      </div>
    </div>

    <hr class="border-gray-100 mb-6 py-1" />

    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in calendarData.days"
        :key="index"
        class="aspect-square flex items-center justify-center text-lg font-medium rounded-sm transition-all"
        :class="[
          getColorClass(day.color, day.isOverflow),
          !day.isEmpty && day.isCurrentMonth && 'cursor-pointer hover:bg-red-400'
        ]"
      >
        {{ day.date }}
      </div>
    </div>
  </div>
</template>
