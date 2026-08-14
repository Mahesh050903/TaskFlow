import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Select } from "../../../components/ui/select";
import { DialogFooter } from "../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { AlertCircle } from "@/components/ui/icons";

function TaskForm({ mode, task, columns, onCancel, onSubmit, saving }) {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    columnId: "",
    priority: "Medium",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isEdit && task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        columnId: String(task.column_id),
        priority: task.priority || "Medium",
      });
      return;
    }

    const firstColumn = columns?.[0];
    setFormData({
      title: "",
      description: "",
      columnId: firstColumn ? String(firstColumn.id) : "",
      priority: "Medium",
    });
    setFormError("");
  }, [isEdit, task, columns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!isEdit && !formData.columnId) {
      setFormError("Column is required");
      return;
    }
    onSubmit(formData, setFormError);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
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

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={4}
          disabled={saving}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="columnId">Column *</Label>
            <Select
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
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
        </div>
      </div>

      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="pt-4">
        <Button type="button" onClick={onCancel} variant="outline" disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default TaskForm;
