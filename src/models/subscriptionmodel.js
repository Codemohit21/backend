import mongoose,{Schema} from "mongoose";



const SubscriptionSchema=new Schema(
    {
        channel:{
            type:Schema.Types.ObjectId, 
            ref:"User",
            required:true,
        },
        subscriber:{
            type:Schema.Types.ObjectId, 
            ref:"User",
            required:true,
        }

    },
    {
        timestamps:true,
    }

)




export const Subscription=mongoose.model("Subscription",SubscriptionSchema);