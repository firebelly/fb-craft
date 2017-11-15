# fb-craft

Craft version of firebellydesign.com

## Getting local dev version going

Git clone, `cd fb-craft` and run `fab devsetup` to automate composer, npm and bower installs.

Edit your .env file (devsetup copies it from .env-example) with db credentials. `npx gulp watch` to run local gulp to compile assets and watch for changes.

## Database & upload dir backups

Look in S3 at fb-dev-backup/fb_craft and fb-dev-backup/fb_craft-uploads

## Production deployment

Running `fab assets` will compile production assets and update rev-manifest.json. Commit the new/changed files, push up, and run `fab production deploy`

Template caches will be cleared out as part of deploy.
