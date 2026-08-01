-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CONSULTANT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ClientCompany" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "secteur" TEXT,
    "adresse" TEXT,
    "contactNom" TEXT,
    "contactEmail" TEXT,
    "effectif" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserClientAccess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "clientCompanyId" TEXT NOT NULL,
    CONSTRAINT "UserClientAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserClientAccess_clientCompanyId_fkey" FOREIGN KEY ("clientCompanyId") REFERENCES "ClientCompany" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobFamily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientCompanyId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobFamily_clientCompanyId_fkey" FOREIGN KEY ("clientCompanyId") REFERENCES "ClientCompany" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientCompanyId" TEXT NOT NULL,
    "jobFamilyId" TEXT,
    "titre" TEXT NOT NULL,
    "niveau" TEXT,
    "reportingPositionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Position_clientCompanyId_fkey" FOREIGN KEY ("clientCompanyId") REFERENCES "ClientCompany" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Position_jobFamilyId_fkey" FOREIGN KEY ("jobFamilyId") REFERENCES "JobFamily" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Position_reportingPositionId_fkey" FOREIGN KEY ("reportingPositionId") REFERENCES "Position" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientCompanyId" TEXT NOT NULL,
    "positionId" TEXT,
    "managerId" TEXT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT,
    "dateEmbauche" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_clientCompanyId_fkey" FOREIGN KEY ("clientCompanyId") REFERENCES "ClientCompany" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobDescription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "positionId" TEXT NOT NULL,
    "missions" TEXT NOT NULL,
    "competences" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobDescription_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserClientAccess_userId_clientCompanyId_key" ON "UserClientAccess"("userId", "clientCompanyId");
