# fb-craft

Craft version of firebellydesign.com

## Getting local dev version going

Git clone, `cd fb-craft` and run `fab devsetup` to automate composer, npm and bower installs.

Edit your .env file (devsetup copies it from .env-example) with db credentials. `npx gulp watch` to run local gulp to compile assets and watch for changes.

Download [Craft CMS](https://craftcms.com/) and copy over the `craft/app` directory to `fb-craft/craft/app`.  `fb-craft` should be fully compatible with the `Craft CMS 2.x` branch. (Last tested with `Craft CMS` version `2.6.3012`.)

Note that the development url is assumed to be `fb-craft.localhost`. In addition to your `.env` file, this is referenced specifically in two files:
+ `fb-craft/craft/config/general.php`:
```
'fb-craft.localhost' => array(
    'devMode' => true,
),
```
+ `fb-craft/gulpfile.js`:
```
gulp.task('watch', ['build'], function() {
	// Init BrowserSync
	browserSync.init({
		proxy: 'fb-craft.localhost',
```
So, if you wish to use a different development url, you will need to edit/manage those files.

## Database & upload dir backups

Look in S3 at fb-dev-backup/fb_craft and fb-dev-backup/fb_craft-uploads

## Production deployment

Running `fab assets` will compile production assets and update rev-manifest.json. Commit the new/changed files, push up, and run `fab production deploy`

Template caches will be cleared out as part of deploy.
