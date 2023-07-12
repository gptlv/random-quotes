import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";

type Quote = {
  author: string | null | undefined;
  text: string | null | undefined;
};

type Status = "success" | "error" | "loading" | "";

const url = "https://api.themotivate365.com/stoic-quote";

const updateAuthor = (author: string | null) => {
  if (author === null) return;
  if (author === "") return "Unknown";
  return author;
};

const updateText = (text: string | null) => {
  if (text === null) return;
  text = text.replace(/@/g, "");
  return text;
};

const App = () => {
  const [quote, setQuote] = useState<Quote>({
    author: null,
    text: null,
  });

  const [status, setStatus] = useState<Status>("");
  const [error, setError] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const formatQuote = () => {
    return `${quote.text} ${quote.author}`;
  };

  const copyToClipboard = () => {
    const formattedQuot = formatQuote();
    navigator.clipboard.writeText(formattedQuot);
  };

  const fetchQuote = () => {
    if (!isFetching) {
      setIsFetching(true);
      setStatus("loading");
      axios
        .get(url)
        .then((res) => {
          console.log(res);
          setStatus("success");
          setQuote({
            author: updateAuthor(res.data.author),
            text: updateText(res.data.quote),
          });
        })
        .catch((err) => {
          console.error("Error:", err);
          setStatus("error");
          setError(err);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (status === "error")
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-center font-bold">
          Something went wrong. Please try again later.
          <br />
          Error: {error.toString()}
        </h1>
      </div>
    );

  return (
    <>
      <div
        className={"flex justify-center items-center h-screen ".concat(
          isFetching ? "cursor-wait" : ""
        )}
      >
        <div className="md:flex justify-center items-center w-10/12 md:w-3/4 lg:1/3">
          {status === "loading" ? (
            <motion.p
              className="text-xl md:text-2xl font-bold text-center"
              transition={{ duration: 1, repeat: Infinity }}
              animate={{ opacity: [0, 1, 0] }}
            >
              Loading...
            </motion.p>
          ) : (
            <div>
              <motion.blockquote
                className="text-2xl md:text-4xl font-bold md:font-black mt-5"
                // key={quote.text}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                {quote.text}
              </motion.blockquote>
              <br />
              <motion.p
                className="text-xl md:text-2xl italic text-right"
                // key={quote.author}
                initial="hidden"
                animate="visible"
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                {quote.author}
              </motion.p>
              <motion.div
                className="flex justify-center items-center mt-4 gap-3"
                initial="hidden"
                animate="visible"
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <button onClick={copyToClipboard}>
                  <ClipboardDocumentIcon className="h-8 w-8 md:h-10 md:w-10" />
                </button>
                <button onClick={isFetching ? undefined : fetchQuote}>
                  <ArrowPathIcon className="h-8 w-8 md:h-10 md:w-10" />
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
