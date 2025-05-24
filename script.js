let bubbles = JSON.parse(localStorage.getItem("bubblyTasks")) || [];
let huboTareas = JSON.parse(localStorage.getItem("huboTareas")) || false; // Estado persistente
let timer = 0;
let timerRunning = false;
let timerInterval;
let pomodoroMinutes = 20;

const container = document.getElementById("bubbleContainer");
const plopSound = document.getElementById("plopSound");
const modal = document.getElementById("modal");

// Inicialización - Ocultar modal al cargar
modal.style.display = "none";

function saveBubbles() {
  localStorage.setItem("bubblyTasks", JSON.stringify(bubbles));
  localStorage.setItem("huboTareas", JSON.stringify(huboTareas));
}

function renderBubbles() {
  container.innerHTML = "";

  // Mostrar modal solo si hubo tareas y ahora no hay ninguna
  if (bubbles.length === 0 && huboTareas) {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }

  bubbles.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "bubble";
    div.textContent = task;
    div.draggable = true;
    div.onclick = () => {
      if (confirm(`¿Eliminar "${task}"?`)) {
        bubbles.splice(index, 1);
        huboTareas = bubbles.length > 0 || huboTareas; // Mantener estado si ya hubo tareas
        saveBubbles();
        renderBubbles();
        plopSound.play();
      }
    };
    container.appendChild(div);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (value && bubbles.length < 20) {
    bubbles.push(value);
    huboTareas = true; // Marcar que hubo al menos una tarea
    input.value = "";
    saveBubbles();
    renderBubbles();
    document.getElementById("taskInputArea").style.display = "none";
  }
}

function closeModal() {
  modal.style.display = "none";
  // Opcional: si quieres que no vuelva a aparecer hasta que complete nuevas tareas
  // huboTareas = false;
  // saveBubbles();
}

// ... (resto del código permanece igual)
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

function closeModal() {
  modal.style.display = "none";
  // Si quieres que no vuelva a aparecer aunque no haya tareas
  huboTareas = false;
  saveBubbles();
}

function toggleTaskInput() {
  const area = document.getElementById("taskInputArea");
  area.style.display = area.style.display === "none" ? "block" : "none";
}

// Gestos para cambiar tiempo
let lastY = null;
pomodoroClock.addEventListener("touchstart", (e) => {
  lastY = e.touches[0].clientY;
});

pomodoroClock.addEventListener("touchmove", (e) => {
  if (lastY === null) return;
  const currentY = e.touches[0].clientY;
  const diffY = lastY - currentY;

  if (Math.abs(diffY) > 20) {
    adjustTime(diffY > 0 ? 1 : -1);
    lastY = currentY;
  }
});

pomodoroClock.addEventListener("touchend", () => {
  lastY = null;
});

// Mouse scroll
pomodoroClock.addEventListener("wheel", (e) => {
  e.preventDefault();
  adjustTime(e.deltaY < 0 ? 1 : -1);
});
let mouseIsDown = false;
let lastMouseY = null;

// Eventos para mouse
pomodoroClock.addEventListener('mousedown', (e) => {
  mouseIsDown = true;
  lastMouseY = e.clientY;
  e.preventDefault(); // Previene selección de texto
});

pomodoroClock.addEventListener('mousemove', (e) => {
  if (!mouseIsDown || lastMouseY === null) return;
  const currentY = e.clientY;
  const diffY = lastMouseY - currentY;

  if (Math.abs(diffY) > 5) {
    adjustTime(diffY > 0 ? 1 : -1);
    lastMouseY = currentY;
  }
});

pomodoroClock.addEventListener('mouseup', () => {
  mouseIsDown = false;
  lastMouseY = null;
});

pomodoroClock.addEventListener('mouseleave', () => {
  mouseIsDown = false;
  lastMouseY = null;
});


// Click para iniciar/parar
pomodoroClock.addEventListener("click", () => {
  toggleTimer();
});

function adjustTime(delta) {
  if (timerRunning) return; // No permitir cambios durante la cuenta regresiva

  pomodoroMinutes = Math.min(60, Math.max(5, pomodoroMinutes + delta));
  timer = pomodoroMinutes * 60;
  updateTimerDisplay();
}

// Inicializar
modal.style.display = "none"; // Ocultar modal al inicio
renderBubbles();
timer = pomodoroMinutes * 60;
updateTimerDisplay();

// Drag & drop tareas
new Sortable(container, {
  animation: 150,
  onEnd: function (evt) {
    const item = bubbles.splice(evt.oldIndex, 1)[0];
    bubbles.splice(evt.newIndex, 0, item);
    saveBubbles();
    renderBubbles();
  }
});

