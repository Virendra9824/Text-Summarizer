import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [summText, setSummText] = useState("");
  const [inputText, setInputText] = useState("");
  const [shouldCopy, setShouldCopy] = useState(false);
  const [copyButton, setCopyButton] = useState("Copy");

  // OnClick Logic
  const summarize = async () => {
    const text = inputText;
    setCopyButton("Copy");

    if (text.length < 200) {
      setSummText("Warning: Number of characters must be greater than 200");
      return;
    }
    setInputText("");
    setSummText("Text is being summarized!, Please wait");
    await axios
      .post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          inputs: inputText,
          parameters: {
            max_length: 700,
            min_length: 30,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      )
      .then((response) => {
        setSummText(response.data[0].summary_text);
        setShouldCopy(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // copyText
  let copyText = () => {
    if (summText && !shouldCopy) {
      navigator.clipboard
        .writeText(summText)
        .then(() => {
          setCopyButton("Copied");
          setShouldCopy(true);
        })
        .catch((error) => {
          console.error("Error copying text to clipboard:", error);
        });
    }
  };

  return (
    <>
      <main className="max-w-[1320px] h-full font-roboto mx-auto px-[20px] py-[20px] md:py-[40px] md:px-[50px]">
        {/* Upper Part */}
        <div className="text-justify ">
          <h1 className="font-semibold text-[#323233] text-[30px] text-center">
            Smart Text Summarizer
          </h1>
          <p className="text-[17px]  hidden md:block  text-[#111] px-5 font-light mt-[10px] text-center">
            Welcome to our Smart Text Summarizer App! Using advanced Artificial
            Intelligence, we transform lengthy texts into concise summaries,
            making information more accessible. Whether it's a dense article or
            a lengthy research paper, our tool simplifies complex content with
            ease.
          </p>

          <p className="text-[16px] hidden md:block text-[#111] font-light  mt-[10px] text-center">
            Simply paste your text into the text area below and click the
            "Summarize" button.
          </p>

          <p className="text-[16px] md:hidden block text-[#111] font-light  mt-[10px] text-center">
            Welcome to the AI Text Summarizer App! <br /> Paste your text into
            the text area below and click the "Summarize" button.
          </p>
        </div>

        {/* Lower Part */}
        <div className=" max-w-[880px] gap-4 mx-auto mt-[40px] grid md:grid-cols-2">
          {/* Input */}
          <div className="rounded-md bg-[white] shadow-lg shadow-orange-800/40 p-[10px]">
            <textarea
              className="w-[100%] font-serif rounded-sm h-[320px] p-2 resize-none"
              placeholder="Paste in some text to summarize. (Min length is 200 chars. Max length is 100,000 chars.)"
              maxLength="100000"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            <button
              onClick={summarize}
              className="w-[100%] hover:text-[blue] py-[8px] text-[white] bg-[orange] text-center rounded-[3px] font-semibold"
            >
              Summarize
            </button>
          </div>

          {/* Output */}
          <div className="rounded-md  shadow-lg shadow-orange-800/40 bg-[white] p-[10px]">
            <textarea
              className="w-[100%] h-[320px] text-[17px] font-serif rounded-sm h-[100%] p-2 resize-none"
              placeholder="Summarized text will appear here!"
              readOnly={true}
              value={summText}
            ></textarea>
            <button
              onClick={copyText}
              disabled={shouldCopy}
              className={`w-[100%] py-[8px] text-center rounded-[3px] font-semibold text-white ${
                !shouldCopy && summText
                  ? "bg-[orange] cursor-pointer hover:text-[blue]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {copyButton}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
