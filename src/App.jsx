import React from "react";
import TypingPractice from "./components/TypingPractice";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  return (
    <>
      <TypingPractice />
      <Analytics />
    </>
  );
};

export default App;
