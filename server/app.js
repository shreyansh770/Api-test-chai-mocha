const express =  require('express')
const cors = require('cors')
const authRouter = require('./router/auth')
require('dotenv/config')

let PORT  = process.env.PORT

const app = express()
app.use(express.json());

app.use('/api',authRouter)

// page not found
app.use((req,res)=>{
    res.json({
        message : "Page not found"
    })
})




module.exports = app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})