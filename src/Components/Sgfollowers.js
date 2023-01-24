import React from "react";
import { Avatar } from "@mui/material";
import { ListItem, ListItemText } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import PersonIcon from "@mui/icons-material/Person";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useState } from "react";
import { blue } from "@mui/material/colors";
import { useEffect } from "react";
function Sgfollowers(props) {
  const [user, setuser] = useState(null);
  const host = "http://localhost:5000";
  console.log(props.id)
  const getconnection = async () => {
    const response = await fetch(`${host}/api/auth/getconnection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ id: props.id }),
    });
    const json = await response.json();
    console.log(json);
    setuser(json);
  };
  useEffect(() => {
    getconnection();
  }, []);

  return (
    <>
      {user && (
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.username} />
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
}

export default Sgfollowers;
