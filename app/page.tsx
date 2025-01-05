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

function AuthenticatedContent({ signOut, user }) {
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const getUserAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setFirstName(attributes['custom:firstname'] || '');
      } catch (error) {
        console.error('Error fetching user attributes:', error);
      }
    };

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
}

export default function App() {
  return (
    <Authenticator
      initialState="signIn"
      hideSignUp={true}
    >
      {(props) => <AuthenticatedContent {...props} />}
    </Authenticator>
  );
}