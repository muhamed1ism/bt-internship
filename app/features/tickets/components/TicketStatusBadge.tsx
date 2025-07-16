import { TICKET_STATUS_CONFIG } from '@app/constants/ticket';
import type { TicketStatusBadgeProps } from '@app/types/ticket';

export const TicketStatusBadge = ({ status, className = '' }: TicketStatusBadgeProps) => {
  const config = TICKET_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${config.color} ${className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};
