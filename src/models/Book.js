import mongoose from "mongoose";
const bookShechma = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 1
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},
{timestamps: true}
)

const Book = mongoose.model("Book", bookShechma)
export default Book