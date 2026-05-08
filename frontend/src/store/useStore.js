import { create } from "zustand";

export const useStore = create((set) => ({
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,

    setDoctor: (doc) => set({ selectedDoctor: doc }),
    setDate: (date) => set({ selectedDate: date }),
    setTime: (time) => set({ selectedTime: time }),
}));