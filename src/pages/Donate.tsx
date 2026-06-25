import { motion } from 'framer-motion';
import {
  Heart, Server, Megaphone, Stethoscope, Rocket, ExternalLink,
  ShieldCheck, Users, HeartHandshake, Share2,
} from 'lucide-react';
import DarkNavbar from '@/shared/components/DarkNavbar';
import DarkFooter from '@/shared/components/DarkFooter';
import PageWrapper from '@/shared/components/PageWrapper';

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const impactCards = [
  { amount: '$10', label: 'Platform Hosting', description: 'Keeps our secure community servers running 24/7 for patient connectivity.', icon: Server, color: 'text-[#cabeff]', bg: 'bg-[#cabeff]/10', barColor: '#cabeff', progress: 85 },
  { amount: '$25', label: 'Community Outreach', description: 'Funding awareness campaigns to reach newly diagnosed warriors globally.', icon: Megaphone, color: 'text-[#7bd0ff]', bg: 'bg-[#7bd0ff]/10', barColor: '#7bd0ff', progress: 60 },
  { amount: '$50', label: 'Medical Resources', description: 'Providing expert-vetted educational materials for specialized care.', icon: Stethoscope, color: 'text-[#ffb77f]', bg: 'bg-[#ffb77f]/10', barColor: '#ffb77f', progress: 45 },
  { amount: '$100', label: 'Advanced Features', description: 'Developing AI-driven health tracking and pain management tools.', icon: Rocket, color: 'text-[#937dff]', bg: 'bg-[#937dff]/10', barColor: '#937dff', progress: 30 },
];

const reasons = [
  { icon: ShieldCheck, title: 'Direct Impact', description: '95% of all donations go directly into platform maintenance and community programs, ensuring maximum transparency.', color: 'text-[#cabeff]', bg: 'bg-[#cabeff]/10' },
  { icon: Users, title: 'Community Driven', description: 'We are built by patients, for patients. Every feature is designed based on real-world feedback from the sickle cell community.', color: 'text-[#7bd0ff]', bg: 'bg-[#7bd0ff]/10' },
  { icon: HeartHandshake, title: 'Bridging the Gap', description: 'Many warriors lack access to specialist information. Your support helps us bridge the informational and emotional gap in care.', color: 'text-[#ffb77f]', bg: 'bg-[#ffb77f]/10' },
];

const Donate = () => {
  const glass = 'bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1]';

  const handleDonate = () => {
    window.open('https://gofundme.com/sickleconnect', '_blank', 'noopener');
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0b1326] text-[#dbe2fd] flex flex-col">
        <DarkNavbar />

        <main className="flex-grow">
          {/* Hero */}
          <section className="relative overflow-hidden py-24 px-6 md:px-10">
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(124,93,255,0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }} />
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cabeff]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10 text-center">
              <motion.div {...fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#cabeff]/10 text-[#cabeff] text-sm font-semibold mb-6 border border-[#cabeff]/20">
                  <Heart className="h-4 w-4 fill-[#cabeff]" />
                  Support the Community
                </span>

                <h1 className="text-3xl md:text-[40px] font-bold mb-6 max-w-3xl mx-auto leading-tight tracking-tight">
                  Support Our{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cabeff] to-[#7bd0ff]">Warriors</span>
                </h1>

                <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Every contribution helps us build a stronger support network for those living with
                  Sickle Cell. Join us in making specialized healthcare resources and community support
                  accessible to everyone.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={handleDonate}
                      className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#937dff] to-[#00a6e0] text-white font-bold shadow-lg shadow-[#937dff]/25 hover:brightness-110 transition-all"
                      style={{ animation: 'pulse-glow 2s infinite' }}
                    >
                      <HeartHandshake className="h-5 w-5" />
                      Donate to our GoFundMe
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </button>
                  </motion.div>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: 'SickleConnect', text: 'Support the sickle cell community', url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="px-8 py-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm text-white/70 font-semibold hover:bg-white/[0.06] transition-all flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Our Story
                  </button>
                </div>
              </motion.div>
            </div>

            <style>{`
              @keyframes pulse-glow {
                0% { box-shadow: 0 0 0 0 rgba(124, 93, 255, 0.6); }
                70% { box-shadow: 0 0 0 15px rgba(124, 93, 255, 0); }
                100% { box-shadow: 0 0 0 0 rgba(124, 93, 255, 0); }
              }
            `}</style>
          </section>

          {/* Impact Cards */}
          <section className="py-20 px-6 md:px-10 bg-[#060d20]/50">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-[32px] font-bold mb-4">Your Impact</h2>
                <p className="text-white/40 max-w-xl mx-auto">
                  See how your generous donations are directly utilized to support our mission and the community.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {impactCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <motion.div key={card.amount} variants={fadeUp}>
                      <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.25 }}
                        className={`${glass} p-6 rounded-2xl h-full group`}
                      >
                        <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color} mb-6 group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className={`text-2xl font-bold ${card.color} mb-2`}>{card.amount}</div>
                        <h3 className="text-sm font-semibold text-white mb-3">{card.label}</h3>
                        <p className="text-xs text-white/40 mb-6 leading-relaxed">{card.description}</p>
                        <div className="w-full h-1.5 bg-[#2d3449] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${card.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                            className={`h-full rounded-full`}
                            style={{ backgroundColor: card.barColor }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Why Support Us */}
          <section className="py-24 px-6 md:px-10">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left — Visual */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden border border-white/[0.08] relative">
                  <div className="w-full h-full bg-gradient-to-br from-[#937dff]/15 via-[#00a6e0]/10 to-[#ffb77f]/10 flex items-center justify-center">
                    <Heart className="h-20 w-20 text-[#cabeff]/20" />
                  </div>
                  <div className={`absolute bottom-6 left-6 right-6 p-5 ${glass} rounded-xl`}>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {['from-violet-500 to-purple-600', 'from-teal-500 to-cyan-600', 'from-rose-500 to-pink-600'].map((g, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0b1326] bg-gradient-to-br ${g} flex items-center justify-center text-white text-[10px] font-bold`}>
                            {['A', 'M', 'S'][i]}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-white/70">Joined by 1,200+ Warriors</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7bd0ff]/10 blur-[60px] rounded-full -z-10" />
              </motion.div>

              {/* Right — Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-[32px] font-bold mb-8">Why Support Us?</h2>

                <div className="space-y-8">
                  {reasons.map((r) => {
                    const Icon = r.icon;
                    return (
                      <div key={r.title} className="flex gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${r.bg} flex items-center justify-center ${r.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-1">{r.title}</h4>
                          <p className="text-sm text-white/40 leading-relaxed">{r.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Testimonial */}
                <div className={`mt-12 p-8 ${glass} rounded-2xl border-[#cabeff]/20`}>
                  <p className="text-sm text-white/60 italic leading-relaxed">
                    "SickleConnect hasn't just given me an app; it's given me a family that
                    understands my pain when no one else does. Your donation makes this family possible."
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[#cabeff]">— Sarah J., Community Member</p>
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

export default Donate;
