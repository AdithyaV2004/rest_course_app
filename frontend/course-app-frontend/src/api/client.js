const BASE_URL = "http://localhost:3000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.token = token;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error("Could not reach the server. Is the backend running on port 3000?");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const api = {
  signup: (payload) => request("/users/signup", { method: "POST", body: payload }),
  signin: (payload) => request("/users/signin", { method: "POST", body: payload }),

  getProfile: (token) => request("/me", { token }),

  getCourses: (token) => request("/users/courses", { token }),
  purchaseCourse: (token, courseId) =>
    request(`/users/courses/${courseId}/purchases`, { method: "POST", token }),
  getPurchased: (token) => request("/users/purchased", { token }),

  addMoney: (token, amount) =>
    request("/wallet/add", { method: "POST", body: { amount }, token }),

  adminGetCourses: (token) => request("/admin/courses", { token }),
  adminCreateCourse: (token, payload) =>
    request("/admin/courses", { method: "POST", body: payload, token }),
  adminUpdateCourse: (token, courseId, payload) =>
    request(`/admin/courses/${courseId}`, { method: "PUT", body: payload, token }),
};
