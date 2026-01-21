-- CreateTable
CREATE TABLE "AnalyticsCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "profileData" TEXT,
    "reposData" TEXT,
    "commitsData" TEXT,
    "statsData" TEXT,
    "aiAnalysis" TEXT,
    "cachedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsCache_username_key" ON "AnalyticsCache"("username");

-- CreateIndex
CREATE INDEX "AnalyticsCache_username_idx" ON "AnalyticsCache"("username");

-- CreateIndex
CREATE INDEX "AnalyticsCache_expiresAt_idx" ON "AnalyticsCache"("expiresAt");
