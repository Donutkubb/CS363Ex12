import express from 'express';
import cors from 'cors';
import logger from 'morgan'; 
import productRouter from './route/productRoute.js'; 

const app = express();
app.use(cors());

app.use(logger("short")); 
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRouter); 

app.get('/', (req, res) => {
    res.send('Server is running. Access API at /api/products/all');
});

app.get('/:path*', (req, res) => {
    res.status(404).json({ error: 'Not Found Page! ' + req.url });
});

app.use((err, req, res, next) => {
    console.error(`${err.name}: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

const PORT = 4000; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});