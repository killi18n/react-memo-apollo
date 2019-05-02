import express from 'express';

const app = express();
const router = express.Router();

app.listen(4000, () => {
    console.log('app is running on port', 4000);
});
