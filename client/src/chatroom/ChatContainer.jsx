import React, { useEffect, useState } from "react";
import socketIoClient from "socket.io-client";
import UserLogin from "./UserLogin";
import ChatBoxReciever from "./ChatBoxReciever";
import ChatBoxSender from "./ChatBoxSender";
import InputText from "./InputText";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import _ from "lodash";
import { useTheme } from '@mui/material/styles';

export default function ChatContainer(props) {
  console.log("localStorage: ", localStorage.getItem("chats"));

  useEffect(() => {
    if (!localStorage.getItem("avatar")) {
      localStorage.setItem(
        "avatar",
        `https://picsum.photos/id/${_.random(1, 1000)}/200/300`
      );
    }
  }, []);

  const [user, setUser] = useState(
    `${props.userData.name} (user${props.userData.user_id})` || ""
  );
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar"));
  const [rooms, setRooms] = useState([`Find a trail buddy`, `Trail conditions & updates`, `Off-trails activities`]);
  const [currentRoom, setCurrentRoom] = useState("");
  const theme = useTheme()

  // All chats received by client and sent from backend
  const [socketio, setSocketIO] = useState(null);
  const [chats, setChats] = useState({
    "Find a trail buddy": [],
    "Trail conditions & updates": [],
    "Off-trails activities": [],
  });

  //  REQUIRES: socketio and socket io client
  //  MODIFIES: chats state
  //  EFFECTS: on recieving an event named chat that event will give us a group of chats
  //          that is contained within that parcitular socket channel and then we
  //          setChats to that recieved chats
  useEffect(() => {
    setSocketIO(socketIoClient("https://trailblazers-app.azurewebsites.net/"));
  }, []);

  useEffect(() => {
    if (socketio) {
      socketio.on("recieve-chat", (recievedChats) => {
        addChat(recievedChats.chat);
      });
    }
  }, [socketio]);

  function addChat(chat) {
    setChats((chats) => {
      const current = chats[chat.currentRoom].slice(0);
      const updatedChats = { ...chats, [chat.currentRoom]: [...current, chat] };
      return updatedChats;
    });
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    setUser("");
  }

  //  REQUIRES: socketio and socket io client
  //  MODIFIES: all other clients' chats
  //  EFFECTS: sends an event named chat with the content of chat variable to the backend
  //          to be emitted by the backend to all other connected clients
  function sendChatsToBackend(chat) {
    socketio.emit("send-chat", { chat, currentRoom }, () => {
      addChat(chat);
    });
  }

  //  REQUIRES: socketio and socket io client
  //  MODIFIES: all other clients' chats
  //  EFFECTS: updates your list of chats and then send your new chat with your username
  //          and avatar to the other clients
  function addMessage(chat) {
    if (currentRoom === "") return;
    const newChat = { ...chat, user, avatar, currentRoom };
    sendChatsToBackend(newChat);
  }

  function joinRoom(roomName) {
    setCurrentRoom(roomName);
    socketio.emit("join-room", roomName);
  }

  return (
    user ? (
      <div style={{backgroundColor: theme.palette.innerCard.main}} className="bottom-tile-cards">
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardHeader
            avatar={<Avatar src={avatar} />}
            title={
              <Typography
              variant="h6"
              sx={{
                fontWeight: "300",
                letterSpacing: "2px",
              }}
              className="about"
            >{`${user} - ${props.trail.name} - ${currentRoom}`}</Typography>
            }
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            {rooms.map((currRoom, id) => (
              <>
                <Button
                  key={id}
                  variant="outlined"
                  onClick={() => joinRoom(currRoom)}
                  sx={{ margin: "0.5rem" }}
                >
                  {currRoom}
                </Button>
                <br></br>
              </>
            ))}
          </Box>
          {currentRoom === "" ? (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">
                Pick a room to begin chatting
              </Typography>
            </Box>
          ) : (
            <List sx={{ flexGrow: 1, overflowY: "auto", padding: 0 }}>
              {chats[currentRoom].length > 0
                ? chats[currentRoom].map((chat, index) => {
                    return user === chat.user ? (
                      <ListItem key={index} sx={{ justifyContent: "flex-end" }}>
                        <ChatBoxReciever
                          avatar={chat.avatar}
                          user={chat.user}
                          message={chat.message}
                        />
                      </ListItem>
                    ) : (
                      <ListItem key={index}>
                        <ChatBoxSender
                          avatar={chat.avatar}
                          user={chat.user}
                          message={chat.message}
                        />
                      </ListItem>
                    );
                  })
                : null}
            </List>
          )}
          <Box sx={{ marginBottom: "1rem"}}>
            <InputText  addMessage={addMessage} />
          </Box>
        </Box>
      </div>
    ) : (
      <UserLogin setUser={setUser} />
    )
  );
}
