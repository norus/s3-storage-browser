"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import { fetchUserAttributes } from 'aws-amplify/auth';
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '../components/StorageBrowser';

// Configure Amplify
Amplify.configure(outputs);

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
  const [firstName, setFirstName] = useState<string>("");

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  async function getUserAttributes() {
    try {
      const attributes = await fetchUserAttributes();
      console.log('User attributes:', attributes);
      setFirstName(attributes['custom:firstname'] || '');
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    }
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
        
        // Fetch attributes when user is available
        useEffect(() => {
          if (user) {
            getUserAttributes();
          }
        }, [user]);
        
        return (
          <main>
            <h1>Hello {firstName || cognitoUser?.username}</h1>
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