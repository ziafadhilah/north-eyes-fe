// services/authService.ts

export interface LoginResponse {
  status: string;
  message: string;
  data?: {
    token: string;
    user_id: string;
    company_name: string;
    company_id: string;
    photo_url: string;
  };
}

export const loginUser = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to connect to server. Please try again.");
  }
};
