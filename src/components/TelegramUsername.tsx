import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

const TelegramUsername: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    const user = initData?.user;
    
    if (user) {
      setUsername(user.username);
    }
  }, []);

  return (
    <div>
      {username ? (
        <p>Your Telegram username: <strong>{username}</strong></p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TelegramUsername;
