<script lang="ts" setup>
import { onMounted, ref } from '@vue/runtime-core';
import { getBusiness } from '@/services/business';
import { BusinessEntry, Day, OpeningDay, OpeningDaySlot } from '@/types';
const businessIds = ['ohGSnJtMIC5nPfYRi_HTAg', 'GXvPAor1ifNfpF0U5PTG0w'];
const businessId = ref<string>(businessIds[0]);
const business = ref<BusinessEntry>();
const error = ref<string | null>();
const weekDays: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

onMounted(() => {
  fetchBusiness();
});

function fetchBusiness() {
  business.value = undefined;
  getBusiness(businessId.value)
    .then((businessRes) => {
      error.value = null;
      // just to show loader a little bit more
      setTimeout(() => {
        business.value = businessRes;
      }, 600);
    })
    .catch(() => {
      error.value = 'There was some problems fetching business';
    });
}

function getWorkingDaysDisplay() {
  if (!business.value) return [];

  // first of all I create a new array with all week days
  // also the closing days that are missing the response object
  let completeOpeningHoursDays: OpeningDaySlot[][] = [];
  weekDays.forEach((day: Day) => {
    const dayOpeningHours: OpeningDay = business.value!.opening_hours.days;
    completeOpeningHoursDays.push(day in dayOpeningHours ? dayOpeningHours[day]! : []);
  });

  // startRangeDay will contains the index of day of the range of common timeslots days
  let startRangeDay = null;
  let workingDaysDisplay: { label: string; slots: OpeningDaySlot[] }[] = [];
  for (let i = 1; i <= completeOpeningHoursDays.length; i++) {
    // effective way to compare arrays
    if (JSON.stringify(completeOpeningHoursDays[i]) === JSON.stringify(completeOpeningHoursDays[i - 1])) {
      if (startRangeDay === null) startRangeDay = i - 1;
      // continue unless the timeslots are different form the previous day
      continue;
    } else {
      // if the timeslots are different from the previous day
      // I add the range of common timeslots days to the workingDaysDisplay array
      workingDaysDisplay.push({
        label: startRangeDay != null ? `${weekDays[startRangeDay]} - ${weekDays[i - 1]}` : weekDays[i - 1],
        slots: completeOpeningHoursDays[i - 1],
      });
      startRangeDay = null;
    }
  }

  return workingDaysDisplay;
}
</script>

<template>
  <div class="container">
    <div class="text-center my-16">
      <h1 class="text-4xl font-bold text-orange-400">Choose a Business Entry</h1>
      <select
        v-model="businessId"
        @change="fetchBusiness"
        class="mt-4 bg-gray-50 border border-gray-300 text-blue-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
      >
        <option v-for="businessId in businessIds" :value="businessId" :key="businessId">{{ businessId }}</option>
      </select>
    </div>
    <div v-if="business">
      <div class="flex flex-col md:flex-row gap-x-5">
        <div class="flex-grow md:w-2/3 border-r-0 md:border-r-2 border-r-blue-500 py-20">
          <h1 class="text-5xl font-bold text-blue-700">{{ business.displayed_what }}</h1>
          <h2 class="text-2xl text-gray-600 mt-3">📍 {{ business.displayed_where }}</h2>
        </div>
        <div class="flex-grow flex flex-col justify-center">
          <h4 class="text-3xl text-blue-600 font-bold my-4">🕒 Opening Hours</h4>
          <div v-for="(daysRange, daysRangeIndex) in getWorkingDaysDisplay()" :key="daysRangeIndex">
            <div class="flex justify-between my-3">
              <b class="text-orange-400 font-bold">
                {{ daysRange.label.toUpperCase() }}
              </b>
              <div v-if="daysRange.slots.length > 0">
                <div v-for="(slot, slotIndex) in daysRange.slots" :key="slotIndex" class="text-end">
                  {{ slot.start }} - {{ slot.end }}
                </div>
              </div>
              <span v-else>Closed 🚫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <span v-if="error" class="text-red-500">{{ error }}</span>
      <span v-else class="material-icons animate-spin text-4xl text-blue-600">pending</span>
    </div>
  </div>
</template>

<style lang="scss">
.container {
  max-width: 1100px;
}
</style>
