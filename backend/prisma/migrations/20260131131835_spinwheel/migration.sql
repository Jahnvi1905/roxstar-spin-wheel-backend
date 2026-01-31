-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "coins" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinWheel" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "winnerPool" INTEGER NOT NULL,
    "adminPool" INTEGER NOT NULL,
    "appPool" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpinWheel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "spinWheelId" INTEGER NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);
