document.addEventListener("DOMContentLoaded", () => {
  const app = document.body;

  const title = document.createElement("h1");
  title.textContent = "GrowDo";
  app.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.textContent = "Не забывай поливать цветочки";
  app.appendChild(subtitle);

  const container = document.createElement("div");
  container.className = "todo-container";
  app.appendChild(container);

  const form = document.createElement("form");
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Введите задачу...";
  inputText.required = true;

  const addBtn = document.createElement("button");
  addBtn.textContent = "Добавить";

  form.append(inputText, addBtn);
  container.appendChild(form);

  const list = document.createElement("div");
  list.className = "todo-list";
  container.appendChild(list);

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function createTaskElement(task) {
    const div = document.createElement("div");
    div.className = "todo-item";
    if (task.done) div.classList.add("done");

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = task.text;

    const controls = document.createElement("div");
    controls.className = "controls";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔";
    doneBtn.addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks();
    });

    controls.append(doneBtn, deleteBtn);
    div.append(span, controls);

    return div;
  }

  function renderTasks() {
    list.textContent = "";
    tasks.forEach(task => list.appendChild(createTaskElement(task)));
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = inputText.value.trim();
    if (!text) return;

    tasks.push({
      id: Date.now(),
      text,
      done: false
    });

    inputText.value = "";
    saveTasks();
    renderTasks();
  });

  renderTasks();
});