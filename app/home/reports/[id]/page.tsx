"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getReportByTargetId } from "@/app/actions/institution";
import { TrustScoreChart } from "@/components/dashboard/trust-score-chart";
import { parseTrustReportContent } from "@/lib/types/trust-report";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Users,
  ShieldAlert,
  FileCheck,
  Loader2,
} from "lucide-react";

const SECTION_ICONS = {
  identity: User,
  address: MapPin,
  economic: Briefcase,
  references: Users,
  risk: ShieldAlert,
} as const;

function ReportSectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

function KeyValueRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  const v = value ?? "—";
  return (
    <div className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0 border-b border-border/60 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={
          mono ? "font-mono text-sm font-medium" : "text-sm font-medium"
        }
      >
        {v}
      </span>
    </div>
  );
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const { data: report, isLoading } = useQuery({
    queryKey: ["institution", "report", id],
    queryFn: () => getReportByTargetId(id),
  });

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-center text-muted-foreground">
          Report not found or you have not unlocked this report.
        </p>
        <p className="text-center">
          <Link href="/home" className="text-sm text-primary hover:underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    );
  }

  const displayName = report.fullName ?? report.email ?? report.phone ?? "—";
  const content = parseTrustReportContent(report.trustReportContent ?? null);
  const hasIdentityBullets =
    content.identity?.nameMatch ||
    content.identity?.phoneAge ||
    content.identity?.bvnNinStatus;
  const hasAddress =
    content.address?.verificationNote ||
    content.address?.residenceDuration ||
    content.address?.utilityBill;
  const hasEconomic =
    content.economicActivity?.status ||
    content.economicActivity?.duration ||
    content.economicActivity?.inflowRange ||
    content.economicActivity?.associationMembership;
  const referenceList =
    content.references?.filter(
      (r) => r.type.trim() || r.status !== "Not provided"
    ) ?? [];
  const hasReferences = referenceList.length > 0;
  const hasRiskSignals =
    content.riskSignals?.fraud ||
    content.riskSignals?.conflictingRefsOrIdentity;

  const fraudVariant =
    content.riskSignals?.fraud === "Reported" ||
    content.riskSignals?.fraud === "Suspected"
      ? "destructive"
      : "secondary";
  const conflictVariant =
    content.riskSignals?.conflictingRefsOrIdentity === "Present"
      ? "destructive"
      : "secondary";

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Credara Trust Report
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{displayName}</p>
            {report.credaraId && (
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                ID: {report.credaraId}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="size-4 text-muted-foreground" />
            <Badge variant="outline" className="font-normal">
              {report.verificationStatus ?? "—"}
            </Badge>
          </div>
        </div>
      </header>

      <section aria-labelledby="trust-score-heading">
        <h2 id="trust-score-heading" className="sr-only">
          Trust score
        </h2>
        <TrustScoreChart score={report.trustScore ?? 0} />
      </section>

      <ReportSectionCard
        title="Identity"
        description="Contact and verification details"
        icon={SECTION_ICONS.identity}
      >
        <div className="space-y-1">
          <KeyValueRow label="Full name" value={report.fullName} />
          <KeyValueRow label="Email" value={report.email} />
          <KeyValueRow label="Phone" value={report.phone} />
          <KeyValueRow label="Credara ID" value={report.credaraId} mono />
          {hasIdentityBullets && (
            <>
              {content.identity?.nameMatch && (
                <KeyValueRow
                  label="Name match"
                  value={content.identity.nameMatch}
                />
              )}
              {content.identity?.phoneAge && (
                <KeyValueRow
                  label="Phone age"
                  value={content.identity.phoneAge}
                />
              )}
              {content.identity?.bvnNinStatus && (
                <KeyValueRow
                  label="BVN / NIN"
                  value={content.identity.bvnNinStatus}
                />
              )}
            </>
          )}
        </div>
      </ReportSectionCard>

      {hasAddress && (
        <ReportSectionCard
          title="Address & residence"
          description="Residence verification and documentation"
          icon={SECTION_ICONS.address}
        >
          <ul className="space-y-3 text-sm">
            {content.address?.verificationNote && (
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">Note:</span>
                <span className="font-medium">
                  {content.address.verificationNote}
                </span>
              </li>
            )}
            {content.address?.residenceDuration && (
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  Duration:
                </span>
                <span className="font-medium">
                  {content.address.residenceDuration}
                </span>
              </li>
            )}
            {content.address?.utilityBill && (
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  Utility bill:
                </span>
                <span className="font-medium">
                  {content.address.utilityBill}
                </span>
              </li>
            )}
          </ul>
        </ReportSectionCard>
      )}

      {hasEconomic && (
        <ReportSectionCard
          title="Economic activity"
          description="Including POS agent activity"
          icon={SECTION_ICONS.economic}
        >
          <ul className="space-y-3 text-sm">
            {content.economicActivity?.status && (
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">Status:</span>
                <span className="font-medium">
                  {content.economicActivity.status}
                </span>
              </li>
            )}
            {content.economicActivity?.duration && (
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  Duration:
                </span>
                <span className="font-medium">
                  {content.economicActivity.duration}
                </span>
              </li>
            )}
            {content.economicActivity?.inflowRange && (
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  Inflow range:
                </span>
                <span className="font-medium">
                  {content.economicActivity.inflowRange}
                </span>
              </li>
            )}
            {content.economicActivity?.associationMembership && (
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  Association:
                </span>
                <span className="font-medium">
                  {content.economicActivity.associationMembership}
                </span>
              </li>
            )}
          </ul>
        </ReportSectionCard>
      )}

      {hasReferences && (
        <ReportSectionCard
          title="References"
          description="Reference checks and status"
          icon={SECTION_ICONS.references}
        >
          <ul className="space-y-3">
            {referenceList.map((r, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2"
              >
                <span className="text-sm font-medium">
                  {r.type.trim() || "Reference"}
                </span>
                <Badge variant="outline" className="font-normal">
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
        </ReportSectionCard>
      )}

      {hasRiskSignals && (
        <ReportSectionCard
          title="Risk signals"
          description="Fraud and consistency flags"
          icon={SECTION_ICONS.risk}
        >
          <div className="flex flex-wrap gap-3">
            {content.riskSignals?.fraud && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Fraud:</span>
                <Badge variant={fraudVariant}>
                  {content.riskSignals.fraud}
                </Badge>
              </div>
            )}
            {content.riskSignals?.conflictingRefsOrIdentity && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Conflicting refs / identity:
                </span>
                <Badge variant={conflictVariant}>
                  {content.riskSignals.conflictingRefsOrIdentity}
                </Badge>
              </div>
            )}
          </div>
        </ReportSectionCard>
      )}
    </div>
  );
}
