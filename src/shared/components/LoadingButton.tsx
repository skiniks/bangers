import { motion } from 'framer-motion'

export default function LoadingButton() {
  return (
    <div className="flex items-center justify-center gap-3">
      <motion.div className="flex gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="h-2.5 w-2.5 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 0.9, 1],
            opacity: [1, 0.6, 1, 1],
            y: [0, -3, 0, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0,
          }}
        />
        <motion.div
          className="h-2.5 w-2.5 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 0.9, 1],
            opacity: [1, 0.6, 1, 1],
            y: [0, -3, 0, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
        <motion.div
          className="h-2.5 w-2.5 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 0.9, 1],
            opacity: [1, 0.6, 1, 1],
            y: [0, -3, 0, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.4,
          }}
        />
      </motion.div>
      <span>Loading posts...</span>
    </div>
  )
}
