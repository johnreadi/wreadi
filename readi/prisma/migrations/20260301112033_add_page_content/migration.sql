-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'READI.FR',
    "siteSlogan" TEXT DEFAULT 'La Compétence !',
    "siteLogo" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#dc2626',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "baseFontSize" TEXT NOT NULL DEFAULT '16px',
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiWelcomeMessage" TEXT DEFAULT 'Bonjour ! Comment puis-je vous aider ?',
    "aiInstructions" TEXT,
    "aiModel" TEXT NOT NULL DEFAULT 'gpt-4o',
    "aiApiKey" TEXT,
    "aiTemperature" REAL NOT NULL DEFAULT 0.7,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactAddress" TEXT,
    "contactHours" TEXT,
    "contactMapUrl" TEXT,
    "privacyPolicy" TEXT,
    "termsOfService" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT,
    "participantName" TEXT NOT NULL,
    "participantEmail" TEXT NOT NULL,
    "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" TEXT NOT NULL,
    CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageSlug" TEXT NOT NULL,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroDescription" TEXT,
    "heroBtnText" TEXT,
    "heroBtnLink" TEXT,
    "heroImage" TEXT,
    "heroVideoUrl" TEXT,
    "titleFontSize" TEXT DEFAULT '4rem',
    "titleFontFamily" TEXT DEFAULT 'inherit',
    "subtitleFontSize" TEXT DEFAULT '1.25rem',
    "descriptionFontSize" TEXT DEFAULT '1.125rem',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PageSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "subtitle" TEXT,
    "content" TEXT DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',
    "mediaUrl" TEXT,
    "slides" TEXT,
    "layout" TEXT NOT NULL DEFAULT 'LEFT',
    "animation" TEXT DEFAULT 'fade',
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "titleFontSize" TEXT DEFAULT '2.25rem',
    "titleFontFamily" TEXT DEFAULT 'inherit',
    "contentFontSize" TEXT DEFAULT '1.125rem',
    "pageContentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PageSection_pageContentId_fkey" FOREIGN KEY ("pageContentId") REFERENCES "PageContent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LandingPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "content" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_pageSlug_key" ON "PageContent"("pageSlug");

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_slug_key" ON "LandingPage"("slug");
