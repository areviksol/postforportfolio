import { Navigate, Route, Routes } from "react-router-dom";
import PostList from "./components/PostList";
import PostProvider from "./contexts/PostContext";
import Post from "./components/Post";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";

function App() {
  const user = localStorage.getItem("token");

  return (
    <div className="container ">
      <Routes>
			{user && <Route path="/" exact element={<PostList />} />}
        <Route path='/posts/:_id' element={
          <PostProvider>
            <Post/>
          </PostProvider>
        } />
        <Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/users/:id/verify/:token" element={<EmailVerify />} />
      </Routes>
    </div>
  );
}

export default App;
