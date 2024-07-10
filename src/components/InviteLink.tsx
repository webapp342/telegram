// /src/components/InviteLink.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InviteLink: React.FC = () => {
    const [referralCode, setReferralCode] = useState('');
    const [points, setPoints] = useState(0);

    useEffect(() => {
        // Kullanıcı bilgilerini backend'den al
        axios.get('/api/user').then(response => {
            setReferralCode(response.data.referralCode);
            setPoints(response.data.points);
        });
    }, []);

    const inviteLink = `https://t.me/YourBotUsername?start=${referralCode}`;

    return (
        <div>
            <h1>Davet Linkiniz</h1>
            <p>{inviteLink}</p>
            <p>Puanlarınız: {points}</p>
        </div>
    );
};

export default InviteLink;
