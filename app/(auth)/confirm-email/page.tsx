import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center px-12 xl:px-20">
        <Link href="/" className="inline-block mb-12">
          <div className="text-white font-semibold text-2xl">Credara</div>
        </Link>
        <h2 className="text-white text-3xl xl:text-4xl font-normal leading-tight mb-4">
          Check your inbox
        </h2>
        <p className="text-[rgba(255,255,255,0.8)] text-base max-w-md">
          We&apos;ve sent you an email with a link to confirm your account.
        </p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#49423D] text-3xl font-semibold leading-tight mb-2">
              Confirm your email
            </h1>
            <p className="text-[#605A57] text-base">
              We&apos;ve sent a confirmation link to the email address you
              provided. Click the link in that email to activate your account.
            </p>
          </div>

          <p className="text-[#9B9592] text-sm mb-8">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <Link
              href="/signup"
              className="text-[#37322F] hover:text-[#49423D] font-medium underline"
            >
              try signing up again
            </Link>
            .
          </p>

          <Button
            asChild
            variant="outline"
            className="w-full border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] hover:bg-[#F7F5F3 font-normal"
          >
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
