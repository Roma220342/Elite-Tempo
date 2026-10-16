import type { FC, SVGProps } from 'react'

// Only icons from src/assets/icons are used; file name = SF Symbol name
const modules = import.meta.glob('../assets/icons/*.svg', {
  query: '?react',
  import: 'default',
  eager: true,
}) as Record<string, FC<SVGProps<SVGSVGElement>>>

const icons: Record<string, FC<SVGProps<SVGSVGElement>>> = {}
for (const [path, C] of Object.entries(modules)) {
  icons[path.split('/').pop()!.replace('.svg', '')] = C
}

export function Icon({ name, ...rest }: { name: string } & SVGProps<SVGSVGElement>) {
  const C = icons[name]
  if (!C) {
    if (import.meta.env.DEV) console.warn(`Icon "${name}" not found in src/assets/icons`)
    return <span className="icon-missing" aria-hidden />
  }
  return <C aria-hidden fill="currentColor" {...rest} />
}
