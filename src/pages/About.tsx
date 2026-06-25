import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Heart, Users, Stethoscope, Shield, ArrowRight, Quote, CheckCircle,
  HelpCircle, BookOpen, ExternalLink,
} from 'lucide-react';
import DarkNavbar from '@/shared/components/DarkNavbar';
import DarkFooter from '@/shared/components/DarkFooter';
import PageWrapper from '@/shared/components/PageWrapper';

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const values = [
  { icon: Users, title: 'Community First', description: 'We believe that lived experience is as valuable as clinical data. Every voice matters in our shared journey.', color: 'text-[#cabeff]', bg: 'bg-[#cabeff]/10' },
  { icon: Stethoscope, title: 'Professional Guidance', description: 'Our resources are vetted by hematologists and health experts to ensure accuracy and medical reliability.', color: 'text-[#7bd0ff]', bg: 'bg-[#7bd0ff]/10' },
  { icon: Shield, title: 'Privacy & Safety', description: 'Your health data is your own. We implement bank-level security to protect your community interactions.', color: 'text-[#ffb77f]', bg: 'bg-[#ffb77f]/10' },
];

const resources = [
  'Treatment Guides', 'Pain Tracking', 'Advocacy Tools', 'Mental Health',
];

const stats = [
  { value: '12k+', label: 'Active Warriors', color: 'text-[#cabeff]' },
  { value: '50+', label: 'Global Partners', color: 'text-[#7bd0ff]' },
  { value: '24/7', label: 'Crisis Support', color: 'text-[#ffb77f]' },
  { value: '100%', label: 'Free for Users', color: 'text-[#937dff]' },
];

