import { motion } from "framer-motion";

export default function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="
          bg-white p-6 rounded-2xl shadow-xl 
          w-[95%] max-w-md relative
          max-h-[90vh] overflow-y-auto   /* 👈 NUEVO */
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        {children}
      </motion.div>
    </div>
  );
}
