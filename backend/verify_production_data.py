from dotenv import load_dotenv
import os
from supabase import create_client

# Load backend/.env
load_dotenv(dotenv_path='backend/.env')

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print(f"URL: {url}")
print(f"Key Found: {'YES' if key else 'NO'}")

if not url or not key:
    print("❌ Cannot connect: Missing keys in backend/.env")
    exit()

try:
    supabase = create_client(url, key)
    
    # Check ai_models
    res_models = supabase.table('ai_models').select('*', count='exact').execute()
    print(f"✅ AI Models: {len(res_models.data)} models found.")
    
    # Check ai_league_stats
    res_stats = supabase.table('ai_league_stats').select('*', count='exact').execute()
    count = len(res_stats.data)
    print(f"✅ League Stats: {count} rows found.")
    
    if count == 0:
        print("⚠️  Warning: No stats found. Engine needs to run.")
    else:
        print("🎉 GREAT NEWS: Data exists in the cloud!")
        print("   This confirms the issue is 100% just the missing Vercel environment variables.")

except Exception as e:
    print(f"❌ Connection Error: {e}")
