import React, { useState } from 'react';

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');

  // Ensure compatibility check here
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return <p>Browser doesn't support speech recognition.</p>;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');
    setText(transcript);
  };

  const startListening = () => {
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <textarea value={text} readOnly rows="10" cols="50" />
    </div>
  );
};

export default SpeechToText;
