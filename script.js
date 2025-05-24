let bubbles = JSON.parse(localStorage.getItem("bubblyTasks")) || [];

let timer = 0;
let timerRunning = false;
let timerInterval;
let pomodoroMinutes = 25;

const container = document.getElementById("bubbleContainer");
const plopSound = document.getElementById("plopSound");

function saveBubbles() {
  localStorage.setItem("bubblyTasks", JSON.stringify(bubbles));
}

function renderBubbles() {
  container.innerHTML = "";
  if (bubbles.length === 0) {
    document.getElementById("modal").style.display = "flex";
  }

  bubbles.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "bubble";
    div.textContent = task;
    div.draggable = true;
    div.onclick = () => {
      if (confirm(`¿Eliminar "${task}"?`)) {
        bubbles.splice(index, 1);
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
    input.value = "";
    saveBubbles();
    renderBubbles();
    document.getElementById("taskInputArea").style.display = "none";
  }
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
  } else {
    if (timer === 0) {
      timer = pomodoroMinutes * 60;
    }
    timerInterval = setInterval(() => {
      if (timer > 0) {
        timer--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        alert("¡Pomodoro terminado!");
        timer = pomodoroMinutes * 60;
        updateTimerDisplay();
      }
    }, 1000);
  }
  timerRunning = !timerRunning;
}

function updateTimerDisplay() {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  document.getElementById("timerWheelDisplay").textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timer = pomodoroMinutes * 60;
  updateTimerDisplay();
}

function toggleTaskInput() {
  const area = document.getElementById("taskInputArea");
  area.style.display = area.style.display === "none" ? "block" : "none";
}

function toggleWheel() {
  const wheel = document.getElementById("wheelContainer");
  wheel.style.display = wheel.style.display === "none" ? "block" : "none";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function generateWheel() {
  const wheel = document.getElementById("minuteWheel");
  for (let i = 5; i <= 90; i += 5) {
    const div = document.createElement("div");
    div.textContent = i + " min";
    div.dataset.minutes = i;
    div.className = "wheel-item";
    wheel.appendChild(div);
  }

  // Posicionar en el valor actual
  const pos = (pomodoroMinutes / 5 - 1) * 40;
  wheel.scrollTop = pos;

  // Listener optimizado con debounce
  let scrollTimeout;
  wheel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleWheelScroll, 100);
  });
}

function handleWheelScroll() {
  const wheel = document.getElementById("minuteWheel");
  const items = wheel.querySelectorAll(".wheel-item");
  const scrollPosition = wheel.scrollTop;
  const index = Math.round(scrollPosition / 40);
  const selected = items[index];
  if (selected) {
    pomodoroMinutes = parseInt(selected.dataset.minutes);
    timer = pomodoroMinutes * 60;
    updateTimerDisplay();
  }
}

// Inicializar al cargar
renderBubbles();
generateWheel();
updateTimerDisplay();

// Drag & drop ordenable
new Sortable(container, {
  animation: 150,
  onEnd: function (evt) {
    const item = bubbles.splice(evt.oldIndex, 1)[0];
    bubbles.splice(evt.newIndex, 0, item);
    saveBubbles();
    renderBubbles();
  }
});
