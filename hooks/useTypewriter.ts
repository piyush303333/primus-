import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 20) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(true);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      setIsFinished(true);
      return;
    }

    setDisplayText('');
    setIsFinished(false);

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length - 1) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        setDisplayText(text); // Set full text at the end
        setIsFinished(true);
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return { displayText, isFinished };
};
