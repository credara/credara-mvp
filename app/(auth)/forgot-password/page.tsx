"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPassword,
  type ForgotPasswordFormState,
} from "@/app/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {pending ? "Sending..." : "Send reset link"}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState<
    ForgotPasswordFormState & { message?: string },
    FormData
  >(resetPassword, {});

  const success = !!state?.message;

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
          {success ? (
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-[#49423D] text-3xl font-semibold leading-tight mb-2">
                  Check your email
                </h1>
                <p className="text-[#605A57] text-base">
                  We sent you a reset link. If you don&apos;t see it, check your
                  spam folder.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-[#49423D] text-3xl font-semibold leading-tight mb-2">
                  Reset password
                </h1>
                <p className="text-[#605A57] text-base">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>
              <form action={formAction} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#37322F] font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] placeholder-[#9B9592]"
                  />
                  {state?.errors?.email && (
                    <p className="text-red-600 text-sm">{state.errors.email}</p>
                  )}
                </div>

                {state?.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                    {state.error}
                  </div>
                )}

                <SubmitButton />
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[rgba(55,50,47,0.12)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#9B9592]">or</span>
                </div>
              </div>

              <p className="text-center text-[#605A57] text-sm">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-[#37322F] hover:text-[#49423D] font-medium"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
