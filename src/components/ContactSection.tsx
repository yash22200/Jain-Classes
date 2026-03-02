import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import contactImg from "@/assets/contact-illustration.jpg";

const ContactSection = () => (
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
            <label className="text-sm font-medium mb-1.5 block">Student Name</label>
            <Input placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
            <Input placeholder="+91 90000 00000" />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1.5 block">Select Course</label>
          <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
            <option>Competitive Exams (JEE/NEET)</option>
            <option>State Board (8th-12th)</option>
            <option>Foundation Course</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium mb-1.5 block">Your Message</label>
          <Textarea placeholder="How can we help you?" rows={4} />
        </div>

        <Button className="w-full" size="lg">Send Enquiry</Button>
      </div>
    </div>
  </section>
);

export default ContactSection;
