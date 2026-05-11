/*
  Warnings:

  - You are about to drop the column `volume` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `weight` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "warehouseId" TEXT NOT NULL,
    "clientId" TEXT,
    "manualClientName" TEXT,
    "manualClientContact" TEXT,
    "weight" REAL NOT NULL,
    "commodityType" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "bookingType" TEXT NOT NULL DEFAULT 'PLATFORM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("bookingType", "clientId", "createdAt", "endDate", "id", "manualClientContact", "manualClientName", "startDate", "status", "updatedAt", "warehouseId") SELECT "bookingType", "clientId", "createdAt", "endDate", "id", "manualClientContact", "manualClientName", "startDate", "status", "updatedAt", "warehouseId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
