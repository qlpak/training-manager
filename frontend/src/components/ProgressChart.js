import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = ({ athleteId }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart Rate (bpm)",
        data: [],
        borderColor: "blue",
        borderWidth: 2,
        tension: 0.1,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (!athleteId) {
      console.warn(
        "Athlete ID is not provided. Cannot subscribe to MQTT topic."
      );
      return;
    }

    const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", {
      reconnectPeriod: 5000,
    });

    const topic = `progress/${athleteId}/heart-rate`;

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Failed to subscribe to topic:", topic, err);
        } else {
          console.log("Subscribed to topic:", topic);
        }
      });
    });

    client.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        try {
          const parsedData = JSON.parse(message.toString());
          console.log("Received heart rate data:", parsedData);

          setChartData((prevData) => {
            const updatedLabels = [
              ...prevData.labels,
              new Date(parsedData.timestamp).toLocaleTimeString(),
            ];
            const updatedData = [
              ...prevData.datasets[0].data,
              parsedData.heartRate,
            ];

            if (updatedLabels.length > 10) {
              updatedLabels.shift();
              updatedData.shift();
            }

            return {
              labels: updatedLabels,
              datasets: [
                {
                  ...prevData.datasets[0],
                  data: updatedData,
                },
              ],
            };
          });
        } catch (error) {
          console.error("Error parsing MQTT message:", error);
        }
      }
    });

    return () => {
      console.log("Cleaning up MQTT subscription");
      client.unsubscribe(topic, (err) => {
        if (err) console.error("Failed to unsubscribe from topic:", topic, err);
        else console.log("Unsubscribed from topic:", topic);
      });

      setTimeout(() => {
        if (client.connected) {
          client.end();
        }
      }, 1000);
    };
  }, [athleteId]);

  return (
    <div style={{ width: "400px", height: "300px" }}>
      <h3>Athlete Progress</h3>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Athlete's Heart Rate Over Time",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Heart Rate (bpm)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Time",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ProgressChart;
