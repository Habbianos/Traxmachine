git --no-pager log --date=iso --pretty="format:%cI %H %s" > CHANGELOG.md
git add CHANGELOG.md
git commit -m "chore: updated changelog"