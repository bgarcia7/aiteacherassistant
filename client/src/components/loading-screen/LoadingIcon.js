import { m } from 'framer-motion';
import Logo from '../logo';

export default function LoadingIcon() {
  return (
    <m.div
      animate={{
        scale: [1, 0.9, 0.9, 1, 1],
        opacity: [1, 0.48, 0.48, 1, 1],
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeatDelay: 1,
        repeat: Infinity,
      }}
    >
      <Logo disabledLink sx={{ width: 64, height: 64 }} />
    </m.div>
  );
}
