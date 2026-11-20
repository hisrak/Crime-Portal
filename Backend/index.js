import 'dotenv/config'
import express from 'express'
import ConnecttoMongo from './db.js'
import auth from './Routes/auth.js'
import Post from './Routes/post.js'
import Newsletter from './Routes/newsletter.js'
import Contact from './Routes/contact.js'
import Notifications from './Routes/notification.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 4000
app.use(express.json())
// CLIENT_URL set ho to sirf usi website ko allow karo (live ke liye), warna sab (local)
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true }))
ConnecttoMongo();

// Images ko browser mein dikhane ke liye (post images + profile images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/profile', express.static(path.join(__dirname, 'uploads', 'profile')))

app.get('/', (req, res) => {
    res.send('Backend is Running')
})

app.use('/api/auth', auth);
app.use('/api/posts', Post);
app.use('/api/newsletter', Newsletter);
app.use('/api/contact', Contact);
app.use('/api/notifications', Notifications);

// Koi bhi error (jaise bari file ya galat file type) JSON mein wapas bhejo
app.use((err, req, res, next) => {
    console.log('Error Here ', err.message);
    const isUploadError = err.name === 'MulterError' || err.message === 'Only image files are allowed';
    res.status(isUploadError ? 400 : 500).json({ err: isUploadError ? err.message : 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Project is Running on http://localhost:${port}`)
})