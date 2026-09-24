-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "budgetHours" INTEGER,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Development',
ADD COLUMN     "projectBrief" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Planning',
ADD COLUMN     "targetDelivery" TIMESTAMP(3);
