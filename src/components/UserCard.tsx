// components/UserCard.tsx
import React from "react";
import { User } from "@/types/user";
import styles from "@/styles/UserCard.module.css";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";

type UserCardProps = {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
};

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className={styles.userCard}>
      <div className={styles.userCardDet}>
        <div className={styles.userDetail}>
          <span className={styles.label}>Name</span>
          <br />
          <span>{user.name}</span>
        </div>
        <div className={styles.userDetail}>
          <span className={styles.label}>Phone Number</span>
          <br />
          <span>{user.phone}</span>
        </div>
      </div>
      <div className={styles.userdButtons}>
        <button onClick={() => onEdit(user)}>
          <CiEdit />
        </button>
        <button onClick={() => onDelete(user._id!)}>
          <RiDeleteBin6Line />
        </button>
      </div>
    </div>
  );
}
