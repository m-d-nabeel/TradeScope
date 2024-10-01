import { motion } from "framer-motion";

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="rounded-lg bg-white p-6 shadow-lg"
  >
    <Icon className="mb-4 h-12 w-12 text-emerald-500" />
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);
