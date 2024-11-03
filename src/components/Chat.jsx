import React, { useState, useEffect } from 'react';
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
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState(null);

    // Initialize user on first load
    useEffect(() => {
        const storedUserId = localStorage.getItem('chatUserId');
        const storedUserName = localStorage.getItem('chatUserName');
        
        if (storedUserId && storedUserName) {
        setUserId(storedUserId);
        setUserName(storedUserName);
        }
    }, []);
    const ws = new WebSocket(socketUrl);
    useEffect(() => {
        
        if ("WebSocket" in window) {
            console.log("WebSocket is supported by your Browser!");

            if (userName && !socket) { 
            
                ws.onopen = () => {
                    // when connection opens
                    console.log('connection is open')
                    web_socket = new WebSocket(socketUrl);
                };

            

                            
                ws.onclose = () => {
                    // trigger when connection get closed
                    console.log("Connection is closed...");
                };
                setSocket(ws);
            }

            
        } else {
            console.log("WebSocket NOT supported by your Browser!");
        }      
      
        return () => ws.close();
    }, [userName]);

    const handleUserRegistration = (e) => {
        e.preventDefault();
        const newUserId = uuidv4();
        setUserId(newUserId);
        localStorage.setItem('chatUserId', newUserId);
        localStorage.setItem('chatUserName', userName);
    };    
    
    const sendMessage = () => {
    // if (socket && socket.readyState === WebSocket.OPEN) {
      const messageData = {
        "action": "sendmessage",
        "userId": userId,
        "userName": userName,
        "message": message,
        "timestamp": new Date().toISOString()
      };
      
      socket.send(JSON.stringify(messageData));
      setMessage('');  // Clear the message input
    // }
    };
    
    const weReceive = () => {
        ws.onmessage = (event) => {
                    console.log(event.Data);
                    console.log(event);               
                    let obj = { "message": event.Data };
                    const jsonString = JSON.stringify(obj);

                    buildMessage(jsonString)// trigger when websocket received message
                };

    }
    weReceive();

    const buildMessage = (msg) => {
        if (msg && typeof msg !== Object) {
            msg = JSON.parse(msg);
        }
        console.log("messages: ", messages);
        setMessages((prevMessages) => [...prevMessages, msg]);
        console.log("messages: ", messages);
    }

    let web_socket;
    
    const delay = async (ms) => {
        return new Promise((resolve) => 
            setTimeout(resolve, ms));
    };

    const handleEnterPress = async (event) => { 
              
        if (event.key === "Enter") {
            event.preventDefault(); 
            
            console.log("enter key pressed");
            
            console.log("message to be sent: ", message);

            // if (!msg.trim()) {
            //     console.log('enter message')
            //     return false;
            // }
            // web_socket = new WebSocket(socketUrl);

            // if (web_socket) {
            //     console.log("web_socket")
                await delay(4000);
            //     setMessage(msg);
                sendMessage();
                // web_socket.send(JSON.stringify({ "action": "sendmessage", "message": msg }));
                console.log('message sent: ', message)
            // } else {
            //     console.log('no web_socket');
            // }  
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
                {messages.map(({ userId, message}) => <ChatMassage key={uuidv4()} message={message} userId={userId} />)}
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
