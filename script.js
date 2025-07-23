// ----- Estado inicial -----
let bubbles = JSON.parse(localStorage.getItem("bubblyTasks")) || [];
// Tras cargar bubbles...
if (bubbles.length > 0 && typeof bubbles[0] === "string") {
  // Migrar al nuevo formato
  bubbles = bubbles.map(text => ({
    text,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  saveBubbles();
}
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
  // Declarar la variable fuera del bucle para controlar el touch
  let touchUsed = false;

  bubbles.forEach((bubbleObj, index) => {
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
        bubbles.splice(index, 1);
        huboTareas = bubbles.length > 0 || huboTareas;
        saveBubbles();
        renderBubbles();
        plopSound.play();

        if (bubbles.length === 0 && huboTareas) {
          showModal();
          huboTareas = false;
        }
      }
    }

    // TOUCHEND: solo ejecuta y previene doble click
    div.addEventListener("touchend", function(e) {
      touchUsed = true;
      e.preventDefault();
      handleBubbleClick();
    });

    // CLICK: solo ejecuta si no hubo touch
    div.addEventListener("click", function(e) {
      if (touchUsed) {
        touchUsed = false;
        return;
      }
      handleBubbleClick();
    });

    container.appendChild(div);
  });
}

function showModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.style.display = "block"; // si estás usando display para mostrarlo
}


// ----- Añadir tarea -----
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (!value || bubbles.length >= 20) return;

  bubbles.push({ text: value, color: colors[Math.floor(Math.random() * colors.length)] });
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

 let addBtnTouchUsed = false;
 document.getElementById("addBtn").addEventListener("touchend", function(e) {
   addBtnTouchUsed = true;
   e.preventDefault();
   addTask();
   setTimeout(() => { addBtnTouchUsed = false; }, 300);
 });
 
 document.getElementById("addBtn").addEventListener("click", function(e) {
   if (addBtnTouchUsed) return;
  addTask();
 });
// ----- Toggle input -----
function toggleTaskInput() {
  const area = document.getElementById("taskInputArea");
  const input = document.getElementById("taskInput");

  area.style.display = area.style.display === "none" ? "block" : "none";
  
  if (area.style.display === "block") {
    input.focus();
    input.setAttribute("inputmode", "text"); // Esto ayuda en móviles a activar bien el teclado
  }
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
    closeHelperModal(); // Cierra el modal si no hay tareas
    return;
  }

  // Elimina clases previas de resaltado
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
      // Fin del sorteo: se marca la burbuja ganadora con la clase "winner"
      const selectedTask = document.querySelector('.highlighted');
      if (selectedTask) {
        selectedTask.classList.remove('highlighted'); // Quita el resaltado temporal
        selectedTask.classList.add('winner');
        // Opcional: luego de cierto tiempo puedes quitar la clase si lo deseas
       // setTimeout(() => {
       //   selectedTask.classList.remove('winner');
      //   }, 2000);
      }
    }
  }

  cycle();
  closeHelperModal(); // Cierra el modal de ayuda una vez iniciado el sorteo
}


// ----- Inicialización -----
modal.style.display = "none";

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

