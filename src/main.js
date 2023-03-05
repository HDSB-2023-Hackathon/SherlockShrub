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
        if (data.suggestions.length > 0) {
          const resultsHTML = data.suggestions.map(suggestion => {
            return `
              <div class="result-box">
                <img class="result-image" src="${suggestion.plant_details.wiki_image.value}">
                <h1 class="result-name">${suggestion.plant_name}</h1>
                <span>(AKA. ${suggestion.plant_details.common_names[0]})</span></h2>
                <p class="result-description">${suggestion.plant_details.wiki_description.value}</p>
                <h3 class="result-probability">Probability: ${Math.round(suggestion.probability * 100)}%</h3>
              </div>
            `;
          }).join('');
          resultsDiv.innerHTML = resultsHTML;
        } else {
          resultsDiv.innerHTML = '<div class="no-result">No results found. Please try again with a different image.</div>';
        }
      })
      
      .catch(error => {
        console.error('Error:', error);
      });
    };
    reader.readAsDataURL(file);
  }
});
