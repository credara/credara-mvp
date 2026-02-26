export const NAME_MATCH_OPTIONS = [
  "Match",
  "Partial Match",
  "Mismatch",
] as const;
export type NameMatch = (typeof NAME_MATCH_OPTIONS)[number];

export const PHONE_AGE_OPTIONS = [
  "<1 year",
  "1-3 years",
  "3-5 years",
  "5+ years",
] as const;
export type PhoneAge = (typeof PHONE_AGE_OPTIONS)[number];

export const BVN_NIN_OPTIONS = [
  "Verified (no mismatch)",
  "Verified (mismatch)",
  "Not verified",
  "Not provided",
] as const;
export type BvnNinStatus = (typeof BVN_NIN_OPTIONS)[number];

export const UTILITY_BILL_OPTIONS = ["Provided", "Not provided"] as const;
export type UtilityBill = (typeof UTILITY_BILL_OPTIONS)[number];

export const ACTIVITY_STATUS_OPTIONS = [
  "Active",
  "Inactive",
  "Not applicable",
] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUS_OPTIONS)[number];

export const ASSOCIATION_OPTIONS = ["Registered member", "Not member"] as const;
export type AssociationMembership = (typeof ASSOCIATION_OPTIONS)[number];

export const REFERENCE_STATUS_OPTIONS = [
  "Confirmed",
  "Not confirmed",
  "Unable to reach",
  "Not provided",
] as const;
export type ReferenceStatus = (typeof REFERENCE_STATUS_OPTIONS)[number];

export const FRAUD_SIGNAL_OPTIONS = ["None", "Reported", "Suspected"] as const;
export type FraudSignal = (typeof FRAUD_SIGNAL_OPTIONS)[number];

export const CONFLICTING_SIGNAL_OPTIONS = ["None", "Present"] as const;
export type ConflictingSignal = (typeof CONFLICTING_SIGNAL_OPTIONS)[number];

export interface TrustReportReference {
  type: string;
  status: ReferenceStatus;
}

export interface TrustReportContent {
  identity?: {
    nameMatch?: NameMatch;
    phoneAge?: PhoneAge;
    bvnNinStatus?: BvnNinStatus;
  };
  address?: {
    verificationNote?: string;
    residenceDuration?: string;
    utilityBill?: UtilityBill;
  };
  economicActivity?: {
    status?: ActivityStatus;
    duration?: string;
    inflowRange?: string;
    associationMembership?: AssociationMembership;
  };
  references?: TrustReportReference[];
  riskSignals?: {
    fraud?: FraudSignal;
    conflictingRefsOrIdentity?: ConflictingSignal;
  };
}

export const EMPTY_TRUST_REPORT: TrustReportContent = {
  identity: {},
  address: {},
  economicActivity: {},
  references: [],
  riskSignals: {},
};

export function parseTrustReportContent(raw: unknown): TrustReportContent {
  if (!raw || typeof raw !== "object") return EMPTY_TRUST_REPORT;
  const o = raw as Record<string, unknown>;
  const refs = Array.isArray(o.references)
    ? (o.references as TrustReportReference[]).filter(
        (r) => r && typeof r.type === "string" && r.status
      )
    : [];
  return {
    identity:
      o.identity && typeof o.identity === "object"
        ? {
            nameMatch: NAME_MATCH_OPTIONS.includes(
              (o.identity as Record<string, unknown>).nameMatch as NameMatch
            )
              ? ((o.identity as Record<string, unknown>).nameMatch as NameMatch)
              : undefined,
            phoneAge: PHONE_AGE_OPTIONS.includes(
              (o.identity as Record<string, unknown>).phoneAge as PhoneAge
            )
              ? ((o.identity as Record<string, unknown>).phoneAge as PhoneAge)
              : undefined,
            bvnNinStatus: BVN_NIN_OPTIONS.includes(
              (o.identity as Record<string, unknown>)
                .bvnNinStatus as BvnNinStatus
            )
              ? ((o.identity as Record<string, unknown>)
                  .bvnNinStatus as BvnNinStatus)
              : undefined,
          }
        : {},
    address:
      o.address && typeof o.address === "object"
        ? {
            verificationNote:
              String(
                (o.address as Record<string, unknown>).verificationNote ?? ""
              ).trim() || undefined,
            residenceDuration:
              String(
                (o.address as Record<string, unknown>).residenceDuration ?? ""
              ).trim() || undefined,
            utilityBill: UTILITY_BILL_OPTIONS.includes(
              (o.address as Record<string, unknown>).utilityBill as UtilityBill
            )
              ? ((o.address as Record<string, unknown>)
                  .utilityBill as UtilityBill)
              : undefined,
          }
        : {},
    economicActivity:
      o.economicActivity && typeof o.economicActivity === "object"
        ? {
            status: ACTIVITY_STATUS_OPTIONS.includes(
              (o.economicActivity as Record<string, unknown>)
                .status as ActivityStatus
            )
              ? ((o.economicActivity as Record<string, unknown>)
                  .status as ActivityStatus)
              : undefined,
            duration:
              String(
                (o.economicActivity as Record<string, unknown>).duration ?? ""
              ).trim() || undefined,
            inflowRange:
              String(
                (o.economicActivity as Record<string, unknown>).inflowRange ??
                  ""
              ).trim() || undefined,
            associationMembership: ASSOCIATION_OPTIONS.includes(
              (o.economicActivity as Record<string, unknown>)
                .associationMembership as AssociationMembership
            )
              ? ((o.economicActivity as Record<string, unknown>)
                  .associationMembership as AssociationMembership)
              : undefined,
          }
        : {},
    references: refs,
    riskSignals:
      o.riskSignals && typeof o.riskSignals === "object"
        ? {
            fraud: FRAUD_SIGNAL_OPTIONS.includes(
              (o.riskSignals as Record<string, unknown>).fraud as FraudSignal
            )
              ? ((o.riskSignals as Record<string, unknown>)
                  .fraud as FraudSignal)
              : undefined,
            conflictingRefsOrIdentity: CONFLICTING_SIGNAL_OPTIONS.includes(
              (o.riskSignals as Record<string, unknown>)
                .conflictingRefsOrIdentity as ConflictingSignal
            )
              ? ((o.riskSignals as Record<string, unknown>)
                  .conflictingRefsOrIdentity as ConflictingSignal)
              : undefined,
          }
        : {},
  };
}
