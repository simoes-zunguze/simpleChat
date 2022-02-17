import React, { useEffect, useState } from 'react';
import Chat from './chat'
import io from "socket.io-client";
import styled from "styled-components";

let URL: string;
let user: string = "";
let chatRoom: string = "";
if (process.env.NODE_ENV === "development") {
  URL = "http://localhost:3001";
  console.log("DEV");
  user = "user1";
  chatRoom = "x1";
} else {
  URL = window.location.href;
  console.log(process.env);
}

const socket = io(URL);
// const socket = io("https://chat.zunguze.com");

const Register: React.FC = () => {
  const [username, setUsername] = useState(user)
  const [room, setRoom] = useState(chatRoom)
  const [showChat, setshowChat] = useState(false)
  console.log(URL);

  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else {
    Notification.requestPermission();
  }
  const joinRoom = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (username !== "" && room !== "") {
      socket.emit("join_chat_room", { username: username, room: room });
      setshowChat(true)
    }
  };

  useEffect(() => {
    socket.io.on('reconnect', data => {
      socket.emit("join_chat_room", { username: username, room: room });
      console.log('reconnected...');
    })

    socket.on('disconnect', () => {
      console.log('disconnected...');
    })

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(attempt);

    });
  }, [])
  return (
    showChat ?
      <Chat username={username} socket={socket} room={room} /> :

      <div className="register">
        <Container>
          <Form action="">
            <Input type="username" placeholder="Nickname" value={username} onChange={e => { setUsername(e.target.value) }} />
            <Input type="room" placeholder="room" value={room} onChange={e => { setRoom(e.target.value) }} />
            <Button onClick={joinRoom}>Join</Button>
          </Form>
        </Container>
      </div>
  );
}

export default Register;

const Container = styled.div`
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
`

const Form = styled.form`
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Input = styled.input`
    color: white;
    margin: 5px;
    padding: 5px;
    border:  2px solid #0004;
    border-radius: 5px;
    background-color: #0003;
`

const Button = styled.button`
    color: white;
    border:  2px solid gray;
    margin: 5px;
    padding: 5px;
    background:  linear-gradient(to right, #076585, #34f);
    border-radius: 5px;
    border: none;
    padding: 10px 20px;

`