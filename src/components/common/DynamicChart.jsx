import api from "api";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DynamicChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`case/dashboard/date-wise-counts/`);
        if (response.status === 200) {
          const data = response.data;

          // Extract labels and data points
          const labels = data.map(item => item.date); // Use 'truncated_date' as labels
          const counts = data.map(item => item.count); // Use 'count' as data points

          // Update chartData state
          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Petitions Filed",
                data: counts,
                backgroundColor: "#e67e22",
                borderColor: "#e67e22",
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card">
      <div className="card-header bg-primary">
        <strong>Datewise Filing</strong>
      </div>
      <div className="card-body p-1">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            // plugins: {
            //   title: {
            //     display: true,
            //     text: "Dynamic Chart",
            //   },
            // },
            scales: {
              x: {
                type: "category",
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1, // Ensure step size is within ticks
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DynamicChart;
