import { authClient } from "../auth-client";

const baseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Helper with AbortController for fast timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 6000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const getAllTasks = async (filters = {}) => {
  const {
    search = "",
    category = "",
    minBudget = "",
    maxBudget = "",
    page = 1,
    limit = 6,
    status = "open",
  } = filters;

  const queryParams = new URLSearchParams({
    status,
    search,
    category,
    minBudget,
    maxBudget,
    page,
    limit,
  }).toString();

  try {
    const res = await fetchWithTimeout(`${baseUrl}/api/tasks?${queryParams}`, {
      next: { revalidate: 5 },
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, tasks: [] };
  }
};

export const getMyTasks = async (clientId) => {
  try {
    const { data: tokenData } = await authClient.token();

    const res = await fetchWithTimeout(`${baseUrl}/api/my-tasks?clientId=${clientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenData?.token}`,
      },
      next: { revalidate: 5 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch my tasks: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getMyTasks API call:", error);
    return { success: false, tasks: [], message: "Failed to fetch tasks" };
  }
};

export const getTaskDetails = async (taskId) => {
  try {
    const res = await fetchWithTimeout(`${baseUrl}/api/tasks/${taskId}`, {
      next: { revalidate: 5 },
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching task details:", error);
    return { success: false, task: null };
  }
};

export const getAllFreelancers = async (filters = {}) => {
  const {
    search = "",
    minRate = "",
    maxRate = "",
    page = 1,
    limit = 12,
  } = filters;

  const queryParams = new URLSearchParams({
    search,
    minRate,
    maxRate,
    page,
    limit,
  }).toString();

  try {
    const res = await fetchWithTimeout(`${baseUrl}/api/freelancers?${queryParams}`, {
      next: { revalidate: 5 },
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    return { success: false, freelancers: [] };
  }
};

export const getFreelancerDetails = async (id) => {
  try {
    const res = await fetchWithTimeout(`${baseUrl}/api/freelancers/${id}`, {
      next: { revalidate: 5 },
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching freelancer details:", error);
    return { success: false };
  }
};

export const getMyProfile = async (id) => {
  try {
    const { data: tokenData } = await authClient.token();

    const res = await fetchWithTimeout(`${baseUrl}/api/freelancers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenData?.token}`,
      },
      next: { revalidate: 5 },
    });

    return await res.json();
  } catch (error) {
    console.error("Error in getMyProfile API call:", error);
    return { error: true, message: "Failed to fetch profile" };
  }
};

export const updateMyProfile = async (id, data) => {
  const res = await fetch(`${baseUrl}/api/freelancers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateProfile = async (id, profileData) => {
  try {
    const { data: tokenData } = await authClient.token();

    const res = await fetch(`${baseUrl}/api/freelancers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify(profileData),
    });

    return await res.json();
  } catch (error) {
    console.error("Error in updateProfile API call:", error);
    return { success: false, message: "Failed to update profile" };
  }
};
