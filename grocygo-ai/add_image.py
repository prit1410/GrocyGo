import pandas as pd
import requests
from bs4 import BeautifulSoup
from time import sleep
from random import uniform

# === CONFIG ===
CSV_PATH = "recipes.csv"
OUTPUT_PATH = "recipes_with_images.csv"
CHECKPOINT_PATH = "recipes_partial.csv"
START_INDEX = 7270  # 👈 Start from row 7270
HEAD_LIMIT = None  # For debug/testing (e.g., 100)

# === LOAD DATA ===
df_full = pd.read_csv(CSV_PATH)
df = df_full.iloc[START_INDEX:].reset_index(drop=True)
if HEAD_LIMIT:
    df = df.head(HEAD_LIMIT)

image_urls = []

print(f"🔄 Processing {len(df)} recipes from row {START_INDEX + 1}...\n")

# === PROCESS EACH RECIPE ===
for i, row in df.iterrows():
    global_index = START_INDEX + i
    url = row['url']
    print(f"[{global_index + 1}] 🔗 Fetching: {url}")

    image_url = ""

    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')

        img_tag = soup.find("img", {
            "class": lambda c: c and "object-cover" in c
        })

        if img_tag and img_tag.get("src", "").startswith("/_next/image"):
            image_url = "https://www.archanaskitchen.com" + img_tag["src"]
            print(f"✅ Found image: {image_url}")
        else:
            print("⚠️ No valid image found.")

    except Exception as e:
        print(f"❌ Error: {e}")

    image_urls.append(image_url)
    sleep(uniform(0.5, 1.2))  # Random delay

    # === SAVE CHECKPOINT EVERY 250 ROWS ===
    if (i + 1) % 250 == 0:
        df_temp = df.iloc[:i + 1].copy().reset_index(drop=True)
        df_temp['recipe_image'] = image_urls
        df_temp.to_csv(CHECKPOINT_PATH, index=False)
        print(f"💾 Checkpoint saved at global row {global_index + 1}\n")

# === FINAL SAVE ===
df['recipe_image'] = image_urls
final_df = df_full.copy()
final_df.loc[START_INDEX:START_INDEX + len(df) - 1, 'recipe_image'] = image_urls
final_df.to_csv(OUTPUT_PATH, index=False)

print(f"\n🎉 Done! Final CSV saved to:\n{OUTPUT_PATH}")
