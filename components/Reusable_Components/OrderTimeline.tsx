'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiTruck, FiPackage, FiClock } from 'react-icons/fi';

interface TimelineStep {
  status: 'completed' | 'current' | 'pending';
  label: string;
  date?: string;
  icon: React.ReactNode;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
}

export function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex gap-4"
        >
          {/* Timeline dot */}
          <div className="flex flex-col items-center flex-shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step.status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : step.status === 'current'
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground'
              }`}
            >
              {step.status === 'completed' ? <FiCheck className="w-5 h-5" /> : step.icon}
            </motion.div>
            {idx < steps.length - 1 && (
              <div
                className={`w-1 h-12 mt-2 ${
                  step.status === 'completed' ? 'bg-green-100' : 'bg-secondary'
                }`}
              />
            )}
          </div>

          {/* Timeline content */}
          <div className="pt-1 pb-6">
            <h4
              className={`font-semibold ${
                step.status === 'completed'
                  ? 'text-green-600'
                  : step.status === 'current'
                    ? 'text-primary'
                    : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </h4>
            {step.date && (
              <p className="text-sm text-muted-foreground">{step.date}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
