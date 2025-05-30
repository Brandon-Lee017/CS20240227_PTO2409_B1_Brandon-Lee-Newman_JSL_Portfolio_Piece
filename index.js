// TASK: import helper functions from utils
import { createNewTask, getTasks, patchTask } from "./utils/taskFunctions.js";
// TASK: import initialData
import { initialData } from "./initialData.js";
/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * ***********************************************************************************************************************************************/
// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  console.log("initializeData: Checking localStorage for tasks");
  if (!localStorage.getItem("tasks")) {
    console.log("initializeData: No tasks found, setting initialData");
    localStorage.setItem("tasks", JSON.stringify(initialData));
    localStorage.setItem("showSideBar", "true");
  } else {
    console.log("initializeData: Data already exists in LocalStorage");
  }
  console.log(
    "initializeData: Tasks in localStorage:",
    JSON.parse(localStorage.getItem("tasks"))
  );
}

// TASK: Get elements from the DOM
const elements = {
  sidebar: document.getElementById("side-bar-div"),
  sidebarLogo: document.getElementById("side-logo-div"),
  boardsNavLinksDiv: document.getElementById("boards-nav-links-div"),
  filterDiv: document.getElementById("filterDiv"),
  modalWindow: document.getElementById("new-task-modal-window"),
  editTaskModal: document.getElementById("edit-task-modal-window"),
  headerBoardName: document.getElementById("header-board-name"),
  columnDivs: document.querySelectorAll(".column-div"),
  themeSwitch: document.getElementById("switch"),
  createNewTaskBtn: document.getElementById("create-task-btn"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  taskTitleInput: document.getElementById("title-input"),
  taskDescriptionInput: document.getElementById("desc-input"),
  taskStatusSelect: document.getElementById("select-status"),
  editTaskTitleInput: document.getElementById("edit-task-title-input"),
  editTaskDescInput: document.getElementById("edit-task-desc-input"),
  editTaskStatusSelect: document.getElementById("edit-select-status"),
  saveChangesBtn: document.getElementById("save-task-changes-btn"),
  deleteTaskBtn: document.getElementById("delete-task-btn"),
  addNewTaskBtn: document.getElementById("add-new-task-btn"),
  editBoardBtn: document.getElementById("edit-board-btn"),
  deleteBoardBtn: document.getElementById("deleteBoardBtn"),
};

console.log("elements: Initial DOM elements:", elements);

let activeBoard = ""; // Declared globally
console.log("activeBoard: Initial value:", activeBoard);

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  console.log("fetchAndDisplayBoardsAndTasks: Starting");
  const tasks = getTasks();
  console.log("fetchAndDisplayBoardsAndTasks: Tasks retrieved:", tasks);
  const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
  console.log("fetchAndDisplayBoardsAndTasks: Unique boards:", boards);
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = localStorage.getItem("activeBoard");
    console.log(
      "fetchAndDisplayBoardsAndTasks: LocalStorage activeBoard:",
      localStorageBoard
    );
    activeBoard = localStorageBoard || boards[0];
    console.log(
      "fetchAndDisplayBoardsAndTasks: Set activeBoard to:",
      activeBoard
    );
    elements.headerBoardName.textContent = activeBoard;
    console.log(
      "fetchAndDisplayBoardsAndTasks: Header updated to:",
      elements.headerBoardName.textContent
    );
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  } else {
    console.log("fetchAndDisplayBoardsAndTasks: No boards found");
  }
  console.log("fetchAndDisplayBoardsAndTasks: Finished");
};

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  console.log("displayBoards: Starting with boards:", boards);
  if (!elements.boardsNavLinksDiv) {
    console.log("displayBoards: elements.boardsNavLinksDiv is null, exiting");
    return;
  }
  console.log("displayBoards: boardsNavLinksDiv:", elements.boardsNavLinksDiv);
  elements.boardsNavLinksDiv.innerHTML = "";
  console.log("displayBoards: Cleared boardsNavLinksDiv");

  boards.forEach((board) => {
    console.log("displayBoards: Creating button for board:", board);
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", function () {
      console.log("displayBoards: Clicked board:", board);
      elements.headerBoardName.textContent = board;
      console.log(
        "displayBoards: Header set to:",
        elements.headerBoardName.textContent
      );
      filterAndDisplayTasksByBoard(board);
      activeBoard = board;
      console.log("displayBoards: activeBoard updated to:", activeBoard);
      localStorage.setItem("activeBoard", activeBoard);
      console.log(
        "displayBoards: Saved activeBoard to localStorage:",
        localStorage.getItem("activeBoard")
      );
      styleActiveBoard(activeBoard);
    });
    elements.boardsNavLinksDiv.appendChild(boardElement);
    console.log("displayBoards: Appended button for:", board);
  });
  console.log("displayBoards: Finished");
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  console.log(
    "filterAndDisplayTasksByBoard: Starting with boardName:",
    boardName
  );
  const tasks = getTasks();
  console.log("filterAndDisplayTasksByBoard: All tasks:", tasks);
  const filteredTasks = tasks.filter((task) => task.board === boardName);
  console.log(
    "filterAndDisplayTasksByBoard: Filtered tasks for",
    boardName,
    ":",
    filteredTasks
  );
  console.log("filterAndDisplayTasksByBoard: columnDivs:", elements.columnDivs);
  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status");
    console.log(
      "filterAndDisplayTasksByBoard: Processing column with status:",
      status
    );
    column.innerHTML = `
        <div class="column-head-div">
        <span class="dot" id="${status}-dot"></span>
        <h4 class="columnHeader">${status.toUpperCase()}</h4>
      </div>`;
    console.log(
      "filterAndDisplayTasksByBoard: Updated column header for",
      status
    );

    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("tasks-container");
    column.appendChild(tasksContainer);
    console.log(
      "filterAndDisplayTasksByBoard: Added tasks-container to",
      status
    );

    const statusTasks = filteredTasks.filter((task) => task.status === status);
    console.log(
      "filterAndDisplayTasksByBoard: Tasks for status",
      status,
      ":",
      statusTasks
    );

    statusTasks.forEach((task) => {
      console.log("filterAndDisplayTasksByBoard: Adding task:", task.title);
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute("data-task-id", task.id);
      taskElement.addEventListener("click", function () {
        console.log("filterAndDisplayTasksByBoard: Task clicked:", task.title);
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
      console.log("filterAndDisplayTasksByBoard: Appended task:", task.title);
    });
  });
  console.log("filterAndDisplayTasksByBoard: Finished");
}

