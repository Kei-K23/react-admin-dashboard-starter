"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconInnerShadowTop,
  IconUserCog,
} from "@tabler/icons-react";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { useProfile, hasPermission } from "@/modules/auth/hooks/use-auth";
import { PermissionEnum } from "@/modules/auth/services/auth-services";
import { PERMISSION_MODULES } from "@/common/constraints";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Administration",
      url: "#",
      icon: IconUserCog,
      items: [
        {
          title: "Admin",
          url: "/administration/admin",
        },
        {
          title: "Role & Permissions",
          url: "/administration/role-permissions",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = useProfile();
  const user = profile?.data;

  const requiredForUrl = (
    url: string
  ): { module: string; permission: PermissionEnum } | undefined => {
    // Map specific routes to their respective modules
    if (url === "/administration/admin")
      return {
        module: PERMISSION_MODULES.USERS,
        permission: PermissionEnum.Read,
      };
    if (url === "/administration/role-permissions")
      return {
        module: PERMISSION_MODULES.ROLES,
        permission: PermissionEnum.Read,
      };
    return undefined;
  };

  const filteredNavMain = data.navMain
    .map((item) => {
      if (item.url === "/" && item.title === "Dashboard") {
        return item;
      }
      const subItems = (item.items || []).filter((sub) => {
        const req = requiredForUrl(sub.url);
        return req ? hasPermission(user, req.module, req.permission) : true;
      });

      // If no allowed sub-items remain, hide the parent entirely
      if (item.items && subItems.length === 0) {
        return null;
      }

      return { ...item, items: subItems };
    })
    .filter(Boolean) as typeof data.navMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: profile?.data.fullName || data.user.name,
            email: profile?.data?.email || data.user.email,
            avatar: profile?.data?.profileImageUrl || data.user.avatar,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
