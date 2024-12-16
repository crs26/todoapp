import { useEffect } from "react";
import Cookies from "universal-cookie";
import type { RootState, AppDispatch } from "./store";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { fetchTasks } from "./features/task/taskSlice";
import { setAuth } from "./features/auth/authSlice";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import "./App.css";

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { accessToken, loading, error } = useAppSelector((state) => state.auth);
  const cookies = new Cookies();

  useEffect(() => {
    const accToken: string = cookies.get("accessToken");
    if (accToken) {
      dispatch(
        setAuth({
          access: accToken,
          refresh: cookies.get("refreshToken"),
          user: cookies.get("user"),
        })
      );
    }
    dispatch(fetchTasks());
  });

  return (
    <>
      <h1>TaskTastic</h1>
      {loading && <p>Loading...</p>}
      {accessToken ? <Dashboard /> : <Login />}
      {error ? "" : error}

      <p className="read-the-docs">Developed by csalvadora for MEDDICC</p>
    </>
  );
};

export default App;
