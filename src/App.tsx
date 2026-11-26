import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { WelcomePage } from './pages/WelcomePage';
import { RedirectIfAuth, RequireAuth, RootRedirect } from './routes/guards';

/** Route guard table from the requirements doc (Session section). */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/signup"
          element={
            <RedirectIfAuth>
              <SignUpPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectIfAuth>
              <SignInPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/welcome"
          element={
            <RequireAuth>
              <WelcomePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
