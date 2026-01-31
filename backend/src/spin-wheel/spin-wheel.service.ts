import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpinWheelGateway } from './spin-wheel.gateway';

@Injectable()
export class SpinWheelService {
  constructor(
    private prisma: PrismaService,
    private gateway: SpinWheelGateway,
  ) {}

  // 1️⃣ CREATE SPIN WHEEL (ONLY ONE ACTIVE)
  async createWheel() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const activeWheel = await this.prisma.spinWheel.findFirst({
      where: { status: 'WAITING' },
    });

    if (activeWheel) {
      return { error: 'Spin wheel already active' };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.spinWheel.create({
      data: {
        status: 'WAITING',
        winnerPool: 0,
        adminPool: 0,
        appPool: 0,
      },
    });
  }

  // 2️⃣ JOIN SPIN WHEEL (COINS + POOLS)
  joinWheel(userId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.$transaction(
      async (tx: {
        user: {
          findUnique: (arg0: { where: { id: number } }) => any;
          update: (arg0: {
            where: { id: number };
            data: { coins: { decrement: number } };
          }) => any;
        };
        spinWheel: {
          findFirst: (arg0: { where: { status: string } }) => any;
          update: (arg0: {
            where: { id: any };
            data: {
              winnerPool: { increment: number };
              adminPool: { increment: number };
              appPool: { increment: number };
            };
          }) => any;
        };
        participant: {
          create: (arg0: { data: { userId: number; spinWheelId: any } }) => any;
        };
      }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          return { error: 'User not found' };
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (user.coins < 10) {
          return { error: 'Insufficient coins' };
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const wheel = await tx.spinWheel.findFirst({
          where: { status: 'WAITING' },
        });

        if (!wheel) {
          return { error: 'No active spin wheel' };
        }

        // deduct coins
        await tx.user.update({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { id: wheel.id },
          data: {
            coins: { decrement: 10 },
          },
        });

        // add participant
        await tx.participant.create({
          data: {
            userId,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            spinWheelId: wheel.id,
          },
        });

        // update pools
        await tx.spinWheel.update({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { id: wheel.id },
          data: {
            winnerPool: { increment: 7 },
            adminPool: { increment: 2 },
            appPool: { increment: 1 },
          },
        });
        this.gateway.userJoined(userId);

        return {
          message: 'User joined spin wheel',
        };
      },
    );
  }

  // 3️⃣ START SPIN WHEEL (MIN 3 USERS)
  async startWheel() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const wheel = await this.prisma.spinWheel.findFirst({
      where: { status: 'WAITING' },
    });

    if (!wheel) {
      return { error: 'No active spin wheel' };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const count = await this.prisma.participant.count({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { spinWheelId: wheel.id },
    });

    if (count < 3) {
      return { error: 'Minimum 3 users required' };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.spinWheel.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: wheel.id },
      data: { status: 'RUNNING' },
    });
    this.startEliminationTimer();
    return { message: 'Spin wheel started' };
  }

  async eliminateNextUser() {
    const wheel = await this.prisma.spinWheel.findFirst({
      where: { status: 'RUNNING' },
    });

    if (!wheel) return;

    const alive = await this.prisma.participant.findMany({
      where: {
        spinWheelId: wheel.id,
        eliminated: false,
      },
    });

    // 🏆 WINNER CASE
    if (alive.length === 1) {
      const winner = alive[0];

      // payout winner
      await this.prisma.user.update({
        where: { id: winner.userId },
        data: {
          coins: { increment: wheel.winnerPool },
        },
      });

      // mark wheel completed
      await this.prisma.spinWheel.update({
        where: { id: wheel.id },
        data: { status: 'COMPLETED' },
      });

      // 🔔 socket event
      this.gateway.winnerDeclared(winner.userId, wheel.winnerPool);

      return;
    }

    // ❌ ELIMINATE RANDOM USER
    const randomIndex = Math.floor(Math.random() * alive.length);
    const eliminated = alive[randomIndex];

    await this.prisma.participant.update({
      where: { id: eliminated.id },
      data: { eliminated: true },
    });

    // 🔔 socket event
    this.gateway.userEliminated(eliminated.userId);
  }

  startEliminationTimer() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const interval = setInterval(async () => {
      const wheel = await this.prisma.spinWheel.findFirst({
        where: { status: 'RUNNING' },
      });

      if (!wheel) {
        clearInterval(interval);
        return;
      }

      const alive = await this.prisma.participant.count({
        where: {
          spinWheelId: wheel.id,
          eliminated: false,
        },
      });

      if (alive <= 1) {
        clearInterval(interval);
      }

      await this.eliminateNextUser();
    }, 7000);
  }
}
