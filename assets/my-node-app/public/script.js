document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('profileImage');
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('profileImage', data.filePath);
            document.getElementById('profileImagePreview').src = data.filePath;
        } else {
            alert('Upload failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});