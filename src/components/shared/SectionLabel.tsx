interface Props {
  children: React.ReactNode
}

export function SectionLabel({ children }: Props) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim font-semibold mb-2">
      {children}
    </div>
  )
}
