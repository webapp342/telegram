// /src/services/dbService.ts
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://alistasyon:Adehghan46@cluster0.mongodb.net/myappdb?retryWrites=true&w=majority';
const client = new MongoClient(uri);

let db: any;

export async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('myappdb'); // Buraya veritabanı adınızı yazın
    }
    return db;
}

export async function findUser(userId: number) {
    const db = await connectDB();
    return db.collection('users').findOne({ userId: userId }); // 'users' koleksiyon adı
}

export async function createUser(user: any) {
    const db = await connectDB();
    return db.collection('users').insertOne(user);
}

export async function updateUserPoints(referralCode: string, points: number) {
    const db = await connectDB();
    return db.collection('users').updateOne({ referralCode: referralCode }, { $inc: { points: points } });
}
