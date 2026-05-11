import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(5, "Location is required"),
  totalCapacity: z.coerce.number().positive("Capacity must be greater than 0"),
});

export const bookingSchema = z.object({
  warehouseId: z.string().cuid(),
  volume: z.coerce.number().positive("Volume must be greater than 0"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type WarehouseInput = z.infer<typeof warehouseSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
