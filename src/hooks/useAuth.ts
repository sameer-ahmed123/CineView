import { useState, useEffect } from "react";
import {onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase";
import type { User } from "firebase/auth";


export function useAuth(){
    const [user,setUser] = useState<User | null>(null)

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser)
        })
        return ()=>{unsubscribe()}
    },[])
    return {user}
}