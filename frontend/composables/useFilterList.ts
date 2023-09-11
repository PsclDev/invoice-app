export default function useFilterList<T>() {
  const currentFilterTerm = ref<string>('');
  const initialList = ref<T[]>([]) as Ref<T[]>;
  const filteredList = ref<T[]>([]) as Ref<T[]>;

  function setInitialList(list: T[]) {
    initialList.value = list;
    filteredList.value = list;
    filter(currentFilterTerm.value);
  }

  function filter(filterTerm: string) {
    if (!filterTerm) {
      filteredList.value = initialList.value;
      return;
    }

    if (filterTerm.length < 3) {
      return;
    }

    currentFilterTerm.value = filterTerm.trim().toLowerCase();
    filteredList.value = initialList.value.filter((i: T) =>
      checkForValue(i, currentFilterTerm.value),
    );
  }

  function checkForValue(obj: T, term: string): boolean {
    for (const key in obj) {
      const val = (obj as any)[key];
      if (
        typeof val === 'string' &&
        val !== '' &&
        val.toLowerCase().includes(term)
      ) {
        return true;
      }
    }

    return false;
  }

  return { filter, filteredList, initialList, setInitialList };
}
