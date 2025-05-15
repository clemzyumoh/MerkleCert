"use client";

import { motion } from "framer-motion";

const textVariants = {
  fade: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  },
  typing: {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.05, duration: 0.1 },
    }),
  },
  wave: {
    hidden: { y: 0 },
    visible: (i) => ({
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 1.5, delay: i * 0.1 },
    }),
  },
};

const AnimatedText = ({
  text = " ",
  as = "h1",
  animation = "fade",
  className = "",
}) => {
  const Tag = as; // Dynamic HTML tag (h1, h2, p, etc.)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="inline-block">
      {animation === "typing" || animation === "wave" ? (
        <Tag className={className}>
          {text.split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={textVariants[animation]}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="inline-block mr-1">
              {word}
            </motion.span>
          ))}
        </Tag>
      ) : (
        <motion.div variants={textVariants[animation]}>
          <Tag className={className}>{text}</Tag>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedText;
