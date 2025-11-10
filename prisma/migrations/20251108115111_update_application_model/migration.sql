/*
  Warnings:

  - You are about to drop the column `appliedAt` on the `Application` table. All the data in the column will be lost.
  - Added the required column `coverLetter` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documents` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levelOfEducation` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residenceAddress` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "appliedAt",
ADD COLUMN     "coverLetter" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documents" JSONB NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "levelOfEducation" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "residenceAddress" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
