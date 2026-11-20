import React from 'react'

export const STATUSES = ['Pending', 'Under Review', 'Resolved']

const styles = {
  'Pending': 'bg-brand-amber/25 text-brand-deep',
  'Under Review': 'bg-sky-100 text-sky-800',
  'Resolved': 'bg-brand-mint text-brand-deep',
}
const dots = {
  'Pending': 'bg-brand-amber',
  'Under Review': 'bg-sky-500',
  'Resolved': 'bg-brand-jade',
}

// Complaint ke status ka chhota badge (purani posts jin mein status nahi, wo Pending dikhti hain)
export const StatusBadge = ({ status = 'Pending', className = '' }) => {
  const st = STATUSES.includes(status) ? status : 'Pending'
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[st]} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[st]}`} />
      {st}
    </span>
  )
}