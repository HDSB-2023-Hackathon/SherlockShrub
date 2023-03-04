const form = document.getElementById('upload-form');
const input = document.getElementById('image-upload');
const button = document.getElementById('upload-button');
const resultsDiv = document.getElementById('results');

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
        resultsDiv.innerHTML = '';
        data.suggestions.forEach(suggestion => {
          const resultBox = document.createElement('div');
          resultBox.classList.add('result-box');

          const resultImage = document.createElement('img');
          resultImage.classList.add('result-image');
          const wikiData = suggestion.taxonomy.wikipedia;
          if (wikiData) {
            const imageUrl = wikiData.image ? wikiData.image.source : '';
            resultImage.src = imageUrl;
          }
          resultBox.appendChild(resultImage);

          const resultName = document.createElement('div');
          resultName.classList.add('result-name');
          resultName.innerText = suggestion.plant_name;
          resultBox.appendChild(resultName);

          const resultDescription = document.createElement('div');
          resultDescription.classList.add('result-description');
          if (wikiData) {
            const description = wikiData.description ? wikiData.description : '';
            resultDescription.innerText = description;
          }
          resultBox.appendChild(resultDescription);

          const resultProbability = document.createElement('div');
          resultProbability.classList.add('result-probability');
          resultProbability.innerText = `Probability: ${Math.round(suggestion.probability * 100)}%`;
          resultBox.appendChild(resultProbability);

          resultsDiv.appendChild(resultBox);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
    reader.readAsDataURL(file);
  }
});
