import React from "react";
import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { IconButton } from "@mui/material";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import { Chip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import { MenuItem } from "@mui/material";
import { useRef } from "react";
const host = "https://redditbackend.onrender.com";
function Subgreddits() {
  const [greddits, setgreddits] = useState([]);
  const sorttype = ["Name Asc", "Name Desc", "FollowerCount", "CreationDate"];
  const [tags, settags] = useState([]);
  const [st, setst] = useState("Name Asc");
  const tagref = useRef(null);
  const sortref = useRef(null);
  const [searchedword, setsearchedword] = useState("");
  const [id, setid] = useState(null);
  const sortchange = (e) => {
    // console.log("hai");
    console.log(e.target.value);
    setst(e.target.value);
  };
  const addtag = () => {
    // console.log("hai")
    console.log(tagref.current.value);
    let newwords = [].concat(tags, tagref.current.value);
    settags(newwords);
    // console.log(tags);
    tagref.current.value = "";
  };
  const onchange = (e) => {
    setsearchedword(e.target.value);
  };
  //lets fectch all greddits
  const handleDelete = (tag) => {
    settags(tags.filter((tagi) => tagi != tag));
  };
  const fetchallgreddits = async () => {
    const response = await fetch(`${host}/api/subgreddit/fetchallgreddits`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
    if (!json.error) setgreddits(json);
    else {
      alert(json.error);
    }
  };
  const joinrequest = async (gredditid) => {
    const newdata = {
      gredditid: gredditid,

    };
    const response = await fetch(`${host}/api/subgreddit/joinrequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(newdata),
    });
  };

  const getmyid = async () => {
    const response = await fetch(`${host}/api/auth/getmyid`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (!json.error) setid(json.id);
    else {
      alert(json.error);
    }
  };

  const navigate = useNavigate();
  const [click, setclick] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      fetchallgreddits();
      getmyid();
    }
  }, [click]);
  const joinuser = (gredditid) => {
    // console.log(e.target.value);
    joinrequest(gredditid);
    if (click == false) setclick(true);
    else setclick(false);
  };

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const joinrejecteduser=(gredditid)=>{
    const greddit2=greddits.filter((greddit1)=>greddit1._id===gredditid);
    console.log(greddit2)
    if(greddit2[0].followers.find((follower)=>{
      var presentdate= new Date();
      // var finaldate=addDays(follower.date,0);
      var finaldate = new Date(follower.date)
      if(presentdate.getTime()  - finaldate.getTime()){
        return follower;
      }

    })){
      joinuser(gredditid);
    }
    else{
      alert("you cannot send join request for 7 days once moderator cancels request")
    }

      
  } 

  return (
    <div className="container my-5">
      <div className="row my-5">
        {tags.length != 0 &&
          tags.map((tag) => {
            return (
              <div className="col col-md-1">
                <Chip label={tag} onDelete={() => handleDelete(tag)} />
              </div>
            );
          })}
      </div>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <TextField
          id="input-with-icon-textfield"
          label="select tag"
          inputRef={tagref}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={addtag}>
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        <Paper
          component="form"
          sx={{
            p: "4px 6px",
            display: "flex",
            alignItems: "center",
            width: 600,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search SubGreddits"
            inputProps={{ "aria-label": "search google maps" }}
            onChange={onchange}
          />

          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>
        <TextField
          id="outlined-select-sort"
          select
          label="Sort"
          inputRef={sortref}
          onChange={sortchange}
          defaultValue={"Name Asc"}
        >
          {sorttype.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <div className="row">
        {greddits.length != 0 &&
          greddits
            .filter((greddit) => {
              {
                /* console.log(greddit); */
              }
              if (searchedword == "") {
                if (tags.length == 0) return greddit;
                else {
                  for (let i = 0; i < tags.length; i++) {
                    if (greddit.tags.includes(tags[i])) return greddit;
                  }
                }
              } else if (
                greddit.name.toLowerCase().includes(searchedword.toLowerCase())
              ) {
                if (tags.length == 0) return greddit;
                else {
                  for (let i = 0; i < tags.length; i++) {
                    if (greddit.tags.includes(tags[i])) return greddit;
                  }
                }
              }
            })
            .sort(function (a, b) {
              if (st == "Name Asc") {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
              } else if (st == "Name Desc") {
                return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
              } else if (st == "FollowerCount") {
                if (a.followers.length < b.followers.length) return 1;
                return -1;
              } else {
                if (a.name < b.name) return 1;
                return -1;
              }
            })
            .map((greddit) => {
              return (
                <div key={greddit._id} className="col col-md-12 my-3">
                  <Card sx={{ minWidth: 275 }}>
                    {/* <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <IconButton aria-label="delete" size="large">
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Stack> */}
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {greddit.name}
                      </Typography>
                      <Typography variant="body2" className="my-2">
                        {greddit.description}
                      </Typography>

                      <Typography variant="p" className="my-4" component="div">
                        Banned KeyWords
                      </Typography>
                      <div className="row">
                        {greddit.bannedkeywords.length != 0 &&
                          greddit.bannedkeywords.map((word) => {
                            return (
                              <div className="col col-md-1 my-1">
                                <Chip label={word} />
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                    <CardActions>
                      <Stack
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        spacing={1}
                      >
                        <>
                          <IconButton aria-label="delete">
                            <PeopleAltIcon />
                          </IconButton>
                          <Typography variant="body2">
                            {greddit.followers.length + 1} followers
                          </Typography>
                        </>
                        <>
                          <IconButton aria-label="delete">
                            <MarkAsUnreadIcon />
                          </IconButton>
                          <Typography variant="body2">
                            {greddit.posts.length} posts
                          </Typography>
                        </>
                        {!greddit.followers.find((user1) => {
                          return (
                            user1.id === id &&
                            (user1.status === "accepted" ||
                              user1.status === "temprejected")
                          );
                        }) &&
                          !greddit.followers.find((user1) => {
                            return (
                              user1.id === id && user1.status === "requested"
                            );
                          }) &&
                          !greddit.followers.find((user1) => {
                            return (
                              user1.id === id && user1.status === "rejected"
                            );
                          }) &&
                          !(greddit.user === id) && (
                            <Button
                              variant="contained"
                              className="mx-5"
                              onClick={() => joinuser(greddit._id)}
                              value="sai"
                            >
                              Join
                            </Button>
                          )}



                        {(greddit.followers.find((user1) => {
                          return user1.id === id && user1.status === "accepted";
                        }) ||
                          greddit.user === id) && (
                          <Button
                            variant="contained"
                            className="mx-5"
                            onClick={() =>
                              navigate(`/subgreddits/${greddit._id}`)
                            }
                          >
                            open
                          </Button>
                        )}

                        {greddit.followers.find((user1) => {
                          return (
                            user1.id === id && user1.status === "requested"
                          );
                        }) &&!(greddit.user === id)&& (
                          <Button variant="contained" className="mx-5" disabled>
                            requested
                          </Button>
                        )}

                        {greddit.followers.find((user1) => {
                          return user1.id === id && user1.status === "rejected";
                        }) && (
                          <Button variant="contained" className="mx-5" 
                            onClick={()=> alert(" cannot join !! you left the subgreddit")}
                          >
                            Join
                          </Button>
                        )}
                        {greddit.followers.find((user1) => {
                          return (
                            user1.id === id && user1.status === "temprejected"
                          );
                        }) && (
                          <Button variant="contained" className="mx-5" 
                          onClick={()=>joinrejecteduser(greddit._id)}
                          >
                            Join
                          </Button>
                        )}
                      </Stack>
                    </CardActions>
                  </Card>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Subgreddits;
