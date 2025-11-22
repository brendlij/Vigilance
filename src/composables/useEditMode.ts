import { ref } from "vue";

const editMode = ref(false);

export function useEditMode() {
  return {
    editMode,
    toggleEditMode: () => {
      editMode.value = !editMode.value;
    },
    setEditMode: (value: boolean) => {
      editMode.value = value;
    },
  };
}
