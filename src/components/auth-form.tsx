"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload =
      mode === "signup"
        ? {
            email: String(formData.get("email") ?? ""),
            name: String(formData.get("name") ?? ""),
            password: String(formData.get("password") ?? ""),
          }
        : {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          };
    const response = await fetch(`/api/auth/${mode === "signup" ? "register" : "login"}`, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    setLoading(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(result?.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <form className="app-card mx-auto grid max-w-[520px] gap-4 p-6" onSubmit={handleSubmit}>
      {mode === "signup" ? (
        <label className="text-sm font-bold">
          Name
          <input
            className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3"
            name="name"
            required
            minLength={2}
            autoComplete="name"
          />
        </label>
      ) : null}
      <label className="text-sm font-bold">
        Email
        <input
          className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3"
          name="email"
          required
          type="email"
          autoComplete="email"
        />
      </label>
      <label className="text-sm font-bold">
        Password
        <input
          className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3"
          name="password"
          required
          minLength={8}
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </label>
      {error ? <p className="rounded-[7px] bg-[#fff0ee] p-3 text-sm font-bold text-[#d63f3f]">{error}</p> : null}
      <button className="button-primary w-full" disabled={loading} type="submit">
        {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "signup" ? "Already have an account?" : "New to Mystery Scoop?"}{" "}
        <Link className="font-black text-[#f72c7b]" href={mode === "signup" ? "/login" : "/signup"}>
          {mode === "signup" ? "Log in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
