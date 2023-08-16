export default function useFilterList<T>() {
  const initialList = ref<T[]>([]) as Ref<T[]>;
  const filteredList = ref<T[]>([]) as Ref<T[]>;

  function setInitialList(list: T[]) {
    initialList.value = list;
    filteredList.value = list;
  }

  function filter(searchTerm: string) {
    if (!searchTerm) {
      filteredList.value = initialList.value;
      return;
    }

    if (searchTerm.length < 3) {
      return;
    }

    const term = searchTerm.trim().toLowerCase();
    filteredList.value = initialList.value.filter((i: T) =>
      checkForValue(i, term),
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

  return { filter, filteredList, setInitialList };
}
