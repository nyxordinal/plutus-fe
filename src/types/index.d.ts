import Chart from "chart.js";

export {};

declare global {
  interface Window {
    myLine: Chart;
  }
}
