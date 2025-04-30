import Navbar from "./pages/Navbar/Navbar";
import Home from "./pages/Home/Home";
import HomeWrapper from "./pages/HomeWrapper";
import Portfolio from "./pages/Portfilio/Portfolio";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import StockDetails from "./pages/StockDetails/StockDetails";
import Profile from "./pages/Profile/Profile";
import Notfound from "./pages/Notfound/Notfound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/Action";
import Wallet from "./pages/Wallet/Wallet";
import Watchlist from "./pages/Watchlist/Watchlist";
import TwoFactorAuth from "./pages/Auth/TwoFactorAuth";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import PasswordUpdateSuccess from "./pages/Auth/PasswordUpdateSuccess";
import LoginWithGoogle from "./pages/Auth/LoginWithGoogle.";
import PaymentSuccess from "./pages/Wallet/PaymentSuccess";
import Withdrawal from "./pages/Wallet/Withdrawal";
import PaymentDetails from "./pages/Wallet/PaymentDetails";
import WithdrawalAdmin from "./Admin/Withdrawal/WithdrawalAdmin";
import Activity from "./pages/Activity/Activity";
import SearchCoin from "./pages/Search/Search";
import { shouldShowNavbar } from "./Util/shouldShowNavbar";

const routes = [
  { path: "/", role: "ROLE_USER" },
  { path: "/portfolio", role: "ROLE_USER" },
  { path: "/activity", role: "ROLE_USER" },
  { path: "/wallet", role: "ROLE_USER" },
  { path: "/withdrawal", role: "ROLE_USER" },
  { path: "/payment-details", role: "ROLE_USER" },
  { path: "/wallet/success", role: "ROLE_USER" },
  { path: "/market/:id", role: "ROLE_USER" },
  { path: "/watchlist", role: "ROLE_USER" },
  { path: "/profile", role: "ROLE_USER" },
  { path: "/search", role: "ROLE_USER" },
  { path: "/admin/withdrawal", role: "ROLE_ADMIN" },
];

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Simple authentication check
  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("jwt");

    // If we have a token, try to get the user
    if (token) {
      dispatch(getUser(token));
    }
  }, [dispatch]);

  // Always show navbar on home page
  const showNavbar =
    location.pathname === "/" ||
    (auth.user && shouldShowNavbar(location.pathname, routes, auth.user?.role));

  // If we're at the root path, always show Home
  if (location.pathname === "/" || location.pathname === "") {
    return (
      <>
        {showNavbar && <Navbar />}
        <HomeWrapper />
      </>
    );
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Home route - always accessible first */}
        <Route index element={<HomeWrapper />} />
        <Route element={<HomeWrapper />} path="/" />
        <Route element={<Navigate to="/" />} path="/index.html" />

        {/* Auth routes */}
        <Route element={<Auth />} path="/signup" />
        <Route element={<Auth />} path="/signin" />
        <Route element={<Auth />} path="/forgot-password" />
        <Route element={<LoginWithGoogle />} path="/login-with-google" />
        <Route
          element={<ResetPasswordForm />}
          path="/reset-password/:session"
        />
        <Route
          element={<PasswordUpdateSuccess />}
          path="/password-update-successfully"
        />
        <Route element={<TwoFactorAuth />} path="/two-factor-auth/:session" />

        {/* Protected routes */}
        <Route
          element={auth.user ? <Portfolio /> : <Auth />}
          path="/portfolio"
        />
        <Route element={auth.user ? <Activity /> : <Auth />} path="/activity" />
        <Route element={auth.user ? <Wallet /> : <Auth />} path="/wallet" />
        <Route
          element={auth.user ? <Withdrawal /> : <Auth />}
          path="/withdrawal"
        />
        <Route
          element={auth.user ? <PaymentDetails /> : <Auth />}
          path="/payment-details"
        />
        <Route
          element={auth.user ? <Wallet /> : <Auth />}
          path="/wallet/:order_id"
        />
        <Route
          element={auth.user ? <StockDetails /> : <Auth />}
          path="/market/:id"
        />
        <Route
          element={auth.user ? <Watchlist /> : <Auth />}
          path="/watchlist"
        />
        <Route element={auth.user ? <Profile /> : <Auth />} path="/profile" />
        <Route element={auth.user ? <SearchCoin /> : <Auth />} path="/search" />

        {/* Admin routes */}
        {auth.user && auth.user.role === "ROLE_ADMIN" && (
          <Route element={<WithdrawalAdmin />} path="/admin/withdrawal" />
        )}

        {/* 404 route */}
        <Route element={<Notfound />} path="*" />
      </Routes>
    </>
  );
}

export default App;

