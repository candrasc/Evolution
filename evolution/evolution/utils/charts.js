const ctx = document.getElementById("myChart").getContext("2d")
let myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Attack", "Defense", "Health"],
    datasets: [
      {
        label: "Trait Distribution",
        data: [0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          ,
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 0,
        },
      },
    },
  },
})

export function updateChart(data) {
  myChart.data.datasets[0]["data"] = data
  myChart.update()
}
