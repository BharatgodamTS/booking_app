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
        area: data.area || 0,
        totalCapacity: data.totalCapacity,
        availableCapacity: data.totalCapacity,
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
