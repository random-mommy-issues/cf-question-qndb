import express from 'express';
const app = express();
import uploadRouter from './cfApi/uploadRouter.js';
app.use(express.json());
app.get('/', (req, res) => {
    res.send('🚀 Server is running');
});

// mount router
app.use('/upload', uploadRouter);

// start server
app.listen(3000, () => {
    console.log('🚀 Server listening on port 3000');
});