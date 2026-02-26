"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TrustReportContent,
  TrustReportReference,
  NameMatch,
  PhoneAge,
  BvnNinStatus,
  UtilityBill,
  ActivityStatus,
  AssociationMembership,
  ReferenceStatus,
  FraudSignal,
  ConflictingSignal,
} from "@/lib/types/trust-report";
import {
  NAME_MATCH_OPTIONS,
  PHONE_AGE_OPTIONS,
  BVN_NIN_OPTIONS,
  UTILITY_BILL_OPTIONS,
  ACTIVITY_STATUS_OPTIONS,
  ASSOCIATION_OPTIONS,
  REFERENCE_STATUS_OPTIONS,
  FRAUD_SIGNAL_OPTIONS,
  CONFLICTING_SIGNAL_OPTIONS,
} from "@/lib/types/trust-report";
import { Plus, Trash2 } from "lucide-react";

type TrustReportFormProps = {
  initialContent: TrustReportContent;
  onSubmit: (content: TrustReportContent) => void;
  isPending: boolean;
};

export function TrustReportForm({
  initialContent,
  onSubmit,
  isPending,
}: TrustReportFormProps) {
  const [identity, setIdentity] = React.useState({
    nameMatch: (initialContent.identity?.nameMatch ?? "") as NameMatch | "",
    phoneAge: (initialContent.identity?.phoneAge ?? "") as PhoneAge | "",
    bvnNinStatus: (initialContent.identity?.bvnNinStatus ?? "") as
      | BvnNinStatus
      | "",
  });
  const [address, setAddress] = React.useState({
    verificationNote: initialContent.address?.verificationNote ?? "",
    residenceDuration: initialContent.address?.residenceDuration ?? "",
    utilityBill: (initialContent.address?.utilityBill ?? "") as
      | UtilityBill
      | "",
  });
  const [economic, setEconomic] = React.useState({
    status: (initialContent.economicActivity?.status ?? "") as
      | ActivityStatus
      | "",
    duration: initialContent.economicActivity?.duration ?? "",
    inflowRange: initialContent.economicActivity?.inflowRange ?? "",
    associationMembership: (initialContent.economicActivity
      ?.associationMembership ?? "") as AssociationMembership | "",
  });
  const [references, setReferences] = React.useState<TrustReportReference[]>(
    initialContent.references?.length
      ? [...initialContent.references]
      : [{ type: "", status: "Not provided" }]
  );
  const [riskSignals, setRiskSignals] = React.useState({
    fraud: (initialContent.riskSignals?.fraud ?? "") as FraudSignal | "",
    conflictingRefsOrIdentity: (initialContent.riskSignals
      ?.conflictingRefsOrIdentity ?? "") as ConflictingSignal | "",
  });

  const buildContent = (): TrustReportContent => {
    const refs = references.filter(
      (r) => r.type.trim() !== "" || r.status !== "Not provided"
    );
    return {
      identity: {
        ...(identity.nameMatch && { nameMatch: identity.nameMatch }),
        ...(identity.phoneAge && { phoneAge: identity.phoneAge }),
        ...(identity.bvnNinStatus && { bvnNinStatus: identity.bvnNinStatus }),
      },
      address: {
        ...(address.verificationNote && {
          verificationNote: address.verificationNote,
        }),
        ...(address.residenceDuration && {
          residenceDuration: address.residenceDuration,
        }),
        ...(address.utilityBill && { utilityBill: address.utilityBill }),
      },
      economicActivity: {
        ...(economic.status && { status: economic.status }),
        ...(economic.duration && { duration: economic.duration }),
        ...(economic.inflowRange && { inflowRange: economic.inflowRange }),
        ...(economic.associationMembership && {
          associationMembership: economic.associationMembership,
        }),
      },
      references: refs.length ? refs : [{ type: "", status: "Not provided" }],
      riskSignals: {
        ...(riskSignals.fraud && { fraud: riskSignals.fraud }),
        ...(riskSignals.conflictingRefsOrIdentity && {
          conflictingRefsOrIdentity: riskSignals.conflictingRefsOrIdentity,
        }),
      },
    };
  };

  const hasChanges = React.useMemo(() => {
    const current = buildContent();
    const refsA = current.references ?? [];
    const refsB = initialContent.references ?? [];
    if (refsA.length !== refsB.length) return true;
    const sameRefs = refsA.every(
      (r, i) =>
        refsB[i] &&
        r.type === refsB[i].type &&
        r.status === (refsB[i] as TrustReportReference).status
    );
    if (!sameRefs) return true;
    return (
      JSON.stringify({
        identity: current.identity ?? {},
        address: current.address ?? {},
        economicActivity: current.economicActivity ?? {},
        riskSignals: current.riskSignals ?? {},
      }) !==
      JSON.stringify({
        identity: initialContent.identity ?? {},
        address: initialContent.address ?? {},
        economicActivity: initialContent.economicActivity ?? {},
        riskSignals: initialContent.riskSignals ?? {},
      })
    );
  }, [
    identity,
    address,
    economic,
    references,
    riskSignals,
    initialContent,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(buildContent());
  };

  const addReference = () =>
    setReferences((prev) => [...prev, { type: "", status: "Not provided" }]);
  const removeReference = (index: number) =>
    setReferences((prev) => prev.filter((_, i) => i !== index));
  const updateReference = (
    index: number,
    field: "type" | "status",
    value: string
  ) =>
    setReferences((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section>
        <h3 className="mb-3 text-sm font-medium">Identity</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Name match</Label>
            <Select
              value={identity.nameMatch || "none"}
              onValueChange={(v) =>
                setIdentity((p) => ({
                  ...p,
                  nameMatch: (v === "none" ? "" : v) as NameMatch,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {NAME_MATCH_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Phone age</Label>
            <Select
              value={identity.phoneAge || "none"}
              onValueChange={(v) =>
                setIdentity((p) => ({
                  ...p,
                  phoneAge: (v === "none" ? "" : v) as PhoneAge,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {PHONE_AGE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>BVN/NIN</Label>
            <Select
              value={identity.bvnNinStatus || "none"}
              onValueChange={(v) =>
                setIdentity((p) => ({
                  ...p,
                  bvnNinStatus: (v === "none" ? "" : v) as BvnNinStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {BVN_NIN_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium">Address & residence</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Verification note</Label>
            <Textarea
              value={address.verificationNote}
              onChange={(e) =>
                setAddress((p) => ({ ...p, verificationNote: e.target.value }))
              }
              placeholder="e.g. verified by landlord call"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Residence duration</Label>
            <Input
              value={address.residenceDuration}
              onChange={(e) =>
                setAddress((p) => ({ ...p, residenceDuration: e.target.value }))
              }
              placeholder="e.g. 3 years"
            />
          </div>
          <div className="space-y-2">
            <Label>Utility bill</Label>
            <Select
              value={address.utilityBill || "none"}
              onValueChange={(v) =>
                setAddress((p) => ({
                  ...p,
                  utilityBill: (v === "none" ? "" : v) as UtilityBill,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {UTILITY_BILL_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium">
          Economic activity (incl. POS)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={economic.status || "none"}
              onValueChange={(v) =>
                setEconomic((p) => ({
                  ...p,
                  status: (v === "none" ? "" : v) as ActivityStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {ACTIVITY_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input
              value={economic.duration}
              onChange={(e) =>
                setEconomic((p) => ({ ...p, duration: e.target.value }))
              }
              placeholder="e.g. 18 months"
            />
          </div>
          <div className="space-y-2">
            <Label>Inflow range</Label>
            <Input
              value={economic.inflowRange}
              onChange={(e) =>
                setEconomic((p) => ({ ...p, inflowRange: e.target.value }))
              }
              placeholder="e.g. ₦180k–₦250k"
            />
          </div>
          <div className="space-y-2">
            <Label>Association</Label>
            <Select
              value={economic.associationMembership || "none"}
              onValueChange={(v) =>
                setEconomic((p) => ({
                  ...p,
                  associationMembership: (v === "none"
                    ? ""
                    : v) as AssociationMembership,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {ASSOCIATION_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium">References</h3>
        <div className="space-y-3">
          {references.map((ref, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2">
              <div className="min-w-[140px] flex-1 space-y-1">
                <Label className="text-xs">Type</Label>
                <Input
                  value={ref.type}
                  onChange={(e) => updateReference(i, "type", e.target.value)}
                  placeholder="e.g. Landlord reference"
                />
              </div>
              <div className="w-[160px] space-y-1">
                <Label className="text-xs">Status</Label>
                <Select
                  value={ref.status}
                  onValueChange={(v) =>
                    updateReference(i, "status", v as ReferenceStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFERENCE_STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeReference(i)}
                disabled={references.length <= 1}
                aria-label="Remove reference"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addReference}
          >
            <Plus className="mr-2 size-4" />
            Add reference
          </Button>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium">Risk signals</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Fraud</Label>
            <Select
              value={riskSignals.fraud || "none"}
              onValueChange={(v) =>
                setRiskSignals((p) => ({
                  ...p,
                  fraud: (v === "none" ? "" : v) as FraudSignal,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {FRAUD_SIGNAL_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Conflicting refs / identity</Label>
            <Select
              value={riskSignals.conflictingRefsOrIdentity || "none"}
              onValueChange={(v) =>
                setRiskSignals((p) => ({
                  ...p,
                  conflictingRefsOrIdentity: (v === "none"
                    ? ""
                    : v) as ConflictingSignal,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {CONFLICTING_SIGNAL_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Button type="submit" disabled={isPending || !hasChanges}>
        Save trust report
      </Button>
    </form>
  );
}
