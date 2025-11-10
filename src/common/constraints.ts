const PERMISSION_MODULES = {
  USERS: "Users",
  ROLES: "Roles",
  PERMISSIONS: "Permissions",
  ACTIVITY_LOGS: "Activity Logs",
  SETTINGS: "Settings",
  REPORTING: "Reporting",
};

const appName = import.meta.env.VITE_APP_NAME?.toLowerCase() || "app";
const ACCESS_TOKEN_KEY = `${appName}_accessToken`;
const REFRESH_TOKEN_KEY = `${appName}_refreshToken`;
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export { PERMISSION_MODULES, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, BASE_URL };
