import { SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <>
      <h1>Hii Welcome to the app</h1>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignInButton>
        <SignedOut mode="modal" />
      </SignInButton>
      <UserButton/>
    </>
  );
}

export default App;
