export const createPriorityMap = (languageData) => ({
  1: {
    color: "danger",
    fireColor: "rgb(220, 53, 69)",
    text: languageData?.high,
  },
  2: {
    color: "warning",
    fireColor: "rgb(255, 193, 7)",
    text: languageData?.medium,
  },
  3: { color: "info", fireColor: "rgb(13, 202, 240)", text: languageData?.low },
});

export const handleAddColorChange = (
  event,
  priorityMap,
  setAddPriorityColor,
  setAddPriorityFireColor,
  setAddPriorityText
) => {
  const newPriority = event.currentTarget.getAttribute("data-value");
  if (!priorityMap[newPriority]) {
    console.warn("⚠️ Invalid priority selection.");
    return;
  }
  setAddPriorityColor(priorityMap[newPriority].color);
  setAddPriorityFireColor(priorityMap[newPriority].fireColor);
  setAddPriorityText(newPriority);
  document.getElementById("add-dropdown-menu").classList.remove("show");
};

export const handleEditColorChange = (
  event,
  priorityMap,
  setEditPriorityColor,
  setEditPriorityFireColor,
  setEditPriorityText
) => {
  const newPriority = event.currentTarget.getAttribute("data-value");
  if (!priorityMap[newPriority]) {
    console.warn("⚠️ Invalid priority selection.");
    return;
  }
  setEditPriorityColor(priorityMap[newPriority].color);
  setEditPriorityFireColor(priorityMap[newPriority].fireColor);
  setEditPriorityText(newPriority);
  document.getElementById("edit-dropdown-menu").classList.remove("show");
};
