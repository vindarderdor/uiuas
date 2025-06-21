import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Sales Chart
  const salesChartCtx = document.getElementById("sales-chart")
  if (salesChartCtx) {
    new Chart(salesChartCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Sales",
            data: [12500, 15000, 17500, 14000, 21000, 19500, 22500, 24000, 21500, 23000, 25500, 28000],
            borderColor: "#ff0000",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }

  // Products Chart
  const productsChartCtx = document.getElementById("products-chart")
  if (productsChartCtx) {
    new Chart(productsChartCtx, {
      type: "doughnut",
      data: {
        labels: ["Footwear", "Clothing", "Accessories", "Sports Equipment", "Other"],
        datasets: [
          {
            data: [45, 30, 15, 8, 2],
            backgroundColor: ["#ff0000", "#ff6b6b", "#ffa5a5", "#ffd3d3", "#ffe8e8"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
        cutout: "70%",
      },
    })
  }

  // Chart action buttons
  const chartActions = document.querySelectorAll(".btn-chart-action")
  chartActions.forEach((btn) => {
    btn.addEventListener("click", function () {
      const parent = this.closest(".chart-actions")
      parent.querySelectorAll(".btn-chart-action").forEach((b) => {
        b.classList.remove("active")
      })
      this.classList.add("active")

      // In a real application, this would update the chart data
    })
  })
})