function refreshTasksUI() {
  console.log("refreshTasksUI: Starting with activeBoard:", activeBoard);
  filterAndDisplayTasksByBoard(activeBoard);
  console.log("refreshTasksUI: Finished");
}

// Styles the active board by adding an active class
//TASK: FIX BUGS
function styleActiveBoard(boardName) {
  console.log("styleActiveBoard: Styling board:", boardName);
  document.querySelectorAll(".board-btn").forEach((btn) => {
    if (btn.textContent === boardName) {
      btn.classList.add("active");
      console.log("styleActiveBoard: Added 'active' to:", btn.textContent);
    } else {
      btn.classList.remove("active");
      console.log("styleActiveBoard: Removed 'active' from:", btn.textContent);
    }
  });
  console.log("styleActiveBoard: Finished");
};

function addTaskToUI(task) {
  console.log("addTaskToUI: Adding task:", task);
  const column = document.querySelector(
    `.column-div[data-status="${task.status}"]`
  );
  console.log("addTaskToUI: Found column:", column);
  if (!column) {
    console.error(`addTaskToUI: Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    console.error("container not found");
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
    console.log("addTaskToUI: Created new tasks-container for", task.status);
  };

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";

  taskElement.setAttribute("data-task-id", task.id);
  taskElement.innerHTML = `
    <h4 class="task-title">${task.title}</h4>
    <p class="task-description">${task.description}</p>`;
  console.log("addTaskToUI: Created task element:", taskElement);

  taskElement.addEventListener("click", () => {
    console.log("addTaskToUI: Task clicked:", task.title);
    openEditTaskModal(task);
  });
  tasksContainer.appendChild(taskElement);
  console.log("addTaskToUI: Appended task:", task.title);
};

function setupEventListeners() {
  console.log("setupEventListeners: Starting");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  console.log("setupEventListeners: cancelEditBtn:", cancelEditBtn);
  cancelEditBtn.addEventListener("click", () => {
    console.log("setupEventListeners: Cancel edit clicked");
    toggleModal(false, elements.editTaskModal);
  });

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  console.log("setupEventListeners: cancelAddTaskBtn:", cancelAddTaskBtn);
  cancelAddTaskBtn.addEventListener("click", () => {
    console.log("setupEventListeners: Cancel add task clicked");
    toggleModal(false);
    elements.filterDiv.style.display = "none";
  });

  // Clicking outside the modal to close it
  console.log("setupEventListeners: filterDiv:", elements.filterDiv);
  elements.filterDiv.addEventListener("click", () => {
    console.log("setupEventListeners: Filter div clicked");
    toggleModal(false);
    elements.filterDiv.style.display = "none";
  });

  // Show sidebar event listener
  console.log("setupEventListeners: hideSideBarBtn:", elements.hideSideBarBtn);
  elements.hideSideBarBtn.addEventListener("click", () => {
    console.log("setupEventListeners: Hide sidebar clicked");
    toggleSidebar(false);
  });
  console.log("setupEventListeners: showSideBarBtn:", elements.showSideBarBtn);
  elements.showSideBarBtn.addEventListener("click", () => {
    console.log("setupEventListeners: Show sidebar clicked");
    toggleSidebar(true);
  });

  // Theme switch event listener
  console.log("setupEventListeners: themeSwitch:", elements.themeSwitch);
  elements.themeSwitch.addEventListener("change", () => {
    console.log("setupEventListeners: Theme switch changed");
    toggleTheme();
  });
  // Show Add New Task Modal event listener
  console.log(
    "setupEventListeners: createNewTaskBtn:",
    elements.createNewTaskBtn
  );
  elements.createNewTaskBtn.addEventListener("click", () => {
    console.log("setupEventListeners: Create new task clicked");
    toggleModal(true);
    elements.filterDiv.style.display = "block";
  });

  console.log("setupEventListeners: modalWindow:", elements.modalWindow);
  elements.modalWindow.addEventListener("submit", (event) => {
    console.log("setupEventListeners: Modal form submitted");
    addTask(event);
  });
  console.log("setupEventListeners: Finished");
}
setupEventListeners();

//Toggle task modal
//fix: fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  console.log("toggleModal: Starting with show:", show, "modal:", modal);
  if (!modal) {
    console.log("toggleModal: Modal is null, exiting");
    return;
  }
  modal.style.display = show ? "block" : "none";
  elements.filterDiv.style.display = show ? "block" : "none";
  console.log("toggleModal: Modal display set to:", modal.style.display);
  console.log(
    "toggleModal: FilterDiv display set to:",
    elements.filterDiv.style.display
  );
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 ***********************************************************************************************************************************************/
function addTask(event) {
  console.log("addTask: Starting");
  event.preventDefault();

  const task = {
    id: Date.now(),
    title: elements.taskTitleInput.value,
    description: elements.taskDescriptionInput.value,
    status: elements.taskStatusSelect.value || "todo",
    board: activeBoard,
  };
  console.log("addTask: Created task:", task);

  const tasks = getTasks();
  const taskExists = tasks.some((t) => t.id === task.id);
  if (taskExists) {
    console.log("addTask: Task ID already exists, skipping");
    return;
  }

  const newTask = createNewTask(task);
  console.log("addTask: New task from createNewTask:", newTask);
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.modalWindow.reset();
    console.log("addTask: Form reset");
  }
  console.log("addTask: Finished");
}

function toggleSidebar(show) {
  console.log("toggleSidebar: Starting with show:", show);
  if (!elements.sidebar || !elements.showSideBarBtn) {
    console.log("toggleSidebar: sidebar or showSideBarBtn is null, exiting");
    return;
  }

  elements.sidebar.style.display = show ? "flex" : "none";
  elements.sidebar.classList.toggle("hidden", !show);
  elements.showSideBarBtn.style.display = show ? "none" : "block";
  localStorage.setItem("showSideBar", String(show));
  console.log(
    "toggleSidebar: Sidebar display:",
    elements.sidebar.style.display
  );
  console.log(
    "toggleSidebar: ShowSideBarBtn display:",
    elements.showSideBarBtn.style.display
  );
}

function toggleTheme() {
  console.log("toggleTheme: Starting");
  const body = document.body;
  if (elements.themeSwitch.checked) {
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    console.log("toggleTheme: Switched to dark");
  } else {
    body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
    console.log("toggleTheme: Switched to light");
  }
  console.log("toggleTheme: Finished");
}

function openEditTaskModal(task) {
  console.log("openEditTaskModal: Starting with task:", task);
  if (!elements.editTaskModal) {
    console.log("openEditTaskModal: editTaskModal is null, exiting");
    return;
  }

  elements.editTaskTitleInput.value = task.title;
  elements.editTaskDescInput.value = task.description;
  console.log(
    "openEditTaskModal: Set title:",
    elements.editTaskTitleInput.value,
    "desc:",
    elements.editTaskDescInput.value
  );
  const saveChangesBtn = document.getElementById("save-task-changes-btn");
  const deleteTaskBtn = document.getElementById("delete-task-btn");
  console.log(
    "openEditTaskModal: saveChangesBtn:",
    saveChangesBtn,
    "deleteTaskBtn:",
    deleteTaskBtn
  );

  if (saveChangesBtn) {
    saveChangesBtn.onclick = function () {
      console.log(
        "openEditTaskModal: Save changes clicked for task ID:",
        task.id
      );
      saveTaskChanges(task.id);
    };
  }

  if (deleteTaskBtn) {
    deleteTaskBtn.onclick = function () {
      console.log("openEditTaskModal: Delete clicked for task ID:", task.id);
      deleteTask(task.id);
      toggleModal(false, elements.editTaskModal);
    };
  }
  toggleModal(true, elements.editTaskModal);
}

// Save changes to a task
function saveTaskChanges(taskId) {
  console.log("saveTaskChanges: Starting with taskId:", taskId);
  const updatedTask = {
    id: Number(taskId),
    title: elements.editTaskTitleInput.value,
    description: elements.editTaskDescInput.value,
    status: elements.editTaskStatusSelect.value,
    board: activeBoard,
  };
  console.log("saveTaskChanges: Updated task:", updatedTask);
  if (!updatedTask.title || !updatedTask.description || !updatedTask.status) {
    console.log("saveTaskChanges: Missing fields, exiting");
    return;
  }
  patchTask(updatedTask.id, updatedTask);
  toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
  console.log("saveTaskChanges: Finished");
}

function deleteTask(taskId) {
  console.log("deleteTask: Deleting task ID:", taskId);
  const tasks = getTasks();
  const deletedTaskBoard = tasks.find(
    (task) => task.id === Number(taskId)
  )?.board;
  const updatedTasks = tasks.filter((task) => task.id !== Number(taskId));
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  console.log("deleteTask: Updated tasks:", updatedTasks);

  const boardStillExists = updatedTasks.some(
    (task) => task.board === deletedTaskBoard
  );
  if (!boardStillExists) {
    console.log("deleteTask: No tasks left for board, refreshing all boards");
    fetchAndDisplayBoardsAndTasks();
  } else {
    console.log("deleteTask: Refreshing tasks for current board");
    refreshTasksUI();
  }
  console.log("deleteTask: Finished");
}

// Your existing DOMContentLoaded setup
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Elements", elements);
  console.log("DOMContentLoaded: Starting");
  initializeData();
  fetchAndDisplayBoardsAndTasks();
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  console.log("DOMContentLoaded: showSidebar from localStorage:", showSidebar);
  toggleSidebar(showSidebar);

  const savedTheme = localStorage.getItem("theme") || "dark";
  console.log("DOMContentLoaded: savedTheme:", savedTheme);
  if (elements.themeSwitch) {
    elements.themeSwitch.checked = savedTheme === "dark";
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
    console.log(
      "DOMContentLoaded: Applied theme, checked:",
      elements.themeSwitch.checked
    );
  }

  // This function handles all the header actions
  function setupHeaderButtons() {
    // Add Task Button opens new task modal
    const addTaskBtn = document.getElementById("add-new-task-btn");
    if (addTaskBtn) {
      addTaskBtn.addEventListener("click", () => {
        toggleModal(true, elements.modalWindow);
      });
    }

    const editBoardBtn = document.getElementById("edit-board-btn");
    const editBoardDiv = document.getElementById("editBoardDiv");
    if (editBoardBtn && editBoardDiv) {
      editBoardBtn.addEventListener("click", () => {
        const isVisible = editBoardDiv.style.display === "block";
        editBoardDiv.style.display = isVisible ? "none" : "block";
      });
    }

    // Delete Board Button clears tasks for current board
    const deleteBoardBtn = document.getElementById("deleteBoardBtn");
    if (deleteBoardBtn) {
      addEventListener("click", () => {
        const confirmDelete = confirm(
          `Are you sure you want to delete the board "${activeBoard}"?`
        );
        if (confirmDelete) {
          const tasks = getTasks();
          const remainingTasks = tasks.filter(
            (task) => task.board !== activeBoard
          );
          localStorage.setItem("tasks", JSON.stringify(remainingTasks));
          // Refresh UI with remaining boards
          fetchAndDisplayBoardsAndTasks();
        }
      });
    }
    console.log("setupHeaderButtons");
  }
  setupHeaderButtons();
  console.log("DOMContentLoaded: Finished");
});
