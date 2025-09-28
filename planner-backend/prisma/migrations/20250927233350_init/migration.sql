-- CreateEnum
CREATE TYPE "public"."LifeStatus" AS ENUM ('ALIVE', 'DEAD', 'INVALID');

-- CreateEnum
CREATE TYPE "public"."AllocationKind" AS ENUM ('FINANCIAL', 'REAL_ESTATE');

-- CreateEnum
CREATE TYPE "public"."MovementKind" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "public"."Frequency" AS ENUM ('ONCE', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."InsuranceType" AS ENUM ('LIFE', 'DISABILITY');

-- CreateTable
CREATE TABLE "public"."Simulation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isSnapshot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SimulationVersion" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "realRate" DOUBLE PRECISION NOT NULL,
    "lifeStatus" "public"."LifeStatus" NOT NULL DEFAULT 'ALIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Allocation" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "kind" "public"."AllocationKind" NOT NULL,
    "name" TEXT NOT NULL,
    "hasFinancing" BOOLEAN NOT NULL DEFAULT false,
    "financingStart" TIMESTAMP(3),
    "financingMonths" INTEGER,
    "financingMonthlyRate" DOUBLE PRECISION,
    "downPayment" DOUBLE PRECISION,

    CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AllocationRecord" (
    "id" TEXT NOT NULL,
    "allocationId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllocationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Movement" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "kind" "public"."MovementKind" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "frequency" "public"."Frequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "nextId" TEXT,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Insurance" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "type" "public"."InsuranceType" NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "months" INTEGER NOT NULL,
    "monthlyPremium" DOUBLE PRECISION NOT NULL,
    "insuredValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movement_nextId_key" ON "public"."Movement"("nextId");

-- CreateIndex
CREATE INDEX "Movement_versionId_idx" ON "public"."Movement"("versionId");

-- AddForeignKey
ALTER TABLE "public"."SimulationVersion" ADD CONSTRAINT "SimulationVersion_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "public"."Simulation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Allocation" ADD CONSTRAINT "Allocation_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "public"."SimulationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AllocationRecord" ADD CONSTRAINT "AllocationRecord_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "public"."Allocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Movement" ADD CONSTRAINT "Movement_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "public"."SimulationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Movement" ADD CONSTRAINT "Movement_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "public"."Movement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Insurance" ADD CONSTRAINT "Insurance_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "public"."SimulationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
