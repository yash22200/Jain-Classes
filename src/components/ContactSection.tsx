import { useState } from "react";
import { API_URL } from "@/lib/api";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import contactImg from "@/assets/contact-illustration.jpg";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "Competitive Exams (JEE/NEET)",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    // Validate message length
    if (formData.message.trim().length < 5) {
      toast({ title: "Error", description: "Message must be at least 5 characters long", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: `Interested in: ${formData.course}\n\n${formData.message.trim()}`,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast({ title: "Success", description: data.message });
        setFormData({ name: "", phone: "", email: "", course: "Competitive Exams (JEE/NEET)", message: "" });
      } else {
        toast({ title: "Error", description: data.message || "Failed to submit", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">
            Have questions? Fill out the form and our counselor will get back to you within 24 hours.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Our Main Center</h4>
                <p className="text-sm text-muted-foreground">143 Academic Avenue, Educational Zone, Mumbai, MH 400001</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Phone & Email</h4>
                <p className="text-sm text-muted-foreground">+91 98164 43210<br />info@jainclasses.edu</p>
              </div>
            </div>
          </div>

          <img src={contactImg} alt="Students studying" className="rounded-2xl w-full max-w-sm object-cover" />
        </div>

        <div className="bg-secondary rounded-2xl p-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Student Name *</label>
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number *</label>
              <Input
                placeholder="+91 90000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-1.5 block">Select Course</label>
            <select
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            >
              <option>Competitive Exams (JEE/NEET)</option>
              <option>State Board (8th-12th)</option>
              <option>Foundation Course</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium mb-1.5 block">Your Message *</label>
            <Textarea
              placeholder="How can we help you?"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send Enquiry"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
