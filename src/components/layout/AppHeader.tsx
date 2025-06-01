
import React from 'react';

interface AppHeaderProps {
  goalName: string | null;
}

export function AppHeader({ goalName }: AppHeaderProps) {
  const title = goalName ? goalName : 'Goal Calendar';
  return (
    <header className="py-6 px-4 md:px-8 bg-card shadow-md sticky top-0 z-50">
      <h1 className="text-3xl font-bold text-center text-primary truncate" title={title}>
        {title}
      </h1>
    </header>
  );
}
