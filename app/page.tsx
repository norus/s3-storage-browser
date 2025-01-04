"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify, AuthOptions } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '../components/StorageBrowser';

// Configure Auth to include custom attributes
const authConfig: AuthOptions = {
  ...outputs.auth,
  userAttributes: {
    include: ['custom:firstname', 'name'],
  }
};

// Configure Amplify with the auth settings
Amplify.configure({
  ...outputs,
  Auth: authConfig
});

const client = generateClient<Schema>();

// Define the CognitoUser interface
interface CognitoUser {
  username?: string;
  attributes?: {
    'custom:firstname'?: string;
    [key: string]: any;
  };
}

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <Authenticator
      initialState="signIn"
      hideSignUp={true}
    >
      {({ signOut, user }) => {
        const cognitoUser = user as unknown as CognitoUser;
        console.log('Full user object:', user);
        console.log('User attributes:', cognitoUser.attributes);
        console.log('Firstname attribute:', cognitoUser?.attributes?.['custom:firstname']);
        
        const firstName = cognitoUser?.attributes?.['custom:firstname'] || cognitoUser?.username;
        
        return (
          <main>
            <h1>Hello {firstName}</h1>
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