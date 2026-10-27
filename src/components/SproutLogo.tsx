"use client";

export function SproutLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CivicSeed"
    >
      <path
        d="M16 4C11.5817 4 8 6.58172 8 10C8 13.4183 11.5817 16 16 16C20.4183 16 24 13.4183 24 10C24 6.58172 20.4183 4 16 4Z"
        stroke="#173F35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10C12 12.7614 14.2614 15 17 15C19.7386 15 22 12.7614 22 10"
        stroke="#173F35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10L16 22"
        stroke="#173F35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 16L20 20"
        stroke="#173F35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 16L12 20"
        stroke="#173F35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
