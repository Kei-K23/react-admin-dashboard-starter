import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../services/auth-service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin, useProfile } from "../../hooks/use-auth";
import { toast } from "sonner";
import ms, { type StringValue } from "ms";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/common/constraints";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { data: profile, refetch } = useProfile();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        const accessExpires = new Date(
          Date.now() + ms(data.data.data.accessTokenExpiresAt as StringValue)
        );
        const refreshExpires = new Date(
          Date.now() + ms(data.data.data.refreshTokenExpiresAt as StringValue)
        );

        Cookies.set(ACCESS_TOKEN_KEY, data.data.data.accessToken, {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          expires: accessExpires,
        });

        Cookies.set(REFRESH_TOKEN_KEY, data.data.data.refreshToken, {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          expires: refreshExpires,
        });

        toast.success(data.data.message);
        // Refetch profile after login to update permissions
        refetch();
        navigate("/", { replace: true });
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  }

  useEffect(() => {
    if (profile?.data?.id) {
      navigate("/", { replace: true });
    }
  }, [profile]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Login</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
