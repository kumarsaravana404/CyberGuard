const input = document.getElementById("input");
const status = document.getElementById("status");

input.addEventListener("input", () => {
  const val = input.value;

  if (/<script|onerror|javascript:/i.test(val)) {
    status.textContent = "⚠️ XSS Pattern Detected";
    status.className = "danger";
  } else if (/select|union|drop/i.test(val)) {
    status.textContent = "⚠️ SQL Injection Pattern";
    status.className = "warn";
  } else {
    status.textContent = "✅ Input looks safe";
    status.className = "safe";
  }
});

async function analyze() {
  const res = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: input.value })
  });

  const data = await res.json();
  document.getElementById("output").textContent =
    JSON.stringify(data, null, 2);
}
