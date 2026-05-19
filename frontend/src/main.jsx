import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "./contexts/auth-context.jsx";
import AccountPage from "./pages/account-page.jsx";
import CampsiteDetailPage from "./pages/campsite-detail-page.jsx";
import CampsitesPage from "./pages/campsites-page.jsx";
import LoginPage from "./pages/login-page.jsx";
import RegisterPage from "./pages/register-page.jsx";
import TrailDetailPage from "./pages/trail-detail-page.jsx";
import TrailsPage from "./pages/trails-page.jsx";
import "./styles/app.css";

const queryClient = new QueryClient();

function usePathname() {
  const [pathname, setPathname] = React.useState(window.location.pathname || "/trails");

  React.useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname || "/trails");
    const handleDocumentClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const link = target.closest("a[data-nav='spa']");
      if (!link) {
        return;
      }
      event.preventDefault();
      const href = link.getAttribute("href");
      if (!href) {
        return;
      }
      window.history.pushState({}, "", href);
      handleLocationChange();
    };

    window.addEventListener("popstate", handleLocationChange);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return pathname;
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function AppRoutes({ pathname }) {
  if (pathname.startsWith("/trails/")) {
    return <TrailDetailPage trailId={pathname.split("/")[2]} />;
  }

  if (pathname.startsWith("/campsites/")) {
    return <CampsiteDetailPage campsiteId={pathname.split("/")[2]} />;
  }

  if (pathname === "/campsites") {
    return <CampsitesPage />;
  }

  if (pathname === "/login") {
    return <LoginPage onNavigate={navigate} />;
  }

  if (pathname === "/register") {
    return <RegisterPage onNavigate={navigate} />;
  }

  if (pathname === "/account") {
    return <AccountPage />;
  }

  return <TrailsPage />;
}

function AuthNav() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <>
        <a className="nav-link" data-nav="spa" href="/account">
          {user.displayName}
        </a>
        <button
          className="nav-link nav-btn"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          type="button"
        >
          Log out
        </button>
      </>
    );
  }

  return (
    <>
      <a className="nav-link" data-nav="spa" href="/login">
        Log in
      </a>
      <a className="nav-link" data-nav="spa" href="/register">
        Sign up
      </a>
    </>
  );
}

function App() {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Trail & Campsite Intelligence</div>
        <nav className="nav-links" aria-label="Primary navigation">
          <a
            className={`nav-link ${pathname.startsWith("/trails") || pathname === "/" ? "active" : ""}`}
            data-nav="spa"
            href="/trails"
          >
            Trails
          </a>
          <a
            className={`nav-link ${pathname.startsWith("/campsites") ? "active" : ""}`}
            data-nav="spa"
            href="/campsites"
          >
            Campsites
          </a>
          <AuthNav />
        </nav>
      </header>

      <main className="content-wrap">
        <AppRoutes pathname={pathname} />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
