import { Github, Linkedin, Link, Database, Cpu, GitBranch, Layers } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const skills = [
  { name: "PySpark", icon: Cpu },
  { name: "SQL", icon: Database },
  { name: "Azure Data Factory", icon: GitBranch },
  { name: "Airflow", icon: Layers },
  { name: "Snowflake", icon: Database },
  { name: "Delta Lake", icon: Layers },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 font-display text-4xl font-bold tracking-tighter md:text-5xl"
          >
            About
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 space-y-4 leading-relaxed text-foreground/90"
          >
            <p>
              I'm a Data Engineer focused on building reliable, scalable data
              pipelines. I work with PySpark, SQL, Azure Data Factory, and
              Airflow to process terabytes of data daily for analytics and
              machine learning workloads.
            </p>
            <p>
              This blog is where I share the patterns, optimizations, and
              lessons learned from production data systems. Every article
              includes real-world examples, code you can copy, and interview
              prep material.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              Technical Skills
            </h2>
            <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary"
                >
                  <skill.icon size={18} className="text-primary" />
                  <span className="font-mono text-sm">{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              Connect
            </h2>
            <div className="flex gap-4">
              <a
                href="https://github.com/Nikhil-1503"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-mono text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/nikhilshanbhag01/"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-mono text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href="https://nikhilshanbhag.netlify.app/"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-mono text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <Link size={16} />
                Website
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
