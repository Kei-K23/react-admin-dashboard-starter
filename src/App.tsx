import { BrowserRouter, Route, Routes } from "react-router";
import DashboardLayout from "./components/layout/main/dashboard-layout";
import DashboardPage from "./components/layout/main/dashboard";
import UserIndexPage from "./modules/auth/pages/user";
import RoleAndPermissionsIndexPage from "./modules/auth/pages/role-and-permissions";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LoginPage from "./modules/auth/pages/login";
import { Toaster } from "sonner";
import ProtectedRoute from "./modules/auth/components/protected-route";
import PermissionGuard from "./modules/auth/components/permission-guard";
import RoleAndPermissionsCreatePage from "./modules/auth/pages/role-and-permissions/create";
import UserCreatePage from "./modules/auth/pages/user/create";
import UserDetailPage from "./modules/auth/pages/user/detail";
import UserEditPage from "./modules/auth/pages/user/edit";
import RoleDetailPage from "./modules/auth/pages/role-and-permissions/detail";
import ProfilePage from "./modules/auth/pages/profile";
import ProfileEditPage from "./modules/auth/pages/profile/edit";
import RoleAndPermissionsEditPage from "./modules/auth/pages/role-and-permissions/edit";
import { PermissionEnum } from "./modules/auth/services/role-and-permissions.service";
import NotFound from "./components/layout/main/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Protected application routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />

              <Route path="account">
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/edit" element={<ProfileEditPage />} />
              </Route>

              <Route path="administration">
                <Route
                  path="users"
                  element={
                    <PermissionGuard
                      module="Users"
                      permission={PermissionEnum.Read}
                    >
                      <UserIndexPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="users/create"
                  element={
                    <PermissionGuard
                      module="Users"
                      permission={PermissionEnum.Create}
                    >
                      <UserCreatePage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="users/:id"
                  element={
                    <PermissionGuard
                      module="Users"
                      permission={PermissionEnum.Read}
                    >
                      <UserDetailPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="users/:id/edit"
                  element={
                    <PermissionGuard
                      module="Users"
                      permission={PermissionEnum.Update}
                    >
                      <UserEditPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="role-permissions"
                  element={
                    <PermissionGuard
                      module="Roles"
                      permission={PermissionEnum.Read}
                    >
                      <RoleAndPermissionsIndexPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="role-permissions/create"
                  element={
                    <PermissionGuard
                      module="Roles"
                      permission={PermissionEnum.Create}
                    >
                      <RoleAndPermissionsCreatePage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="role-permissions/:id"
                  element={
                    <PermissionGuard
                      module="Roles"
                      permission={PermissionEnum.Read}
                    >
                      <RoleDetailPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="role-permissions/:id/edit"
                  element={
                    <PermissionGuard
                      module="Roles"
                      permission={PermissionEnum.Update}
                    >
                      <RoleAndPermissionsEditPage />
                    </PermissionGuard>
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
