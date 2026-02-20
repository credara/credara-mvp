"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  signUp,
  signInWithGoogleForm,
  type SignUpFormState,
} from "@/app/actions/auth";
import {
  userTypeValues,
  userTypeLabels,
  type UserType,
} from "@/app/(auth)/schema";
import { ChevronDownIcon } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}

export default function SignupPage() {
  const [agreed, setAgreed] = useState(false);
  const [userType, setUserType] = useState<UserType>("individual");
  const [state, formAction] = useFormState<SignUpFormState, FormData>(
    signUp,
    {}
  );

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center px-12 xl:px-20">
        <Link href="/" className="inline-block mb-12">
          <div className="text-white font-semibold text-2xl">Credara</div>
        </Link>
        <h2 className="text-white text-3xl xl:text-4xl font-normal leading-tight mb-4">
          Build trust with verified Credara Trust Scores
        </h2>
        <p className="text-[rgba(255,255,255,0.8)] text-base max-w-md">
          Comprehensive trustworthiness assessment for rentals, lending, and
          beyond in emerging markets.
        </p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#49423D] text-3xl font-semibold leading-tight mb-2">
              Get started
            </h1>
            <p className="text-[#605A57] text-base">
              Create your Credara account to request trust assessments
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#37322F] font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                name="fullName"
                required
                className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] placeholder-[#9B9592]"
              />
              {state?.errors?.fullName && (
                <p className="text-red-600 text-sm">{state.errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#37322F] font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                required
                className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] placeholder-[#9B9592]"
              />
              {state?.errors?.email && (
                <p className="text-red-600 text-sm">{state.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType" className="text-[#37322F] font-medium">
                Account type
              </Label>
              <input type="hidden" name="userType" value={userType} readOnly />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] hover:bg-[#F7F5F3] font-normal"
                  >
                    {userTypeLabels[userType]}
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
                      onSelect={() => setUserType(value)}
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
              <Label htmlFor="password" className="text-[#37322F] font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                required
                className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] placeholder-[#9B9592]"
              />
              {state?.errors?.password && (
                <p className="text-red-600 text-sm">{state.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-[#37322F] font-medium"
              >
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                required
                className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] placeholder-[#9B9592]"
              />
              {state?.errors?.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>

            {state?.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {state.error}
              </div>
            )}

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="hidden"
                name="agreed"
                value={agreed ? "on" : ""}
                readOnly
              />
              <Checkbox
                id="agreed"
                checked={agreed}
                onCheckedChange={(c) => setAgreed(c === true)}
                className="mt-1"
              />
              <label
                htmlFor="agreed"
                className="text-[#605A57] text-sm leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-[#37322F] hover:text-[#49423D] font-medium underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-[#37322F] hover:text-[#49423D] font-medium underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {state?.errors?.agreed && (
              <p className="text-red-600 text-sm">{state.errors.agreed}</p>
            )}

            <SubmitButton />
          </form>

          <form action={signInWithGoogleForm} className="mt-4">
            <Button
              type="submit"
              variant="outline"
              className="w-full border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] hover:bg-[#F7F5F3]"
            >
              <svg className="mr-2 size-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
          </form>

          <p className="text-center text-[#605A57] text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#37322F] hover:text-[#49423D] font-medium"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-[#9B9592] text-xs mt-6">
            We take your data security and privacy seriously
          </p>
        </div>
      </div>
    </div>
  );
}
