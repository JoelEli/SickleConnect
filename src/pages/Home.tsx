import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Heart, Users, MessageSquare, Shield, ArrowRight, Stethoscope, Globe, ExternalLink,
} from 'lucide-react';
import DarkNavbar from '@/shared/components/DarkNavbar';
import DarkFooter from '@/shared/components/DarkFooter';
import PageWrapper from '@/shared/components/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/animations';

const stats = [
  { label: 'Members', value: '15,000+', icon: Users },
  { label: 'Posts', value: '50,000+', icon: MessageSquare },
  { label: 'Experts', value: '250+', icon: Stethoscope },
  { label: 'Countries', value: '40+', icon: Globe },
];

const features = [
  {
    icon: Users, title: 'Community Support',
    description: 'Connect with others understanding your journey. Share experiences and find peer support.',
    iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400',
  },
  {
    icon: Stethoscope, title: 'Medical Expertise',
    description: 'Access verified information and connect with qualified medical professionals for advice.',
    iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400',
  },
  {
    icon: Shield, title: 'Safe Space',
    description: 'A secure, moderated environment for open and honest discussions without judgment.',
    iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400',
  },
];

const Home = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">
        <DarkNavbar />

        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
            <motion.div animate={{ x: [0, -25, 0], y: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
            <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[10%] left-[30%] w-[450px] h-[450px] rounded-full bg-teal-500/15 blur-[120px]" />
            <motion.div animate={{ x: [0, -15, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-rose-500/10 blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-8">
                <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
                <span className="text-sm font-medium text-rose-300">Over 10k Stories Shared</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
                <span className="text-white">Connect.</span>{' '}
                <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Share.</span>{' '}
                <span className="text-white">Support.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
                className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
                A supportive network for sickle cell patients, families, and doctors.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-0 text-base px-8 py-6 shadow-2xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-shadow">
                      Join the Community <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/about">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-white text-base px-8 py-6 backdrop-blur-sm">
                      Learn More
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 container mx-auto px-6 -mt-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 md:p-10">
            <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} variants={staggerItem} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/[0.05] flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-white/40" />
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-white/40">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="relative z-10 container mx-auto px-6 py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">SickleConnect</span>?
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Built specifically for the sickle cell community with care and purpose</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={staggerItem}>
                  <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="h-full">
                    <div className="h-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300 group">
                      <div className={`h-14 w-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                        <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-white/40 leading-relaxed mb-6">{feature.description}</p>
                      <Link to="/community" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors group-hover:text-rose-400">
                        Explore <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* CTA */}
        <section className="relative z-10 container mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 to-purple-500/10 border border-white/[0.06] rounded-3xl p-12 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join?</h2>
              <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">Take the first step towards connecting with a community that understands.</p>
              <Link to="/auth">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-0 px-10 py-6 text-base shadow-2xl shadow-rose-500/25">
                    <Heart className="mr-2 h-4 w-4" /> Join SickleConnect Today
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>

        <DarkFooter />
      </div>
    </PageWrapper>
  );
};

export default Home;
