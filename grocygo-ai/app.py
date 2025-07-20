from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
from sentence_transformers import SentenceTransformer, util
import torch
import os
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter

app = FastAPI()


from fastapi import Body
from fastapi.responses import JSONResponse

class MealPlanSuggestionRequest(BaseModel):
    inventory: List[str]
    diet: str = None
    course: str = None


class MealPlanSuggestionItem(BaseModel):
    recipe_title: str
    ingredients: str
    url: str
    recipe_image: str
    prep_time: str
    course: str
    diet: str
    matched_ingredients: List[str]
    missing_ingredients: List[str]
    description: str
    instructions: str
    ingredients_available: int
    ingredients_total: int
    id: str

# Load and preprocess recipe data
RECIPES_CSV = 'recipes.csv'
if not os.path.exists(RECIPES_CSV):
    df = None
    recipe_embeddings = None
    print(f"ERROR: '{RECIPES_CSV}' not found. Please place the file in the same directory as app.py.")
else:
    df = pd.read_csv(RECIPES_CSV)
    df['ingredients_list'] = df['ingredients'].fillna('').apply(lambda x: [i.strip().lower() for i in x.split('|')])
    df['ingredients_str'] = df['ingredients_list'].apply(lambda x: ', '.join(x))
    # Add fallback columns for course and diet if not present
    if 'course' not in df.columns:
        df['course'] = ''
    if 'diet' not in df.columns:
        df['diet'] = ''


# Load Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')
recipe_embeddings = model.encode(df['ingredients_str'].tolist(), convert_to_tensor=True) if df is not None else None

# Map common local terms
synonym_map = {
    "ringan": "brinjal", "baingan": "eggplant", "mirchi": "chili", "methi": "fenugreek",
    "besan": "gram flour", "maida": "all-purpose flour", "haldi": "turmeric", "atta": "wheat flour",
    "dhania": "coriander", "jeera": "cumin"
}

def normalize_ingredient(ingredient):
    ing = ingredient.lower().strip()
    for k, v in synonym_map.items():
        if k in ing:
            return v
    return ing


# FastAPI setup
# Only create the app ONCE, at the top
# app = FastAPI()  # <-- REMOVE this duplicate if present

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InventoryRequest(BaseModel):
    ingredients: List[str]
    course: str = None
    diet: str = None


@app.post("/suggest")
def suggest_recipes(req: InventoryRequest):
    if df is None or recipe_embeddings is None:
        return {"error": f"'{RECIPES_CSV}' not found on server. Please upload the file."}, 500

    try:
        # Normalize user's ingredients
        user_ingredients = set([normalize_ingredient(i) for i in req.ingredients if i.strip()])
        user_str = ', '.join(user_ingredients)
        user_vec = model.encode(user_str, convert_to_tensor=True)

        # Filter by course and diet if provided
        filtered_df = df.copy()
        if req.course:
            filtered_df = filtered_df[filtered_df['course'].str.lower().str.contains(req.course.strip().lower(), na=False)]
        if req.diet:
            filtered_df = filtered_df[filtered_df['diet'].str.lower().str.contains(req.diet.strip().lower(), na=False)]

        # If no recipes after filtering, fallback to all
        if filtered_df.empty:
            filtered_df = df.copy()
            filtered_embeddings = recipe_embeddings
        else:
            filtered_embeddings = model.encode(filtered_df['ingredients_str'].tolist(), convert_to_tensor=True)

        # Semantic similarity
        cosine_scores = util.pytorch_cos_sim(user_vec, filtered_embeddings)[0]
        top_results = cosine_scores.argsort(descending=True)[:5]
        scores = cosine_scores[top_results]

        # Fallback if scores too low
        if max(scores).item() < 0.1:
            results = filtered_df.sample(min(5, len(filtered_df)))[['recipe_title', 'ingredients', 'url', 'recipe_image', 'prep_time', 'course', 'diet']].to_dict(orient='records')
        else:
            top_indices = top_results.tolist() if hasattr(top_results, 'tolist') else top_results
            if isinstance(top_indices, list) and len(top_indices) > 0 and hasattr(top_indices[0], 'item'):
                top_indices = [int(x.item()) for x in top_indices]
            cols = ['recipe_title', 'ingredients', 'url', 'recipe_image', 'prep_time', 'course', 'diet']
            for col in cols:
                if col not in filtered_df.columns:
                    filtered_df[col] = ""
            results = filtered_df.iloc[top_indices][cols].to_dict(orient='records')

        # Always add matched_ingredients and missing_ingredients fields
        for recipe in results:
            recipe_ings = [normalize_ingredient(i) for i in recipe.get('ingredients', '').split('|') if i.strip()]
            matched = [i for i in recipe_ings if i in user_ingredients]
            missing = [i for i in recipe_ings if i not in user_ingredients]
            recipe['matched_ingredients'] = matched
            recipe['missing_ingredients'] = missing
    except Exception as e:
        import traceback
        print('AI suggestion error:', traceback.format_exc())
        return {"error": f'AI suggestion error: {str(e)}'}, 500
    return results

