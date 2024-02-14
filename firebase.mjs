import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from './firebaseconfig.mjs';
import { addDoc, collection } from 'firebase/firestore';

const app = express();

const corsOptions = {
  origin: '*', // or use '*' to allow all origins
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Endpoint to add a user
app.post('/adduser', async (req, res) => {
    try {
        const userData = req.body;
        const docRef = await addDoc(collection(db, "Users"), userData);
        res.status(200).send({ message: "User added", id: docRef.id });
    } catch (e) {
        res.status(500).send({ message: "Error adding user", error: e.message });
    }
});



// Start the server
const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
