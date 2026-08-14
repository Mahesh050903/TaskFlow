import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./TaskModal.css";

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function TaskModal({
  mode,
  task,
  columns,
  initialColumnId,
  onClose,
  onCreate,
  onUpdate,
}) {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    columnId: "",
    priority: "Medium",
  });

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        columnId: String(task.column_id ?? ""),
        priority: task.priority || "Medium",
      });
      setFormError("");
      return;
    }

    const defaultColumn =
      columns?.find((c) => Number(c.id) === Number(initialColumnId)) ||
      columns?.[0];

    setFormData({
      title: "",
      description: "",
      columnId: defaultColumn ? String(defaultColumn.id) : "",
      priority: "Medium",
    });
    setFormError("");
  }, [isEdit, task, columns, initialColumnId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [saving, onClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setFormError("Task title is required.");
      return;
    }

    if (!isEdit && !formData.columnId) {
      setFormError("Please select a column.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (isEdit) {
        await onUpdate(task.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
        });
      } else {
        await onCreate({
          columnId: Number(formData.columnId),
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      setFormError(error.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  };

  const modal = (
    <div
      className="task-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        className="task-modal"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="task-modal-header">
          <div className="task-modal-heading">
            <div className="task-modal-icon">
              {isEdit ? "✎" : "+"}
            </div>
            <div>
              <h2>{isEdit ? "Edit Task" : "Create Task"}</h2>
              <p>
                {isEdit
                  ? "Update the task details."
                  : "Add a new task to your board."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="task-modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal-form">
          <div className="task-form-group">
            <label htmlFor="title">
              Task title <span className="required">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              autoFocus
              disabled={saving}
            />
          </div>

          <div className="task-form-group">
            <label htmlFor="description">
              Description <span className="optional">(Optional)</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows="4"
              disabled={saving}
            />
          </div>

          {!isEdit && (
            <div className="task-form-group">
              <label htmlFor="columnId">
                Column <span className="required">*</span>
              </label>

              <select
                id="columnId"
                name="columnId"
                value={formData.columnId}
                onChange={handleChange}
                disabled={saving}
              >
                {columns?.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="task-form-group">
            <label htmlFor="priority">Priority</label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {formError && (
            <div className="task-form-error">
              <span className="error-icon">!</span>
              <span>{formError}</span>
            </div>
          )}

          <div className="task-modal-footer">
            <button
              type="button"
              className="task-button task-button-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="task-button task-button-primary"
              disabled={saving}
            >
              {saving && <span className="button-spinner" />}
              <span>
                {saving
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Task"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default TaskModal;