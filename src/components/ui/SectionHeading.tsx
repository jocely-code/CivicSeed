"use client";

interface SectionHeadingProps {
  children: React.ReactNode;
  level?: 2 | 3 | 4;
  className?: string;
}

export function SectionHeading({
  children,
  level = 2,
  className,
}: SectionHeadingProps) {
  const Tag = level === 3 ? "h3" : level === 4 ? "h4" : "h2";
  return (
    <Tag className={className}>
      {children}
    </Tag>
  );
}
