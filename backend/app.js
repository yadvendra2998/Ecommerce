import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/error.js'
import dotenv from 'dotenv'
import authjwt from './helpers/jwt.js'
import authErrorHandler from './helpers/error-handler.js'
import productRoutes from './routes/productRoutes.js'
import categoriesRoutes from './routes/categoryRoutes.js'
import usersRoutes from './routes/userRoutes.js'
import ordersRoutes from './routes/orderRoutes.js'

const app =express();


dotenv.config();
app.use(cors());
app.options('*', cors())
const api =process.env.API_URI;


app.use(bodyParser.json());
app.use(morgan('tiny'))
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(authjwt())
app.use(authErrorHandler)


app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.use(notFound)
app.use(errorHandler)

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  
}).then(()=>{
    console.log('Connection is Establised')
}).catch((err) =>{
    console.log(err)
})

app.listen(5000, () =>{
    console.log(api)
    console.log('Server is starting on http://localhost/5000')
})