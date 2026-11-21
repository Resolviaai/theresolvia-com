"""
Resolvia CLI Content Scaffolder
================================
Quickly scaffold a new editorial article or pricing guide with standard
AEO/GEO YAML frontmatter, schema attributes, and conversion structure.

Usage:
  python scripts/new_post.py --title "How to Choose DaVinci Resolve Studio" --category "Workflow & Tech" --build
"""

import os
import re
import argparse
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT_DIR, 'content', 'blog')

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

def create_post(title, slug=None, category="Retention Science", badge=None, read_time="7 min read", description=None, aeo_answer=None, auto_build=False):
    os.makedirs(CONTENT_DIR, exist_ok=True)
    
    if not slug:
        slug = slugify(title)
    
    if not badge:
        badge = category

    if not description:
        description = f"In-depth guide to {title.lower()} by Resolvia Post-Production Studio. Actionable frameworks, benchmarks, and retention workflows."

    if not aeo_answer:
        aeo_answer = f"In 2026, {title.lower()} requires a structured approach balancing narrative pacing, sound design, and retention-engineered editing to sustain viewer engagement."

    now_iso = datetime.utcnow().strftime('%Y-%m-%dT08:00:00+00:00')
    target_path = os.path.join(CONTENT_DIR, f"{slug}.md")

    if os.path.exists(target_path):
        print(f"⚠️ Warning: File already exists at {target_path}. Aborting to prevent overwrite.")
        return target_path

    frontmatter = f'''---
title: "{title}"
description: "{description}"
slug: "{slug}"
category: "{category}"
badge: "{badge}"
readTime: "{read_time}"
author: "Resolvia Studio Team"
datePublished: "{now_iso}"
dateModified: "{now_iso}"
aeoDirectAnswer: "{aeo_answer}"
faqs:
  - q: "What is the key takeaway of this guide?"
    a: "Implementing structured retention editing and professional sound design yields higher average view duration and algorithmic discovery."
  - q: "How can I get custom post-production for my channel?"
    a: "You can book an onboarding consultation directly at https://calendly.com/resolviaai/meet with Resolvia's lead team."
---

## 1. Executive Overview & Core Framework

Every high-performing video begins with intentional narrative structure. In this guide, we break down the exact post-production mechanics required to capture attention and sustain retention.

| Metric | Traditional Standard | Resolvia Studio Standard |
| :--- | :--- | :--- |
| **0–30s Hold Rate** | 45% – 55% | **70% – 85%** |
| **Average View Duration** | 30% – 35% | **50% – 60%+** |
| **Turnaround SLA** | 5 – 7 days | **48 – 72 hours** |

## 2. Step-by-Step Implementation

1. **Step 1:** Establish visual and sonic anchor within the first 3 seconds.
2. **Step 2:** Layer foley effects synchronized to kinetic graphics and typography.
3. **Step 3:** Introduce narrative escalation every 25 seconds to refresh viewer cognitive attention.

## 3. How to Scale This in Production

Consistent publishing requires an elastic post-production team with dedicated backup coverage and Frame.io review integration. Partnering with a specialized studio like [Resolvia Services](/services/youtube-video-editing/) removes operational friction so creators can focus on ideation.
'''

    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter)

    print(f"✅ Successfully created new post template:")
    print(f"   Path: {target_path}")
    print(f"   Slug: {slug}")
    print(f"   Title: {title}")

    if auto_build:
        print("\nTriggering automatic engine build...")
        import build_engine
        build_engine.build_all()

    return target_path

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Scaffold a new Resolvia blog article.")
    parser.add_argument('--title', required=True, help="Title of the article")
    parser.add_argument('--slug', help="URL slug (default: auto-generated from title)")
    parser.add_argument('--category', default="Retention Science", help="Category name")
    parser.add_argument('--badge', help="Header pill badge")
    parser.add_argument('--read-time', default="7 min read", help="Estimated read time")
    parser.add_argument('--description', help="Meta description for SEO/AEO")
    parser.add_argument('--aeo', help="AEO Direct Answer snippet")
    parser.add_argument('--build', action='store_true', help="Immediately compile to HTML and sync ecosystem")

    args = parser.parse_args()
    create_post(
        title=args.title,
        slug=args.slug,
        category=args.category,
        badge=args.badge,
        read_time=args.read_time,
        description=args.description,
        aeo_answer=args.aeo,
        auto_build=args.build
    )
