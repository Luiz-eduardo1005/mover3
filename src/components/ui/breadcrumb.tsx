import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}
    >
      <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link 
            to="/" 
            className="hover:text-foreground transition-colors flex items-center"
            itemProp="item"
            aria-label="Página inicial"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Início</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        {items.map((item, index) => (
          <li 
            key={index} 
            className="flex items-center space-x-2"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors"
                itemProp="item"
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span 
                className="text-foreground font-medium"
                itemProp="name"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
