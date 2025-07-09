import type { MessageInputProps } from '@app/types/ticket';
import { MESSAGE_PLACEHOLDERS } from '@app/constants/ticket';

export const MessageInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = MESSAGE_PLACEHOLDERS.DEFAULT,
  disabled = false,
  isLoading = false,
}: MessageInputProps) => {
  return (
    <div className="border-t border-gray-100 bg-white p-4">
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim() || isLoading || disabled}
          className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};
