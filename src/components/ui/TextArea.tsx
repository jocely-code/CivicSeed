"use client";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({
  label,
  error,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className={["field", className].filter(Boolean).join(" ")}>
      <label htmlFor={props.id}>{label}</label>
      <textarea
        id={props.id}
        className={[
          "textarea",
          error ? "textarea--error" : undefined,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
