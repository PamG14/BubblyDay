// ----- Estado centralizado ----- op2
const appState = {
  bubbles: JSON.parse(localStorage.getItem("bubblyTasks")) || [],
  huboTareas: false,
  touchUsed: false,
  addBtnTouchUsed: false,
  timer: 0,
  timerRunning: false,
  timerInterval: null,
  pomodoroMinutes: 20,
  colors: ['color1', 'color2', 'color3', 'color4', 'color5']
};

// Migración si bubbles es array de strings
if (appState.bubbles.length > 0 && typeof appState.bubbles[0] === "string") {
  appState.bubbles = appState.bubbles.map(text => ({
    text,
    color: appState.colors[Math.floor(Math.random() * appState.colors.length)]
  }));
  saveBubbles();
}

// ----- Elementos -----
const container = document.getElementById("bubbleContainer");
const plopSound = document.getElementById("plopSound");
const modal = document.getElementById("modal");
const helperModal = document.getElementById("helper-modal");
const timerDisplay = document.getElementById("timerDisplay");

// ----- Guardar estado -----
function saveBubbles() {
  localStorage.setItem("bubblyTasks", JSON.stringify(appState.bubbles));
}

// ----- Evento inteligente (click o touch) -----
function addSmartListener(element, handler) {
  let usedTouch = false;
  element.addEventListener("touchend", e => {
    usedTouch = true;
    e.preventDefault();
    handler(e);
    setTimeout(() => usedTouch = false, 300);
  });
  element.addEventListener("click", e => {
    if (usedTouch) return;
    handler(e);
  });
}

// ----- Mostrar burbujas -----
function renderBubbles() {
  container.innerHTML = "";

  appState.bubbles.forEach((bubbleObj, index) => {
    const div = document.createElement("div");
    div.className = `bubble ${bubbleObj.color}`;
    div.textContent = bubbleObj.text;
    div.draggable = true;

    function handleBubbleClick() {
      if (div.classList.contains("winner")) {
        div.classList.remove("winner");
        return;
      }

      if (confirm(`¿Eliminar "${bubbleObj.text}"?`)) {
        appState.bubbles.splice(index, 1);
        appState.huboTareas = appState.bubbles.length > 0 || appState.huboTareas;
        saveBubbles();
        renderBubbles();
        plopSound.play();

        if (appState.bubbles.length === 0 && appState.huboTareas) {
          showModal();
          appState.huboTareas = false;
        }
      }
    }

    addSmartListener(div, handleBubbleClick);
    container.appendChild(div);
  });
}
function showModal() {
  modal.classList.remove("hidden");
  modal.style.display = "block";

  const closeBtn = modal.querySelector(".close-btn");
  if (closeBtn) {
    addSmartListener(closeBtn, closeModal);
  }
}

//function showModal() {
//modal.classList.remove("hidden");
//  modal.style.display = "block";
//}

// ----- Añadir tarea -----
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (!value || appState.bubbles.length >= 20) return;

  appState.bubbles.push({
    text: value,
    color: appState.colors[Math.floor(Math.random() * appState.colors.length)]
  });

  appState.huboTareas = true;
  input.value = "";
  saveBubbles();
  renderBubbles();
  document.getElementById("taskInputArea").style.display = "none";
}

// ----- Input por Enter -----
document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ----- Botón de añadir -----
addSmartListener(document.getElementById("addBtn"), addTask);

// ----- Toggle input -----
function toggleTaskInput() {
  const area = document.getElementById("taskInputArea");
  const input = document.getElementById("taskInput");

  area.style.display = area.style.display === "none" ? "block" : "none";

  if (area.style.display === "block") {
    input.focus();
    input.setAttribute("inputmode", "text");
  }
}

// ----- Pomodoro -----
function adjustTime(delta) {
  if (appState.timerRunning) return;

  appState.pomodoroMinutes = Math.min(60, Math.max(5, appState.pomodoroMinutes + delta));
  appState.timer = appState.pomodoroMinutes * 60;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(appState.timer / 60);
  const seconds = appState.timer % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleTimer() {
  if (appState.timerRunning) {
    clearInterval(appState.timerInterval);
    appState.timerRunning = false;
  } else {
    if (appState.timer === 0) appState.timer = appState.pomodoroMinutes * 60;

    appState.timerInterval = setInterval(() => {
      if (appState.timer > 0) {
        appState.timer--;
        updateTimerDisplay();
      } else {
        clearInterval(appState.timerInterval);
        alert("¡Pomodoro terminado!");
        appState.timerRunning = false;
        appState.timer = appState.pomodoroMinutes * 60;
        updateTimerDisplay();
      }
    }, 1000);

    appState.timerRunning = true;
  }
}

// ----- Eventos Pomodoro y ayuda -----
document.getElementById("arrow-up").addEventListener("click", () => adjustTime(1));
document.getElementById("arrow-down").addEventListener("click", () => adjustTime(-1));
document.getElementById("pomodoroClock").addEventListener("click", toggleTimer);
document.getElementById("snowflake-help").addEventListener("click", () => {
  helperModal.classList.remove("hidden");
});

// ----- Cerrar modales -----
function closeModal() {
  modal.classList.add("hidden");
}

function closeHelperModal() {
  helperModal.classList.add("hidden");
}

// ----- Sorteo de tarea -----
function highlightTaskRoulette() {
  const tasks = Array.from(document.querySelectorAll('.bubble'));
  if (tasks.length === 0) {
    alert("¡No hay tareas para elegir!");
    closeHelperModal();
    return;
  }

  tasks.forEach(t => t.classList.remove('highlighted', 'winner'));

  let index = 0;
  let totalCycles = 20 + Math.floor(Math.random() * 10);
  let delay = 80;

  function cycle() {
    tasks.forEach(t => t.classList.remove('highlighted'));
    tasks[index % tasks.length].classList.add('highlighted');

    index++;
    totalCycles--;

    if (totalCycles > 0) {
      setTimeout(cycle, delay);
      delay += 20;
    } else {
      const selectedTask = document.querySelector('.highlighted');
      if (selectedTask) {
        selectedTask.classList.remove('highlighted');
        selectedTask.classList.add('winner');
      }
    }
  }

  cycle();
  closeHelperModal();
}

// ----- Inicialización -----
modal.style.display = "none";

document.addEventListener("DOMContentLoaded", function () {
  renderBubbles();
  appState.timer = appState.pomodoroMinutes * 60;
  updateTimerDisplay();

  new Sortable(container, {
    animation: 150,
    onEnd: function (evt) {
      const item = appState.bubbles.splice(evt.oldIndex, 1)[0];
      appState.bubbles.splice(evt.newIndex, 0, item);
      saveBubbles();
      renderBubbles();
    }
  });

//  addSmartListener(document.querySelector(".close-btn"), closeModal);
//});
