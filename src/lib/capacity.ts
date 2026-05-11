/**
 * Core Capacity Logic for Warehouse Management
 */

interface ActiveBooking {
  volume: number;
}

interface WarehouseWithBookings {
  totalCapacity: number;
  bookings: ActiveBooking[];
}

/**
 * Calculates the available capacity for a given warehouse based on active bookings.
 * Formula: Available Capacity = Total Capacity - Sum(Active Booked Volumes)
 * 
 * @param warehouse - Warehouse object containing totalCapacity and array of active bookings
 * @returns number - The remaining volume available for new bookings
 */
export const calculateAvailableCapacity = (warehouse: WarehouseWithBookings): number => {
  const bookedVolume = warehouse.bookings.reduce((sum, booking) => sum + booking.volume, 0);
  const available = warehouse.totalCapacity - bookedVolume;
  
  // Ensure we don't return negative capacity due to data inconsistencies
  return Math.max(0, available);
};

/**
 * Validates if a new booking request fits within the available capacity.
 * 
 * @param requestedVolume - The volume requested by the client
 * @param availableCapacity - Current available capacity
 * @returns boolean
 */
export const canAccommodateBooking = (
  requestedVolume: number,
  availableCapacity: number
): boolean => {
  return requestedVolume <= availableCapacity;
};
