"use client";

import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Expanding category rows: each row grows on hover, draws corner brackets and
 * reveals a trailing icon.
 *
 * The source shipped against shadcn's token names (bg-background, text-primary,
 * border-border …), which this project does not define — it uses its own
 * charcoal/ivory/champagne scale. Colours are mapped to those tokens so the
 * component matches the rest of the site; structure, props and interaction are
 * unchanged.
 */

export interface Category {
  id: string | number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  /** Renders the row as a link. Works from server components, unlike onClick. */
  href?: string;
  featured?: boolean;
}

export interface CategoryListProps {
  title?: string;
  subtitle?: string;
  categories: Category[];
  headerIcon?: React.ReactNode;
  className?: string;
  /** hide the built-in header when the surrounding section already has one */
  showHeader?: boolean;
}

export const CategoryList = ({
  title,
  subtitle,
  categories,
  headerIcon,
  className,
  showHeader = true,
}: CategoryListProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

  return (
    <div className={cn("w-full text-ivory", className)}>
      <div className="mx-auto w-full">
        {showHeader && (title || subtitle) && (
          <div className="mb-12 text-center md:mb-16">
            {headerIcon && (
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold/70 to-gold text-ink">
                {headerIcon}
              </div>
            )}
            {title && (
              <h2 className="mb-2 font-display text-[clamp(32px,4vw,54px)] font-semibold tracking-[-0.03em]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-display text-[clamp(32px,4vw,54px)] font-semibold tracking-[-0.03em] text-muted-dark">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          {categories.map((category) => {
            const active = hoveredItem === category.id;
            const interactive = Boolean(category.onClick || category.href);

            const hoverProps = {
              onMouseEnter: () => setHoveredItem(category.id),
              onMouseLeave: () => setHoveredItem(null),
              onFocus: () => setHoveredItem(category.id),
              onBlur: () => setHoveredItem(null),
            };

            // NB: build the row body as an element, not as a component defined
            // in here. A component declared inside render is a new type on every
            // render, so hovering (which sets state) would remount the row and
            // swallow the click before the link could navigate.
            const body = (
              <div
                  className={cn(
                    "relative overflow-hidden rounded-xl border transition-all duration-300 ease-in-out",
                    interactive ? "cursor-pointer" : "cursor-default",
                    active
                      ? "h-32 border-gold bg-gold/[0.06] shadow-lg shadow-gold/10"
                      : "h-24 border-line-dark hover:border-gold/50"
                  )}
                >
                  {/* corner brackets on hover */}
                  {active && (
                    <>
                      <div className="absolute left-3 top-3 h-6 w-6">
                        <div className="absolute left-0 top-0 h-0.5 w-4 bg-gold" />
                        <div className="absolute left-0 top-0 h-4 w-0.5 bg-gold" />
                      </div>
                      <div className="absolute bottom-3 right-3 h-6 w-6">
                        <div className="absolute bottom-0 right-0 h-0.5 w-4 bg-gold" />
                        <div className="absolute bottom-0 right-0 h-4 w-0.5 bg-gold" />
                      </div>
                    </>
                  )}

                  <div className="flex h-full items-center justify-between gap-6 px-6 md:px-8">
                    <div className="min-w-0 flex-1">
                      <h3
                        className={cn(
                          "font-display font-semibold tracking-[-0.02em] transition-colors duration-300",
                          category.featured
                            ? "text-[clamp(20px,2.4vw,30px)]"
                            : "text-[clamp(18px,2vw,25px)]",
                          active ? "text-gold" : "text-ivory"
                        )}
                      >
                        {category.title}
                      </h3>
                      {category.subtitle && (
                        <p
                          className={cn(
                            "mt-1 text-[13.5px] transition-colors duration-300 md:text-[15px]",
                            active ? "text-ivory/90" : "text-muted-dark"
                          )}
                        >
                          {category.subtitle}
                        </p>
                      )}
                    </div>

                    {category.icon && active && (
                      <div className="shrink-0 text-gold">{category.icon}</div>
                    )}
                  </div>
              </div>
            );

            if (category.href) {
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group relative block outline-none"
                  {...hoverProps}
                >
                  {body}
                </Link>
              );
            }

            return (
              <div
                key={category.id}
                className="group relative"
                {...hoverProps}
                onClick={category.onClick}
                {...(category.onClick
                  ? {
                      role: "button" as const,
                      tabIndex: 0,
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          category.onClick?.();
                        }
                      },
                    }
                  : {})}
              >
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
