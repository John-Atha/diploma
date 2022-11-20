import { useTheme } from '@mui/system';
import React from 'react'
import Chart from "react-apexcharts";

interface Serie {
    name: string,
    data: any,
}

export interface ChartProps {
    categories: string[],
    // series: Serie[],
    values: number[],
    id: string,
    width?: number | string,
    height?: number | string,
    type?: "bar" | "line" | "area" |
        "histogram" | "pie" | "donut" |
        "radialBar" | "scatter" | "bubble" |
        "heatmap" | "treemap" | "boxPlot" |
        "candlestick" | "radar" | "polarArea" | "rangeBar",
}

export const GeneralChart = ({
    categories,
    values,
    id,
    width,
    height,
    type="bar"
}: ChartProps) => {
    const theme = useTheme();

    const getSeries = () => {
        if (type==="pie") {
            return values;
        }
        else {
            return [{
                name: "data",
                data: values,
            }]
        }
    }

    const options = {
        chart: {
            id,
        },
        ...(type!=="pie" && {xaxis: { categories }}),
        ...(type==="pie" && { labels: categories }),
        ...(type!=="pie" && { colors: [theme.palette.primary.main, theme.palette.warning.main]}),
        ...(type!=="pie" && {
            dataLabels: {
                enabled: false
            },
        }),
        fill: {
            opacity: type==="area" ? 0.2 : 1,
            type: 'solid'
        },
        stroke: {
            width: 1.5,
        },
        grid: {
            show: false,
        },
    }

    return (
        <Chart
            options={options}
            series={getSeries()}
            type={type}
            width={width || "100%"}
            height={height || "auto"}
        />
    )
}