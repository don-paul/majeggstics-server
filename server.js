const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

require('dotenv').config();

const API_URL = process.env.API_URL;
const BACKUP_EID = process.env.BACKUP_EID;
const BUILDER_IO_API_KEY = process.env.BUILDER_IO_API_KEY;

app.use(cors()); // Enable All CORS Requests
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Hello, Majeggstics!');
});

app.get('/archive', async (req, res) => {
    // console.log('archive endpoint called', req.query.EID);
    try {
        const response = await fetch(`${API_URL}/archive?EID=${req.query.EID}`);
        if (!response.ok) {
            console.log('Response status:', response.status);
            console.log('Response text:', await response.text());
            res.send('Error:', response.status);
            return;
        }
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.get('/coopData', async (req, res) => {
    try {
        // console.log('coopData contract endpoint called', req.query.EID);
        const EID = req.query.EID || BACKUP_EID;

        // kevId is contract id
        const response = await fetch(`${API_URL}/contract?EID=${EID}&contract=${req.query.contract}&coop=${req.query.coop}`);

        if (!response.ok) {
            console.log('Response status:', response.status);
            console.log('Response text:', await response.text());
            res.send('Error:', response.status);
            return;
        }
        const data = await response.json();
        const newData = data?.contributorsList?.map((item) => ({
            // ...item,
            userName: item.userName,
            isSelectedIGN: item.userId === req.query.EID,
            equippedArtifactsList: item.farmInfo.equippedArtifactsList,
        }));
        // console.log('coopData:', newData);
        // console.log('newData:', newData);
        res.send(newData);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.get('/boosts', async (req, res) => {
    // console.log('boosts endpoint called', BUILDER_IO_API_KEY);
    try {
        const response = await fetch(`https://cdn.builder.io/api/v3/content/boosts?apiKey=${BUILDER_IO_API_KEY}`);

        if (!response.ok) {
            console.log('Response status:', response.status);
            console.log('Response text:', await response.text());
            res.send('Error:', response.status);
            return;
        }
        const data = await response.json();

        const returnData = data.results.map((item) => {
            return {
                id: item.id,
                geCost: item.data.geCost,
                tokenCost: item.data.tokenCost,
                duration: item.data.duration,
                unlock: item.data.unlock,
                description: item.data.description,
                image: item.data.image,
            };
        });

        res.send(returnData);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.get('/shipsData', async (req, res) => {
    // console.log('shipsData endpoint called', req.query.EID);
    try {
        const response = await fetch(`${API_URL}/backup?EID=${req.query.EID}`);
        if (!response.ok) {
            console.log('Response status:', response.status);
            console.log('Response text:', await response.text());
            res.send('Error:', response.status);
            return;
        }
        const data = await response.json();

        const returnData = data.artifactsDb.missionInfosList;

        res.send(returnData);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});