import { useEffect, useMemo, useState } from "react";
import {
  FaBolt,
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaClock,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

const STORAGE_KEY = "smart-priority-planner.tasks";

const today = () => new Date().toISOString().slice(0, 10);

const loadTasks = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const daysUntil = (date) => {
  if (!date) return 999;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target - start) / 86400000);
};

const priorityScore = (task) => {
  const urgency = Math.max(0, 10 - Math.max(0, daysUntil(task.dueDate)));
  const impact = Number(task.impact || 3) * 4;
  const effort = Math.max(1, Number(task.effort || 3));
  const overdueBoost = daysUntil(task.dueDate) < 0 ? 12 : 0;
  return Math.round(impact + urgency * 2 + overdueBoost - effort);
};

const priorityLabel = (score) => {
  if (score >= 30) return "Critical";
  if (score >= 20) return "High";
  if (score >= 10) return "Medium";
  return "Low";
};

const statusLabel = (task) => {
  if (task.completed) return "Completed";
  const diff = daysUntil(task.dueDate);
  if (diff < 0) return "Overdue";
  if (diff <= 1 && priorityScore(task) >= 20) return "At risk";
  return "On track";
};

const prettyDate = (date) => {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [view, setView] = useState("today");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "General",
    dueDate: today(),
    effort: 3,
    impact: 3,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const enriched = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        score: priorityScore(task),
        priority: priorityLabel(priorityScore(task)),
        health: statusLabel(task),
      })),
    [tasks]
  );

  const categories = useMemo(
    () => ["All", ...new Set(tasks.map((task) => task.category).filter(Boolean))],
    [tasks]
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return enriched
      .filter((task) => {
        if (category !== "All" && task.category !== category) return false;
        if (query && !`${task.title} ${task.category}`.toLowerCase().includes(query)) return false;

        const diff = daysUntil(task.dueDate);
        if (view === "today") return !task.completed && diff <= 0;
        if (view === "upcoming") return !task.completed && diff > 0 && diff <= 14;
        if (view === "backlog") return !task.completed && (!task.dueDate || diff > 14);
        if (view === "completed") return task.completed;
        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [enriched, search, category, view]);

  const nextTask = useMemo(
    () =>
      enriched
        .filter((task) => !task.completed)
        .sort((a, b) => b.score - a.score)[0],
    [enriched]
  );

  const openCount = enriched.filter((task) => !task.completed).length;
  const overdueCount = enriched.filter((task) => task.health === "Overdue").length;
  const completedCount = enriched.filter((task) => task.completed).length;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const addTask = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        category: form.category.trim() || "General",
        dueDate: form.dueDate,
        effort: Number(form.effort),
        impact: Number(form.impact),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    setForm({
      title: "",
      category: "General",
      dueDate: today(),
      effort: 3,
      impact: 3,
    });
    setShowForm(false);
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <main className="planner-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><FaBolt /></div>
          <div>
            <strong>Priority Planner</strong>
            <span>Focus on the work that matters most</span>
          </div>
        </div>

        <button className="primary-button" onClick={() => setShowForm(true)}>
          <FaPlus /> Add task
        </button>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">SMART PRIORITIZATION</span>
          <h1>Know what to work on <em>next.</em></h1>
          <p>
            Score tasks using urgency, impact, effort, and due dates, then surface the
            highest-value work before it becomes a fire drill.
          </p>
        </div>

        <div className="focus-card">
          <span className="section-label">RECOMMENDED NEXT</span>
          {nextTask ? (
            <>
              <h2>{nextTask.title}</h2>
              <div className="focus-meta">
                <span>{nextTask.category}</span>
                <span>Due {prettyDate(nextTask.dueDate)}</span>
                <span>Score {nextTask.score}</span>
              </div>
              <p>
                This is currently your highest-priority open task based on impact,
                urgency, effort, and deadline risk.
              </p>
            </>
          ) : (
            <>
              <h2>You’re all caught up.</h2>
              <p>Add a task and the planner will recommend what deserves attention first.</p>
            </>
          )}
        </div>
      </section>

      <section className="metrics">
        <div className="metric-card">
          <span>Open tasks</span>
          <strong>{openCount}</strong>
        </div>
        <div className="metric-card">
          <span>Overdue</span>
          <strong>{overdueCount}</strong>
        </div>
        <div className="metric-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
        <div className="metric-card">
          <span>Completion rate</span>
          <strong>{completionRate}%</strong>
        </div>
      </section>

      <section className="planner-card">
        <div className="planner-header">
          <div>
            <span className="section-label">TASK BOARD</span>
            <h2>Your priorities</h2>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <FaSearch />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
              />
            </label>

            <label className="filter-box">
              <FaFilter />
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <FaChevronDown />
            </label>
          </div>
        </div>

        <div className="tabs">
          {["today", "upcoming", "backlog", "completed", "all"].map((item) => (
            <button
              className={view === item ? "active" : ""}
              key={item}
              onClick={() => setView(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <FaCheck />
              <h3>No tasks in this view</h3>
              <p>Add something new or switch to another view.</p>
            </div>
          ) : (
            filtered.map((task) => (
              <article className={task.completed ? "task-row complete" : "task-row"} key={task.id}>
                <button
                  className="check-control"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.completed && <FaCheck />}
                </button>

                <div className="task-main">
                  <div className="task-title-row">
                    <h3>{task.title}</h3>
                    <span className={`priority priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="task-meta">
                    <span>{task.category}</span>
                    <span><FaCalendarAlt /> {prettyDate(task.dueDate)}</span>
                    <span><FaClock /> Effort {task.effort}/5</span>
                    <span>Impact {task.impact}/5</span>
                    <span className={`health health-${task.health.toLowerCase().replace(" ", "-")}`}>
                      {task.health}
                    </span>
                  </div>
                </div>

                <div className="score-box">
                  <small>Priority score</small>
                  <strong>{task.score}</strong>
                </div>

                <button className="delete-control" onClick={() => deleteTask(task.id)}>
                  <FaTrash />
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}>
          <form className="task-form" onSubmit={addTask} onMouseDown={(event) => event.stopPropagation()}>
            <div className="form-heading">
              <div>
                <span className="section-label">NEW TASK</span>
                <h2>Add something that matters</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)}>×</button>
            </div>

            <label>
              Task
              <input
                autoFocus
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="What needs to get done?"
              />
            </label>

            <div className="form-grid">
              <label>
                Category
                <input
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder="Work, Personal, School..."
                />
              </label>

              <label>
                Due date
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                />
              </label>

              <label>
                Impact
                <select
                  value={form.impact}
                  onChange={(event) => setForm({ ...form, impact: event.target.value })}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option value={value} key={value}>{value} / 5</option>
                  ))}
                </select>
              </label>

              <label>
                Effort
                <select
                  value={form.effort}
                  onChange={(event) => setForm({ ...form, effort: event.target.value })}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option value={value} key={value}>{value} / 5</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="score-preview">
              <FaBolt />
              <div>
                <span>Estimated priority</span>
                <strong>
                  {priorityLabel(priorityScore({
                    dueDate: form.dueDate,
                    effort: form.effort,
                    impact: form.impact,
                  }))}
                </strong>
              </div>
            </div>

            <button className="primary-button form-submit" type="submit">
              <FaPlus /> Add to planner
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default App;
