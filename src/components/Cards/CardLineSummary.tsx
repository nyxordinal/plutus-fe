import { Summary } from "@interface/entity.interface";
import { formatDateShort } from "@util";
import Chart, { ChartConfiguration } from "chart.js";
import PropTypes from "prop-types";
import { useEffect } from "react";

type PropType = {
  id: string;
  title: string;
  data: Summary[];
};

const CardLineChartSummary = ({ id, title, data }: PropType) => {
  useEffect(() => {
    const label: string[] = [];
    const dataset: number[] = [];
    data.forEach((d) => {
      label.push(formatDateShort(d.yearmonth));
      dataset.push(d.amount);
    });

    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: label.reverse(),
        datasets: [
          {
            label: title,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: dataset.reverse(),
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: title,
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
                fontColor: "white",
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: 2,
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: 2,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: 3,
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: 2,
              },
            },
          ],
        },
      },
    };
    const ctx = (document.getElementById(id) as HTMLCanvasElement).getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    window.myLine = new Chart(ctx, config);
  }, [id]);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h2 className="text-white text-xl font-semibold">{title}</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id={id}></canvas>
          </div>
        </div>
      </div>
    </>
  );
};

CardLineChartSummary.defaultProps = {
  title: "Summary Chart",
};

CardLineChartSummary.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
};

export default CardLineChartSummary;
