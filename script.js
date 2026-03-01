const imageInput = document.getElementById("imageInput");
const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("loader");
const resultSection = document.getElementById("resultSection");

let stream = null;

/* =========================
   Upload Image
========================= */
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});


/* =========================
   Start Camera
========================= */
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
            stream = s;
            video.srcObject = stream;
            video.classList.remove("hidden");
            captureBtn.classList.remove("hidden");
        })
        .catch(err => {
            alert("Camera access denied!");
        });
}


/* =========================
   Capture Image
========================= */
function captureImage() {
    if (!stream) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Stop camera
    stream.getTracks().forEach(track => track.stop());

    video.classList.add("hidden");
    captureBtn.classList.add("hidden");
}


/* =========================
   Analyze Image
========================= */
function analyzeImage() {

    if (!canvas.width) {
        alert("Please upload or capture an image first!");
        return;
    }

    loader.classList.remove("hidden");
    resultSection.classList.add("hidden");

    canvas.toBlob(function(blob) {

        const formData = new FormData();
        formData.append("image", blob, "food.jpg");

        fetch("/analyze", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {

            loader.classList.add("hidden");

            resultSection.innerHTML = `
                <h2>${data.food_name}</h2>
                <h3>🔥 ${data.calories}</h3>
                <p>${data.nutrition}</p>
            `;

            resultSection.classList.remove("hidden");
        })
        .catch(error => {
            loader.classList.add("hidden");
            alert("Error analyzing image");
        });

    }, "image/jpeg");
}
