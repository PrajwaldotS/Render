document.getElementById("myForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;

  const response = await fetch("https://render-ujce.onrender.com/api/form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  const data = await response.json();
  console.log(data);

  alert("Form submitted successfully!");
});
