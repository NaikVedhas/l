import { useState } from "react"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios.js"  //as we are not exporting default from axios we need to use {}
import { toast } from "react-hot-toast";
import {Loader} from "lucide-react";  // Icon from Lucide

const SignupForm = () => {
    

    const [name,setName]= useState('');
    const [username,setusername]= useState('');
    const [email,setEmail]= useState('')
    const [password,setPassword]= useState('')
  
    const queryClient = useQueryClient();

    //For updating we use Mutation functions. It gives us mutate,islaoding state too and we have onSuccess,onError too.mutate:signupMutation means we are renaming it here
    const {mutate:signupMutation,isLoading } = useMutation({

        mutationFn: async (data) =>{
            const res = await axiosInstance.post("/auth/signup",data); //we can use fetch method also inside react qurey but axios is better than fetch method. As u can see react qurey is just replacing the try catch, if(!data) etc etc things for us but we use fetch/axios method only inside this
            return res.data;   //we are returing the data property of this response
        },
        onSuccess:()=>{
            toast.success("Account created successfully");
            queryClient.invalidateQueries({queryKey:["authUser"]}); //so basically this will refetch the authUser and as we have logged in now we will be redirected to home page without refreshing just like react context
            
        },
        onError:(err)=>{
            toast.error(err.response.data.message || "Something went wrong"); //if thet err is not availble then show this error
        }

    })
    const handleSubmit = (e) =>{
        e.preventDefault();
        signupMutation({name,username,email,password});

    }
    return (
    <div>
        <form onSubmit={handleSubmit}  className="flex flex-col gap-2">
            <input 
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="input input-bordered w-full"            
            required
            />
            
            <input 
            type="text"
            placeholder="username"
            value={username}
            onChange={(e)=>setusername(e.target.value)}
            className="input input-bordered w-full"
            required            
            />
            <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="input input-bordered w-full"
            required          
            />
            <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="input input-bordered w-full"
            required            
            />
            <button 
            disabled={isLoading}
            type="submit"
            className="btn btn-primary w-full text-white"
            >
            {isLoading ? <Loader className='w-5 h-5 animate-spin mx-auto' />:"Signup"}

            </button>
        </form>
    </div>
  )
}
export default SignupForm