import os

schema_path = r"C:\Users\CHANG-PCSONSAI\.gemini\antigravity\scratch\make-a-dot\prisma\schema.prisma"

with open(schema_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add fields to Project
project_replacement = """
  status       String @default("DRAFT") // DRAFT, SIMULATION, HOT_MISSION, ACTIVE, COMPLETED, CANCELLED
  budgetSatang Int    @default(0) // งบประมาณรวม (สตางค์)
  fundingGoalSatang Int @default(0) // เป้าหมายเงินทุนรวมที่ต้องการระดม
  revShareOffered   Float @default(0) // สัดส่วนส่วนแบ่งรายได้ (%) ที่เสนอ
"""
content = content.replace(
    '  status       String @default("DRAFT") // DRAFT, SIMULATION, HOT_MISSION, ACTIVE, COMPLETED, CANCELLED\n  budgetSatang Int    @default(0) // งบประมาณรวม (สตางค์)',
    project_replacement.strip('\n')
)

# 2. Add upgradedToProjectId to ProblemNode
problem_replacement = """
  // ===== BOUNTY PROTOCOL (DOT012) =====
  bountyPrizeSatang Int     @default(0) // เงินรางวัลค่าหัว (สตางค์) — ถ้า 0 = แลกเปลี่ยน/ไม่ใช่เงินสด
  bountyType        String  @default("CASH") // CASH, REV_SHARE, RESOURCE_SWAP, HYBRID
  bountyDescription String? // อธิบายรางวัลเพิ่มเติม (เช่น "ฟรีค่าห้องอัดเสียง 3 วัน")
  
  // การวิวัฒนาการปัญหา (Bounty-to-Project Conversion)
  upgradedToProjectId String? @unique
"""
content = content.replace(
    '  // ===== BOUNTY PROTOCOL (DOT012) =====\n  bountyPrizeSatang Int     @default(0) // เงินรางวัลค่าหัว (สตางค์) — ถ้า 0 = แลกเปลี่ยน/ไม่ใช่เงินสด\n  bountyType        String  @default("CASH") // CASH, REV_SHARE, RESOURCE_SWAP, HYBRID\n  bountyDescription String? // อธิบายรางวัลเพิ่มเติม (เช่น "ฟรีค่าห้องอัดเสียง 3 วัน")',
    problem_replacement.strip('\n')
)

# 3. Add Wallet & Ledger models, Dispute & ArbitratorVote to the bottom of the schema
additional_models = """

// ============================================================
// PILLAR 6: UNIFIED LEDGER & WALLET
// ============================================================

model Wallet {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  balance       Int      @default(0) // ยอดเงินที่ถอนได้ (Satang)
  lockedBalance Int      @default(0) // ยอดที่ถูกล็อกใน Escrow หรือ Stake (Satang)
  
  transactions  LedgerTransaction[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model LedgerTransaction {
  id          String   @id @default(cuid())
  walletId    String
  wallet      Wallet   @relation(fields: [walletId], references: [id], onDelete: Cascade)
  
  amount      Int      // จำนวนเงิน (Satang) บวกคือเข้า ลบคือออก
  type        String   // DEPOSIT, WITHDRAWAL, STAKE_HOLD, ESCROW_RELEASE, TRANSFER
  status      String   @default("COMPLETED") // PENDING, COMPLETED, FAILED, REVERTED
  
  referenceId String?  // อ้างอิง ID ของ Escrow, Project, หรือ Bounty ที่มาของ Transaction นี้
  
  createdAt   DateTime @default(now())
}

// ============================================================
// PILLAR 7: DISPUTE & ARBITRATION (ศาลลูกขุน)
// ============================================================

model Dispute {
  id           String   @id @default(cuid())
  escrowId     String   @unique // 1 Dispute ต่อ 1 Escrow (ต่อ 1 Milestone/Bounty)
  escrow       EscrowVault   @relation(fields: [escrowId], references: [id], onDelete: Cascade)
  
  plaintiffId  String   // ผู้ร้องเรียน
  plaintiff    User     @relation("Plaintiff", fields: [plaintiffId], references: [id])
  
  defendantId  String   // ผู้ถูกร้องเรียน
  defendant    User     @relation("Defendant", fields: [defendantId], references: [id])
  
  status       String   @default("OPEN") // OPEN, VOTING, RESOLVED, APPEALED_TO_ADMIN
  reason       String
  
  votes        ArbitratorVote[]
  
  resolvedAt   DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ArbitratorVote {
  id           String   @id @default(cuid())
  disputeId    String
  dispute      Dispute  @relation(fields: [disputeId], references: [id], onDelete: Cascade)
  
  arbitratorId String
  arbitrator   User     @relation("Arbitrator", fields: [arbitratorId], references: [id])
  
  verdict      String   // SOLVER_WINS, REQUESTER_WINS, SPLIT
  justification String?
  
  createdAt    DateTime @default(now())
  
  @@unique([disputeId, arbitratorId])
}
"""

if "model Wallet" not in content:
    content += additional_models

# Also add Wallet, Disputes relations to User model
user_wallet_relation = "  wallet        Wallet?"
if user_wallet_relation not in content:
    content = content.replace("  accounts Account[]", "  wallet        Wallet?\n  accounts Account[]")

user_dispute_relations = """
  disputesFiled    Dispute[] @relation("Plaintiff")
  disputesDefended Dispute[] @relation("Defendant")
  arbitratorVotes  ArbitratorVote[] @relation("Arbitrator")
"""
if "disputesFiled" not in content:
    content = content.replace("  accounts Account[]", user_dispute_relations + "  accounts Account[]")

with open(schema_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Schema updated successfully")
