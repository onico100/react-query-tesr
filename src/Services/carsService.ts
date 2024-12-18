import http from "@/Services/http";

export async function getAllCars() {
  try {
    const response = await http.get("/cars/get");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createCar(car: any) {
  try {
    const response = await http.post("/cars/insert", car);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateCar(id: string, car: any) {
  try {
    const response = await http.patch("/cars/update", { ...car, _id: id });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCar(id: string) {
  try {
    const response = await http.delete(`/cars`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
