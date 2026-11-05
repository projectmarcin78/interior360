#!/usr/bin/env python3
"""Refresh the static YouTube cards before publishing, without an API key."""
import argparse
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

CHANNEL_ID = "UC65I1Py40D4V3G4axwHYj4A"
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
ROOT = Path(__file__).resolve().parents[1]
PAGES = ("public/makieta/index.html", "public/makieta/konsultacje/index.html")


def parse_videos(data):
    feed = ET.fromstring(data)
    if feed.findtext("yt:channelId", namespaces=NS) not in (CHANNEL_ID, CHANNEL_ID[2:]):
        raise ValueError("Unexpected YouTube channel; keeping the previous catalogue.")
    found = {}
    for entry in feed.findall("a:entry", NS):
        if entry.findtext("yt:channelId", namespaces=NS) != CHANNEL_ID:
            raise ValueError("Unexpected video channel.")
        video_id = entry.findtext("yt:videoId", namespaces=NS) or ""
        title = (entry.findtext("a:title", namespaces=NS) or "").strip()
        published = entry.findtext("a:published", namespaces=NS) or ""
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id) or not title:
            raise ValueError("Invalid video entry; keeping the previous catalogue.")
        published_at = datetime.fromisoformat(published.replace("Z", "+00:00"))
        if published_at.tzinfo is None:
            raise ValueError("Missing publication timezone.")
        found[video_id] = (published_at, title)
    if len(found) < 6:
        raise ValueError("Expected at least six videos; keeping the previous catalogue.")
    latest = sorted(found.items(), key=lambda item: item[1][0], reverse=True)[:6]
    return [{"id": video_id, "title": details[1], "series": "MIRELLA I MARCIN / YOUTUBE", "index": i}
            for i, (video_id, details) in enumerate(latest)]


def refresh(data, root=ROOT):
    videos = parse_videos(data)
    # Escape HTML delimiters so even unusual titles cannot close the script tag.
    encoded = json.dumps(videos, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
    updated = datetime.now(timezone.utc).date().isoformat()
    replacement = f'const videos={encoded};\nconst videosUpdatedAt="{updated}";'
    prepared = []
    for relative in PAGES:
        path = root / relative
        source = path.read_text(encoding="utf-8")
        output, count = re.subn(r'const videos=\[.*?\];(?:\nconst videosUpdatedAt="[^"]*";)?',
                                lambda _: replacement, source, count=1, flags=re.S)
        if count != 1:
            raise ValueError(f"Video data marker missing in {relative}")
        prepared.append((path, output))
    # Validate every page before changing any files.
    for path, output in prepared:
        path.write_text(output, encoding="utf-8")
    print(f"Updated {len(videos)} YouTube cards in {len(prepared)} pages ({updated}).")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--feed-file", type=Path, help="Use a saved Atom feed for local checks.")
    args = parser.parse_args()
    if args.feed_file:
        data = args.feed_file.read_bytes()
    else:
        request = urllib.request.Request(FEED_URL, headers={"User-Agent": "interior360-weekly-update/1.0"})
        with urllib.request.urlopen(request, timeout=30) as response:
            data = response.read(2_000_001)
        if len(data) > 2_000_000:
            raise ValueError("YouTube feed is unexpectedly large.")
    refresh(data)


if __name__ == "__main__":
    main()

