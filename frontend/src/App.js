import { useState, useEffect } from "react";
import * as d3 from "d3-fetch";
import { tidy, distinct, select } from "@tidyjs/tidy";

import "./App.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-03-09/movies.csv"
    ).then((payload) => checks(payload));
  }, []);

  const checks = (payload) => {
    console.log(tidy(payload, distinct("clean_test"), select("clean_test")));
    console.log(tidy(payload, distinct("test"), select("test")));
  };

  return <div className="App">Hi there</div>;
}

export default App;
