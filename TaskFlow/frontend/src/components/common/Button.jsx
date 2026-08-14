import { Button as ShadcnButton } from "@/components/ui/button";

function Button({ children, type = "button", disabled, onClick, className = "", variant = "default" }) {
  // Map old variants to shadcn variants
  let mappedVariant = variant;
  if (variant === "primary") mappedVariant = "default";
  if (variant === "danger") mappedVariant = "destructive";

  return (
    <ShadcnButton
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      variant={mappedVariant}
    >
      {children}
    </ShadcnButton>
  );
}

export default Button;
