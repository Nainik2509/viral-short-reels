#!/usr/bin/env python3
"""
YouTube Shorts Automated Uploader & Scheduler for Viral Reel Studio
Uses YouTube Data API v3 to upload and schedule videos directly.
"""

import argparse
import os
import sys
import datetime

def print_help_guide():
    print("""
================================================================================
🎬 YouTube Automated Uploader & Scheduler Guide
================================================================================
To schedule uploads automatically via the YouTube Data API:
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a project and enable 'YouTube Data API v3'
3. Create OAuth 2.0 Client ID (Desktop Application) credentials
4. Download the JSON credential file and save it as:
   `client_secrets.json` in the root workspace folder.
5. Run:
   ./.venv/bin/pip install google-api-python-client google-auth-oauthlib google-auth-httplib2
6. Execute the upload:
   python scripts/youtube_scheduler.py --video "export/GTA_6_Launch_Eve/video.mp4" \\
       --title "GTA 6 Just Broke Metacritic! 🚨 (All-Time Record)" \\
       --schedule "2026-11-19T00:00:00Z"
================================================================================
""")

def main():
    parser = argparse.ArgumentParser(description="Upload and Schedule YouTube Shorts via YouTube Data API v3")
    parser.add_argument("--video", "-v", required=True, help="Path to video file (.mp4)")
    parser.add_argument("--title", "-t", required=True, help="Video title")
    parser.add_argument("--description", "-d", default="", help="Video description")
    parser.add_argument("--tags", help="Comma-separated tags")
    parser.add_argument("--schedule", "-s", help="ISO 8601 publish timestamp (e.g. '2026-11-19T00:00:00Z')")
    parser.add_argument("--privacy", default="private", choices=["private", "public", "unlisted"], help="Privacy status (must be 'private' if scheduling)")

    args = parser.parse_args()

    secrets_file = "client_secrets.json"
    if not os.path.exists(secrets_file):
        print(f"⚠️  Missing credentials: '{secrets_file}' not found.")
        print_help_guide()
        sys.exit(1)

    try:
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        print("❌ Missing Google API client libraries.")
        print("Run: ./.venv/bin/pip install google-api-python-client google-auth-oauthlib google-auth-httplib2")
        sys.exit(1)

    SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
    flow = InstalledAppFlow.from_client_secrets_file(secrets_file, SCOPES)
    credentials = flow.run_local_server(port=0)
    youtube = build('youtube', 'v3', credentials=credentials)

    status = {
        "privacyStatus": "private" if args.schedule else args.privacy,
        "selfDeclaredMadeForKids": False
    }
    if args.schedule:
        status["publishAt"] = args.schedule

    body = {
        "snippet": {
            "title": args.title[:100],
            "description": args.description,
            "tags": [tag.strip() for tag in args.tags.split(",")] if args.tags else [],
            "categoryId": "20"  # 20 = Gaming
        },
        "status": status
    }

    media = MediaFileUpload(args.video, chunksize=-1, resumable=True, mimetype="video/mp4")
    print(f"🚀 Uploading video '{args.video}' to YouTube...")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
    response = request.execute()

    print(f"✅ Video uploaded successfully! Video ID: {response.get('id')}")
    if args.schedule:
        print(f"📅 Video scheduled to go live at: {args.schedule}")

if __name__ == "__main__":
    if len(sys.argv) == 1:
        print_help_guide()
        sys.exit(0)
    main()
