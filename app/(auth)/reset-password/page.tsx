"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updatePassword,
  type ResetPasswordFormState,
} from "@/app/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {pending ? "Updating..." : "Set new password"}
    </Button>
  );
}

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState<ResetPasswordFormState, FormData>(
    updatePassword,
    {}
  );

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center px-12 xl:px-20">
        <Link href="/" className="inline-block mb-12">
          <div className="text-white font-semibold text-2xl">Credara</div>
        </Link>
        <h2 className="text-white text-3xl xl:text-4xl font-normal leading-tight mb-4">
          Set a new password
        </h2>
        <p className="text-[rgba(255,255,255,0.8)] text-base max-w-md">
          Choose a strong password to secure your account.
        </p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#49423D] text-3xl font-semibold leading-tight mb-2">
              Reset password
            </h1>
            <p className="text-[#605A57] text-base">
              Enter your new password below.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#37322F] font-medium">
                New password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
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
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
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

            <SubmitButton />
          </form>

          <p className="mt-6 text-center text-[#605A57] text-sm">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#37322F] hover:text-[#49423D] font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
