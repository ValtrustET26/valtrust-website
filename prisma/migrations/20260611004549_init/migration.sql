-- CreateEnum
CREATE TYPE "Role" AS ENUM ('buyer', 'seller', 'admin');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('available', 'sold');

-- CreateEnum
CREATE TYPE "PropertyVerificationStatus" AS ENUM ('unverified', 'valuation_verified', 'deed_verified', 'fully_verified');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'verified', 'failed');

-- CreateTable
CREATE TABLE "BuyerProfile" (
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerProfile_pkey" PRIMARY KEY ("clerkId")
);

-- CreateTable
CREATE TABLE "SellerProfile" (
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isIdentityVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerProfile_pkey" PRIMARY KEY ("clerkId")
);

-- CreateTable
CREATE TABLE "IdentityVerification" (
    "sellerClerkId" TEXT NOT NULL,
    "duiNumber" TEXT,
    "duiImageUrl" TEXT NOT NULL,
    "selfieImageUrl" TEXT NOT NULL,
    "extractedName" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentityVerification_pkey" PRIMARY KEY ("sellerClerkId")
);

-- CreateTable
CREATE TABLE "Valuation" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "sellerClerkId" TEXT,
    "department" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "exactAddress" TEXT,
    "postalCode" INTEGER,
    "type" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "areaM2" DOUBLE PRECISION NOT NULL,
    "landAreaM2" DOUBLE PRECISION,
    "levels" INTEGER NOT NULL,
    "yearBuilt" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "parkingSpaces" INTEGER,
    "kitchenType" TEXT NOT NULL,
    "hasLivingDiningRoom" BOOLEAN,
    "hasLaundryRoom" BOOLEAN,
    "hasStorageCellar" BOOLEAN,
    "hasStudioHomeOffice" BOOLEAN,
    "hasServiceQuarter" BOOLEAN,
    "hasAC" BOOLEAN,
    "hasSmartHome" BOOLEAN,
    "hasPool" BOOLEAN,
    "hasSecurityGate" BOOLEAN,
    "hasCCTV" BOOLEAN,
    "hasGym" BOOLEAN,
    "hasElevator" BOOLEAN,
    "hasGreenAreas" BOOLEAN,
    "hasOtherAmenity" BOOLEAN,
    "otherAmenityDescription" TEXT,
    "publicDescription" TEXT,
    "maintenanceFee" DOUBLE PRECISION,
    "petsAllowed" TEXT,
    "includedServices" TEXT,
    "estimatedMin" DOUBLE PRECISION NOT NULL,
    "estimatedMax" DOUBLE PRECISION NOT NULL,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "pricePerM2" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Valuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "sellerClerkId" TEXT NOT NULL,
    "valuationId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "PropertyStatus" NOT NULL DEFAULT 'available',
    "verificationStatus" "PropertyVerificationStatus" NOT NULL DEFAULT 'unverified',
    "areaM2" DOUBLE PRECISION NOT NULL,
    "rooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyPhoto" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDeed" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "ownerName" TEXT,
    "propertyAddress" TEXT,
    "extractedText" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyDeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyerProfileClerkId" TEXT,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyView" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "viewerClerkId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteComment" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIConversation" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Valuation_publicId_key" ON "Valuation"("publicId");

-- CreateIndex
CREATE INDEX "Valuation_sellerClerkId_idx" ON "Valuation"("sellerClerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_valuationId_key" ON "Property"("valuationId");

-- CreateIndex
CREATE INDEX "Property_sellerClerkId_idx" ON "Property"("sellerClerkId");

-- CreateIndex
CREATE INDEX "Property_location_idx" ON "Property"("location");

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "Property"("price");

-- CreateIndex
CREATE INDEX "PropertyPhoto_propertyId_idx" ON "PropertyPhoto"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyDeed_propertyId_key" ON "PropertyDeed"("propertyId");

-- CreateIndex
CREATE INDEX "Favorite_clerkId_idx" ON "Favorite"("clerkId");

-- CreateIndex
CREATE INDEX "Favorite_propertyId_idx" ON "Favorite"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_clerkId_propertyId_key" ON "Favorite"("clerkId", "propertyId");

-- CreateIndex
CREATE INDEX "PropertyView_propertyId_idx" ON "PropertyView"("propertyId");

-- CreateIndex
CREATE INDEX "SiteComment_clerkId_idx" ON "SiteComment"("clerkId");

-- CreateIndex
CREATE INDEX "AIMessage_conversationId_idx" ON "AIMessage"("conversationId");

-- AddForeignKey
ALTER TABLE "IdentityVerification" ADD CONSTRAINT "IdentityVerification_sellerClerkId_fkey" FOREIGN KEY ("sellerClerkId") REFERENCES "SellerProfile"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valuation" ADD CONSTRAINT "Valuation_sellerClerkId_fkey" FOREIGN KEY ("sellerClerkId") REFERENCES "SellerProfile"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_sellerClerkId_fkey" FOREIGN KEY ("sellerClerkId") REFERENCES "SellerProfile"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_valuationId_fkey" FOREIGN KEY ("valuationId") REFERENCES "Valuation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyPhoto" ADD CONSTRAINT "PropertyPhoto_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDeed" ADD CONSTRAINT "PropertyDeed_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_buyerProfileClerkId_fkey" FOREIGN KEY ("buyerProfileClerkId") REFERENCES "BuyerProfile"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyView" ADD CONSTRAINT "PropertyView_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AIConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
