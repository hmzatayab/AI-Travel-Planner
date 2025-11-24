import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { loginUser } from "@/APIs/User";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import Aurora from "@/components/Aurora";
import LoadingIcon from "@/utils/Loading";

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await loginUser(data);

      if (user) {
        setUser(user);
        localStorage.setItem("userToken", user.token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 w-full h-full z-0">
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
              Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="emailOrUsername"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          className="bg-white/0 border-white/30 text-white placeholder:text-white/50"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    const [showPassword, setShowPassword] = useState(false);
                    return (
                      <FormItem className="relative">
                        <Label>Password</Label>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="bg-white/0 border-white/30 text-white placeholder:text-white/50 pr-10"
                              {...field}
                              value={field.value || ""}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff size={15} />
                              ) : (
                                <Eye size={15} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-md py-2 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.45)] transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div role="status" className="flex items-center gap-2">
                      <LoadingIcon />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-white/60 mt-4">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Register here
              </Link>
              <br />
              <Link
                to="/"
                className="inline-block mt-2 text-white/50 hover:text-white/80 text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
