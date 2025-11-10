import { BrowserRouter, Route, Routes } from "react-router";
import DashboardLayout from "./components/layout/main/dashboard-layout";
import DashboardPage from "./components/layout/main/dashboard";
import AdminIndexPage from "./modules/auth/pages/admin";
import RoleAndPermissionsIndexPage from "./modules/auth/pages/role-and-permissions";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LoginPage from "./modules/auth/pages/login";
import { Toaster } from "sonner";
import ProtectedRoute from "./modules/auth/components/protected-route";
import PermissionGuard from "./modules/auth/components/permission-guard";
import { PermissionEnum } from "./modules/auth/services/auth-services";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Protected application routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />

              <Route path="administration">
                <Route
                  path="admin"
                  element={
                    <PermissionGuard
                      module="Users"
                      permission={PermissionEnum.Read}
                    >
                      <AdminIndexPage />
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
              </Route>
            </Route>
          </Route>
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
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
