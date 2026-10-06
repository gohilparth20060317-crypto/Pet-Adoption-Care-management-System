import * as userApi from "./userApi";
import * as adoptionApi from "./adoptionApi";

/**
 * The backend only exposes GET /api/adoption/history/{userId}, not a
 * "get all adoption requests" endpoint. This aggregates history across every
 * user so the admin can still see and manage all requests in one place.
 */
export const getAllAdoptionRequests = async () => {
  const users = await userApi.getAllUsers();
  const results = await Promise.all(
    users.map((u) => adoptionApi.getAdoptionHistory(u.id).catch(() => []))
  );
  return results.flat();
};
