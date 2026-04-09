import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { DashboardPage } from "@/pages/DashboardPage";
import { SetupPage } from "@/pages/SetupPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<DashboardPage />}
      />
      <Route
        path="/setup"
        element={<SetupPage />}
      />
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
