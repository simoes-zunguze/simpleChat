import React, { FC, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components";
import { Howl } from 'howler';
import Members from '../components/members';
import { info } from 'console';
import { MemberContext } from '../contexts/MemberContext';


const notification = require("../assets/sounds/sound.mp3");
const openChat = require("../assets/sounds/open-chat.mp3");

export interface Props {
    socket: Socket,
    username: string,
    room: string,
}

export interface Message {
    username: string,
    date: string,
    room: string,
    me?: boolean,
    text: string,
    id?: string,
    type: string
}

export interface Member {
    username: string,
    id?: string
}

const Chat: FC<Props> = ({ socket, username, room }) => {

    const [text, setText] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);
    const [writing, setWriting] = useState(false);
    const [typingName, setTypingName] = useState('');
    const [members, setMembers] = useState<Member[]>([]);
    const newNotification = new Howl({
        src: [notification]
    });

    const openChatNotification = new Howl({
        src: [openChat],
        volume: 0.2,
    });

    const sendMessage = async () => {
        const time = new Date().getHours() + ':' + new Date().getMinutes();

        if (text !== '') {
            let newMessage: Message = { username: username, room: room, text: text, date: time, id: uuidv4(), me: true, type: "message" }
            setMessages([...messages, newMessage])

            socket.emit("send", {
                username: username,
                room: room,
                text: text,
                type: "message"
            })
            setText(text => '')
        }
    }

    const messageType = (message: Message) => {
        switch (message.type) {
            case 'info':
                console.log(message.text);
                setTypingName(message.username)
                setTimeout(() => {
                    setTypingName('')
                }, 3000);
                break;
            case 'join':
                setMembers(members => [...members, { username: message.username, id: message.id }]);
                break;
            case 'disconnect':
                const newMembers = members.filter(member => {
                    return member.id !== message.id
                })
                setMembers(newMembers);
                break;
        }


    }

    const receiveMessage = (message: Message) => {
        messageType(message);

        if (message.type === 'info')
            return

        let newMessage: Message = { ...message, id: uuidv4(), me: false };

        setMessages(messages => [...messages, newMessage])
        console.log(document.hasFocus());

        if (document.hasFocus()) {
            openChatNotification.play();
        } else {
            if (("Notification" in window)) {
                new Notification('New Message')
            }
            newNotification.play();
        }
        console.log(newMessage);
    }

    const writingMessage = () => {
        if (!writing) {
            setWriting(writing => true)
            setTimeout(() => {
                setWriting(writing => false);
            }, 3000);
            console.log("writing...");
            socket.emit("send", {
                username: username,
                room: room,
                text: "writing...",
                type: "info"
            })
        }

    }

    useEffect(() => {
        console.log(members);
    }, [members]);

    useEffect(() => {
        socket.on('receive', data => {
            receiveMessage({ ...data })
        })

    }, [])

    return (
        <Container>
            <ChatName>
                <span>Chat Room: <span style={{ color: "cyan" }}>{room}</span></span>
                <span>Your Nickname: <span style={{ color: "cyan" }}>{username}</span></span>
            </ChatName>
            <ChatBox>

                {
                    messages.map(message => {

                        switch (message.type) {
                            case 'join':
                                return (
                                    <InfoMessage key={message.id}>
                                        <strong> {message.username}</strong> joined the chat - {message.date}
                                    </InfoMessage>
                                );
                            case 'disconnect':
                                return (
                                    <InfoMessage key={message.id}>
                                        <strong> {message.username}</strong> disconnected - {message.date}
                                    </InfoMessage>
                                )
                            default:

                                return (
                                    message.me ?
                                        <MessageWrapper>
                                            <MyMessage key={message.id}>
                                                {/* <Name> {message.username}</Name> */}
                                                <Text>
                                                    {message.text}
                                                </Text>
                                                <Time>
                                                    {message.date}
                                                </Time>
                                            </MyMessage>
                                        </MessageWrapper>
                                        :
                                        <MessageWrapper>

                                            <TheirMessage key={message.id}>
                                                <Name> {message.username}</Name>
                                                <Text>
                                                    {message.text}
                                                </Text>

                                                <Time>
                                                    {message.date}
                                                </Time>
                                            </TheirMessage>
                                        </MessageWrapper>
                                )
                        }

                    })
                }
                {typingName ?
                    <Writing>
                        {typingName + " is typing..."}
                    </Writing> : ""}
            </ChatBox>

            <MessageBox>
                <MessageInput type="text" placeholder="message" value={text}

                    onChange={e => { setText(e.target.value) }}
                    onKeyUp={e => {
                        e.preventDefault()
                        writingMessage();
                        if (e.code === 'Enter')
                            sendMessage()
                    }}
                />

                <SendButton onClick={e => {
                    e.preventDefault();
                    sendMessage();
                }} ><i className="fa fa-send"></i></SendButton>
            </MessageBox>
            <MemberContext.Provider value={{ members }}>
                <Members></Members>

            </MemberContext.Provider>
        </Container>
    )
}

export default Chat;

const Container = styled.div`
    height: 90vh;
    background: rgba(0,0,0,0.2);
    backdrop-filter: saturate(180%) blur(10px);    width: 90%;
    max-width: 1200px;
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    align-items: center;
    padding-bottom: 10px;
    border-radius: 10px;
    overflow: hidden;
`

const ChatName = styled.div`
    position: relative;
    background-color:   rgba(0,0,0,0.2);;
    height: 50px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-evenly;
`


const MessageBox = styled.div`
    position: relative;
    background-color:  #0002;
    padding: 5px;
    overflow-y: scroll;
    width: 90%;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
`
const Writing = styled.div`
    color: green; 
    text-align: center;
`

const MessageWrapper = styled.div`
    position: relative;
    /* background-color: red; */
    display: flex;
    width: 100%;
    margin: 3px 0;
    font-weight: 100;
`
const Name = styled.div`
    color: #0f1;
    font-weight: 500;
`

const Text = styled.div`
    
`
const Time = styled.div`
    font-size: 10px;
    /* background-color: white; */
    text-align: right;
`

const MyMessage = styled.div`
    position: relative;
    background-color:  #2f35;
    max-width: 250px;
    min-width: 70px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    justify-self: flex-end;
    margin-left: auto;
    color: white;
    border-radius: 7px 7px 0 7px;
`

const InfoMessage = styled.div`
    /* background-color: red; */
    text-align: center;
    color: whitesmoke;

`

const TheirMessage = styled.div`
    position: relative;

    max-width: 240px;
    min-width: 70px;
    background-color:  #269f;
    padding: 5px;
    display: flex;
    flex-direction: column;
    color: white;
    margin: 3px 0;
    border-radius: 7px 7px 7px 0;

`



const MessageInput = styled.input`
    background:  none;
    padding: 5px;
    width: calc(90% - 30px);
`


const SendButton = styled.button`
    background: none;
    padding: 5px;
    border: none;
    font-size: 20px;
    color: white;
    cursor: pointer;
`

const ChatBox = styled.div`
  position:'relative';
    height: 90%;
    width: 90%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /* overflow-y: scroll; */
`
