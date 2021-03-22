import React from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { max, bin } from "d3-array";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { Bar } from "@vx/shape";

const PADDING = 50;
const HEIGHT = 500;

const yAcessor = (d) => d.count;

export default function Histogram(props) {
  const scaleX = scaleBand()
    .range([PADDING, props.width - PADDING])
    .domain(props.data.map((d) => d[props.x]))
    .padding(0.1);

  const scaleY = scaleLinear()
    .range([HEIGHT - PADDING, PADDING])
    .domain([0, max(props.data, yAcessor)]);

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
      {props.data.map((d) => (
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
