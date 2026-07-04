import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchMe } from "@/features/auth/authSlice";
import useOrderSocket from "@/hooks/useOrderSocket";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMe());
  }, [dispatch, isAuthenticated]);

  useOrderSocket();
  return <RouterProvider router={router} />;
}

export default App;
