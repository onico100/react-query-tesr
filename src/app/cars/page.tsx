"use client";

import { useState } from "react";
import { Car } from "@/types/car";
import {
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
} from "@/Services/carsService";
import styles from "../../styles/Cars.module.css";
import CarCard from "@/components/CarCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Cars() {
  const queryClient = useQueryClient();

  const {
    data: cars,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: getAllCars,
    staleTime: 300000, // 10 minutes
  });

  const insertCarMutation = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: (data: { id: string; car: Car }) =>
      updateCar(data.id, data.car),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  const deleteCarMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  const [newCar, setNewCar] = useState<Car>({
    model: "",
    plate_number: "",
    color: "",
  });

  const [updateCarData, setUpdateCarData] = useState<Car & { id: string }>({
    id: "",
    model: "",
    plate_number: "",
    color: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  function resetForm() {
    setNewCar({ model: "", plate_number: "", color: "" });
    setUpdateCarData({ id: "", model: "", plate_number: "", color: "" });
    setIsEditing(false);
  }

  function handleAddOrUpdateCar() {
    if (isEditing && updateCarData.id) {
      updateCarMutation.mutate({ id: updateCarData.id, car: updateCarData });
    } else {
      insertCarMutation.mutate(newCar);
    }
    resetForm();
  }

  function handleEditCar(car: Car) {
    setUpdateCarData({
      id: car._id!,
      model: car.model,
      plate_number: car.plate_number,
      color: car.color,
    });
    setIsEditing(true);
  }

  function handleDeleteCar(id: string) {
    deleteCarMutation.mutate(id);
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to Next.js - Car Collection</h1>

      <div>
        <h2>{isEditing ? "Edit Car" : "Add Car"}</h2>
        <input
          type="text"
          placeholder="Model"
          value={isEditing ? updateCarData.model : newCar.model}
          onChange={(e) =>
            isEditing
              ? setUpdateCarData({ ...updateCarData, model: e.target.value })
              : setNewCar({ ...newCar, model: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Plate Number"
          value={isEditing ? updateCarData.plate_number : newCar.plate_number}
          onChange={(e) =>
            isEditing
              ? setUpdateCarData({
                  ...updateCarData,
                  plate_number: e.target.value,
                })
              : setNewCar({ ...newCar, plate_number: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Color"
          value={isEditing ? updateCarData.color : newCar.color}
          onChange={(e) =>
            isEditing
              ? setUpdateCarData({ ...updateCarData, color: e.target.value })
              : setNewCar({ ...newCar, color: e.target.value })
          }
        />
        <button onClick={handleAddOrUpdateCar}>
          {isEditing ? "Update Car" : "Add Car"}
        </button>
        {isEditing && <button onClick={resetForm}>Cancel Edit</button>}
      </div>

      <div>
        <h2>All Cars</h2>
        {isLoading ? (
          <p>Loading cars...</p>
        ) : isError ? (
          <p>Error loading cars.</p>
        ) : (
          <div className={styles.carList}>
            {cars?.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onEdit={handleEditCar}
                onDelete={handleDeleteCar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
