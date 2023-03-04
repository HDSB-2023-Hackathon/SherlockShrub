const resultsDiv = document.getElementById('results');

function displayResults(results) {
  resultsDiv.innerHTML = '';
  results.forEach((result) => {
    const name = result.name;
    const description = result.description;
    const imageUrl = result.images[0].url;

    const resultBox = document.createElement('div');
    resultBox.classList.add('result-box');

    const image = document.createElement('img');
    image.src = imageUrl;
    resultBox.appendChild(image);

    const title = document.createElement('h2');
    title.textContent = name;
    resultBox.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = description;
    resultBox.appendChild(desc);

    resultsDiv.appendChild(resultBox);
  });
}

const form = document.getElementById('upload-form');
const input = document.getElementById('image-upload');
const button = document.getElementById('upload-button');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function() {
      const dataUrl = reader.result;
      fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': 'kKb6UsOtuHjqSaHHoETeJRSsnRg6x7wretC0FqAmJVsYM2YmEC'
        },
        body: JSON.stringify({
          images: [dataUrl.split(',')[1]],
          organs: ['flower', 'leaf', 'fruit', 'bark', 'habit', 'other'],
          language: 'en'
        })
      })
      .then(response => response.json())
      .then(data => {
        const results = data.suggestions;
        displayResults(results);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
    reader.readAsDataURL(file);
  }
});