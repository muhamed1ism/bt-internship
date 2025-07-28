import { useState, useEffect } from 'react';

interface AnimatedBadgeProps {
  count: number;
  type: 'employee' | 'cto' | 'notification';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}

export const AnimatedBadge = ({
  count,
  type,
  className = '',
  size = 'md',
  title,
}: AnimatedBadgeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation when badge first appears
    if (count > 0 && !isVisible) {
      setIsVisible(true);
    } else if (count === 0 && isVisible) {
      setIsVisible(false);
    }
  }, [count, isVisible]);

  useEffect(() => {
    // Trigger bounce animation when count changes
    if (count > 0) {
      setHasChanged(true);
      const timer = setTimeout(() => setHasChanged(false), 600);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (count === 0) return null;

  const getColors = () => {
    switch (type) {
      case 'employee':
        return 'from-red-500 to-pink-500 shadow-red-500/30';
      case 'cto':
        return 'from-blue-500 to-indigo-500 shadow-blue-500/30';
      case 'notification':
        return 'from-orange-500 to-amber-500 shadow-orange-500/30';
      default:
        return 'from-gray-500 to-gray-600 shadow-gray-500/30';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-5 w-5 text-xs';
      case 'md':
        return 'h-7 w-7 text-xs';
      case 'lg':
        return 'h-8 w-8 text-sm';
      default:
        return 'h-7 w-7 text-xs';
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-r ${getColors()} ${getSizeClasses()} transform font-bold text-white shadow-lg ring-2 ring-white transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} ${hasChanged ? 'animate-bounce' : 'animate-pulse'} ${className} `}
      title={title}
    >
      {/* Ripple effect background */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${getColors()} animate-ping opacity-75`}
      />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center">
        {count <= 9 ? (
          <span className="font-extrabold">{count}</span>
        ) : (
          <span className="font-extrabold">9+</span>
        )}
      </div>

      {/* Glow effect */}
      <div
        className={`absolute -inset-1 rounded-full bg-gradient-to-r ${getColors()} animate-pulse opacity-30 blur-sm`}
      />
    </div>
  );
};

interface PulsingIndicatorProps {
  type: 'employee' | 'cto' | 'notification';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PulsingIndicator = ({ type, size = 'md', className = '' }: PulsingIndicatorProps) => {
  const getColors = () => {
    switch (type) {
      case 'employee':
        return 'bg-red-500';
      case 'cto':
        return 'bg-blue-500';
      case 'notification':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'md':
        return 'h-4 w-4';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer pulsing ring */}
      <div
        className={`absolute ${getSizeClasses()} rounded-full ${getColors()} animate-ping opacity-75`}
      />

      {/* Inner solid dot */}
      <div className={`relative ${getSizeClasses()} rounded-full ${getColors()} shadow-lg`} />
    </div>
  );
};

interface AnimatedTextBadgeProps {
  text: string;
  type: 'employee' | 'cto' | 'notification';
  icon?: string;
  isNew?: boolean;
  className?: string;
}

export const AnimatedTextBadge = ({
  text,
  type,
  icon,
  isNew = false,
  className = '',
}: AnimatedTextBadgeProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getColors = () => {
    switch (type) {
      case 'employee':
        return 'from-red-500 to-pink-600 border-red-300';
      case 'cto':
        return 'from-blue-500 to-indigo-600 border-blue-300';
      case 'notification':
        return 'from-orange-500 to-amber-600 border-orange-300';
      default:
        return 'from-gray-500 to-gray-600 border-gray-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${getColors()} transform border px-3 py-1 text-xs font-bold text-white shadow-md transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-95 opacity-0'} ${isNew ? 'animate-pulse' : ''} ${className} `}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {text}
    </span>
  );
};
