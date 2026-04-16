import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import ChatMassage from './ChatMassage';
import Form from 'react-bootstrap/Form';

const dialog = [
    {
        id: "001",
        userId: "11",
        message: "hi",
    },
    {
        id: "002",
        userId: "22",
        message: "Hey, how you doing?"
    },
    {
        id: "003",
        userId: "11",
        message: "I am good man, thanks. Hope you are too"
    },
    {
        id: "004",
        userId: "22",
        message: "oh, I am ok"
    }
]

const socketUrl = "wss://birlb9bus7.execute-api.eu-central-1.amazonaws.com/production/";

const Chat = () => {
    const [messages, setMessages] = useState(dialog);
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    // Initialize user on first load
    useEffect(() => {
        const storedUserId = localStorage.getItem('chatUserId');
        const storedUserName = localStorage.getItem('chatUserName');
        
        if (storedUserId && storedUserName) {
            setUserId(storedUserId);
            setUserName(storedUserName);
        }
    }, []);

    // WebSocket connection management
    useEffect(() => {
        if (!userName) return;

        if ("WebSocket" in window) {
            console.log("WebSocket is supported by your Browser!");
            
            const ws = new WebSocket(socketUrl);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log('Connection is open');
            };

            ws.onclose = () => {
                console.log("Connection is closed...");
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            ws.onmessage = (event) => {
                console.log(event.data);
                try {
                    const data = JSON.parse(event.data);
                    buildMessage(data);
                } catch (e) {
                    console.error("Failed to parse message:", e);
                }
            };

            setSocket(ws);

            return () => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        } else {
            console.log("WebSocket NOT supported by your Browser!");
        }
    }, [userName]);

    const handleUserRegistration = (e) => {
        e.preventDefault();
        const newUserId = uuidv4();
        setUserId(newUserId);
        localStorage.setItem('chatUserId', newUserId);
        localStorage.setItem('chatUserName', userName);
    };    
    
    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const messageData = {
                "action": "sendmessage",
                "userId": userId,
                "userName": userName,
                "message": message,
                "timestamp": new Date().toISOString()
            };
            
            socketRef.current.send(JSON.stringify(messageData));
            
            // Add sent message to local state immediately
            const newMessage = {
                userId: userId,
                message: message
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage('');
        } else {
            console.warn("WebSocket is not connected");
        }
    };

    const buildMessage = (msg) => {
        if (msg && typeof msg !== 'object') {
            msg = JSON.parse(msg);
        }
        setMessages((prevMessages) => [...prevMessages, msg]);
    }

    const handleEnterPress = (event) => { 
        if (event.key === "Enter") {
            event.preventDefault(); 
            console.log("enter key pressed");
            console.log("message to be sent: ", message);
            sendMessage();
            event.target.value = '';
        }        
    }

    return (
        <Container style={{ width: 500 }}>
        {!userId ? (
        <Container>
      <Row className='justify-content-center'><Col>
        <h1>Welcome to CHA Chatty</h1>
         
        <h2>Login</h2>
      </Col></Row>
      <Row className='justify-content-center'>
        <Col>
          <Form onSubmit={handleUserRegistration}>
      <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Control type="text" placeholder="Enter User Name" onChange={e => setUserName(e.target.value)} required />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Control type="text" placeholder="Enter Chat Room" onChange={e => SetChatter({ ...chatter, room: e.target.value })} />
      </Form.Group> */}
      
        <Button variant="primary" type="submit">
          Submit
        </Button>
     
    </Form>
        </Col>
      </Row>
    </Container>

    ) : (
            <Container style={{height: '100vh'}} className='bg-light pb-1 d-flex flex-column'>
        <Row>
            <Col className="bg-info m-1">
                <h5>Chat room</h5>
            </Col>
        </Row>
        <Row>
            <Col>
                Logged in as: {userName} (ID: {userId})
            </Col>
        </Row>
        <Row className="flex-grow-1">
            <Col>
                {messages.map(({ userId: msgUserId, message: msgContent}) => <ChatMassage key={uuidv4()} message={msgContent} userId={msgUserId} currentUserId={userId} />)}
            </Col>
        </Row>
        <Row>
            <Col>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">        
                        <Form.Control type="text" placeholder="Message" onChange={(e) => setMessage(e.target.value)} onKeyDown={handleEnterPress}/>
                    </Form.Group>      
                </Form>
            </Col>
        </Row>
    </Container>
    )}
     </Container>   
    )
}

export default Chat
