const API_URL = "http://localhost:5000/api";

const apiClient = {
  async request(endpoint, { method = "GET", body = null, ...customConfig } = {}) {
    const headers = {
      "Content-Type": "application/json",
    };

    const config = {
      method,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "An error occurred with the request");
    }

    return data;
  },

  get(endpoint, customConfig = {}) {
    return this.request(endpoint, { ...customConfig, method: "GET" });
  },
  post(endpoint, body, customConfig = {}) {
    return this.request(endpoint, { ...customConfig, method: "POST", body });
  },
  put(endpoint, body, customConfig = {}) {
    return this.request(endpoint, { ...customConfig, method: "PUT", body });
  },
  patch(endpoint, body, customConfig = {}) {
    return this.request(endpoint, { ...customConfig, method: "PATCH", body });
  },
  delete(endpoint, customConfig = {}) {
    return this.request(endpoint, { ...customConfig, method: "DELETE" });
  },
};

export default apiClient;
