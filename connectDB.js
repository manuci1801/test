const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin@cluster0.ljkqx.mongodb.net/testprico?retryWrites=true&w=majority", { 
            useNewUrlParser: true,
            useUnifiedTopology: true, 
            useCreateIndex: true
        })
        console.log('MongoDB Connected')
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB