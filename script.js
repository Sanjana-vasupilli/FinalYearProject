const imageUpload = document.getElementById("imageUpload");
const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultCard = document.getElementById("resultCard");
const foodName = document.getElementById("foodName");
const calories = document.getElementById("calories");

let selectedImage = null;

// Load image to canvas
imageUpload.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = event.target.result;
    selectedImage = event.target.result.split(",")[1]; // base64
  };

  reader.readAsDataURL(file);
});

// Send image to backend
analyzeBtn.addEventListener("click", async () => {
  if (!selectedImage) {
    alert("Please upload an image first.");
    return;
  }

  analyzeBtn.innerText = "Analyzing...";
  
  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: selectedImage
      })
    });

    const data = await response.json();

    foodName.innerText = data.food;
    calories.innerText = data.calories + " kcal";

    resultCard.style.display = "block";
    analyzeBtn.innerText = "Analyze Food";

  } catch (error) {
    alert("Error connecting to backend.");
    analyzeBtn.innerText = "Analyze Food";
  }
});
