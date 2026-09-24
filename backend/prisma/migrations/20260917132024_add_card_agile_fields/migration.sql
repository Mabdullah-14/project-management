-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "completionTime" TIMESTAMP(3),
ADD COLUMN     "eta" TIMESTAMP(3),
ADD COLUMN     "ets" INTEGER,
ADD COLUMN     "feedBack" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'Medium';
