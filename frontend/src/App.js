import { useState, useEffect } from "react";
import * as d3 from "d3-fetch";
import { max, bin } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import * as tidy from "@tidyjs/tidy";

import Histogram from "./Histogram";
import "./App.css";

const COLUMNS = [
  "year",
  "title",
  "bechdelResult",
  "budget",
  "domgross",
  "intgross",
  "plot",
  "rating",
  "language",
  "country",
  "writer",
  "metascore",
  "director",
  "released",
  "actors",
  "runtime",
  "genres",
  "budgetAdjusted",
  "domgrossAdjusted",
  "intgrossAdjusted",
  "imdbVotes",
  "imdbRating",
  "totalGross",
  "totalGrossAdjusted",
  "bechdelResultCondensed"
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-03-09/movies.csv"
    ).then((payload) => {
      const cleanData = cleanDataTypes(payload);
      setData(cleanData);
      setLoading(false);
    });
  }, []);

  const cleanDataTypes = (payload) => {
    return tidy.tidy(
      payload,
      tidy.mutate({
        actors: (d) => d.actors.split(","),
        genres: (d) => d.genre.split(","),
        year: (d) => parseInt(d.year, 10),
        metascore: (d) => parseInt(d.metascore, 10),
        budget: (d) => parseInt(d.budget, 10),
        budgetAdjusted: (d) => parseInt(d.budget_2013, 10),
        domgross: (d) => parseInt(d.domgross, 10),
        domgrossAdjusted: (d) => parseInt(d.domgross_2013, 10),
        intgross: (d) => parseInt(d.intgross, 10),
        intgrossAdjusted: (d) => parseInt(d.intgross_2013, 10),
        runtime: (d) => parseInt(d.runtime, 10),
        imdbVotes: (d) => parseInt(d.imdb_votes.split(",").join(""), 10),
        imdbRating: (d) => parseFloat(d.imdb_rating),
        totalGross: (d) => d.domgross + d.intgross,
        totalGrossAdjusted: (d) => d.domgrossAdjusted + d.intgrossAdjusted,
        bechdelResultCondensed: (d) =>
          ["nowomen", "notalk", "men"].includes(d.clean_test)
            ? "nok"
            : d.clean_test,
        rated: (d) => {
          if (d.rated === "NA") {
            return "N/A";
          } else if (d.rated === "X") {
            return "NC-17";
          } else {
            return d.rated;
          }
        }
      }),
      tidy.rename({ clean_test: "bechdelResult", rated: "rating" }),
      tidy.filter((d) => d.type === "movie"),
      tidy.select(COLUMNS)
    );
  };

  return (
    <div className="App">
      {loading && <div>loading</div>}
      {!loading && (
        <Histogram
          data={data}
          x="bechdelResult"
          width={600}
          sort={"fixed"}
          sortOrder={["nowomen", "notalk", "men", "ok", "dubious"]}
        />
      )}
      {!loading && (
        <Histogram
          data={data}
          x="bechdelResultCondensed"
          width={600}
          sort="fixed"
          sortOrder={["nok", "ok", "dubious"]}
        />
      )}
      {!loading && <Histogram data={data} x="year" width={1400} sort="asc" />}
      {!loading && (
        <Histogram
          data={data}
          x="rating"
          width={600}
          sort="fixed"
          sortOrder={["G", "PG", "PG-13", "R", "NC-17", "TV-PG", "TV-14"]}
        />
      )}
    </div>
  );
}

export default App;