class RecipeSuggestion(BaseModel):
    recipe_title: str
    matched_ingredients: List[str]
    missing_ingredients: List[str]

class ShoppingSuggestionRequest(BaseModel):
    inventory: List[str]
    recipes: List[RecipeSuggestion]

@app.post("/shopping-suggestions")
def shopping_suggestions(req: ShoppingSuggestionRequest):
    # Aggregate missing ingredients across all recipes
    shopping_dict: Dict[str, List[str]] = {}
    for recipe in req.recipes:
        for missing in recipe.missing_ingredients:
            item = missing.strip().lower()
            if item:
                if item not in shopping_dict:
                    shopping_dict[item] = []
                shopping_dict[item].append(recipe.recipe_title)
    # Format output
    shopping_list = [
        {"item": item, "needed_for": needed_for}
        for item, needed_for in shopping_dict.items()
    ]
    return {"shopping_list": shopping_list}

@app.post("/mealplan-suggestions", response_model=List[MealPlanSuggestionItem])
def mealplan_suggestions(req: MealPlanSuggestionRequest = Body(...)):
    try:
        if df is None:
            return JSONResponse(status_code=500, content={"error": f"'{RECIPES_CSV}' not found on server. Please upload the file."})
        inventory = req.inventory
        diet = req.diet
        inv_set = set([normalize_ingredient(i) for i in inventory if i.strip()])
        suggestions = []
        # Precompute normalized ingredients for all recipes (cache in memory for speed)
        if not hasattr(df, '_norm_ingredients'):
            df['_norm_ingredients'] = df['ingredients'].fillna('').apply(lambda x: [normalize_ingredient(i) for i in x.split('|') if i.strip()])
        course_list = [req.course] if req.course else ["Breakfast", "Lunch", "Dinner"]
        for course in course_list:
            course_mask = df['course'].str.lower().str.contains(course.lower(), na=False)
            course_df = df[course_mask]
            if diet and diet.strip():
                diet_mask = course_df['diet'].str.lower().str.contains(diet.strip().lower(), na=False)
                course_df = course_df[diet_mask]
            if course_df.empty:
                continue
            # Calculate availability ratio for each recipe
            norm_ings = course_df['_norm_ingredients']
            available_counts = norm_ings.apply(lambda ings: sum(i in inv_set for i in ings))
            total_counts = norm_ings.apply(len)
            availability_ratio = available_counts / total_counts
            # Sort by availability ratio (highest first)
            sorted_indices = availability_ratio.sort_values(ascending=False).index
            if sorted_indices.empty:
                continue
            # Pick the recipe with highest availability ratio
            best_idx = sorted_indices[0]
            best = course_df.loc[best_idx]
            # Always get full ingredient list from CSV, fallback to other fields if missing
            ingredient_names = []
            # Try 'ingredients' string first
            if 'ingredients' in best and isinstance(best['ingredients'], str) and best['ingredients'].strip():
                ingredient_names = [i.strip() for i in best['ingredients'].split('|') if i.strip()]
            # Fallback to 'ingredients_list' column
            if not ingredient_names and 'ingredients_list' in best and isinstance(best['ingredients_list'], list):
                ingredient_names = [i.strip() for i in best['ingredients_list'] if i.strip()]
            # Fallback to 'items' if present
            if not ingredient_names and 'items' in best and isinstance(best['items'], list):
                ingredient_names = [str(i.get('name', '')).strip() for i in best['items'] if str(i.get('name', '')).strip()]
            # If still not found, fallback to empty string
            if not ingredient_names:
                ingredient_names = []
            recipe_ings_norm = [normalize_ingredient(i) for i in ingredient_names]
            matched = [name for name, norm in zip(ingredient_names, recipe_ings_norm) if norm in inv_set]
            missing = [name for name, norm in zip(ingredient_names, recipe_ings_norm) if norm not in inv_set]
            suggestion = {
                "recipe_title": best['recipe_title'],
                "ingredients": '|'.join(ingredient_names),
                "url": best['url'] if 'url' in best else '',
                "recipe_image": best['recipe_image'] if 'recipe_image' in best else '',
                "prep_time": best['prep_time'] if 'prep_time' in best else '',
                "course": best['course'],
                "diet": best['diet'] if 'diet' in best else '',
                "matched_ingredients": [normalize_ingredient(i) for i in matched],
                "missing_ingredients": [normalize_ingredient(i) for i in missing],
                "description": best['description'] if 'description' in best else '',
                "instructions": best['instructions'] if 'instructions' in best else '',
                "ingredients_available": len(matched),
                "ingredients_total": len(ingredient_names),
                "id": str(best.get('recipe_title', '')) + '_' + str(course),
            }
            suggestions.append(suggestion)
        return suggestions
    except Exception as e:
        import traceback
        print('mealplan-suggestions error:', traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": f"mealplan-suggestions error: {str(e)}"})