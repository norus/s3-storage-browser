"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '../components/StorageBrowser';

Amplify.configure(outputs);

export default function App() {
  return (
    <Authenticator
      initialState="signIn"
      hideSignUp={true}
    >
      {({ signOut, user }) => (
        <main>
            <h1>Hello {user?.signInDetails?.loginId}</h1>
            <button onClick={signOut}>Sign out</button>

          {/* StorageBrowser Component */}
          <h2>Your Files</h2>
          <StorageBrowser />

        </main>
      )}
    </Authenticator>
  );
}