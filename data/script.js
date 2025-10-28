document.addEventListener("DOMContentLoaded", () => {
  const app = document.body;

  const title = document.createElement("h1");
  title.textContent = "GrowDo";
  app.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.innerHTML = 'Не забывай поливать <span class="flowers">цветочки</span>';
  app.appendChild(subtitle);

  const flowersText = subtitle.querySelector(".flowers");
  const letters = flowersText.textContent.split("");
  flowersText.textContent = "";
  letters.forEach(ch => {
    const span = document.createElement("span");
    span.textContent = ch;
    flowersText.appendChild(span);
  });

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

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Поиск по названию...";
  container.appendChild(searchInput);

  const sortBtn = document.createElement("button");
  sortBtn.textContent = "Сортировать по дате";
  container.appendChild(sortBtn);

  const list = document.createElement("div");
  list.className = "todo-list";
  container.appendChild(list);

  const calendarContainer = document.createElement("div");
  calendarContainer.className = "calendar";
  container.appendChild(calendarContainer);

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderCalendar() {
  calendarContainer.textContent = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const header = document.createElement("h2");
  header.textContent = now.toLocaleString("ru", { month: "long", year: "numeric" });
  calendarContainer.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  calendarContainer.appendChild(grid);

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const label = document.createElement("div");
    label.className = "day-number";
    label.textContent = day;
    cell.appendChild(label);

    const dayTasks = tasks.filter(t => {
      if (!t.date) return false;
      const tDate = new Date(t.date);
      return (
        tDate.getFullYear() === year &&
        tDate.getMonth() === month &&
        tDate.getDate() === day
      );
    });

    if (dayTasks.length > 0) {
      const list = document.createElement("ul");
      list.className = "calendar-task-list";

      dayTasks.forEach(t => {
        const item = document.createElement("li");
        item.textContent = t.text;
        if (t.done) item.classList.add("done");
        list.appendChild(item);
      });

      cell.appendChild(list);
    }

    grid.appendChild(cell);
  }
}

  function createTaskElement(task) {
    const li = document.createElement("div");
    li.className = "todo-item";
    if (task.done) li.classList.add("done");
    li.draggable = true;

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
    li.append(span, controls);

    li.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", task.id);
    });

    li.addEventListener("dragover", e => e.preventDefault());

    li.addEventListener("drop", e => {
      const draggedId = e.dataTransfer.getData("text/plain");
      const fromIndex = tasks.findIndex(t => t.id == draggedId);
      const toIndex = tasks.findIndex(t => t.id == task.id);
      const [moved] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, moved);
      saveTasks();
      renderTasks();
    });

    return li;
  }

  function renderTasks() {
    list.textContent = "";
    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    tasks
      .filter(task => {
        if (filterValue === "Выполненные") return task.done;
        if (filterValue === "Невыполненные") return !task.done;
        return true;
      })
      .filter(task => task.text.toLowerCase().includes(searchValue))
      .forEach(task => list.appendChild(createTaskElement(task)));

    renderCalendar();
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

  sortBtn.addEventListener("click", e => {
    e.preventDefault();
    tasks.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    saveTasks();
    renderTasks();
  });

  filterSelect.addEventListener("change", renderTasks);
  searchInput.addEventListener("input", renderTasks);

  renderTasks();
});