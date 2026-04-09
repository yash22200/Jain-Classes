import { useState, useEffect } from "react";
import { GraduationCap, AtSign, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to the appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Pass the selected role tab so the backend can validate it
      // The `login` function returns the user object directly — no localStorage read needed
      const loggedInUser = await login(email, password, role);

      // Navigate based on the RETURNED user's actual role (from backend, not from UI state)
      if (loggedInUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-[-60px] w-48 h-48 rounded-full bg-primary/10" />
      <div className="absolute bottom-0 left-[-40px] w-56 h-56 rounded-full bg-primary/10" />
      <div className="absolute top-1/3 left-[-20px] w-24 h-64 rounded-full bg-primary/5 rotate-12" />
      <div className="absolute top-1/4 right-0 w-16 h-40 rounded-full bg-primary/5" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display">Jain Classes</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Home", "About", "Courses", "Contact"].map((link) => (
              <Link key={link} to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Welcome Back</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Please enter your credentials to access the tuition management system.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md bg-card rounded-xl border shadow-sm p-6 space-y-6">
          {/* Role Tabs */}
          <div className="flex rounded-lg border overflow-hidden">
            {(["student", "admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setError(null); // Clear error when switching tabs
                }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors capitalize ${
                  role === r
                    ? "bg-primary/10 text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "student" ? "Student" : "Admin"}
              </button>
            ))}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-email"
                placeholder="name@example.com"
                className="pl-10"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Password</Label>
              <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-password"
                placeholder="••••••••"
                className="pl-10 pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Keep me logged in */}
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              Keep me logged in
            </label>
          </div>

          {/* Submit */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold gap-2"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                Login as {role === "admin" ? "Admin" : "Student"} <LogIn className="w-5 h-5" />
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Need Help?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            New to Jain Classes?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Create an account</Link>
          </p>
        </form>

        {/* Footer links */}
        <div className="flex gap-6 mt-8 text-xs text-muted-foreground">
          <button className="hover:text-foreground">Privacy Policy</button>
          <button className="hover:text-foreground">Terms of Service</button>
          <button className="hover:text-foreground">Help Center</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
