import React, { useState } from 'react';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import Nav from './Nav';
import './Chat.css';

const characters = [
  {
    id: 1,
    name: 'Albert Einstein',
    history: 'A theoretical physicist known for the theory of relativity.',
    responses: [
      "Imagination is more important than knowledge.",
      "I have no special talent. I am only passionately curious.",
      "Life is like riding a bicycle. To keep your balance, you must keep moving."
    ],
    keywords: {
      physics: "Physics is the most fundamental of the sciences.",
      relativity: "The theory of relativity transformed how we think about space and time.",
      bicycle: "Life is like riding a bicycle. To keep your balance, you must keep moving."
    }
  },
  {
    id: 2,
    name: 'Marie Curie',
    history: 'A physicist and chemist who conducted pioneering research on radioactivity.',
    responses: [
      "Nothing in life is to be feared, it is only to be understood.",
      "I am among those who think that science has great beauty.",
      "Be less curious about people and more curious about ideas."
    ],
    keywords: {
      radioactivity: "I discovered radioactivity with my husband, Pierre Curie.",
      fear: "Nothing in life is to be feared, it is only to be understood."
    }
  },
  {
    id: 3,
    name: 'Nelson Mandela',
    history: 'A South African anti-apartheid revolutionary and political leader.',
    responses: [
      "It always seems impossible until it’s done.",
      "Education is the most powerful weapon which you can use to change the world.",
      "I learned that courage was not the absence of fear, but the triumph over it."
    ],
    keywords: {
      freedom: "I spent 27 years in prison fighting for freedom.",
      apartheid: "Apartheid is a policy of racial segregation that I fought against."
    }
  }
];

function ChatHistory() {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [activeCharacter, setActiveCharacter] = useState(null);

  const handleSelectCharacter = (character) => {
    setActiveCharacter(character);
    setChatMessages([]);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    const newMessage = { id: chatMessages.length + 1, message, user: 'You', timestamp: new Date().toISOString() };
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');

    // Simulate character response with keyword detection
    if (activeCharacter) {
      const lowerCaseMessage = message.toLowerCase();
      const characterKeywords = activeCharacter.keywords || {};

      let responseFound = false;

      // Check for keywords in the message
      Object.keys(characterKeywords).forEach((keyword) => {
        if (lowerCaseMessage.includes(keyword)) {
          const characterResponse = {
            id: chatMessages.length + 2,
            message: characterKeywords[keyword],
            user: activeCharacter.name,
            timestamp: new Date().toISOString()
          };

          setTimeout(() => {
            setChatMessages((prevMessages) => [...prevMessages, characterResponse]);
          }, 1000);

          responseFound = true;
        }
      });

      // If no keyword found, send a random response
      if (!responseFound) {
        const randomResponse = activeCharacter.responses[Math.floor(Math.random() * activeCharacter.responses.length)];
        const characterResponse = {
          id: chatMessages.length + 2,
          message: randomResponse,
          user: activeCharacter.name,
          timestamp: new Date().toISOString()
        };

        setTimeout(() => {
          setChatMessages((prevMessages) => [...prevMessages, characterResponse]);
        }, 1000);
      }
    }
  };

  return (
    <Container>
      <Nav />
      <h2>Select a Historical Character</h2>
      <Row className="mt-3">
        {characters.map((character) => (
          <Col key={character.id} md={4}>
            <Card className="character-card" onClick={() => handleSelectCharacter(character)}>
              <Card.Body>
                <Card.Title>{character.name}</Card.Title>
                <Card.Text>{character.history}</Card.Text>
                <Button variant="primary">Chat with {character.name}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {activeCharacter && (
        <>
          <h3 className="mt-5">Chatting with {activeCharacter.name}</h3>
          <Card className="chat-container mt-3">
            <Card.Body className="chat-body">
              <div className="chat-history">
                {chatMessages.map((chat) => (
                  <div key={chat.id} className={`chat-message ${chat.user === 'You' ? 'sent' : 'received'}`}>
                    <p><strong>{chat.user}</strong>: {chat.message}</p>
                    <small>{new Date(chat.timestamp).toLocaleTimeString()}</small>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Form className="mt-3" onSubmit={handleSendMessage}>
            <Form.Group controlId="formMessage">
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">Send</Button>
          </Form>
        </>
      )}
    </Container>
  );
}

export default ChatHistory;
