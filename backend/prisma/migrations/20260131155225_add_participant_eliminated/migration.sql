/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SpinWheel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "eliminated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SpinWheel" DROP COLUMN "createdAt";

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_spinWheelId_fkey" FOREIGN KEY ("spinWheelId") REFERENCES "SpinWheel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
