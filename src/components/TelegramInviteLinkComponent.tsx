import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TelegramInviteLinkComponent: React.FC = () => {
  const [inviteLink, setInviteLink] = useState<string>('');

  // Özel davet linki oluşturma işlemi
  const generateInviteLink = async () => {
    try {
      // Burada özel davet linkini oluşturacak işlemleri yapabilirsiniz
      const token = uuidv4(); // Rastgele bir token oluştur
      const userId = 'user_telegram_id'; // Kullanıcının Telegram ID'si ya da bot aracılığıyla sağlanan kullanıcı kimliği

      // Davet linkini oluştur
      const inviteLink = `https://example.com/invite/${token}?user=${userId}`;

      // Davet linkini state'e kaydet
      setInviteLink(inviteLink);
    } catch (error) {
      console.error('Error generating invite link:', error);
    }
  };

  return (
    <div>
      <h1>Özel Davet Linki</h1>
      <button onClick={generateInviteLink}>Özel Davet Linki Oluştur</button>
      {inviteLink && (
        <div>
          <p>Özel Davet Linkiniz:</p>
          <a href={inviteLink} target="_blank" rel="noopener noreferrer">{inviteLink}</a>
        </div>
      )}
    </div>
  );
};

export default TelegramInviteLinkComponent;
