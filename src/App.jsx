import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";
const TrackMedia = lazy(() => import("./pages/TrackMedia"));
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/track-media-dashboard"
          element={
            <Suspense fallback={<Loading/>}>
              <TrackMedia />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
