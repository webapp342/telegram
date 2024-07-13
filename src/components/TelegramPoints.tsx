import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import app from './firebaseConfig';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const TelegramPoints: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);
  const [currentPoints, setCurrentPoints] = useState<number>(0);

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);
      fetchUserPoints(username);
    }
  }, []);

  const fetchUserPoints = async (username: string) => {
    const userDoc = await getDoc(doc(firestore, 'users', username));

    if (userDoc.exists()) {
      setCurrentPoints(userDoc.data().points || 0);
    } else {
      await setDoc(doc(firestore, 'users', username), { points: 0 });
    }
  };

  const addPoints = async () => {
    const updatedPoints = currentPoints + 1;
    await updateDoc(doc(firestore, 'users', telegramUsername!), { points: updatedPoints });
    setCurrentPoints(updatedPoints);
  };

  return (
    <div>
      <h1>Puan Al</h1>
      <button onClick={addPoints}>Puan Al</button>
      <h2>Güncel Puan: {currentPoints}</h2>
    </div>
  );
};

export default TelegramPoints;
