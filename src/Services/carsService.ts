// services/carsService.ts
import http from "./http";
import { Car } from "@/types/car";

// Get all cars
export async function getAllCars(): Promise<Car[]> {
  const response = await http.get("/cars/get");
  console.log(222);
  return response.data;
}

// Insert a new car
export async function insertCar(car: Car): Promise<{ message: string }> {
  const response = await http.post("/cars/insert", car);
  return response.data;
}

// Update an existing car
export async function updateCar(
  id: string,
  updatedCar: Partial<Car>
): Promise<{ message: string }> {
  const response = await http.patch(`/cars/update`, { id, ...updatedCar });
  return response.data;
}

// Delete a car
export async function deleteCar(id: string): Promise<{ message: string }> {
  const response = await http.delete(`/cars/delete?id=${id}`);
  return response.data;
}
