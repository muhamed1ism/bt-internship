import { TicketStatusBadge } from './TicketStatusBadge';
import { UI_CONFIG } from '@app/constants/ticket';
import type { TicketCardProps } from '@app/types/ticket';

export const TicketCard = ({
  ticket,
  isSelected,
  onSelect,
  onToggleDescription,
  isDescriptionExpanded,
}: TicketCardProps) => {
  const shouldTruncate = ticket.description.length > UI_CONFIG.DESCRIPTION_TRUNCATE_LENGTH;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      className={`group cursor-pointer rounded-lg border-2 p-5 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={() => onSelect(ticket)}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="truncate text-lg font-semibold text-gray-900">{ticket.title}</h3>
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>
        <span className="ml-4 text-sm whitespace-nowrap text-gray-500">
          {formatDateTime(ticket.createdAt)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm leading-relaxed text-gray-600">
          {shouldTruncate && !isDescriptionExpanded
            ? ticket.description.substring(0, UI_CONFIG.DESCRIPTION_TRUNCATE_LENGTH) + '...'
            : ticket.description}
        </p>
        {shouldTruncate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDescription(ticket.id);
            }}
            className="mt-2 text-xs text-blue-600 transition-colors hover:text-blue-800"
          >
            {isDescriptionExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span>👤</span>
          <span>
            {ticket.employee.firstName} {ticket.employee.lastName}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>📧</span>
          <span>{ticket.employee.email}</span>
        </div>
      </div>
    </div>
  );
};
