// ----- Estado inicial -----
let bubbles = JSON.parse(localStorage.getItem("bubblyTasks")) || [];
let huboTareas = JSON.parse(localStorage.getItem("huboTareas")) || false;
let timer = 0;
let timerRunning = false;
let timerInterval;
let pomodoroMinutes = 20;
const colors = ['color1', 'color2', 'color3', 'color4', 'color5'];

// ----- Elementos -----
const container = document.getElementById("bubbleContainer");
const plopSound = document.getElementById("plopSound");
const modal = document.getElementById("modal");
const timerDisplay = document.getElementById("timerDisplay");

// ----- Guardar estado -----
function saveBubbles() {
  localStorage.setItem("bubblyTasks", JSON.stringify(bubbles));
  localStorage.setItem("huboTareas", JSON.stringify(huboTareas));
}

// ----- Mostrar burbujas -----
function renderBubbles() {
  container.innerHTML = "";

  if (bubbles.length === 0 && huboTareas) {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }

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

  const indexExistente = bubbles.findIndex(t => t.toLowerCase() === value.toLowerCase());

  if (indexExistente !== -1) {
    if (confirm(`"${value}" ya existe. ¿Querés reemplazarla?`)) {
      bubbles[indexExistente] = value;
    } else {
      return;
    }
  } else {
    bubbles.push(value);
  }

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

// ----- Modal de tareas aleatorias -----
document.getElementById("snowflake-help").addEventListener("click", () => {
  document.getElementById("helper-modal").classList.remove("hidden");
});

function closeHelperModal() {
  document.getElementById("helper-modal").classList.add("hidden");
}

function highlightTaskRoulette() {
  closeHelperModal();

  const tasks = Array.from(document.querySelectorAll('.bubble'));
  if (tasks.length === 0) return;

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
    }
  }

  cycle();
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

