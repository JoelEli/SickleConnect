import { motion } from 'framer-motion';
import AuthForm from '@/features/auth/components/AuthForm';
import PageWrapper from '@/shared/components/PageWrapper';

const Auth = () => {
  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <AuthForm />
      </motion.div>
    </PageWrapper>
  );
};

export default Auth;
