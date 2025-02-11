// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    function createTaskCard(task) {
        let deadline = dayjs(task.deadline);
        let currentDate = dayjs();
    // deadline
        let dateRange = currentDate.diff(deadline, "day");
        let taskDeadlineColor;
      
    // colors
        if (task.status !== "done") {
          if (dateRange > 0) {
            taskDeadlineColor = "past-due";
          } else if (dateRange > -4) {
            taskDeadlineColor = "due-soon";
          } else {
            taskDeadlineColor = "on-track";
          }
        } else {
          taskDeadlineColor = "on-track";
        }
//creates a div class for card placement
  const cardBox = $("<div>");
  //adding jquery and boostrap css classes
  cardBox.addClass(
    "card draggable mb-2 task-card " + taskDeadlineColor.toString()
  );
  //adding a unique id attribute
  cardBox.attr("data-task-id", task.id);

  //creates div in body
  const cardBody = $("<div>");
  cardBody.addClass("card-body");

  //
  const cardTitle = $("<h5>");
  cardTitle.addClass("card-title");
  cardTitle.text(task.title);

  //
  const cardText = $("<p>");
  cardText.addClass("card-text");
  cardText.text(task.description);

  //
  const cardDeadline = $("<p>");
  cardDeadline.addClass("card-text text-muted");
  cardDeadline.text(deadline.format("MM-DD-YYYY"));

  //
  const cardDeleteBtn = $("<button>");
  cardDeleteBtn.addClass("btn btn-sm btn-danger float-end delete-task");
  cardDeleteBtn.attr("data-task-id", task.id);
  cardDeleteBtn.text("Delete");

  //
  cardBody.append(cardTitle);
  cardBody.append(cardText);
  cardBody.append(cardDeadline);
  cardBody.append(cardDeleteBtn);
  cardBox.append(cardBody);

  return cardBox;
}
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //
    let todoEl = $("#todo-cards");
    let inprogressEl = $("#in-progress-cards");
    let doneEl = $("#done-cards");
    //
    todoEl.empty();
    inprogressEl.empty();
    doneEl.empty();
  
    //
    for (let i = 0; i < taskList.length; i++) {
      const currentTask = taskList[i];
      const currentCard = createTaskCard(currentTask);
  
      //
      if (currentTask.status === "done") {
        doneEl.append(currentCard);
      } else if (currentTask.status === "in-progress") {
        inprogressEl.append(currentCard);
      } else if (currentTask.status === "to-do") {
        todoEl.append(currentCard);
      }
  
      //
      $(".delete-task").on("click", handleDeleteTask);
  
      //
      $(".task-card").draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (event) {
          eventTarget = $(event.target);
          const original = eventTarget.hasClass("ui-draggable")
            ? eventTarget
            : eventTarget.closest(".task-card");
          return original.clone().css({
            width: original.outerWidth(),
          });
        },
      });
    }
  }

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    //
    const taskTitle = $("#task-title").val();
    const taskDescription = $("#task-description").val();
    const taskDeadline = $("#task-deadline").val();
  
    //
    const newTask = {
      //
      id: generateTaskId(),
      title: taskTitle,
      description: taskDescription,
      deadline: taskDeadline,
      //
      status: "to-do",
    };
  
    //
    taskList.push(newTask);
    //
    localStorage.setItem("tasks", JSON.stringify(taskList));
    //
    localStorage.setItem("nextId", JSON.stringify(nextId));
  
    //
    $("#formModal").modal("hide");
  
    //
    $("#task-title").val(``);
    $("#task-description").val(``);
    $("#task-deadline").val(``);
  
    //
    renderTaskList();
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskDeleteBtn = $(event.currentTarget);
    const taskId = taskDeleteBtn.data("task-id");
    console.log(taskId);
  
    const deletedTaskIndex = taskList.findIndex(
      (task) => task.id === parseInt(taskId)
    );
    if (deletedTaskIndex !== -1) {
      taskList.splice(deletedTaskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(taskList));
      renderTaskList();
      taskDeleteBtn.closest(".task-card").remove();
    }
  }
  
  // Todo: create a function to handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    const taskId = ui.draggable.data("task-id");
    const dropLaneTarget = $(event.target).closest(".lane").attr("id");
  
    const droppedTask = taskList.find((task) => task.id === taskId);
    droppedTask.status = dropLaneTarget;
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
  
  // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
  $(document).ready(function () {
    renderTaskList();
    $(".lane").droppable({
      accept: ".task-card",
      drop: handleDrop,
    });
    $("#newTaskForm").on("submit", handleAddTask);
  });
