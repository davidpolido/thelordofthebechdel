import { useState, useEffect } from "react";
import * as d3 from "d3-fetch";
import {
  tidy,
  distinct,
  select,
  count,
  arrange,
  fixedOrder,
  mutate,
  asc,
  groupBy,
  n,
  map
} from "@tidyjs/tidy";

import Histogram from "./Histogram";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-03-09/movies.csv"
    ).then((payload) => {
      setData(payload);
      setLoading(false);
    });
  }, []);

  const testResultData = tidy(
    data,
    count("clean_test", { name: "count" }),
    arrange([
      fixedOrder("clean_test", ["nowomen", "notalk", "men", "ok", "dubious"])
    ])
  );

  const testResultCondensedData = tidy(
    data,
    mutate({
      testCondensed: (d) =>
        ["nowomen", "notalk", "men"].includes(d.clean_test)
          ? "nok"
          : d.clean_test
    }),
    count("testCondensed", { name: "count" }),
    arrange([fixedOrder("testCondensed", ["nok", "ok", "dubious"])])
  );

  const yearData = tidy(
    data,
    mutate({ yearNumber: (d) => parseInt(d.year, 10) }),
    count("yearNumber", { name: "count" }),
    arrange([asc("yearNumber")])
  );
  if (!loading) {
    console.log(data[200]);
  }

  return (
    <div className="App">
      {loading && <div>loading</div>}
      {/* {!loading && <div>you have {data.length} dataaaaaas </div>} */}
      {!loading && (
        <Histogram data={testResultData} x="clean_test" width={600} />
      )}
      {!loading && (
        <Histogram
          data={testResultCondensedData}
          x="testCondensed"
          width={600}
        />
      )}
      {!loading && <Histogram data={yearData} x="yearNumber" width={1400} />}
    </div>
  );
}

export default App;
