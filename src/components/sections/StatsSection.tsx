"use client";

import { motion } from "framer-motion";

const stats = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "10K+",
    description: "Comics available in our library.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "1M+",
    description: "Active readers worldwide.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "4.9/5",
    description: "Average user rating across platforms.",
  },
];

const arrowPositions = [
  { x1: 18, x2: 46 },
  { x1: 52, x2: 80 },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2 + index * 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const arrowVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (index = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 0.6 + index * 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

const viewport = { once: true, amount: 0.3 };

export default function StatsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-gray-800">
      <div className="mx-auto max-w-12xl">
        <motion.div
          className="p-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="text-center relative z-10"
                  variants={stepVariants}
                  custom={index}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="text-black">
                      {stat.icon}
                    </div>
                  </div>
                  <h4 className="font-black text-3xl sm:text-4xl text-yellow-400 mb-4">
                    {stat.title}
                  </h4>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.svg
              className="hidden md:block absolute inset-x-0 top-0 w-full h-16 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ zIndex: 1 }}
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <defs>
                <marker 
                  id="chevron-arrow-yellow" 
                  markerWidth="4.5" 
                  markerHeight="4.5" 
                  refX="1.7" 
                  refY="4" 
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                  viewBox="0 0 3 8"
                >
                  <polyline 
                    points="0,0 1.9,4 0,8" 
                    fill="none" 
                    stroke="#facc15" 
                    strokeWidth="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>

              {arrowPositions.map((arrow, index) => (
                <motion.line
                  key={`arrow-${arrow.x1}`}
                  x1={arrow.x1}
                  y1="10"
                  x2={arrow.x2}
                  y2="10"
                  stroke="#facc15"
                  strokeWidth="0.5"
                  markerEnd="url(#chevron-arrow-yellow)"
                  variants={arrowVariants}
                  custom={index}
                  strokeLinecap="round"
                />
              ))}
            </motion.svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
