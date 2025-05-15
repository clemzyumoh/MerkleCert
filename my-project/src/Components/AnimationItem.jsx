"use client";

import { motion } from "framer-motion";

const directions = {
  top: { hidden: { y: -100, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  bottom: { hidden: { y: 100, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left: { hidden: { x: -100, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1 } },
};

const AnimateItem = ({ children, direction = "top", delay = 0 }) => {
  return (
    <motion.div
      variants={directions[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, delay }}
      className="inline-block">
      {children}
    </motion.div>
  );
};

export default AnimateItem;
