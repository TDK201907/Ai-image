let net, img, canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d");

document.getElementById("imageUpload").addEventListener("change", e => {
    let reader = new FileReader();
    reader.onload = function(event) {
        img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

async function loadModel() {
    net = await bodyPix.load();
}
loadModel();

async function removeBackground() {
    if (!img || !net) return alert("Chưa tải ảnh hoặc model chưa sẵn sàng");
    const segmentation = await net.segmentPerson(img);
    const mask = bodyPix.toMask(segmentation);
    ctx.putImageData(mask, 0, 0);
}

async function blurBackground() {
    if (!img || !net) return alert("Chưa tải ảnh hoặc model chưa sẵn sàng");
    const segmentation = await net.segmentPerson(img);
    const backgroundBlurAmount = 10;
    const edgeBlurAmount = 3;
    const flipHorizontal = false;
    await bodyPix.drawBokehEffect(
        canvas, img, segmentation, backgroundBlurAmount, edgeBlurAmount, flipHorizontal
    );
}

function removeWatermark() {
    if (!img) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
}

function adjustBrightness(value) {
    if (!img) return;
    ctx.filter = `brightness(${value}%)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
}

function cropImage() {
    if (!img) return;
    let width = canvas.width;
    let height = canvas.height;
    ctx.drawImage(canvas, 50, 50, width - 100, height - 100, 0, 0, width, height);
}

function aiEnhance() {
    if (!img) return;
    ctx.filter = "contrast(120%) saturate(130%)";
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
}

function downloadImage() {
    let link = document.createElement('a');
    link.download = "processed_image.png";
    link.href = canvas.toDataURL();
    link.click();
}