const About = () => {
  const glass = 'bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1]';
  const glassHover = `${glass} hover:shadow-[0_0_30px_rgba(124,93,255,0.2)] hover:scale-[1.02] transition-all duration-300`;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0b1326] text-[#dbe2fd]">
        <DarkNavbar />

        <main className="flex-grow">
          {/* Hero */}
          <section className="relative pt-24 pb-32 px-6 md:px-10 overflow-hidden">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <motion.div {...fadeUp}>
                <h1 className="text-3xl md:text-[40px] font-bold leading-tight mb-6 tracking-tight">
                  Our Mission to Support the{' '}
                  <span className="text-[#cabeff]">Sickle Cell</span> Community
                </h1>
                <p className="text-lg text-white/50 mb-8 max-w-xl leading-relaxed">
                  Empowering individuals, families, and caregivers through medical expertise,
                  emotional support, and a vibrant peer network.
                </p>
                <div className="flex gap-4">
                  <Link to="/auth">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Button className="bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] text-white border-0 px-8 py-3 rounded-xl shadow-lg shadow-[#7c5dff]/15">
                        Join Our Community
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/search">
                    <Button variant="ghost" className={`${glass} rounded-xl px-8 py-3 text-white/70 hover:bg-white/5`}>
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                <div className={`${glass} rounded-3xl p-2 relative overflow-hidden`}>
                  <div className="w-full aspect-video lg:aspect-square rounded-2xl bg-gradient-to-br from-[#7c5dff]/20 via-[#38bdf8]/10 to-[#ffb77f]/10 flex items-center justify-center">
                    <div className="text-center">
                      <Heart className="h-16 w-16 text-[#cabeff]/30 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-white/30">Community Together</p>
                    </div>
                  </div>
                  <div className={`absolute bottom-6 left-6 right-6 ${glass} p-4 rounded-xl flex items-center gap-4`}>
                    <div className="bg-[#00a6e0]/20 p-2 rounded-lg">
                      <Heart className="h-5 w-5 text-[#7bd0ff] fill-[#7bd0ff]" />
                    </div>
                    <span className="text-sm font-semibold">Trusted by 5,000+ warriors globally</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Story */}
          <section className="py-24 px-6 md:px-10 bg-[#060d20]/50">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeUp} viewport={{ once: true }} whileInView="animate" initial="initial">
                <h2 className="text-[32px] font-bold mb-6 leading-tight">The SickleConnect Story</h2>
                <p className="text-base text-white/50 mb-4 leading-relaxed">
                  Founded by a group of healthcare innovators and community advocates, SickleConnect
                  was born out of a simple observation: the sickle cell community needed more than just
                  medicine — they needed connection.
                </p>
                <p className="text-base text-white/50 leading-relaxed">
                  Our journey started with a small forum and has evolved into a comprehensive digital
                  home for those managing the complexities of sickle cell disease. We bridge the gap
                  between clinical excellence and the lived experience.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                <div className={`${glass} p-10 rounded-3xl relative overflow-hidden border-[#cabeff]/20`}>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#cabeff]/10 rounded-full blur-3xl" />
                  <Quote className="h-12 w-12 text-[#cabeff] mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-[#cabeff]">Our Mission Statement</h3>
                  <p className="text-lg italic text-white/60 leading-relaxed">
                    "To transform the sickle cell journey from a path of isolation to a shared experience
                    of resilience, guided by professional expertise and authentic community love."
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Values */}
          <section className="py-24 px-6 md:px-10">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-[32px] font-bold mb-4">Our Values</h2>
                <p className="text-base text-white/40 max-w-2xl mx-auto">
                  The core principles that guide every feature we build and every interaction we host.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <motion.div key={v.title} variants={fadeUp}>
                      <motion.div
                        whileHover={{ y: -6, boxShadow: '0 0 30px rgba(124, 93, 255, 0.2)' }}
                        transition={{ duration: 0.25 }}
                        className={`${glass} p-8 rounded-3xl h-full`}
                      >
                        <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center mb-6`}>
                          <Icon className={`h-7 w-7 ${v.color}`} />
                        </div>
                        <h4 className="text-2xl font-semibold mb-3">{v.title}</h4>
                        <p className="text-base text-white/40 leading-relaxed">{v.description}</p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* What We Offer — Bento Grid */}
          <section className="py-24 px-6 md:px-10 bg-[#171f33]/30">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row justify-between items-end mb-16"
              >
                <div className="max-w-xl">
                  <h2 className="text-[32px] font-bold mb-4">What We Offer</h2>
                  <p className="text-base text-white/40">
                    A complete ecosystem designed specifically for the unique challenges of sickle cell warriors.
                  </p>
                </div>
                <Link to="/search" className="mt-6 md:mt-0 text-sm font-semibold text-[#cabeff] flex items-center gap-2 hover:gap-3 transition-all">
                  View All Resources <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Peer Support — large card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="md:col-span-8"
                >
                  <div className={`${glass} rounded-3xl p-8 relative overflow-hidden group h-full`}>
                    <div className="relative z-10">
                      <h4 className="text-2xl font-semibold mb-2">Peer Support Groups</h4>
                      <p className="text-base text-white/40 mb-6 max-w-sm">
                        Connect with others who truly understand the pain and the triumph.
                      </p>
                      <div className="flex -space-x-3 mb-8">
                        {['bg-gradient-to-br from-violet-500 to-purple-600', 'bg-gradient-to-br from-teal-500 to-cyan-600', 'bg-gradient-to-br from-rose-500 to-pink-600'].map((bg, i) => (
                          <div key={i} className={`w-12 h-12 rounded-full border-2 border-[#0b1326] ${bg} flex items-center justify-center text-white text-xs font-bold`}>
                            {['A', 'M', 'S'][i]}
                          </div>
                        ))}
                        <div className="w-12 h-12 rounded-full bg-[#937dff] flex items-center justify-center text-[#0b1326] text-xs font-bold border-2 border-[#0b1326]">
                          +4k
                        </div>
                      </div>
                      <Link to="/community">
                        <button className={`${glass} px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#cabeff]/10 transition-colors`}>
                          Join a group
                        </button>
                      </Link>
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#cabeff]/5 rounded-full blur-3xl group-hover:bg-[#cabeff]/10 transition-colors" />
                  </div>
                </motion.div>

                {/* Expert Q&A — small card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="md:col-span-4"
                >
                  <div className={`${glass} rounded-3xl p-8 flex flex-col justify-between h-full`}>
                    <div>
                      <HelpCircle className="h-10 w-10 text-[#7bd0ff] mb-4" />
                      <h4 className="text-2xl font-semibold mb-2">Expert Q&A</h4>
                      <p className="text-base text-white/40">
                        Get your medical questions answered by verified hematologists in real-time.
                      </p>
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <p className="text-[11px] font-semibold text-[#7bd0ff] uppercase tracking-widest mb-1.5">Next Session</p>
                      <p className="text-sm">Managing Fatigue with Dr. Sarah Chen</p>
                    </div>
                  </div>
                </motion.div>

                {/* Resource Library — full width */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="md:col-span-12"
                >
                  <div className={`${glass} rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center`}>
                    <div className="md:w-1/2">
                      <h4 className="text-2xl font-semibold mb-2">Resource Library</h4>
                      <p className="text-base text-white/40 mb-6">
                        A curated collection of research papers, dietary guides, and pain management
                        toolkits tailored for you.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {resources.map(r => (
                          <div key={r} className="flex items-center gap-2 text-white/50">
                            <CheckCircle className="h-4 w-4 text-[#cabeff]/60" />
                            <span className="text-sm font-semibold">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#7c5dff]/10 via-[#38bdf8]/5 to-transparent aspect-video flex items-center justify-center">
                        <BookOpen className="h-14 w-14 text-white/15" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Impact Stats */}
          <section className="py-24 px-6 md:px-10">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`${glass} rounded-[40px] p-12 md:p-20 relative overflow-hidden text-center`}
              >
                <h2 className="text-[32px] font-bold mb-16">The Impact of SickleConnect</h2>

                <motion.div
                  variants={stagger}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full"
                >
                  {stats.map((s) => (
                    <motion.div key={s.label} variants={fadeUp}>
                      <p className={`text-4xl md:text-[40px] font-bold ${s.color} mb-2`}>{s.value}</p>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.15em]">{s.label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-20">
                  <p className="text-lg text-white/50 mb-8 max-w-2xl mx-auto">
                    Ready to join a community that understands your strength?
                  </p>
                  <Link to="/auth">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
                      <Button className="bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] text-white border-0 px-12 py-5 rounded-full text-lg font-semibold shadow-lg shadow-[#7c5dff]/20">
                        Get Started Today
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <DarkFooter />
      </div>
    </PageWrapper>
  );
};

export default About;
