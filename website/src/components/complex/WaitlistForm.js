import React, { useState } from "react";

import Button from "@/components/base/Button";
import TextBox from "@/components/base/TextBox";
import TextView from "@/components/base/TextView";

import { validateEmail } from "@/utils";


const WaitlistForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    let timeout = null;

    const showMessage = (msg) => {
      if(!timeout) {
        clearTimeout(timeout);
      }

      setMessage(msg);
      timeout = setTimeout(() => {
        setMessage(null);
      }, 5_000);
    }
  
    const handleSubmit = async () => {
      // Validating the name...
      if (!name.trim()) {
        showMessage("Oops! Someone forgot to tell us their name. 🤔");
        return;
      }

      // Validating the email address...
      if (!validateEmail(email)) {
        showMessage("Oops! Someone made a typo in their email! 🤭");
        return;
      }

      // Adding to the waitlist...
      showMessage("Adding you to the waitlist...");
      const response = await fetch("/api/add-to-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
        }),
      });
      const { message: msg } = await response.json();
      showMessage(msg);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <TextBox
          label="Name"
          placeholder="Deep"
          onChange={setName}
          value={name}
        />
        <TextBox
          label="Email"
          placeholder="deep@gmail.com"
          onChange={setEmail}
          value={email}
        />
        <Button text="submit" buttonStyle={{ maxWidth: '96px' }} onPress={handleSubmit}>Submit</Button>
        <TextView texts={[[message]]} />
      </form>
    );
}

export default WaitlistForm;
