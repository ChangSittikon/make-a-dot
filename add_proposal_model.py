import os

schema_path = r"C:\Users\CHANG-PCSONSAI\.gemini\antigravity\scratch\make-a-dot\prisma\schema.prisma"
with open(schema_path, "r", encoding="utf-8") as f:
    content = f.read()

model_code = """
// ============================================================
// PILLAR 8: UPGRADE PROPOSALS (Bounty to Project)
// ============================================================

model UpgradeProposal {
  id           String      @id @default(cuid())
  bountyId     String
  bounty       ProblemNode @relation(fields: [bountyId], references: [id], onDelete: Cascade)
  
  proposerId   String
  proposer     User        @relation(fields: [proposerId], references: [id], onDelete: Cascade)
  
  vision       String
  proposedRole String      // e.g., SWEAT_SHARE, INVESTOR, PROJECT_MANAGER
  
  status       String      @default("PENDING") // PENDING, APPROVED, REJECTED
  
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}
"""

if "model UpgradeProposal" not in content:
    content += model_code

if "upgradeProposals UpgradeProposal[]" not in content:
    # Add relation to ProblemNode
    content = content.replace(
        "upgradedToProjectId String? @unique",
        "upgradedToProjectId String? @unique\n  upgradeProposals  UpgradeProposal[]"
    )
    # Add relation to User
    content = content.replace(
        "arbitratorVotes  ArbitratorVote[] @relation(\"Arbitrator\")",
        "arbitratorVotes  ArbitratorVote[] @relation(\"Arbitrator\")\n  upgradeProposals UpgradeProposal[]"
    )

with open(schema_path, "w", encoding="utf-8") as f:
    f.write(content)
