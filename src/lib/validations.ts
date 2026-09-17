import { z } from 'zod';

// ============================================================
// SHARED
// ============================================================
export const basisPointsSchema = z.number().int().min(0).max(10000); // 0.00% - 100.00%
export const satangSchema = z.number().int().min(0); // สตางค์ ห้ามติดลบ

// ============================================================
// PROJECT
// ============================================================
export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  industryId: z.string().min(1),
  ownerId: z.string().min(1),
  budgetSatang: satangSchema.optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// ============================================================
// COLLABORATION CANVAS
// ============================================================
export const splitTypeSchema = z.enum(['REVENUE_SHARE', 'FLAT_FEE', 'HYBRID']);

export const createCanvasSchema = z.object({
  proposerId: z.string().min(1),
  splitType: splitTypeSchema.default('REVENUE_SHARE'),
  hasBreakeven: z.boolean().default(false),
  breakevenAmountSatang: satangSchema.default(0),
  breakevenRecipientId: z.string().optional(),
});

export const addResourceSchema = z.object({
  contributorId: z.string().min(1),
  label: z.string().min(1).max(200),
  icon: z.string().optional(),
  category: z.enum(['EQUIPMENT', 'LABOR', 'CASH', 'VENUE', 'IP']),
  equivalentValueSatang: satangSchema,
});

// ============================================================
// ESCROW
// ============================================================
export const createEscrowSchema = z.object({
  totalAmountSatang: satangSchema,
  paymentMethod: z.enum(['STRIPE_CONNECT', 'CRYPTO_WALLET', 'BANK_TRANSFER']).default('BANK_TRANSFER'),
  stripePaymentId: z.string().optional(),
  cryptoTxHash: z.string().optional(),
  bankSlipUrl: z.string().optional(),
});

export const createMilestoneSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  amountSatang: satangSchema,
  order: z.number().int().min(0),
});

export const disputeSchema = z.object({
  reason: z.string().min(1).max(1000),
});

// ============================================================
// GUARANTOR
// ============================================================
export const guarantorTypeSchema = z.enum(['PEER', 'INSTITUTIONAL', 'COLLATERAL_ASSET']);

export const createGuarantorSchema = z.object({
  guarantorType: guarantorTypeSchema,
  guarantorUserId: z.string().optional(),
  institutionName: z.string().optional(),
  institutionLicense: z.string().optional(),
  collateralDescription: z.string().optional(),
  collateralAmountSatang: satangSchema.default(0),
  premiumFeePercentage: basisPointsSchema.default(300),
});

// ============================================================
// ENDORSEMENT
// ============================================================
export const createEndorsementSchema = z.object({
  directorId: z.string(),
  projectId: z.string().optional(),
  userId: z.string().optional(),
  message: z.string().optional(),
  isFeatured: z.boolean().default(false),
}).refine(data => data.projectId || data.userId, {
  message: 'ต้องระบุ projectId หรือ userId อย่างน้อย 1 อย่าง',
  path: ['projectId']
});

// ============================================================
// MEMBER
// ============================================================
export const addMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['OWNER', 'MEMBER', 'CONTRACTOR', 'INVESTOR']).default('MEMBER'),
  equityPercentage: basisPointsSchema.default(0),
});
