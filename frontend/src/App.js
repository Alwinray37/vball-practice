import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import PlanBuilder from "./pages/PlanBuilder";
import DrillLibrary from "./pages/DrillLibrary";
import SavedPlans from "./pages/SavedPlans";
import Practice from "./pages/Practice";
import ToolDock from "./components/ToolDock";
import { clearSession, getSession } from "./data/storage";
import "./index.css";

// Key the builder by plan id so switching between "new plan" and
// "edit plan X" resets its state.
function KeyedPlanBuilder() {
  const { planId } = useParams();
  return <PlanBuilder key={planId || "new"} />;
}

function CurrentPracticeRoute({ session }) {
  return session ? (
    <Navigate to={`/practice/${session.planId}`} replace />
  ) : (
    <Navigate to="/plans" replace />
  );
}

function App() {
  const [session, setSession] = useState(getSession);

  useEffect(() => {
    const syncSession = () => setSession(getSession());
    window.addEventListener("storage", syncSession);
    window.addEventListener("vbp-session-change", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("vbp-session-change", syncSession);
    };
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <header className="app-header">
          <span className="app-logo">VBall Practice</span>
          <nav className="app-nav">
            <NavLink to="/" end>
              Plan Builder
            </NavLink>
            <NavLink to="/drills">Drills</NavLink>
            <NavLink to="/plans">Saved Plans</NavLink>
            {session && (
              <>
                <NavLink to="/practice" className="active-practice-link">
                  Current Practice
                </NavLink>
                <button
                  className="nav-end-practice"
                  onClick={() => {
                    if (window.confirm("Close the active practice?")) {
                      clearSession();
                      if (window.location.hash.startsWith("#/practice")) {
                        window.location.hash = "#/plans";
                      }
                    }
                  }}
                >
                  Close
                </button>
              </>
            )}
          </nav>
        </header>
        <ToolDock />
        <main>
          <Routes>
            <Route path="/" element={<KeyedPlanBuilder />} />
            <Route path="/builder/:planId" element={<KeyedPlanBuilder />} />
            <Route path="/drills" element={<DrillLibrary />} />
            <Route path="/plans" element={<SavedPlans />} />
            <Route
              path="/practice"
              element={<CurrentPracticeRoute session={session} />}
            />
            <Route path="/practice/:planId" element={<Practice />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
