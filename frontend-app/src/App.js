import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
// Public Pages
import HomePage from "./components/HomePage";
import AboutUs from "./components/AboutUs/AboutUs";
import MenuPage from "./components/MenuPage/MenuPage";
import CartPage from "./components/CartPage/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ContactPage from "./components/ContactPage/ContactPage";
import FeedbackPage from "./components/FeedbackPage/FeedbackPage";
import GalleryPage from "./components/Gallery/GalleryPage";
import ServicePage from "./components/ServicePage/ServicePage";
import ServiceDetail from "./components/ServiceDetail";
import MoreServices from "./components/MoreServices";
import Header from "./components/Header";
import Footer from "./components/Footer";
// Admin Pages (with Dashboard Layout)
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from "./components/admin/AdminDashboard"; 
import DashboardHome from "./components/admin/Dashboardlayout";
import OrdersPage from "./components/admin/OrdersPage";
import StaffPage from "./components/admin/StaffPage";
import MenuItemsPage from "./components/admin/MenuitemsPage";
import AddAdmin from './components/admin/AddAdmin';
import AllAdminsPage from './components/admin/AllAdminsPage';
import CateringEventsPage from "./components/admin/CateringEventsPage/CateringEventsPage";
import CateringEventDetail from "./components/admin/CateringEventsPage/CateringEventDetail";
import AddCateringEvent from "./components/admin/CateringEventsPage/AddCateringEvent";
import EditCateringEvent from "./components/admin/CateringEventsPage/EditCateringEvent";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* Admin login page (public) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected admin routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          {/* Admin dashboard with nested routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            {/* Default dashboard home */}
            <Route index element={<DashboardHome />} />
            
            {/* Nested admin pages */}
            <Route path="orders" element={<OrdersPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="menuitem" element={<MenuItemsPage />} />
            <Route path="/admin/add-admin" element={<AddAdmin />} />
            <Route path="/admin/all-admins" element={<AllAdminsPage />} />
            
            {/* Catering events nested routes */}
            <Route path="catering-events" element={<CateringEventsPage />} />
            <Route path="catering-events/new" element={<AddCateringEvent />} />
            <Route path="catering-events/:id/edit" element={<EditCateringEvent />} />
            <Route path="catering-events/:id" element={<CateringEventDetail />} />
          </Route>
        </Route>
        
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/services/more" element={<MoreServices />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}
export default App;