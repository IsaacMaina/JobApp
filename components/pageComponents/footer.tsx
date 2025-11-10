import Link from "next/link";
import {
  Facebook,
  X,
  Instagram,
  Linkedin,
  Github,
  MessageCircle,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-red-900 text-amber-50 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Logo and copyright */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Link
              href="/"
              className="text-2xl font-bold text-amber-50 rounded-md px-2 py-1 hover:bg-slate-50 hover:text-red-900 transition-colors duration-200"
            >
              My Job
            </Link>
            <p className="text-sm text-amber-100">
              &copy; {new Date().getFullYear()} My Job. All rights reserved.
            </p>
          </div>

          {/* Quick navigation links */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Link
                href="/jobs"
                className="text-amber-50 border border-amber-50 rounded-md px-2 py-1 hover:bg-slate-50 hover:text-red-900 transition-colors duration-200"
              >
                Browse Jobs
              </Link>
              <Link
                href="/dashboard"
                className="text-amber-50 border border-amber-50 rounded-md px-2 py-1 hover:bg-slate-50 hover:text-red-900 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs/post"
                className="text-amber-50 border border-amber-50 rounded-md px-2 py-1 hover:bg-slate-50 hover:text-red-900 transition-colors duration-200"
              >
                Post a Job
              </Link>
            </div>
          </div>

          {/* Social media links */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex flex-col space-y-2 bg-red-300/20 h-full m-2 rounded-2xl p-2 ">
              <span className="text-amber-50 font-semibold text-center">
                Social Links
              </span>
              <hr className="w-full border-amber-50" />

              {[
                {
                  href: "https://web.facebook.com/profile.php?id=61576682944507",
                  icon: <Facebook size={24} />,
                  label: "Facebook",
                },
                {
                  href: "https://x.com/DevIsaacMaina",
                  icon: <X size={24} />,
                  label: "Twitter (X)",
                },
                {
                  href: "https://www.instagram.com/devisaacmaina",
                  icon: <Instagram size={24} />,
                  label: "Instagram",
                },
                {
                  href: "https://www.linkedin.com/in/isaac-maina/?skipRedirect=true",
                  icon: <Linkedin size={24} />,
                  label: "LinkedIn",
                },
                {
                  href: "https://github.com/IsaacMaina",
                  icon: <Github size={24} />,
                  label: "GitHub",
                },
                {
                  href: "https://wa.me/254758302725",
                  icon: <MessageCircle size={24} />,
                  label: "WhatsApp",
                },
                {
                  href: "mailto:mainaisaacwachira2000@gmail.com",
                  icon: <Mail size={24} />,
                  label: "Email",
                },
                {
                  href: "sms:+254758302725",
                  icon: <MessageSquare size={24} />,
                  label: "SMS",
                },
                {
                  href: "tel:+254758302725",
                  icon: <Phone size={24} />,
                  label: "Phone",
                },
              ].map(({ href, icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-50 rounded-md px-2 py-1 flex items-center space-x-2 hover:bg-slate-50 hover:text-red-900 transition-colors duration-200"
                >
                  {icon}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
