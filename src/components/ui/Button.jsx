import React from "react";
import Link from "next/link";

function Button({
  variant = "primary",
  children,
  href,
  as = "button",
  className = "",
  isLoading = false,
  ...props
}) {
  // Remove isLoading from DOM props
  const domProps = { ...props };

  const baseClass = "px-s24 py-s8 h-fit rounded-r8 hover:cursor-pointer";

  const variants = {
    primary: "body-default bg-primary-main text-background hover:bg-primary-light",
    secondary: "body-default text-accent-main bg-secondary-main hover:bg-secondary-light hover:text-accent-main",
    ctaAccent: "body-large text-background bg-accent-main hover:bg-secondary-main hover:text-accent-main",
    ctaSecondary: "body-large text-accent-main bg-secondary-main hover:bg-secondary-main hover:text-accent-main",
    outliner:
      "body-default text-primary-main hover:bg-primary-main hover:text-background border-primary-main border-2",
    destructive: "body-default text-background bg-red-main hover:bg-red-dark",
  };

  const allClasses = `
    ${baseClass}
    ${variants[variant] || variants.primary}
    ${className}
    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
  `;

  // LINK BUTTON
  if (as === "link" && href) {
    return (
      <Link href={href} className={allClasses} {...domProps}>
        {isLoading ? "Loading..." : children}
      </Link>
    );
  }

  // NORMAL BUTTON
  return (
    <button
      className={allClasses}
      disabled={isLoading || domProps.disabled}
      {...domProps}
    >
      { children}
    </button>
  );
}

export default Button;
