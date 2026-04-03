import { useState } from "react";
import { GraduationCap, AtSign, Lock, Eye, EyeOff, User, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password, confirm);
      // after signup, route to student dashboard
      navigate("/student", { replace: true });
    } catch (err: any) {
      setError(err.message);
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
          <Link to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Signup Form */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Create Account</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Join Jain Classes and start your learning journey today.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md bg-card rounded-xl border shadow-sm p-6 space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="John Doe" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="name@example.com" className="pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="+91 98765 43210" className="pl-10" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="••••••••"
                className="pl-10 pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="••••••••"
                className="pl-10 pr-10"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <Checkbox id="terms" className="mt-0.5" />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the <button className="text-primary hover:underline font-medium">Terms of Service</button> and <button className="text-primary hover:underline font-medium">Privacy Policy</button>
            </label>
          </div>

          {/* Submit */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full h-12 text-base font-semibold gap-2" size="lg">
            Create Account <UserPlus className="w-5 h-5" />
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Already a student?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
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

export default Signup;
