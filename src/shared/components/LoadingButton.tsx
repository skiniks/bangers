import { AnimatePresence, motion } from 'framer-motion'

export default function LoadingButton() {
  return (
    <div className="relative w-[120px] h-6">
      <AnimatePresence mode="wait">
        <motion.div key="loading" className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex gap-1.5">
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
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
