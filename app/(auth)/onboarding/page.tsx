"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { completeOnboarding } from "@/app/actions/user";
import {
  userTypeValues,
  userTypeLabels,
  type UserType,
} from "@/app/(auth)/schema";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { OnboardingFormState } from "@/app/actions/auth";

const initialFormValues = {
  userType: "individual" as UserType,
  phone: "",
  businessName: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {pending ? "Completing setup..." : "Complete setup"}
    </Button>
  );
}

export default function OnboardingPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [state, formAction] = useActionState<OnboardingFormState, FormData>(
    completeOnboarding,
    {}
  );
  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  const updateField = <K extends keyof typeof initialFormValues>(
    field: K,
    value: (typeof initialFormValues)[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center px-12 xl:px-20">
        <Link href="/" className="inline-block mb-12">
          <div className="text-white font-semibold text-2xl">Credara</div>
        </Link>
        <h2 className="text-white text-3xl xl:text-4xl font-normal leading-tight mb-4">
          One more step to get started
        </h2>
        <p className="text-[rgba(255,255,255,0.8)] text-base max-w-md">
          Tell us how you plan to use Credara so we can tailor your experience.
        </p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#49423D] text-3xl font-semibold leading-tight mb-2">
              Complete your profile
            </h1>
            <p className="text-[#605A57] text-base">
              Choose your account type and add your phone number
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-[#37322F] font-medium">
                Account type
              </Label>
              <input
                type="hidden"
                name="userType"
                value={formValues.userType}
                readOnly
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] hover:bg-[#F7F5F3] font-normal"
                  >
                    {userTypeLabels[formValues.userType]}
                    <ChevronDownIcon className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-(--radix-dropdown-menu-trigger-width)"
                >
                  {userTypeValues.map((value) => (
                    <DropdownMenuItem
                      key={value}
                      onSelect={() => updateField("userType", value)}
                    >
                      {userTypeLabels[value]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {state?.errors?.userType && (
                <p className="text-red-600 text-sm">{state.errors.userType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#37322F] font-medium">
                Phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                name="phone"
                value={formValues.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
                className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] placeholder-[#9B9592]"
              />
              {state?.errors?.phone && (
                <p className="text-red-600 text-sm">{state.errors.phone}</p>
              )}
            </div>

            {formValues.userType === "fintech" && (
              <div className="space-y-2">
                <Label
                  htmlFor="businessName"
                  className="text-[#37322F] font-medium"
                >
                  Business name{" "}
                  <span className="text-[#9B9592] font-normal">(optional)</span>
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your company name"
                  name="businessName"
                  value={formValues.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] placeholder-[#9B9592]"
                />
                {state?.errors?.businessName && (
                  <p className="text-red-600 text-sm">
                    {state.errors.businessName}
                  </p>
                )}
              </div>
            )}

            {/* {state?.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {state.error}
              </div>
            )} */}

            <SubmitButton />
          </form>

          <p className="text-center text-[#9B9592] text-xs mt-6">
            By continuing, you agree to our{" "}
            <Link href="#" className="hover:text-[#605A57] underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="hover:text-[#605A57] underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
