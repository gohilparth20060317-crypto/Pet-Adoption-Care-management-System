import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import RootLayout from "./components/layout/RootLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/user/Dashboard";
import PetListing from "./pages/user/PetListing";
import PetDetails from "./pages/user/PetDetails";
import Vaccinations from "./pages/user/Vaccinations";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Wishlist from "./pages/user/Wishlist";
import DeliveryLocation from "./pages/user/DeliveryLocation";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePets from "./pages/admin/ManagePets";
import ManageVaccinations from "./pages/admin/ManageVaccinations";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAdoptions from "./pages/admin/ManageAdoptions";
import Payments from "./pages/admin/Payments";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route element={<RootLayout />}>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Authenticated user */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/pets" element={<ProtectedRoute><PetListing /></ProtectedRoute>} />
                <Route path="/pets/:id" element={<ProtectedRoute><PetDetails /></ProtectedRoute>} />
                <Route path="/vaccinations" element={<ProtectedRoute><Vaccinations /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/delivery-location" element={<ProtectedRoute><DeliveryLocation /></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/pets" element={<AdminRoute><ManagePets /></AdminRoute>} />
                <Route path="/admin/vaccinations" element={<AdminRoute><ManageVaccinations /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
                <Route path="/admin/adoptions" element={<AdminRoute><ManageAdoptions /></AdminRoute>} />
                <Route path="/admin/payments" element={<AdminRoute><Payments /></AdminRoute>} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
