import React, { useState } from 'react';
import { Button, Form, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import Nav from './Nav';
import axios from 'axios'; // Import axios for API requests
import './Chat.css';

// Character data with Wikipedia queries and images for each character
const characters = [
  {
    id: 1,
    name: 'Albert Einstein',
    history: 'A theoretical physicist known for the theory of relativity.',
    wikiQuery: 'Albert_Einstein',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg',
    predefinedResponses: {
      life: "Einstein's life was marked by his quest for knowledge and his work as a theoretical physicist.",
      theory: "Einstein is best known for the theory of relativity, which revolutionized the understanding of space and time.",
      work: "During his career, Einstein worked on many scientific theories, including the photoelectric effect and quantum mechanics."
    }
  },
  {
    id: 2,
    name: 'Marie Curie',
    history: 'A physicist and chemist who conducted pioneering research on radioactivity.',
    wikiQuery: 'Marie_Curie',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Mariecurie.jpg',
    predefinedResponses: {
      life: "Marie Curie's life was a journey of scientific discovery, and she was the first woman to win a Nobel Prize.",
      research: "Marie Curie conducted groundbreaking research on radioactivity, discovering elements like polonium and radium.",
      legacy: "Her legacy continues today in science, particularly in fields like physics, chemistry, and cancer treatment."
    }
  },
  {
    id: 3,
    name: 'Nelson Mandela',
    history: 'A South African anti-apartheid revolutionary and political leader.',
    wikiQuery: 'Nelson_Mandela',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/1280px-Nelson_Mandela_1994.jpg',
    predefinedResponses: {
      life: "Mandela's life was dedicated to the fight against apartheid and the pursuit of equality and justice.",
      leadership: "Mandela showed incredible leadership during South Africa's transition to democracy.",
      prison: "Nelson Mandela spent 27 years in prison for his anti-apartheid activities, emerging as a global symbol of resistance."
    }
  }
];

function ChatHistory() {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select a character to chat with
  const handleSelectCharacter = (character) => {
    setActiveCharacter(character);
    setChatMessages([]); // Reset chat when selecting a new character
  };

  // Fetch data from Wikipedia API based on the character's wikiQuery
  const fetchCharacterResponse = async (query) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`
      );
      return response.data.extract; // Return the summary extract from the API
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      return "Sorry, I couldn't find more information.";
    }
  };

  // Detect keywords in the user's message and return predefined responses
  const detectKeywords = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (activeCharacter.predefinedResponses) {
      const { predefinedResponses } = activeCharacter;
      if (lowerCaseMessage.includes('life')) {
        return predefinedResponses.life;
      } else if (lowerCaseMessage.includes('theory')) {
        return predefinedResponses.theory;
      } else if (lowerCaseMessage.includes('work')) {
        return predefinedResponses.work;
      } else if (lowerCaseMessage.includes('research')) {
        return predefinedResponses.research;
      } else if (lowerCaseMessage.includes('legacy')) {
        return predefinedResponses.legacy;
      } else if (lowerCaseMessage.includes('leadership')) {
        return predefinedResponses.leadership;
      } else if (lowerCaseMessage.includes('prison')) {
        return predefinedResponses.prison;
      }
    }
    return null; // If no keyword matches, return null to use Wikipedia response
  };

  // Handle sending messages in the chat
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      message,
      user: 'You',
      timestamp: new Date().toISOString()
    };
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');

    // Simulate character response with dynamic API
    if (activeCharacter) {
      setLoading(true); // Show loading state while fetching response

      // Detect if there are keywords in the user's message
      const detectedResponse = detectKeywords(message);

      // Use predefined response if a keyword was found, otherwise fetch from Wikipedia
      const characterResponseText = detectedResponse
        ? detectedResponse
        : await fetchCharacterResponse(activeCharacter.wikiQuery);

      const characterResponse = {
        id: chatMessages.length + 2,
        message: characterResponseText,
        user: activeCharacter.name,
        timestamp: new Date().toISOString()
      };

      // Delay response to simulate real-time chat
      setTimeout(() => {
        setChatMessages((prevMessages) => [...prevMessages, characterResponse]);
        setLoading(false); // Stop loading after fetching
      }, 1000);
    }
  };

  return (
    <Container>
      <Nav />
      <h2>Select a Historical Character</h2>
      <Row className="mt-3">
        {characters.map((character) => (
          <Col key={character.id} md={4}>
            <Card className="character-card" onClick={() => handleSelectCharacter(character)} style={{ border: activeCharacter?.id === character.id ? '2px solid blue' : '1px solid gray' }}>
              <Card.Img variant="top" src={character.image} alt={character.name} />
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

          {loading && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

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
            <Button variant="primary" type="submit" className="mt-2" disabled={loading}>
              Send
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
}

export default ChatHistory;
