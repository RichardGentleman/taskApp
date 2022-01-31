const taskElementToDo = document.querySelector('#tasksToDo');
const taskElementInProgress = document.querySelector('#tasksInProgress');
const taskElementDone = document.querySelector('#tasksDone');
const taskTemplate = document.getElementById('single-task');
const filterDate = document.querySelector("#date");
const filterWagon = document.querySelector("#wagon");
const filterCrewCabPickup = document.querySelector("#crewCabPickup");
const filterSUV = document.querySelector("#SUV");
const filterExtendedCabPickup = document.querySelector("#extendedCabPickup");
const filterMinivan = document.querySelector("#minivan");
const filterHatchback = document.querySelector("#hatchback");
const filterCargoVan = document.querySelector("#cargoVan");
const filterConvertible = document.querySelector("#convertible");
const filterCoupe = document.querySelector("#coupe");
const filters = document.querySelectorAll('input[name="filter"]');

// ---------- Drag and Drop ---------------- //

// const draggables = document.querySelectorAll(".draggable");
// const containers = document.querySelectorAll(".container");

// draggables.forEach(draggable => {
//   draggable.addEventListener("dragstart", () => {
//     draggable.classList.add("dragging");
//     console.log("drag started");
//   })

//   draggable.addEventListener("dragend", () => {
//     draggable.classList.remove("dragging");
//     console.log("drag end");
//   })
// })

// containers.forEach(container => {
//   container.addEventListener("dragover", e => {
//     e.preventDefault();
//     const draggedItem = document.querySelector(".dragging")
//     container.appendChild(draggedItem);
//   })
// })

// ------- Filter Upon Date -------- //

filterDate.addEventListener("change", orderDates)

function orderDates(e) {
  let sourceData = JSON.parse(localStorage.getItem('sourceData'));
  let dates= [];
  sourceData.forEach(function(item) {
      dates.push(item)
  });
  if(e.target.value === "newest") {
  const sortedData = dates.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    displayData(sortedData);
  } else if (e.target.value === "oldest") {
    const oldestData = dates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    displayData(oldestData);
  } else {
    displayData(sourceData);
  }
}

// ----------- Filter Upon Category ------------- //

filterWagon.addEventListener('change', filterSourceData);
filterCrewCabPickup.addEventListener('change', filterSourceData);
filterSUV.addEventListener('change', filterSourceData);
filterExtendedCabPickup.addEventListener('change', filterSourceData);
filterMinivan.addEventListener('change', filterSourceData);
filterHatchback.addEventListener('change', filterSourceData);
filterCargoVan.addEventListener('change', filterSourceData);
filterConvertible.addEventListener('change', filterSourceData);
filterCoupe.addEventListener('change', filterSourceData);

function filterSourceData(e) {
  const activeFilters = [];
  filters.forEach(function(filter) {
    if(filter.checked){
      activeFilters.push(filter.value)
    }
  });
  let sourceData = JSON.parse(localStorage.getItem('sourceData'));
  if(e.target.checked == true){
    let filteredData = [];
    activeFilters.forEach((f) =>{
      filteredData = [ ...filteredData, ...sourceData.filter((x) => x.category === f)];
    });
    displayData(filteredData);
  } else {
    displayData(sourceData);
  }
}

function sendHttpRequest(method, url) {
  return fetch(url).then(response => {
          if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then(errData => {
          console.log(errData);
          throw new Error('Something went wrong - server-side.');
        });
      }
  });
}

async function fetchTasks() {
  const responseData = await sendHttpRequest(
    'GET',
    'https://61d422ce8df81200178a8aca.mockapi.io/api/task'
  );
  localStorage.setItem('sourceData', JSON.stringify(responseData))
  let listOfTasks = responseData;
    // console.log(listOfTasks);

  displayData(listOfTasks);
}

function displayData(list){
  taskElementToDo.replaceChildren();
  for (const task of list) {
    const taskEl = document.importNode(taskTemplate.content, true);
    taskEl.querySelector(".task-time").textContent = new Intl.DateTimeFormat('sk-SK', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(task.createdAt));
    taskEl.querySelector("h3").textContent = task.name.toUpperCase();
    taskEl.querySelector(".task-description").textContent = task.description;
    taskEl.querySelector(".task-category").textContent = task.category;

    // -------- TASK ITEM EFFECTS ---------- //
    const taskItem = taskEl.querySelector(".task-item");

    // -------- Random Color Generator ---------- //

    const randomColor = function getRandomColor(code) {
      var letters = '0123456789ABCDEF';
      var color = "#";
      for (var i = 0; i < 2; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      color = color + code;
      return color;
    };

    const green = "FF99";
    taskItem.style.backgroundColor = randomColor(green);

    // -------- Show Description on Mouse Hover/Click  ---------- //

    const taskDescriptionEl = taskEl.querySelector(".task-description");
    const mouseoverHandler = () => {
      taskDescriptionEl.classList.toggle("task-description--active");
    };
    // taskItem.addEventListener("mouseenter", mouseoverHandler);
    // taskItem.addEventListener("mouseleave", mouseoverHandler);
    taskItem.addEventListener("click", mouseoverHandler, false);
     // -------- Show Description on Mouse Hover/Click ---------- //

    taskElementToDo.append(taskEl);
  }
}

fetchTasks();
