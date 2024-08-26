import { Route, Routes } from "react-router-dom";
import Stock from "./Pages/Stock";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Stock />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
