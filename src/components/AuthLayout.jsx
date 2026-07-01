import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from './Card'

export default function AuthLayout({
  icon: Icon = ShieldCheck,
  title,
  subtitle,
  children,
  footer,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      <Card>
        <Card.Content className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <Icon size={42} className="text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-fg-primary">{title}</h2>
          {subtitle && (
            <p className="text-fg-secondary mt-2">{subtitle}</p>
          )}
          {children}
          {footer && (
            <p className="text-center text-fg-secondary text-sm mt-5">
              {footer}
            </p>
          )}
        </Card.Content>
      </Card>
    </motion.div>
  )
}
