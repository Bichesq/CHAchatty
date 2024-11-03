import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../App.css'


const ChatMassage = ({ message, userId }) => {
    
    if (userId == userId) {
        return (
            <>
                <Row className='justify-content-end m-1'>
                    <Col md={'auto'} className='sent'>
                        <div className=" p-1">
                            <p>{message}</p>
                        </div>
                    </Col>
                </Row>
            </>
        )
    } else {
        return (
            <>
                <Row className='justify-content-start m-1'>
                    <Col md={'auto'} className='received'>
                        <div className=" p-1">
                            <p>{message}</p>
                        </div>
                    </Col>
                </Row>
            </>
        )
    }
}
export default ChatMassage
