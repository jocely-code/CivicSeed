"use client";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  return (
    <div className={["field", className].filter(Boolean).join(" ")}>
      <label htmlFor={props.id}>{label}</label>
      <input
        id={props.id}
        className={[
          "input",
          error ? "input--error" : undefined,
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
