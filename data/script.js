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

  const inputDate = document.createElement("input");
  inputDate.type = "date";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Добавить";

  form.append(inputText, inputDate, addBtn);
  container.appendChild(form);

  const filterSelect = document.createElement("select");
  ["Все", "Выполненные", "Невыполненные"].forEach(optText => {
    const option = document.createElement("option");
    option.value = optText;
    option.textContent = optText;
    filterSelect.appendChild(option);
  });
  container.appendChild(filterSelect);

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
    span.textContent = `${task.text} (${task.date || "без даты"})`;

    const controls = document.createElement("div");
    controls.className = "controls";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔";
    doneBtn.addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Изменить задачу:", task.text);
      const newDate = prompt("Введите новую дату:", task.date);
      if (newText !== null) task.text = newText;
      if (newDate !== null) task.date = newDate;
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

    controls.append(doneBtn, editBtn, deleteBtn);
    div.append(span, controls);

    return div;
  }

  function renderTasks() {
    list.textContent = "";
    const filterValue = filterSelect.value;

    tasks
      .filter(task => {
        if (filterValue === "Выполненные") return task.done;
        if (filterValue === "Невыполненные") return !task.done;
        return true;
      })
      .forEach(task => list.appendChild(createTaskElement(task)));
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = inputText.value.trim();
    const date = inputDate.value;
    if (!text) return;

    tasks.push({
      id: Date.now(),
      text,
      date,
      done: false
    });

    inputText.value = "";
    inputDate.value = "";
    saveTasks();
    renderTasks();
  });

  filterSelect.addEventListener("change", renderTasks);

  renderTasks();
});