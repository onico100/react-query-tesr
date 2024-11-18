// services/usersService.ts
import axios from "./http";
import { User } from "@/types/user";

// Get all users
export async function getAllUsers(): Promise<User[]> {
  const response = await axios.get<{ documents: User[] }>("/users/get");
  console.log(2222);
  return response.data.documents;
}

export async function insertUser(user: User): Promise<User> {
  try {
    const response = await axios.post("/users/insert", user);
    console.log(2222, response.data);
    return response.data;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}

// Update an existing user
export async function updateUser(
  id: string,
  updatedUser: Partial<User>
): Promise<{ message: string }> {
  const response = await axios.patch(`/users/update`, { id, ...updatedUser });
  return response.data;
}

// Delete a user
export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await axios.delete(`/users/delete?id=${id}`);
  return response.data;
}
