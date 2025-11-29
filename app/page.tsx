"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  Brain,
  ArrowRight,
  MessageCircle,
  Workflow,
  Layers,
  MonitorSmartphone,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AIHelpdeskLanding() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-slate-100">
      {/* NAVBAR */}
      {/* <nav
        className={`fixed justiy-end w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-white/70 backdrop-blur-xl shadow-md"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:text-slate-900 transition">
              Features
            </a>
            <a href="#workflow" className="hover:text-slate-900 transition">
              Workflow
            </a>
            <a href="#contact" className="hover:text-slate-900 transition">
              Contact
            </a>

            <Button
              onClick={() => router.push("/login")}
              className="shadow-md hover:shadow-lg transition"
            >
              Login
            </Button>
            <Button
              variant='outline'
              onClick={() => router.push("/chat")}
              className=" "
            >
              Try Chat
            </Button>
          </div>
        </div>
      </nav> */}

      {/* HERO */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center relative">
          {/* Floating gradient blobs */}
          <div className="absolute w-96 h-96 bg-blue-300/30 top-[-60px] left-[-80px] blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-indigo-300/30 bottom-[-120px] right-[-100px] blur-[120px] rounded-full animate-pulse"></div>

          <div className="inline-flex items-center gap-2 bg-white/70 border px-5 py-2 rounded-full shadow-md backdrop-blur-md text-blue-600 font-medium mb-6 animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            Powered by Real-time AI Processing
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight animate-fadeUp">
            Elevate Your Customer Support with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}Intelligent Automation
            </span>
          </h1>

          <p className="text-xl text-slate-600 mt-6 max-w-3xl mx-auto leading-relaxed animate-fadeUp delay-150">
            Our AI-driven helpdesk resolves tickets instantly, understands context,
            automates workflows, and empowers your team with cutting-edge insights.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fadeUp delay-200">
            <Button
              onClick={() => router.push("/chat")}
              className="bg-slate-900 text-white px-8 py-4 text-lg rounded-xl hover:bg-slate-800 shadow-xl flex items-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section id="workflow" className="py-20 bg-white/70 backdrop-blur-sm border-y">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold text-slate-900 mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              {
                icon: <MonitorSmartphone className="w-8 h-8" />,
                title: "1. Customer Message",
                desc: "User sends a query via chat, email, WhatsApp, or web widget.",
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "2. AI Understanding",
                desc: "AI identifies intent, sentiment, urgency, and context.",
              },
              {
                icon: <Workflow className="w-8 h-8" />,
                title: "3. Smart Processing",
                desc: "System routes, categorizes, and resolves with automation.",
              },
              {
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: "4. Instant Resolution",
                desc: "Customer receives accurate responses or agent assistance.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 border rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-xl text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl font-bold mb-12 text-slate-900">
            Features You’ll Rely On Daily
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-7 h-7" />,
                title: "AI Intelligence",
                desc: "Understands natural language and responds instantly.",
              },
              {
                icon: <Zap className="w-7 h-7" />,
                title: "Ultra Fast",
                desc: "Ticket resolution accelerated with automation.",
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: "Secure Access",
                desc: "RBAC, JWT, encryption and audit logging.",
              },
              {
                icon: <BarChart3 className="w-7 h-7" />,
                title: "Analytics",
                desc: "Advanced dashboards with ticket trends.",
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: "Team Collaboration",
                desc: "Real-time assignment and escalation.",
              },
              {
                icon: <Clock className="w-7 h-7" />,
                title: "24/7 AI Support",
                desc: "AI assistant never sleeps. Lucky you.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-8 border rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-primary text-white p-14 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-lg text-slate-300 mb-6">
            Transform your support operations with automation powered by AI.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-4 text-lg rounded-xl"
          >
            Login to Dashboard
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t text-center text-slate-600">
        © 2025 HelpAI. All rights reserved.
      </footer>
    </div>
  );
}
