import Link from "next/link";
import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
function Header() {
  return (
    <header className="w-full ">
        <NavigationMenu className="list-none ">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/carrier-list" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Carrier List</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/truck-list" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Truck List</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/driver-list" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Driver List</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/search-list" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Search List</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
    </header>
  );
}

export default Header;
