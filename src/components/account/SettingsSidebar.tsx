"use client";

interface SidebarItem {
  href: string;
  label: string;
}

interface SettingsSidebarProps {
  items: SidebarItem[];
}

export default function SettingsSidebar({ items }: SettingsSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <nav className="rounded-2xl border border-white/10 bg-[#070b10] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.42)]">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#58E8C1]">Settings</p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-zinc-300 transition hover:-translate-y-0.5 hover:border-[#58E8C1]/35 hover:bg-[#0e141d] hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
