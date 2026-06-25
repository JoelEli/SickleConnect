import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import PageWrapper from "@/shared/components/PageWrapper";

const NotFound = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-[#0b1326] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="text-8xl font-bold text-[#cabeff]/20 mb-4"
          >
            404
          </motion.p>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-white/40 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/home">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#937dff] to-[#00a6e0] text-white font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#937dff]/20">
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
