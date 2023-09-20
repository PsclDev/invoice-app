import { isArray } from 'lodash';

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
    return Object.values(obj as object).some((value) => {
      switch (typeof value) {
        case 'string':
        case 'number':
          // replace dot and comma so search works independent of decimal separator
          return value
            .toString()
            .replace(/[/.,]/g, '')
            .toLowerCase()
            .includes(term.replace(/[/.,]/g, ''));
        case 'object':
          if (isArray(value)) {
            return value.some((itm) =>
              itm.toString().toLowerCase().includes(term),
            );
          }
          break;
      }
      return false;
    });
  }

  return { filter, filteredList, initialList, setInitialList };
}
