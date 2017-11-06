# fb-craft

Craft version of firebellydesign.com

## Database & upload dir backups

Look in S3 at fb-dev-backup/fb_craft and fb-dev-backup/fb_craft-uploads

## Production deployment

Running `fab assets` will compile production assets and update rev-manifest.json. Commit the new/changed files, push up, and run `fab production deploy`

Template caches will be cleared out as part of deploy.
