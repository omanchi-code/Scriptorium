import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  small?: boolean;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkProps = CommonProps & {
  href: string;
};

/**
 * The site's one recurring interactive-text pattern (`[ Like this ]`),
 * as a single primitive instead of `className="bracket-link"` repeated
 * at every call site. Visually identical to before — this only
 * centralizes the pattern, it doesn't change it.
 */
export default function ActionButton(props: ButtonProps | LinkProps) {
  const { children, className = "", small } = props;
  const classes = `bracket-link ${small ? "text-xs" : ""} ${className}`.trim();

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonProps;
  return (
    <button {...buttonProps} className={`${classes} disabled:opacity-40`}>
      {children}
    </button>
  );
}
