import {
  Briefcase,
  Car,
  CircleHelp,
  FilePlus,
  FlaskConical,
  GitBranch,
  House,
  type LucideIcon,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface InternalItem {
  to: string
  label: string
  icon: LucideIcon
}

interface ExternalItem {
  href: string
  label: string
  icon: LucideIcon
}

const internalItems: InternalItem[] = [
  { to: '/car', label: 'Car Loan Calculator', icon: Car },
  { to: '/car-budget', label: 'Reverse Car Loan Calculator', icon: Car },
  { to: '/home', label: 'Home Loan Calculator', icon: House },
  { to: '/home-budget', label: 'Reverse Home Loan Calculator', icon: House },
]

const externalItems: ExternalItem[] = [
  { href: 'https://www.aizatto.com/', label: 'aizatto.com', icon: FilePlus },
  { href: 'https://www.build.my/', label: 'build.my', icon: FlaskConical },
  {
    href: 'https://www.deepthought.app/',
    label: 'Deep Thought',
    icon: CircleHelp,
  },
  {
    href: 'https://www.github.com/aizatto/loan-calculator/',
    label: 'GitHub',
    icon: GitBranch,
  },
  {
    href: 'https://www.linkedin.com/in/aizatto/',
    label: 'LinkedIn',
    icon: Briefcase,
  },
]

export const Menu: React.FC = () => {
  const { pathname } = useLocation()

  return (
    <nav className="flex flex-wrap items-center gap-1 border-b px-2 py-2">
      {internalItems.map((item) => {
        // "/" renders CarPage, so treat it as /car for highlighting
        const active =
          pathname === item.to || (pathname === '/' && item.to === '/car')
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              buttonVariants({ variant: active ? 'secondary' : 'ghost' })
            )}
          >
            <item.icon data-icon="inline-start" />
            {item.label}
          </Link>
        )
      })}
      {externalItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          <item.icon data-icon="inline-start" />
          {item.label}
        </a>
      ))}
    </nav>
  )
}
