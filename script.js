// ----- Estado inicial -----
let bubbles = JSON.parse(localStorage.getItem("bubblyTasks")) || [];
let huboTareas = false;
let timer = 0;
let timerRunning = false;
let timerInterval;
let pomodoroMinutes = 20;
const colors = ['color1', 'color2', 'color3', 'color4', 'color5'];

// ----- Elementos -----
const container = document.getElementById("bubbleContainer");
const plopSound = document.getElementById("plopSound");
const modal = document.getElementById("modal");
const helperModal = document.getElementById("helper-modal");
const timerDisplay = document.getElementById("timerDisplay");

// ----- Guardar estado -----
function saveBubbles() {
  localStorage.setItem("bubblyTasks", JSON.stringify(bubbles));
}

// ----- Mostrar burbujas -----
function renderBubbles() {
  container.innerHTML = "";


  bubbles.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = `bubble ${colors[Math.floor(Math.random() * colors.length)]}`;
    div.textContent = task;
    div.draggable = true;

    const handleDelete = () => {
      if (confirm(`¿Eliminar "${task}"?`)) {
        bubbles.splice(index, 1);
        huboTareas = bubbles.length > 0 || huboTareas;
        saveBubbles();
        renderBubbles();
        plopSound.play();
      }
    };

    div.addEventListener("click", handleDelete);
    div.addEventListener("touchend", handleDelete);

    container.appendChild(div);
  });
}

// ----- Añadir tarea -----
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (!value || bubbles.length >= 20) return;

  bubbles.push(value);
  huboTareas = true;
  input.value = "";
  saveBubbles();
  renderBubbles();
  document.getElementById("taskInputArea").style.display = "none";
}


// ----- Input por Enter -----
document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ----- Toggle input -----
function toggleTaskInput() {
  const area = document.getElementById("taskInputArea");
  const input = document.getElementById("taskInput");

  area.style.display = area.style.display === "none" ? "block" : "none";
  if (area.style.display === "block") input.focus();
}

// ----- Pomodoro -----
function adjustTime(delta) {
  if (timerRunning) return;

  pomodoroMinutes = Math.min(60, Math.max(5, pomodoroMinutes + delta));
  timer = pomodoroMinutes * 60;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerDisplay.textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  } else {
    if (timer === 0) timer = pomodoroMinutes * 60;

    timerInterval = setInterval(() => {
      if (timer > 0) {
        timer--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        alert("¡Pomodoro terminado!");
        timerRunning = false;
        timer = pomodoroMinutes * 60;
        updateTimerDisplay();
      }
    }, 1000);

    timerRunning = true;
  }
}

// Flechas ↑↓
document.getElementById("arrow-up").addEventListener("click", () => adjustTime(1));
document.getElementById("arrow-down").addEventListener("click", () => adjustTime(-1));
document.getElementById("pomodoroClock").addEventListener("click", toggleTimer);

// Event listener para el copo de nieve
document.getElementById("snowflake-help").addEventListener("click", function () {
  helperModal.classList.remove("hidden");
});

// Función para cerrar el modal de finalización
function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.classList.add("hidden");
}

// Función para cerrar el modal de ayuda
function closeHelperModal() {
  const helperModal = document.getElementById("helper-modal");
  if (helperModal) helperModal.classList.add("hidden");
}

// Función mejorada para highlightTaskRoulette
function highlightTaskRoulette() {
  const tasks = Array.from(document.querySelectorAll('.bubble'));
  if (tasks.length === 0) {
    alert("¡No hay tareas para elegir!");
    closeHelperModal(); // 👉 cierra el modal si no hay tareas
    return;
  }

  tasks.forEach(t => t.classList.remove('highlighted'));

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
      // Al finalizar, selecciona la tarea resaltada
      const selectedTask = document.querySelector('.highlighted');
      if (selectedTask) {
        selectedTask.classList.add('selected-task');
        setTimeout(() => {
          selectedTask.classList.remove('selected-task');
        }, 2000);
      }
    }
  }

  cycle();
  closeHelperModal(); // Cierra el modal después de iniciar la selección
}


// ----- Inicialización -----
modal.style.display = "none";
renderBubbles();
timer = pomodoroMinutes * 60;
updateTimerDisplay();

new Sortable(container, {
  animation: 150,
  onEnd: function (evt) {
    const item = bubbles.splice(evt.oldIndex, 1)[0];
    bubbles.splice(evt.newIndex, 0, item);
    saveBubbles();
    renderBubbles();
  }
});

// Soporte para cerrar el modal también en celular
document.querySelector(".close-btn").addEventListener("touchend", (e) => {
  e.preventDefault(); // Evita que el toque genere doble evento
  closeModal();
});

document.addEventListener("DOMContentLoaded", function () {
  renderBubbles();
  timer = pomodoroMinutes * 60;
  updateTimerDisplay();

  new Sortable(container, {
    animation: 150,
    onEnd: function (evt) {
      const item = bubbles.splice(evt.oldIndex, 1)[0];
      bubbles.splice(evt.newIndex, 0, item);
      saveBubbles();
      renderBubbles();
    }
  });

  document.querySelector(".close-btn").addEventListener("touchend", (e) => {
    e.preventDefault();
    closeModal();
  });
});

