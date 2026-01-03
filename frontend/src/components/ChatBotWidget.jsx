import { useEffect } from 'react';

// Tidio public key from your dashboard
const TIDIO_KEY = 'sffnu6awvmynv7vj0pcozcoymdnz13bq';

const ChatBotWidget = () => {
  useEffect(() => {
    if (document.getElementById('tidio-chat-script')) return;
    const script = document.createElement('script');
    script.src = `//code.tidio.co/${TIDIO_KEY}.js`;
    script.async = true;
    script.id = 'tidio-chat-script';
    document.body.appendChild(script);
  }, []);

  return null; // No visible UI, just loads the script
};

export default ChatBotWidget;
