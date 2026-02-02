# Edge Cases Handled

- Concurrent user joins handled via Prisma transactions
- Insufficient coin balance validation
- Minimum participant validation before start
- Duplicate spin wheel prevention
- Atomic coin deduction & pool updates
- Safe elimination sequence
- Guaranteed single winner payout
- Server restart safe (DB-driven state)
