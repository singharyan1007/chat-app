import "./App.css";
import React, { useState, useRef } from "react";
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import styled from 'styled-components';
import {BsEmojiSmileFill} from 'react-icons/bs'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
//Initalize the firebase in our code...

firebase.initializeApp({
  //This is where I will be pasting it

  //Connecting with the firebase ka database

  //I need to add my configurations


  apiKey: "AIzaSyCRnQbZ1MX4tEf0NKdAWPg36z3PqkjmsfQ",
  authDomain: "chat-app-44703.firebaseapp.com",
  projectId: "chat-app-44703",
  databaseURL:"https://chat-app-44703.firebaseio.com",
  storageBucket: "chat-app-44703.appspot.com",
  messagingSenderId: "319189174528",
  appId: "1:319189174528:web:c7e4a494b93d8165820be5",
  measurementId: "G-GCHH87RYMD"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>CampusTalks</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign In with Google{" "}
      </button>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  //Display the messages
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(1000);
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const { uid, photoURL } = auth.currentUser;

  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }
  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </main>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow } />
        </div>
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        ></input>
        <button type="submit" disabled={!formValue}>
          {" "}
          Send Message
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL ||
            "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
          }
        />
      <p>{text}</p>
      </div>
    </>
  );
}
const Container = styled.div`

.button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
`;

export default App;
