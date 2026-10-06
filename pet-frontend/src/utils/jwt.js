import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

// Backend puts role as e.g. "ROLE_USER" / "ROLE_ADMIN" in the JWT claims,
// and the email in the `sub` claim.
export const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  const role = decoded?.role || "";
  return role.replace("ROLE_", "");
};

export const getEmailFromToken = (token) => decodeToken(token)?.sub || null;
