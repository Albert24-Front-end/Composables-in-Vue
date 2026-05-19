import { ref, type Ref, watch } from "vue";

type UseLocalStorageValueOptions = {
  syncTabs?: boolean;
};

export function useLocalStorageValue<ValueType>(
  key: string,
  initialValue: ValueType,
  options: UseLocalStorageValueOptions = { syncTabs: false },
): { value: Ref<ValueType> } {
  const startValue: ValueType =
    (JSON.parse(window.localStorage.getItem(key) ?? "null") as ValueType) ??
    initialValue;
  const value = ref(startValue);

  // live saving value in localStorage
  watch(
    value,
    (newValue) => {
      const serializedValue = JSON.stringify(newValue);
      window.localStorage.setItem(key, serializedValue);
    },
    { immediate: true },
  );

  // enabling state synchronisation between several tabs of the same app
  if (options.syncTabs) {
    window.addEventListener("storage", (event) => {
      if (event.key === key) {
        value.value = JSON.parse(event.newValue ?? "null") as ValueType;
      }
    });
  }

  return { value };
}
