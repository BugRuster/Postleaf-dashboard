"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { login, type LoginRequest } from "@/lib/api/auth";
import { setToken, setUser } from "@/lib/auth/token";
import { loginSchema, type LoginFormData } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EnvelopeSimple,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const isEmail = data.identifier.includes("@");

      const loginPayload: LoginRequest = isEmail
        ? { email: data.identifier, password: data.password }
        : { username: data.identifier, password: data.password };

      const response = await login(loginPayload);

      if (
        !response.data.user.isAdmin ||
        (response.data.role !== "admin" && response.data.role !== "super_admin")
      ) {
        setErrorMessage(
          "Access denied. Only admins and super admins can access this dashboard.",
        );
        setIsLoading(false);
        return;
      }

      if (response.data.user.adminExpiryTime) {
        const expiryTime = new Date(response.data.user.adminExpiryTime);
        const currentTime = new Date();

        if (currentTime >= expiryTime) {
          setErrorMessage(
            "Your admin access has expired. Please contact a super admin.",
          );
          setIsLoading(false);
          return;
        }
      }

      const authToken = response.data.token;
      const userData = response.data.user;

      setToken(authToken);
      setUser(userData);

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status: number;
            data?: {
              message?: string;
              error?: string;
            };
          };
        };

        const backendMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error;

        if (backendMessage) {
          setErrorMessage(backendMessage);
        } else {
          const status = axiosError.response?.status;
          if (status === 401 || status === 400) {
            setErrorMessage(
              "Invalid username/email or password. Please try again.",
            );
          } else if (status === 403) {
            setErrorMessage(
              "Access denied. You don't have permission to log in.",
            );
          } else {
            setErrorMessage("An error occurred. Please try again later.");
          }
        }
      } else if (error && typeof error === "object" && "request" in error) {
        setErrorMessage(
          "Unable to connect to server. Please check your internet connection.",
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black dark:bg-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent dark:from-white/50"></div>
        <div className="relative z-10">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Postleaf"
              width={240}
              height={240}
              className=""
            />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck
              size={48}
              weight="fill"
              className="text-white dark:text-black"
            />
          </div>
          <h1 className="text-5xl font-bold text-white dark:text-black leading-tight">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/90 dark:text-black/90">
            Manage your platform, monitor activity, and keep your community
            safe.
          </p>
        </div>

        <div className="relative z-10 text-white/80 dark:text-black/80 text-sm">
          © 2026 Postleaf. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Postleaf"
              width={140}
              height={140}
              className=""
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Sign in
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your admin credentials to access the dashboard
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="identifier"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username or Email
              </Label>
              <div className="relative">
                <EnvelopeSimple
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your username or email"
                  {...register("identifier")}
                  disabled={isLoading}
                  className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white"
                />
              </div>
              {errors.identifier && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isLoading}
                  className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold rounded-lg shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in to Dashboard
                  <ArrowRight size={20} />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-gray-500 dark:text-gray-500">
            By continuing, you agree to our{" "}
            <Link
              href="https://postleaf.live/tandc.html"
              target="_blank"
              className="underline hover:text-gray-700 dark:hover:text-gray-300"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="https://postleaf.live/privacypolicy.html"
              target="_blank"
              className="underline hover:text-gray-700 dark:hover:text-gray-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
