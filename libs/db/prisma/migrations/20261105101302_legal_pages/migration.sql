-- CreateTable
CREATE TABLE "LegalPage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "LegalPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LegalPage" ADD CONSTRAINT "LegalPage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
