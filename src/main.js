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
          'Api-Key': 'eYMF44yTQ1hnas37J4urhdM1bcUdtYgaulhFIbD7ZaPrYRvjg2'
        },
        body: JSON.stringify({
          images: [dataUrl.split(',')[1]],
          "plant_details": ["common_names", "wiki_image", "wiki_description", "url"],
          language: 'en'
        })
      })
      .then(response => response.json())
      .then(data => {
        resultsDiv.innerHTML = '';
        if (data.suggestions.length > 0) {
          data.suggestions.forEach(suggestion => {
            console.log('suggestion:', suggestion);
            const resultBox = document.createElement('div');
            resultBox.classList.add('result-box');
            const resultImage = document.createElement('img');
            resultImage.classList.add('result-image');
            resultImage.src = suggestion.plant_details.wiki_image.value;
            resultBox.appendChild(resultImage);
            const resultName = document.createElement('h1');
            resultName.classList.add('result-name');
            resultName.innerText = suggestion.plant_name;
            resultBox.appendChild(resultName);
            const resultCommonName = document.createElement('h2');
            resultCommonName.classList.add('resultCommonName');
            resultCommonName.innerText = suggestion.plant_details.common_names[0];
            const resultCommonNameSpan = document.createElement('span');
            resultCommonNameSpan.innerText = `(AKA. ${resultCommonName.innerText})`;
            resultBox.appendChild(resultCommonNameSpan);
            const resultDescription = document.createElement('p');
            resultDescription.classList.add('result-description');
            resultDescription.innerText = suggestion.plant_details.wiki_description.value;
            resultBox.appendChild(resultDescription);
            const resultProbability = document.createElement('h3');
            resultProbability.classList.add('result-probability');
            resultProbability.innerText = `Probability: ${Math.round(suggestion.probability * 100)}%`;
            resultBox.appendChild(resultProbability);
            resultsDiv.appendChild(resultBox);
          });
        } else {
          const noResultDiv = document.createElement('div');
          noResultDiv.classList.add('no-result');
          noResultDiv.innerText = 'No results found. Please try again with a different image.';
          resultsDiv.appendChild(noResultDiv);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
    reader.readAsDataURL(file);
  }
});
