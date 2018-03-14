var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var sass         = require('gulp-sass');
var uglify       = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var include      = require('gulp-include');
var rev          = require('gulp-rev');
var sourcemaps   = require('gulp-sourcemaps');
var runSequence  = require('run-sequence');
var argv         = require('minimist')(process.argv.slice(2));
var isProduction = argv.production;
var notify       = require("gulp-notify");
var browserSync = require('browser-sync').create();
var gutil       = require("gulp-util");

// smash CSS!
gulp.task('styles', function() {
	return gulp.src([
			'public/assets/scss/application.scss',
		])
		.pipe(gulpif(!isProduction, sourcemaps.init()))
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulpif(isProduction, cssnano()))
		.pipe(gulp.dest('public/assets/dist/css'))
		.pipe(gulpif(!isProduction, sourcemaps.write('maps')))
		.pipe(gulpif(!isProduction, gulp.dest('public/assets/dist/css')))
		.pipe(browserSync.stream({match: '**/*.css'}))
		.pipe(notify({message: 'Styles smashed.', onLast: true}));
});

// smash javascript!
gulp.task('scripts', function() {
	return gulp.src([
			'public/assets/js/application.js',
		])
		.pipe(include())
		.pipe(gulpif(!isProduction, sourcemaps.init()))
		.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest('public/assets/dist/js'))
		.pipe(gulpif(!isProduction, sourcemaps.write('maps')))
		.pipe(gulpif(!isProduction, gulp.dest('public/assets/dist/js')))
		.pipe(browserSync.reload({stream:true}))
		.pipe(notify({message: 'Scripts smashed.', onLast: true}));
});

// revision files for production assets
gulp.task('rev', function() {
	return gulp.src(['public/assets/dist/**/*.css', 'public/assets/dist/**/*.js'])
		.pipe(rev())
		.pipe(gulp.dest('public/assets/dist'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('public/assets/dist'));
});

// folders to watch for changes
gulp.task('watch', ['build'], function() {
	// Init BrowserSync
	browserSync.init({
		proxy: 'fb-craft.localhost',
		notify: false,
		open: false
	});

	gulp.watch('public/assets/scss/**/*.scss', ['styles']);
	gulp.watch('public/assets/js/**/*.js', ['scripts']);
});

// `gulp clean` - Deletes the build folder entirely.
gulp.task('clean', require('del').bind(null, ['public/assets/dist']));

// `gulp build` - Run all the build tasks but don't clean up beforehand.
gulp.task('build', function(callback) {
	if (isProduction) {
		// production gulpin' (with file revisioning)
		runSequence(
			'clean',
			['styles','scripts'],
			'rev',
			callback
		);
	} else {
		// dev gulpin'
		runSequence(
			'clean',
			['styles','scripts'],
			callback
		);
	}
});

// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task('default', function() {
	gulp.start('build');
});
