import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-foreground))] py-12">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-white font-display">Jain Classes</span>
          </div>
          <p className="text-xs opacity-60 leading-relaxed">
            Dedicated to providing high-quality education and mentorship to help students reach their full potential since 2009.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs opacity-60">
            <li><a href="#courses" className="hover:opacity-100">Courses Offered</a></li>
            <li><a href="#" className="hover:opacity-100">Fee Structure</a></li>
            <li><a href="#" className="hover:opacity-100">Scholarship Test</a></li>
            <li><a href="#" className="hover:opacity-100">Student Login</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Academic Support</h4>
          <ul className="space-y-2 text-xs opacity-60">
            <li><a href="#" className="hover:opacity-100">Digital Library</a></li>
            <li><a href="#" className="hover:opacity-100">Doubt Clearing Sessions</a></li>
            <li><a href="#" className="hover:opacity-100">Previous Papers</a></li>
            <li><a href="#" className="hover:opacity-100">Study Material</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Newsletter</h4>
          <p className="text-xs opacity-60 mb-3">Stay updated with our latest course news.</p>
          <div className="flex gap-2">
            <Input placeholder="Email" className="bg-white/10 border-white/10 text-white placeholder:text-white/40 text-xs h-9" />
            <Button size="sm" className="h-9 shrink-0">→</Button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs opacity-50">© 2024 Jain Classes Coaching Institute. All rights reserved.</p>
        <div className="flex gap-4 text-xs opacity-50">
          <a href="#" className="hover:opacity-100">Privacy Policy</a>
          <a href="#" className="hover:opacity-100">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
