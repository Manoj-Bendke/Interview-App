  import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton,useUser } from "@clerk/clerk-react";
  import {toast} from "react-hot-toast";
  function HomePage(){
    const {isSignedIn} = useUser();
    return(
      <>
      <h1>Hii Welcome to the app</h1>
      <SignedOut>
          <SignInButton mode="modal" >
            <button >Log in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton mode="modal" >
            <button>Log Out</button>
          </SignOutButton>
        </SignedIn> 
        <UserButton/>
        <button className="btn btn-secondary" onClick={()=> isSignedIn ? toast.success("This show toast is working") : toast.error("this toast did not work")}>checkSign in</button>
        </>
    )
  }
  export default HomePage;