import {
  shallowRef,
  type Ref,
  toValue,
  type MaybeRefOrGetter,
  watchEffect,
  onBeforeMount,
} from "vue";

type UseLocalStorageValueOptions = {
  check?: boolean;
};

export function useLocalStorageValue<ValueType>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<ValueType>,
  options: MaybeRefOrGetter<UseLocalStorageValueOptions>,
): { value: Ref<ValueType> } {
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

    // enabling state synchronisation between several tabs of the same app
    watchEffect((onCleanup) => {
      const opts = toValue(options);
      // console.log("watchEffect ran, check =", opts.check);
      if (opts.check) {
        const handler = (event: StorageEvent) => {
          // console.log("storage event fired:", event.key, event.newValue);
          if (event.key === toValue(key)) {
            value.value = JSON.parse(event.newValue ?? "null") as ValueType;
          }
        };
        window.addEventListener("storage", handler);
        onCleanup(() => {
          window.removeEventListener("storage", handler);
        });
      }
    });
  });

  return { value };
}
