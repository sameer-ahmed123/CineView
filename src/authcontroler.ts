import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const signup = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword( 
        auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

const login = async (email:string, password:string) =>{
    try{
        const userCredential = await signInWithEmailAndPassword(auth,email,password)
        console.log("User logged in:", userCredential.user);
    }
    catch(error){
        console.log(error)
    }
}

export {signup,login }