"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import { fetchUserAttributes } from 'aws-amplify/auth';
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '../components/StorageBrowser';
import { useEffect, useState } from 'react';

Amplify.configure(outputs);

export default function App() {
  const [firstName, setFirstName] = useState<string>('');

  const getUserAttributes = async () => {
    try {
      const attributes = await fetchUserAttributes();
      setFirstName(attributes['custom:firstname'] || '');
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    }
  };

  return (
    <Authenticator
      initialState="signIn"
      hideSignUp={true}
    >
      {({ signOut, user }) => {
        // Call getUserAttributes when the component renders with a user
        useEffect(() => {
          getUserAttributes();
        }, []);

        return (
          <main>
            <h1>Hello {firstName || user?.signInDetails?.loginId}</h1>
            <button onClick={signOut}>Sign out</button>

            {/* StorageBrowser Component */}
            <h2>Your Files</h2>
            <StorageBrowser />
          </main>
        );
      }}
    </Authenticator>
  );
}