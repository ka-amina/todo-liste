//click on the Add task button and get the modal
const addTask = document.querySelector("#addTask");
const modalTask = document.querySelector(".modal__content");
//date input to now
const dateInput = document.getElementById("DateInput");
dateInput.valueAsDate = new Date();

let isUpdating = false;
let currentTaskId = null;

// Initialize tasks from local storage
window.addEventListener("load", loadTasksFromLocalStorage);

addTask.addEventListener("click", () => {
  modalTask.classList.toggle("active");
});
// click on the cancel and close button and hide the task modal
function closeModal() {
  const modalTask = document.querySelector(".modal__content.active");
  modalTask.classList.remove("active");
}

// Load tasks from local storage and display them
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => displayTask(task));
}

// Save tasks to local storage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  window. location. reload()
}

function getAllTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks"));
}

function displayTask(taskContent) {
  const taskCard = document.createElement("div");
  taskCard.className = "list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0 cursor-pointer";
  taskCard.dataset.taskId = taskContent.id;
  taskCard.innerHTML = ` 
    <div class="list-group-item d-flex border-top-0">
      <div class="me-3 fs-16px">
        <i class="far fa-question-circle text-green-500 fa-fw"></i> 
      </div>
      <div class="flex-fill">
        <div class="fs-14px lh-12 mb-2px fw-bold text-dark">${taskContent.title}</div>
        <div class="mb-1 fs-12px">
          <div class="text-gray-600 flex-1"># created in ${taskContent.date}</div>
        </div>
        <div class="mb-1">
          <span class="badge bg-blue">${taskContent.priority}</span>
          <span class="badge bg-gray-100 text-black">${taskContent.type}</span>
        </div> 
      </div>
    </div>`;

  taskCard.addEventListener("click", function () {
    showSprintInfo(taskContent);
  });

  if (taskContent.status === "To Do") {
    document.getElementById("to-do-tasks").appendChild(taskCard);
  } else if (taskContent.status === "In Progress") {
    document.getElementById("in-progress-tasks").appendChild(taskCard);
  } else if (taskContent.status === "Done") {
    document.getElementById("done-tasks").appendChild(taskCard);
  }
}

// add task


document.getElementById("task-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("titleInput").value;
  const priorityValue = document.getElementById("PrioritySelect").value;
  const status = document.getElementById("statusSelect").value;
  const date = document.getElementById("DateInput").value;
  const description = document.getElementById("descriptionText").value;
  const taskType = document.querySelector(".form-check-input").checked ? "Feature" : "Bug";

  if (title === "" || priorityValue === "" || priorityValue === "Select Priority" || status === "Select Status") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in all required fields!",
    });
    return;
  }

  const priorityMapping = { 1: "High", 2: "Medium", 3: "Low", 4: "Critical" };
  const statusMapping = { 1: "To Do", 2: "In Progress", 3: "Done" };
  const statusLabel = statusMapping[status] || "Unknown";
  const priorityLabel = priorityMapping[priorityValue] || "Unknown";

  const taskContent = {
    id: isUpdating && currentTaskId ? currentTaskId : Date.now().toString(),
    title,
    priority: priorityLabel,
    status: statusLabel,
    date,
    type: taskType,
    description,
  };

  const tasks = getAllTasksFromLocalStorage();

  if (isUpdating) {
    const taskIndex = tasks.findIndex(task => task.id === taskContent.id);
    tasks[taskIndex] = taskContent;

    isUpdating = false;
    currentTaskId = null;
    Swal.fire({
      title: 'Task Updated!',
      text: `Task updated to: "${taskContent.title}"`,
      icon: 'info',
      confirmButtonText: 'Got it!'
  }).then((result) => {
    if (result.isConfirmed){
      saveTasksToLocalStorage(tasks);
    }});
  } else {
    tasks.push(taskContent);
    Swal.fire({
      title: "Task Added!",
      text: `You have added a new task: "${taskContent.title}"`,
      icon: "success",
      confirmButtonText: "Nice!",
    }).then((result) => {
      if (result.isConfirmed){
        saveTasksToLocalStorage(tasks);
      }});
  }

  
  displayTask(taskContent);
  
  modalTask.classList.remove("active");
  
  document.getElementById("task-form").reset();
});



