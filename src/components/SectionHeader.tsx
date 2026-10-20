import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
};

/** Section heading with an optional "view all" link. Stacks on phones, sits on one row from `sm` up. */
export function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">{title}</h2>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="-my-2 shrink-0 self-start whitespace-nowrap py-2 text-sm sm:self-auto font-semibold text-brand hover:text-brand-dark"
        >
          {action.label} <span aria-hidden="true">&rarr;</span>
        </Link>
      )}
    </div>
  );
}
