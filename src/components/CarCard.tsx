// components/CarCard.tsx
import React from "react";
import { Car } from "@/types/car";
import styles from "@/styles/CarCard.module.css";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";

type CarCardProps = {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
};

export default function CarCard({ car, onEdit, onDelete }: CarCardProps) {
  return (
    <div className={styles.carCard}>
      <div className={styles.carCardDet}>
        <div className={styles.carDetail}>
          <span className={styles.label}>Model</span>
          <br />
          <span>{car.model}</span>
        </div>
        <div className={styles.carDetail}>
          <span className={styles.label}>Plate</span>
          <br />
          <span>{car.plate_number}</span>
        </div>
        <div className={styles.carDetail}>
          <span className={styles.label}>Color</span>
          <br />
          <span>{car.color}</span>
        </div>
      </div>
      <div className={styles.cardButtons}>
        <button onClick={() => onEdit(car)}>
          <CiEdit />
        </button>
        <button onClick={() => onDelete(car._id!)}>
          <RiDeleteBin6Line />
        </button>
      </div>
    </div>
  );
}
