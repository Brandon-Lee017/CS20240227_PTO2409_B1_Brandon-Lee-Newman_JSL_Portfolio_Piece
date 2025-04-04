// TASK: import helper functions from utils
// TASK: import initialData

import { getTasks, createNewTask, putTask, deleteTask } from "./utils/taskFunctions.js";
import { initialData } from "./initialData.js";

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM
const elements = {
  headerBoardName : document.getElementById("header-board-name"),
  editTaskModal : document.getElementById("edit-task-modal-window"),
  modalWindow : document.getElementById("modal-window"),
  filterDiv : document.getElementById("filterDiv"),
  showSideBarBtn : document.getElementById("show-side-bar-btn"),
  hideSideBarBtn : document.getElementById("hide-side-bar-btn"),
  themeSwitch : document.getElementById("switch"),
  createNewTaskBtn : document.getElementById("add-new-task-btn"),
  boardsContainer : document.getElementById("boards-nav-links-div"),
  cancelAddTaskBtn : document.getElementById("cancel-add-task-btn"),
  cancelEditBtn : document.getElementById("cancel-edit-btn"),
  titleInput : document.getElementById("title-input"),
  descInput : document.getElementById("desc-input"),
  selectStatus : document.getElementById("select-status"),
  sideBarDiv : document.getElementById("side-bar-btn"),
  editTaskTitleInput : document.getElementById("edit-task-title-input"),
  editTaskDescInput : document.getElementById("edit-task-desc-input"),
  editSelectStatus : document.getElementById("edit-select-status"),
  saveChangeBtn : document.getElementById("save-task-changes-btn"),
  cancelChangeBtn : document.getElementById("cancel-edit-btn"),
  deleteTaskBtn : document.getElementById("delete-task-btn"),
  
  columnDivs: [
    document.querySelector("[data-status='todo']"),
    document.querySelector ("[data-status='doing']"),
    document.querySelector ("[data-status='done']"),
  ]
};

let activeBoard = ""; // Declared globally 

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; 
    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
};

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener ("click", () => { 
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
    });
    boardsContainer.appendChild(boardElement);
  });
}


// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");

    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status = status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener("click",(event) => { 
        openEditTaskModal(task);
      });
      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  const boardBtns = document.querySelectorAll('.board-btn') 
  for (let i = 0; i < boardBtns.length; i++) { 
    let btn = boardBtns[i]
    if(btn.textContent === 'boardName') {
      btn.classList.add('active');
    }
    else {
      btn.classList.remove('active');
    }
  };
};


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status:${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(); 
};



function setupEventListeners() {
  // Cancel editing task event listener
  elements.cancelEditBtn.addEventListener('click', () => toggleModal(false, elements.editTaskModal));

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener('click', () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener('click', () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit',  (event) => {
    addTask(event)
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
      title : elements.titleInput.value,
      description : elements.descInput.value,
      status : elements.selectStatus.value,
      board : activeBoard
    };
    const newTask = createNewTask(task);
    if ( newTask ==="" ) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}

function toggleSidebar(show) {
  elements.sideBarDiv.style.display = show ? 'block' : 'none';
  localStorage.setItem('showSideBar', show ? 'true' : 'false') ;
  elements.showSideBarBtn.style.display = show ? 'none' : 'block'
}

function toggleTheme() {
  const isLightTheme = document.body.classList.toggle('light-theme')
  localStorage.setItem('light-theme', isLightTheme ? 'enabled' : 'disabled');
}



function openEditTaskModal(task) {
  toggleModal(true, elements.editTaskModal);

  elements.editTaskTitleInput.value = task.title
  elements.editTaskDescInput.value = task.description
  elements.editSelectStatus.value = task.status

  // Call saveTaskChanges upon click of Save Changes button
  const newSaveChangeBtn = elements.saveChangeBtn.cloneNode(true);
  elements.saveChangeBtn.replaceWith(newSaveChangeBtn);
  newSaveChangeBtn.addEventListener("click", () => saveTaskChanges(task.id));
 

const newDeleteTaskBtn = elements.deleteTaskBtn.cloneNode(true);
elements.deleteTaskBtn.replaceWith(newDeleteTaskBtn);
newDeleteTaskBtn.addEventListener("click", () => {
  const confirmDelete = confirm(`Are you sure you would like to delete the task "${task.title}"?`);
  if (confirmDelete ==="") {
    deleteTask(task.id);
    refreshTasksUI();
    elements.cancelChangeBtn.click();
  }
});
  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  const newTitle = elements.editTaskTitleInput.value
  const newDescription = elements.editTaskDescInput.value
  const newStatus = elements.editSelectStatus.value
  

  // Create an object with the updated task details
  const newTask = {
    title : newTitle,
    description : newDescription,
    status : newStatus,
    board : activeBoard,
  }

  // Update task using a hlper functoin
  putTask(taskId, newTask);

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal)
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}