"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedPaymentStatusProps = {
  status: "success" | "pending" | "failed";
};

export default function AnimatedPaymentStatus({
  status,
}: AnimatedPaymentStatusProps) {
  const reduceMotion = useReducedMotion();
  const color =
    status === "failed"
      ? "text-red-600"
      : status === "pending"
        ? "text-amber-500"
        : "text-emerald-600";
  const bg =
    status === "failed"
      ? "bg-red-50"
      : status === "pending"
        ? "bg-amber-50"
        : "bg-emerald-50";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.78 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: [1, 1.04, 1] }}
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        repeat: status === "success" ? Infinity : 0,
        repeatDelay: 1.2,
      }}
      className={`mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full ${bg}`}
    >
      {status === "success" ? (
        <motion.svg
          viewBox="0 0 64 64"
          className="h-14 w-14 text-emerald-600"
          fill="none"
        >
          <motion.circle
            cx="32"
            cy="32"
            r="24"
            stroke="currentColor"
            strokeWidth="4"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={reduceMotion ? undefined : { pathLength: [0, 1, 1] }}
            transition={{
              duration: 1.6,
              times: [0, 0.55, 1],
              ease: [0.16, 1, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 1.2,
            }}
          />
          <motion.path
            d="M20 33.5 28.2 42 45 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={reduceMotion ? undefined : { pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: 1.6,
              times: [0, 0.45, 0.78, 1],
              ease: [0.16, 1, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 1.2,
            }}
          />
        </motion.svg>
      ) : status === "failed" ? (
        <motion.svg
          viewBox="0 0 64 64"
          className="h-14 w-14 text-red-600"
          fill="none"
        >
          <motion.circle
            cx="32"
            cy="32"
            r="24"
            stroke="currentColor"
            strokeWidth="4"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={reduceMotion ? undefined : { pathLength: [0, 1, 1] }}
            transition={{
              duration: 1.4,
              times: [0, 0.6, 1],
              ease: [0.16, 1, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 1.15,
            }}
          />
          <motion.path
            d="M23 23 41 41"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={reduceMotion ? undefined : { pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: 1.4,
              times: [0, 0.35, 0.65, 1],
              ease: [0.16, 1, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 1.15,
            }}
          />
          <motion.path
            d="M41 23 23 41"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={reduceMotion ? undefined : { pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: 1.4,
              times: [0, 0.5, 0.8, 1],
              ease: [0.16, 1, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 1.15,
            }}
          />
        </motion.svg>
      ) : (
        <motion.div
          animate={reduceMotion ? undefined : { rotate: status === "pending" ? 360 : 0 }}
          transition={{
            duration: 1.6,
            ease: "linear",
            repeat: status === "pending" ? Infinity : 0,
          }}
          className={`text-4xl font-black ${color}`}
        >
          {status === "pending" ? "..." : "!"}
        </motion.div>
      )}
    </motion.div>
  );
}
