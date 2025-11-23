import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/admin/dashboard");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/dashboard`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else if (data.user) {
      // Assign admin role to the first user (or any user who signs up through this page)
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{ user_id: data.user.id, role: "admin" }]);

      if (roleError) {
        console.error("Error assigning admin role:", roleError);
      }

      toast.success("Account created! Please sign in.");
      setIsSignUp(false);
    }

    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else if (data.session) {
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 flex items-center justify-center">
        <Card className="p-8 w-full max-w-md border-border/50 animate-fade-in">
          <h1 className="text-4xl font-bold text-center mb-2">
            Admin <span className="text-primary">{isSignUp ? "Sign Up" : "Login"}</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {isSignUp ? "Create your admin account" : "Sign in to manage your website"}
          </p>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:scale-105 transition-all"
            >
              {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Sign up"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
