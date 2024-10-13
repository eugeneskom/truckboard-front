"use client";
import Link from "next/link";
import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/hooks/useAuth";
function Header() {
  const { user } = useAuth();
  return (
    <header className="w-full ">
      <NavigationMenu className="list-none w-[100%] w-full">
        <NavigationMenuList className="w-[100%] w-full">
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

          <NavigationMenuItem>
            <Link href="/rate-list" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Rate List</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/tablo" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Tablo</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {/* <NavigationMenuItem className="ml-auto">
            <Link href="/login" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Login</NavigationMenuLink>
            </Link>
          </NavigationMenuItem> */}

          {user ? (
            <>
              <NavigationMenuItem className="ml-auto">
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <LogoutButton />
            </>
          ) : (
            <>
           <NavigationMenuItem className="ml-auto">
            <Link href="/login" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Login</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="ml-auto">
            <Link href="/register" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Register</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

export default Header;
