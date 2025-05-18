import React from 'react';

interface SectionBlockProps {
  title: string;
  bgColor: string;
  children: React.ReactNode;
}

export const SectionBlock = ({ title, bgColor, children }: SectionBlockProps) => (
  <div className="w-full">
    <h2 className={`text-3xl w-full h-15 pl-4 flex items-center transition-colors duration-200 ${bgColor}`}>
      {title}
    </h2>
    <div className="pl-8 bg-gray-200 pt-5 pb-5">
      {children}
    </div>
  </div>
);
