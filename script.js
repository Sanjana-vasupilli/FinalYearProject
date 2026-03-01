const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("loader");
const resultDiv = document.getElementById("result");

imageInput.addEventListener("change", function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

function analyzeImage() {
    const file = imageInput.files[0];
    if (!file) return alert("Upload an image first!");

    loader.classList.remove("hidden");
    resultDiv.classList.add("hidden");

    const formData = new FormData();
    formData.append("image", file);

    fetch("/analyze", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        loader.classList.add("hidden");

        resultDiv.innerHTML = `
            <h2>🍛 ${data.food_name}</h2>
            <h3>🔥 ${data.calories}</h3>
            <p>${data.nutrition}</p>
        `;

        resultDiv.classList.remove("hidden");
    });
}
