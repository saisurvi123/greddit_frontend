import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Poststate from "./Context/posts/Poststate";
import { useContext } from "react";
import postcontext from "./Context/posts/postcontext";
import MySubgreddits from "./Components/MySubgreddits";
import Sgstate from "./Context/subgreddits/Sgstate";
import Mysubgredditpage from "./Components/Mysubgredditpage";
import Subgreddits from "./Components/Subgreddits";
import Subgredditspage from "./Components/Subgredditspage";
function App() {
  // const user=useContext(postcontext).user;
  return (
    <>
    <Sgstate>
      <Poststate>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/mysubgreddits" element={<MySubgreddits/>} />
            <Route exact path="/subgreddits" element={<Subgreddits/>} />
            <Route exact path="/login" element={<Signin />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/mygredditpage/:id" element={<Mysubgredditpage/>} />
            <Route exact path="/subgreddits/:id" element={<Subgredditspage/>} />
            

          </Routes>
        </Router>
      </Poststate>
      </Sgstate>
    </>
  );
}

export default App;
