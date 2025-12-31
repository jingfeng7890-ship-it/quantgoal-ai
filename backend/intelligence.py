import feedparser
import urllib.parse
from datetime import datetime, timedelta

def fetch_team_news(team_name, days_back=3):
    """
    Fetches the latest headlines for a specific football team from Google News RSS.
    Returns a summarized string of relevant news.
    """
    try:
        # 1. Construct Google News RSS URL
        encoded_query = urllib.parse.quote(f"{team_name} football team news")
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
        
        # 2. Parse Feed
        feed = feedparser.parse(rss_url)
        
        # 3. Filter Recent News
        relevant_headlines = []
        limit_date = datetime.now() - timedelta(days=days_back)
        
        for entry in feed.entries[:5]: # Top 5 stories
            # Simple simulation of date checking (RSS dates vary in format, skipping complex parsing for MVP)
            # Just taking top 5 recent from Google's ranking
            
            # Clean title (remove source name typically at the end like " - BBC Sport")
            title = entry.title.split(' - ')[0]
            if len(title) > 10:
                relevant_headlines.append(f"- {title}")

        if not relevant_headlines:
            return "No significant recent news found."
            
        return "\n".join(relevant_headlines)

    except Exception as e:
        print(f"News Fetch Error for {team_name}: {e}")
        return "News fetch unavailable."

def get_match_briefing(home_team, away_team):
    """
    Combines news for both teams into a single prompt context.
    """
    print(f"Collecting Intelligence for {home_team} vs {away_team}...")
    
    news_home = fetch_team_news(home_team)
    news_away = fetch_team_news(away_team)
    
    briefing = f"""
    [LATEST NEWS / INJURY REPORT]
    {home_team}:
    {news_home}
    
    {away_team}:
    {news_away}
    """
    return briefing

if __name__ == "__main__":
    # Test
    print(get_match_briefing("Manchester United", "Liverpool"))
