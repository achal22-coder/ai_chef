import OpenAI from "openai";
import { marked } from 'marked';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-5c9750a0cde34732a4dbb30bf37a0d0e',
  dangerouslyAllowBrowser: true
});

const form = document.getElementById('ingredient-form');
const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loading = document.getElementById('loading');
      loading.style.display = 'block';
      
      try {
        const ingredients = document.getElementById('ingredients').value;
        const diet = document.getElementById('diet').value;
        const cuisine = document.getElementById('cuisine').value;
        const time = document.getElementById('time').value;

        const prompt = `Suggest recipes using these ingredients: ${ingredients}. 
        ${diet ? `Dietary preference: ${diet}.` : ''} 
        ${cuisine ? `Cuisine type: ${cuisine}.` : ''} 
        ${time ? `Maximum cooking time: ${time} minutes.` : ''}`;

        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: "You are a helpful recipe assistant." }, { role: "user", content: prompt }],
          model: "deepseek-chat",
        });

        const recipes = completion.choices[0].message.content.split('\n').filter(line => line.trim() !== '');
        displayRecipes(recipes);
      } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = '<div class="error">Failed to fetch recipes. Please try again.</div>';
      } finally {
        loading.style.display = 'none';
      }
});

function displayRecipes(recipes) {
  resultsDiv.innerHTML = '';
  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = marked.parse(recipe);
    resultsDiv.appendChild(recipeCard);
  });
}
