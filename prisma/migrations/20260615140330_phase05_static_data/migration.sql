-- CreateTable
CREATE TABLE "CboLargeGroup" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CboLargeGroup_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CboMainSubgroup" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "largeGroupCode" TEXT NOT NULL,

    CONSTRAINT "CboMainSubgroup_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CboSubgroup" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mainSubgroupCode" TEXT NOT NULL,

    CONSTRAINT "CboSubgroup_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CboFamily" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subgroupCode" TEXT NOT NULL,

    CONSTRAINT "CboFamily_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CboOccupation" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "familyCode" TEXT NOT NULL,

    CONSTRAINT "CboOccupation_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CnaeSection" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CnaeSection_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CnaeDivision" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sectionCode" TEXT NOT NULL,

    CONSTRAINT "CnaeDivision_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CnaeGroup" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "divisionCode" TEXT NOT NULL,

    CONSTRAINT "CnaeGroup_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CnaeClass" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "groupCode" TEXT NOT NULL,

    CONSTRAINT "CnaeClass_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CnaeSubclass" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "classCode" TEXT NOT NULL,

    CONSTRAINT "CnaeSubclass_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "QbqKnowledge" (
    "id" SERIAL NOT NULL,
    "occupationCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "QbqKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QbqSkill" (
    "id" SERIAL NOT NULL,
    "occupationCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "QbqSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QbqAttitude" (
    "id" SERIAL NOT NULL,
    "occupationCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "QbqAttitude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "area" TEXT,
    "subarea" TEXT,
    "institution" TEXT,
    "duration" TEXT,
    "degree" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketMetrics" (
    "id" SERIAL NOT NULL,
    "occupationCode" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "admissions" INTEGER,
    "dismissals" INTEGER,
    "balance" INTEGER,
    "avgSalary" DOUBLE PRECISION,
    "avgWeeklyHours" DOUBLE PRECISION,
    "avgTenureMonths" DOUBLE PRECISION,
    "stockTotal" INTEGER,
    "ageDistribution" JSONB,
    "sexDistribution" JSONB,
    "educationDistribution" JSONB,
    "raceDistribution" JSONB,
    "disabilityCount" INTEGER,

    CONSTRAINT "MarketMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QbqKnowledge_occupationCode_idx" ON "QbqKnowledge"("occupationCode");

-- CreateIndex
CREATE INDEX "QbqSkill_occupationCode_idx" ON "QbqSkill"("occupationCode");

-- CreateIndex
CREATE INDEX "QbqAttitude_occupationCode_idx" ON "QbqAttitude"("occupationCode");

-- CreateIndex
CREATE INDEX "Course_type_idx" ON "Course"("type");

-- CreateIndex
CREATE INDEX "MarketMetrics_occupationCode_uf_period_source_idx" ON "MarketMetrics"("occupationCode", "uf", "period", "source");

-- AddForeignKey
ALTER TABLE "FavoriteProfession" ADD CONSTRAINT "FavoriteProfession_occupationCode_fkey" FOREIGN KEY ("occupationCode") REFERENCES "CboOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPlan" ADD CONSTRAINT "CareerPlan_occupationCode_fkey" FOREIGN KEY ("occupationCode") REFERENCES "CboOccupation"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CboMainSubgroup" ADD CONSTRAINT "CboMainSubgroup_largeGroupCode_fkey" FOREIGN KEY ("largeGroupCode") REFERENCES "CboLargeGroup"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CboSubgroup" ADD CONSTRAINT "CboSubgroup_mainSubgroupCode_fkey" FOREIGN KEY ("mainSubgroupCode") REFERENCES "CboMainSubgroup"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CboFamily" ADD CONSTRAINT "CboFamily_subgroupCode_fkey" FOREIGN KEY ("subgroupCode") REFERENCES "CboSubgroup"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CboOccupation" ADD CONSTRAINT "CboOccupation_familyCode_fkey" FOREIGN KEY ("familyCode") REFERENCES "CboFamily"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CnaeDivision" ADD CONSTRAINT "CnaeDivision_sectionCode_fkey" FOREIGN KEY ("sectionCode") REFERENCES "CnaeSection"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CnaeGroup" ADD CONSTRAINT "CnaeGroup_divisionCode_fkey" FOREIGN KEY ("divisionCode") REFERENCES "CnaeDivision"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CnaeClass" ADD CONSTRAINT "CnaeClass_groupCode_fkey" FOREIGN KEY ("groupCode") REFERENCES "CnaeGroup"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CnaeSubclass" ADD CONSTRAINT "CnaeSubclass_classCode_fkey" FOREIGN KEY ("classCode") REFERENCES "CnaeClass"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QbqKnowledge" ADD CONSTRAINT "QbqKnowledge_occupationCode_fkey" FOREIGN KEY ("occupationCode") REFERENCES "CboOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QbqSkill" ADD CONSTRAINT "QbqSkill_occupationCode_fkey" FOREIGN KEY ("occupationCode") REFERENCES "CboOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QbqAttitude" ADD CONSTRAINT "QbqAttitude_occupationCode_fkey" FOREIGN KEY ("occupationCode") REFERENCES "CboOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketMetrics" ADD CONSTRAINT "MarketMetrics_occupationCode_fkey" FOREIGN KEY ("occupationCode") REFERENCES "CboOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
