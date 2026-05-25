import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
