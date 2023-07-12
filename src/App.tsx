import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  const fetchQuote = () => {
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
      });
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (status === "error") return <h1>{error.toString()}</h1>;

  return (
    <>
      <div
        className="flex justify-center items-center h-screen"
        onClick={fetchQuote}
      >
        <div className="md:flex justify-center items-center w-10/12 md:w-3/4 lg:1/3">
          {status === "loading" ? (
            <motion.p
              className="text-xl md:text-2xl font-bold text-center"
              // whileTap={{ scale: 0.9, transition: { duration: 0.2 } }}
              // initial="hidden"
              // whileInView="visible"
              // viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, repeat: Infinity }}
              animate={{ opacity: [0, 1, 0] }}
              // variants={{
              //   hidden: { opacity: 0 },
              //   visible: { opacity: 1 },
              // }}
            >
              Loading...
            </motion.p>
          ) : (
            <div>
              <motion.blockquote
                className="text-2xl md:text-4xl font-bold md:font-black mt-5"
                key={quote.text}
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
                key={quote.author}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
