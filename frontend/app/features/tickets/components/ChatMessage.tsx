import type { ChatMessageProps } from '@app/types/ticket';

export const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-xs items-end space-x-3 lg:max-w-md ${
          isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white shadow-md ${
            isCurrentUser ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          {getInitials(`${message.senderUser.firstName} ${message.senderUser.lastName}`)}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-3 py-2 shadow-sm ${
            isCurrentUser
              ? 'rounded-br-md bg-green-500 text-white'
              : 'rounded-bl-md border bg-white text-gray-800'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={`mt-1 text-xs ${isCurrentUser ? 'text-green-100' : 'text-gray-500'}`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
