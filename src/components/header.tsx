import { Separator } from "@radix-ui/react-separator";
import { Home, Pizza, UsersRound, UtensilsCrossed } from "lucide-react";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Pizza className="h-6 w-6" />
        <Separator orientation="vertical" className="h-6" />
        <nav className="flex select-none items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <NavLink to="/dashboard">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Ínicio</span>
          </NavLink>
          <NavLink to="/orders">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="hidden sm:inline">Pedidos</span>
          </NavLink>
          <NavLink to="/collaborators">
            <UsersRound className="h-4 w-4" />
            <span className="hidden sm:inline">Colaboradores</span>
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
