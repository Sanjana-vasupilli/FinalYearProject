const imageInput = document.getElementById("imageInput");
const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("loader");
const resultSection = document.getElementById("resultSection");

let stream;

/* Upload Image */
imageInput.addEventListener("change", function () {
    const file = this.files[0];
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

/* Start Camera */
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
            stream = s;
            video.srcObject = stream;
            video.classList.remove("hidden");
            captureBtn.classList.remove("hidden");
        })
        .catch(err => alert("Camera access denied!"));
}

/* Capture Image */
function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    video.classList.add("hidden");
    captureBtn.classList.add("hidden");

    stream.getTracks().forEach(track => track.stop());
}

/* Analyze */
function analyzeImage() {
    canvas.toBlob(function(blob) {

        loader.classList.remove("hidden");
        resultSection.classList.add("hidden");

        const formData = new FormData();
        formData.append("image", blob);

        fetch("/analyze", {
            method: "POST",
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            loader.classList.add("hidden");

            resultSection.innerHTML = `
                <h2>🍛 ${data.food_name}</h2>
                <h3>🔥 ${data.calories}</h3>
                <p>${data.nutrition}</p>
            `;

            resultSection.classList.remove("hidden");
        });

    }, "image/jpeg");
}
