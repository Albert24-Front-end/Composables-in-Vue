import {
  shallowRef,
  type Ref,
  toValue,
  type MaybeRefOrGetter,
  watchEffect,
  onBeforeMount,
  onUnmounted,
} from "vue";

type UseLocalStorageValueOptions = {
  syncTabs?: boolean;
};

export function useLocalStorageValue<ValueType>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<ValueType>,
  options: UseLocalStorageValueOptions = { syncTabs: false },
): { value: Ref<ValueType> } {
  // const startValue: ValueType =
  //   (JSON.parse(
  //     window.localStorage.getItem(toValue(key)) ?? "null",
  //   ) as ValueType) ?? toValue(initialValue);
  const abortController = new AbortController(); // creating abort controller of signals which were passed to event listeners
  const value = shallowRef<ValueType>(toValue(initialValue)); // the object will be held in LS, so there is no need to deeply unpack it with ref
  onBeforeMount(() => {
    watchEffect(() => {
      const hasValue = window.localStorage.getItem(toValue(key)) !== null;

      if (!hasValue) return;

      value.value = JSON.parse(
        window.localStorage.getItem(toValue(key)) ?? "null",
      );
    });

    // live saving value in localStorage
    watchEffect(() => {
      const serializedValue = JSON.stringify(value.value);
      window.localStorage.setItem(toValue(key), serializedValue);
    });

    // watch(
    //   value,
    //   (newValue) => {
    //     const serializedValue = JSON.stringify(newValue);
    //     window.localStorage.setItem(toValue(key), serializedValue);
    //   },
    //   { immediate: true },
    // );

    // enabling state synchronisation between several tabs of the same app
    if (options.syncTabs) {
      window.addEventListener("storage", (event) => {
        if (event.key === toValue(key)) {
          value.value = JSON.parse(event.newValue ?? "null") as ValueType;
        }
      }, {signal: abortController.signal});
    }

    onUnmounted(() => {
      abortController.abort();
    })
  });

  return { value };
}
