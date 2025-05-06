document.getElementById("trendForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const keywordInput = document.getElementById("keywords").value;
    const keywords = keywordInput.split(",").map(k => k.trim()).filter(Boolean);
  
    fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ keywords: keywords })
    })
      .then(res => res.json())
      .then(data => {
        const traces = {};
        data.forEach(row => {
          const date = row["date"];
          Object.keys(row).forEach(key => {
            if (key !== "date") {
              if (!traces[key]) traces[key] = { x: [], y: [], type: 'scatter', mode: 'lines+markers', name: key };
              traces[key].x.push(date);
              traces[key].y.push(row[key]);
            }
          });
        });
  
        Plotly.newPlot("trendChart", Object.values(traces), {
          title: "Search Interest Over Time",
          xaxis: { title: "Date" },
          yaxis: { title: "Search Interest" }
        });
      })
      .catch(err => alert("Error fetching data: " + err.message));
  });
  