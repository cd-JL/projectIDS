"use client"

import React from "react";
import './chart.css'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Prisma, vulnerabilities } from "@prisma/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartOneProps {
  item: vulnerabilities
}
function CourseGpaChart({data, labels}:{data: number[], labels: string[]}) {
  
    return <div className='w-[500px] mx-auto'>
        <h3 className='text-base mb-3 text-center'>Expoitability score</h3>
        <Bar options={
            {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'black',
                        },
                        ticks: {
                            font: {
                                weight: "normal"
                            },
                            color: "black"
                        }
                    },
                    x: {
                        axis: "x",
                        ticks: {
                            color: "black",
                            font: {
                                size: 13
                            },

                        }
                    },
                },
                responsive: true,
                color: "black",
                font: {
                    size: 15,
                    weight: "bolder"
                }
            }
        }
            data={
                {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: ['green', '#963000', 'purple', 'blue', 'red']
                        },
                    ],
                }
            } />
    </div>;
}

export default CourseGpaChart;