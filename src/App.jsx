import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Loading from "./components/Loading";
import { Suspense, lazy } from "react";
import { startservices } from "./utils/backend";
import Protect from "./pages/Protect";
import CreateUser from "./pages/CreateUser";
const TrackMedia = lazy(() => import("./pages/TrackMedia"));

function App() {
  // startservices()
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<CreateUser />} />
          <Route element={<Protect />}>
            <Route path="/track-media-dashboard" element={<TrackMedia />} />
          </Route>
          {/* <Route
          path="/track-media-dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <TrackMedia />
            </Suspense>
          }
        /> */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
