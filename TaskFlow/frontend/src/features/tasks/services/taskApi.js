const API_URL =
  "http://localhost:5000/api";

async function parseResponse(
  response,
  defaultMessage
) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        defaultMessage
    );
  }

  return data;
}

export async function getBoard(
  boardId
) {
  const response = await fetch(
    `${API_URL}/boards/${boardId}`
  );

  return parseResponse(
    response,
    "Failed to load board."
  );
}

export async function createTask(
  taskData
) {
  const response = await fetch(
    `${API_URL}/tasks`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        taskData
      ),
    }
  );

  return parseResponse(
    response,
    "Unable to create task."
  );
}

export async function updateTask(
  taskId,
  taskData
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        taskData
      ),
    }
  );

  return parseResponse(
    response,
    "Unable to update task."
  );
}

export async function deleteTask(
  taskId
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );

  return parseResponse(
    response,
    "Unable to delete task."
  );
}

export async function moveTask(
  taskId,
  columnId
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        columnId,
      }),
    }
  );

  return parseResponse(
    response,
    "Unable to move task."
  );
}