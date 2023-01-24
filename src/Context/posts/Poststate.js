import { useState } from "react";
import postcontext from "./postcontext";
const host = "https://keepnotes-wfzj.onrender.com";

const Poststate=(props)=>{
    const [user, setuser] = useState(null);
    return (
        <postcontext.Provider
          value={{ user,setuser}}
        >
          {props.children}
        </postcontext.Provider>
      );
};
export default Poststate;
