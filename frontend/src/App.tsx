import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/home/Footer";
import HomePage from "./components/home/HomePage";
import Blogs from "./components/blogs/Blogs";
import Auth from "./components/auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authActions } from "./store/auth-slice";

function App() {
  const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
  const dispatch = useDispatch();
  console.log(isLoggedIn);
  useEffect(() => {
    const data: string = localStorage.getItem("userData") as string;
    if(JSON.parse(data) !== null) {
      dispatch(authActions.login());
    }
  }, [])
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
