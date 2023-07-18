/*
  Warnings:

  - You are about to drop the column `period_type` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Period` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `solved` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_period_type_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "period_type",
ALTER COLUMN "solved" SET NOT NULL,
ALTER COLUMN "solved" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "managerId" DROP NOT NULL,
ALTER COLUMN "managerId" DROP DEFAULT;

-- DropTable
DROP TABLE "Period";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