// browse  task card

function showSprintInfo(taskContent) {
  // Select the main sprint container
  const sprintContainers = document.getElementsByClassName(
    "sprintcard sprint__content"
  );

  // Get the first sprint container and make it visible
  const targetContainer = sprintContainers[0];
  targetContainer.classList.add("active");

  // Create the sprint card element
  const sprintCard = document.createElement("div");
  sprintCard.className = "sprintcard w-100"; // Apply any necessary styling class

  // Set the inner HTML of the sprint card
  sprintCard.innerHTML = `

    <div class="sprintcard-header">
      <h5>${taskContent.title}</h5>
      <a  class="cancel-card cursor-pointer" onclick="closeCard() ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292968 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
        </svg>
      </a>
    </div>
    <div class="d-flex"><h6>Date: </h6><span>${taskContent.date}</span></div>
    <div>
      <h6>Description</h6>
      <p>${taskContent.description}</p>
    </div>
    <div><h6>Status </h6><span>${taskContent.status}</span></div>
    <div><h6>Priority </h6><span>${taskContent.priority}</span></div>
    <div><h6>Type </h6><span>${taskContent.type}</span></div>
    <div class="sprintcard-btns">
      <button class="cancel-card" onclick="closeCard() ">Cancel</button>
      <button class="delete" onclick="deleteTask()">Delete</button>
      <button class="update">Update</button>
    </div>
  `;
  targetContainer.appendChild(sprintCard);
  // navigate to update function
  const updateButton = sprintCard.querySelector(".update");
  updateButton.addEventListener("click", function () {
    updateTask(taskContent);
  });
  //  navigate to closecard function
  const closecard = sprintCard.querySelector(".cancel-card");
  closecard.addEventListener("click", function () {
    closeCard();
  });
  // navigate to delete function
  const deleteButton = sprintCard.querySelector(".delete");
  deleteButton.addEventListener("click", function () {
    deleteTask(taskContent);
  });

  console.log("Sprint card added:", sprintCard);
}

//close task card
function closeCard() {
  const sprintContainer = document.querySelector(
    ".sprintcard.sprint__content.active"
  );

  sprintContainer.classList.remove("active");
}

//update task
function updateTask(taskContent) {
  const taskCard = document.querySelector(".sprintcard.sprint__content.active");
  if (taskCard) taskCard.classList.remove("active");
  isUpdating = true;
  currentTaskId = taskContent.id;

  document.getElementById("titleInput").value = taskContent.title;

  const priorityMapping = { High: "1", Medium: "2", Low: "3", Critical: "4" };
  const statusMapping = { "To Do": "1", "In Progress": "2", Done: "3" };

  document.getElementById("PrioritySelect").value =
    priorityMapping[taskContent.priority];
  document.getElementById("statusSelect").value =
    statusMapping[taskContent.status];
  document.getElementById("DateInput").value = taskContent.date;
  document.getElementById("descriptionText").value = taskContent.description;

  document.getElementById("feature").checked = taskContent.type === "Feature";
  document.getElementById("bug").checked = taskContent.type === "Bug";

  const taskModal = document.querySelector(".modal__content");
  taskModal.classList.add("active");

  console.log("Loaded task for update:", taskContent);
}


function deleteTask(taskContent) {
  const taskElement = document.getElementById(taskContent.id);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      closeCard();
      
      if (taskElement) taskElement.remove();
      const tasks = getAllTasksFromLocalStorage().filter(task => task.id !== taskContent.id);
      saveTasksToLocalStorage(tasks);
      Swal.fire({
        title: "Task Deleted!",
        text: `The task "${taskContent.title}" has been deleted.`,
        icon: "success",
        confirmButtonText: "Okay",
      });
    }
  });
}


const todo= document.querySelector("to-do-tasks")