const providers = [
  { name: "AquaFix Plumbing Co.", service: "Plumbing", score: 4.9, eta: 22 },
  { name: "Metro Waste Logistics", service: "Trash Disposal", score: 4.7, eta: 35 },
  { name: "FiberFirst Install Team", service: "Internet Setup", score: 4.8, eta: 55 },
  { name: "PrimeVolt Electric", service: "Electrical", score: 4.9, eta: 28 },
  { name: "QuickHands Utilities", service: "Plumbing", score: 4.6, eta: 18 }
];

const priorityMultiplier = { Standard: 1, Urgent: 0.8, Emergency: 0.6 };

function dispatchProvider(service, priority) {
  const options = providers.filter((p) => p.service === service);
  const ranked = options
    .map((p) => ({ ...p, weightedEta: Math.round(p.eta * priorityMultiplier[priority]) }))
    .sort((a, b) => b.score - a.score || a.weightedEta - b.weightedEta);
  return ranked[0] || null;
}

document.getElementById("requestForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const service = document.getElementById("serviceType").value;
  const priority = document.getElementById("priority").value;
  const address = document.getElementById("address").value;
  const result = document.getElementById("result");

  const match = dispatchProvider(service, priority);
  if (!match) {
    result.innerHTML = "No provider is currently available in this category.";
    return;
  }

  const basePrice = { Plumbing: 120, "Trash Disposal": 90, "Internet Setup": 140, Electrical: 130 }[service] || 100;
  const customerFee = +(basePrice * 0.045).toFixed(2);
  const providerFee = +(basePrice * 0.08).toFixed(2);

  result.innerHTML = `
    <p><strong>Matched Provider:</strong> ${match.name}</p>
    <p><strong>Service:</strong> ${service} (${priority})</p>
    <p><strong>Location:</strong> ${address}</p>
    <p><strong>ETA:</strong> ${match.weightedEta} minutes</p>
    <p><strong>Provider Quality Score:</strong> ${match.score}/5.0</p>
    <hr/>
    <p><strong>Estimated Service Value:</strong> $${basePrice.toFixed(2)}</p>
    <p><strong>Customer Platform Fee (4.5%):</strong> $${customerFee}</p>
    <p><strong>Provider Commission (8.0%):</strong> $${providerFee}</p>
  `;
});

function pulseMetrics() {
  const open = document.getElementById("openDemand");
  const active = document.getElementById("activeProviders");
  const avg = document.getElementById("avgMatch");
  open.textContent = 120 + Math.floor(Math.random() * 20);
  active.textContent = 930 + Math.floor(Math.random() * 25);
  avg.textContent = `${1 + Math.floor(Math.random() * 3)}m ${10 + Math.floor(Math.random() * 50)}s`;
}
setInterval(pulseMetrics, 4000);
document.getElementById("simulateBtn").addEventListener("click", pulseMetrics);
document.getElementById("newRequestBtn").addEventListener("click", () => {
  document.getElementById("dispatch").scrollIntoView({ behavior: "smooth" });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
