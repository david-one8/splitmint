'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export default function BackButton({
  href,
  label = 'Back',
}: {
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label="Go back"
      className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}
