-- DropIndex
DROP INDEX "idx_location_geom";

-- AlterTable
ALTER TABLE "bts_stations" ALTER COLUMN "geom" DROP NOT NULL;

-- AlterTable
ALTER TABLE "location_history" ALTER COLUMN "geom" DROP NOT NULL;
