import React, { useMemo } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { max, bin } from "d3-array";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { Bar } from "@vx/shape";
import { tidy, count, asc, arrange, fixedOrder } from "@tidyjs/tidy";

const PADDING = 50;
const HEIGHT = 500;

const yAcessor = (d) => d.count;

export default function Histogram(props) {
  let sort;
  switch (props.sort) {
    case "asc":
      sort = asc(props.x);
      break;
    case "fixed":
      sort = fixedOrder(props.x, props.sortOrder);
      break;
    default:
      sort = [];
  }

  const countData = tidy(
    props.data,
    count(props.x, { name: "count" }),
    arrange(sort)
  );

  const scaleX = useMemo(
    () =>
      scaleBand()
        .range([PADDING, props.width - PADDING])
        .domain(countData.map((d) => d[props.x]))
        .padding(0.1),
    [countData, props]
  );

  const scaleY = useMemo(
    () =>
      scaleLinear()
        .range([HEIGHT - PADDING, PADDING])
        .domain([0, max(countData, yAcessor)]),
    [countData]
  );

  return (
    <svg
      height={HEIGHT}
      width={props.width}
      style={{ border: "1px solid #ececec", margin: 20 }}
    >
      <text
        x={props.width / 2}
        y={PADDING / 2}
        style={{ textAnchor: "middle" }}
      >
        {props.x}
      </text>
      {countData.map((d) => (
        <g key={`${d[props.x]}`}>
          <Bar
            key={`bar-${d[props.x]}`}
            x={scaleX(d[props.x])}
            y={scaleY(d.count)}
            width={scaleX.bandwidth()}
            height={HEIGHT - PADDING - scaleY(d.count)}
            fill={d[props.x] === "dubious" ? "#B0BEC5" : "#607D8B"}
          />
          <text
            key={`text-${d[props.x]}`}
            x={scaleX(d[props.x]) + scaleX.bandwidth() / 2}
            y={scaleY(d.count) - 5}
            fill="#455A64"
            style={{ textAnchor: "middle" }}
          >
            {d.count}
          </text>
        </g>
      ))}
      <AxisLeft scale={scaleY} left={PADDING} />
      <AxisBottom scale={scaleX} top={HEIGHT - PADDING} />
    </svg>
  );
}
