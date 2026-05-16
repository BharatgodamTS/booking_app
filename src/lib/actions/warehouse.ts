'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWarehouse(data: {
  name: string;
  address: string;
  area: number;
  totalCapacity: number;
  pricing: number;
  storageType: string;
  availableFrom: string;
  materialsAllowed: string;
  wdraStatus: boolean;
  gstNumber: string;
  images?: string;
  features: string[];
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name: data.name,
        address: data.address,
        area: data.area,
        totalCapacity: data.totalCapacity,
        availableCapacity: data.totalCapacity, // Initially full capacity available
        pricing: data.pricing,
        storageType: data.storageType,
        availableFrom: new Date(data.availableFrom),
        materialsAllowed: data.materialsAllowed,
        wdraStatus: data.wdraStatus,
        gstNumber: data.gstNumber,
        images: data.images || "",
        features: data.features.join(","),
        ownerId: session.user.id,
        status: "PENDING"
      },
    });

    revalidatePath('/dashboard/warehouse');
    return { success: true, data: warehouse };
  } catch (error: any) {
    console.error("[CREATE_WAREHOUSE_ERROR]", error);
    return { success: false, error: error.message || "Failed to create warehouse record." };
  }
}

export async function updateWarehouse(id: string, data: {
  name: string;
  address: string;
  area: number;
  totalCapacity: number;
  pricing: number;
  storageType: string;
  availableFrom: string;
  materialsAllowed: string;
  wdraStatus: boolean;
  gstNumber: string;
  images?: string;
  features: string[];
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        ...data,
        availableFrom: new Date(data.availableFrom),
        features: data.features.join(","),
        status: "PENDING"
      }
    });

    revalidatePath('/dashboard/warehouse');
    return { success: true, data: warehouse };
  } catch (error: any) {
    console.error("[UPDATE_WAREHOUSE_ERROR]", error);
    return { success: false, error: "Update failed" };
  }
}

export async function getOwnerWarehouses() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const warehouses = await prisma.warehouse.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return warehouses.map(w => ({
      ...w,
      features: w.features ? w.features.split(",") : []
    }));
  } catch (error) {
    console.error("❌ [GET_WAREHOUSES_ERROR]", error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { totalTransactions: 0, currentInventory: 0, activeWarehouses: 0, pendingRequests: 0 };
    }

    const [warehouses, bookings] = await Promise.all([
      prisma.warehouse.findMany({
        where: { ownerId: session.user.id }
      }),
      prisma.booking.findMany({
        where: { warehouse: { ownerId: session.user.id } }
      })
    ]);

    const activeWarehouses = warehouses.filter(w => w.status === 'APPROVED').length;
    const pendingRequests = bookings.filter(b => b.status === 'PENDING').length;
    const totalTransactions = bookings.length;
    const currentInventory = bookings
      .filter(b => b.status === 'APPROVED')
      .reduce((sum, b) => sum + (b.weight || 0), 0);

    return {
      totalTransactions,
      currentInventory,
      activeWarehouses,
      pendingRequests
    };
  } catch (error) {
    console.error("[GET_LOGISTICS_STATS_ERROR]", error);
    return { totalTransactions: 0, currentInventory: 0, activeWarehouses: 0, pendingRequests: 0 };
  }
}

// 📦 BOOKING MANAGEMENT ACTIONS
export async function getOwnerBookings(status?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    return await prisma.booking.findMany({
      where: {
        warehouse: { ownerId: session.user.id },
        ...(status ? { status } : {})
      },
      include: {
        client: {
          select: { name: true, email: true, phone: true }
        },
        warehouse: {
          select: { name: true, location: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("[GET_OWNER_BOOKINGS_ERROR]", error);
    return [];
  }
}

export async function updateBookingStatus(bookingId: string, status: 'APPROVED' | 'REJECTED') {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { warehouse: true }
    });

    if (!booking) return { success: false, error: "Booking not found" };

    // 🛡️ ATOMIC STATUS UPDATE
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status }
      });

      // If approved, decrement available capacity
      if (status === 'APPROVED') {
        await tx.warehouse.update({
          where: { id: booking.warehouseId },
          data: {
            availableCapacity: {
              decrement: booking.weight
            }
          }
        });
      }
    });

    revalidatePath('/dashboard/warehouse');
    revalidatePath('/dashboard/warehouse/reports');
    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_BOOKING_STATUS_ERROR]", error);
    return { success: false, error: "Failed to update booking status" };
  }
}
