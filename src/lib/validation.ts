import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(5, "Full address specification required"),
  totalCapacity: z.coerce.number().positive("Total capacity must be a positive metric tonnage"),
});

export const bookingSchema = z.object({
  warehouseId: z.string().cuid(),
  volume: z.coerce.number().positive("Operational volume must be greater than zero"),
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: "Operational window error: End date must follow start date",
  path: ["endDate"],
});

export type WarehouseInput = z.infer<typeof warehouseSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
