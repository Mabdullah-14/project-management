const path=require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express=require('express');
const app=express();
const cors=require('cors');
const cookieParser=require('cookie-parser')

const {connectDB}=require('./config/db')
const PORT=process.env.PORT || 5000;
const authRoutes=require('./routes/authroutes')
const cardRoutes=require('./routes/cardroutes')
const boardRoutes=require('./routes/boardroutes')
const columnRoutes=require('./routes/columnroutes')
const {selectiveWriteLimit,authLimiter} =require('./middleware/rateLimiter')


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
    
}))
 
app.set('trust proxy',1)

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authLimiter,authRoutes)
app.use('/api/cards',selectiveWriteLimit,cardRoutes)
app.use('/api/boards',selectiveWriteLimit,boardRoutes)
app.use('/api/columns',selectiveWriteLimit,columnRoutes)
connectDB()
app.listen(PORT,()=>{
    console.log(`This app is running on localhost ${PORT}`)
})