---
title: {{ replace .File.ContentBaseName "-" " " | title }}
date: {{ .Date }}
draft: true
gameInfo:
  bggId: 1
  # collectInfoFromBgg: true
  image: "https://.../"
  players:
    min: 2
    max: 6
  playTimeMins:
    min: 20
    max: 60
  minAge: 8
  tutorialVideos: []
---

Add game description here, or remove if using the description from BGG...
