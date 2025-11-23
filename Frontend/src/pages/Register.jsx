import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Aurora from "@/components/Aurora";
import PasswordStrengthMeter from "@/utils/PasswordMeter";
import { toast } from "sonner";

import { useUser } from "@/context/UserContext";
import { registerUser } from "@/APIs/User";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const idempotencyKeyRef = useRef(uuidv4());

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);

    const idempotencyKey = idempotencyKeyRef.current;

    try {
      const user = await registerUser({ ...values, idempotencyKey });

      idempotencyKeyRef.current = uuidv4();

      toast.success("Account Created Successfully", {
        description: (
          <span className="text-black">
            You can now log in to your account.
          </span>
        ),
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });

      setUser(user);
      navigate("/");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        error?.toString() ||
        "Something went wrong";
      toast.error(<span className="text-red-600">Registration failed!</span>, {
        description: <span className="text-black">{backendMessage}</span>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <main className="relative z-10 p-8 max-w-7xl mx-auto flex justify-center items-center h-full text-white/80">
        <Card className="w-full max-w-md bg-white/0 backdrop-blur-xl border border-white/20 shadow-xl text-white">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-extrabold tracking-tight">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <Label>Username</Label>
                <Input
                  {...form.register("username")}
                  placeholder="@username"
                  className="bg-white/0 border-white/30 text-white placeholder:text-white/50"
                />
                {form.formState.errors.username && (
                  <p className="text-red-400 text-sm">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  {...form.register("name")}
                  placeholder="John Doe"
                  className="bg-white/0 border-white/30 text-white placeholder:text-white/50"
                />
                {form.formState.errors.name && (
                  <p className="text-red-400 text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  {...form.register("email")}
                  placeholder="example@gmail.com"
                  className="bg-white/0 border-white/30 text-white placeholder:text-white/50"
                />
                {form.formState.errors.email && (
                  <p className="text-red-400 text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label>Password</Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="6+ characters"
                    className="bg-white/0 border-white/30 text-white placeholder:text-white/50 pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-white/60"
                  >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>

                {form.formState.errors.password && (
                  <p className="text-red-400 text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <PasswordStrengthMeter password={form.watch("password")} />

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-700 to-indigo-800 
                hover:from-blue-600 hover:to-indigo-700 
                text-white font-semibold rounded-md py-2 
                shadow-[0_4px_20px_rgba(59,130,246,0.3)]
                hover:shadow-[0_6px_25px_rgba(59,130,246,0.45)]
                transition-all duration-300"
              >
                {loading ? "Creating..." : "Register"}
              </Button>

              <p className="text-center text-sm text-white/60">
                Already have an account?{" "}
                <span
                  className="text-blue-400 hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
                <br />
                <Link
                  to="/"
                  className="inline-block mt-2 text-gray-500 hover:text-gray-800 text-sm"
                >
                  ← Back to Home
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Register;
