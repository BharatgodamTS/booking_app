'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function recordStockMovement(data: {
  warehouseId: string;
  type: 'INBOUND' | 'OUTBOUND';
  commodity: string;
  weight: number;
  truckNumber: string;
  driverName: string;
  biltyNumber: string;
  partyName: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId }
    });

    if (!warehouse) throw new Error("Warehouse not found");

    // Update Available Capacity
    const capacityChange = data.type === 'INBOUND' ? -data.weight : data.weight;
    
    // Check for overcapacity
    if (data.type === 'INBOUND' && warehouse.availableCapacity < data.weight) {
      throw new Error("Insufficient storage capacity for this inbound shipment.");
    }

    const movement = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          warehouseId: data.warehouseId,
          type: data.type,
          commodity: data.commodity,
          weight: data.weight,
          truckNumber: data.truckNumber,
          driverName: data.driverName,
          biltyNumber: data.biltyNumber,
          partyName: data.partyName,
          status: 'COMPLETED'
        }
      }),
      prisma.warehouse.update({
        where: { id: data.warehouseId },
        data: {
          availableCapacity: {
            increment: capacityChange
          }
        }
      })
    ]);

    revalidatePath('/dashboard/warehouse');
    return { success: true, data: movement[0] };
  } catch (error: any) {
    console.error("[STOCK_MOVEMENT_ERROR]", error);
    return { success: false, error: error.message };
  }
}

export async function getWarehouseLedger(warehouseId: string) {
  try {
    const movements = await prisma.stockMovement.findMany({
      where: { warehouseId },
      orderBy: { timestamp: 'desc' }
    });
    return movements;
  } catch (error) {
    return [];
  }
}

export async function getGlobalLogisticsStats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const stats = await prisma.stockMovement.groupBy({
      by: ['commodity'],
      _sum: {
        weight: true
      },
      where: {
        warehouse: {
          ownerId: session.user.id
        }
      }
    });

    return stats.map(s => ({
      commodity: s.commodity,
      totalWeight: s._sum.weight || 0
    }));
  } catch (error) {
    return [];
  }
}
