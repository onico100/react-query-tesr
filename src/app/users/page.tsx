"use client";

import { useState } from "react";
import { User } from "@/types/user";
import {
  getAllUsers,
  insertUser,
  updateUser,
  deleteUser,
} from "@/Services/usersService";
import styles from "../../styles/Users.module.css";
import UserCard from "@/components/UserCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Users() {
  const queryClient = useQueryClient();

  const {
    data: users = [], // Default to an empty array for safer rendering
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    staleTime: 300000, // 5 minutes
    retry: 1, // Retry once if the query fails
  });

  const insertUserMutation = useMutation({
    mutationFn: insertUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: { id: string; user: User }) =>
      updateUser(data.id, data.user),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Optimistically update the cache
      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        oldUsers
          ? oldUsers.map((user) =>
              user._id === data.id ? { ...user, ...data.user } : user
            )
          : []
      );

      return { previousUsers };
    },
    onError: (_error, _data, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers); // Rollback on error
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: async (deletedUserId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Optimistically update the cache
      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        oldUsers ? oldUsers.filter((user) => user._id !== deletedUserId) : []
      );

      return { previousUsers };
    },
    onError: (_error, _deletedUserId, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers); // Rollback on error
    },
  });

  const [formState, setFormState] = useState<User & { id?: string }>({
    id: "",
    name: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleAddOrUpdateUser = () => {
    if (isEditing && formState.id) {
      updateUserMutation.mutate({ id: formState.id, user: formState });
    } else {
      insertUserMutation.mutate(formState);
    }
    resetForm();
  };

  const handleEditUser = (user: User) => {
    setFormState({ id: user._id, name: user.name, phone: user.phone });
    setIsEditing(true);
  };

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const resetForm = () => {
    setFormState({ id: "", name: "", phone: "" });
    setIsEditing(false);
  };

  const handleChange = (field: keyof User, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Next.js - User Collection</h1>

      <div className={styles.form}>
        <h2>{isEditing ? "Edit User" : "Add User"}</h2>
        <input
          type="text"
          placeholder="Name"
          value={formState.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formState.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <button onClick={handleAddOrUpdateUser}>
          {isEditing ? "Update User" : "Add User"}
        </button>
        {isEditing && <button onClick={resetForm}>Cancel Edit</button>}
      </div>

      <div className={styles.userListSection}>
        <h2>All Users</h2>
        {isLoading ? (
          <p>Loading users...</p>
        ) : isError ? (
          <p>Error loading users.</p>
        ) : (
          <div className={styles.userList}>
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
