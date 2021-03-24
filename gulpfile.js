var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var minify = require ("gulp-csso");
var rename = require ("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var server = require("browser-sync").create();
var uglify = require('gulp-uglify');

gulp.task("style", function() {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("src/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("src/css"))
    .pipe(server.stream());
});

gulp.task('compress', function () {
  return gulp.src('src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'))
});

gulp.task("images", function () {
   return gulp.src("src/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
        imagemin.optipng({optimizationlevel: 3}),
        imagemin.mozjpeg({progressive: true}),
        imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task('webp', () =>
    gulp.src('src/img/**/*.{png,jpg}')
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest('build/img'))
);

gulp.task("html", function () {
    return gulp.src("src/*.html")
      .pipe(posthtml([
        include()
    ]))
      .pipe(gulp.dest("build"));
});


gulp.task("copy", function() {
  return gulp.src([
      "src/fonts/**/*.{woff,woff2}",
      "src/img/**",
      "src/js/**",
      "src/css/normalize.css"
    ], {
      base: "src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("html:copy", function() {
   return gulp.src("src/*.html")
     .pipe(gulp.dest("build"));
});

gulp.task("js:copy", function() {
  return gulp.src("src/**/*.js")
    .pipe(gulp.dest("build"));
});


gulp.task("clean", function () {
  return del("build");
});

gulp.task("browserSync", function(done) {
  server.init({
    server: {
      baseDir: "src/"
    },
    port: 3000
  });
  done();
});

gulp.task("serve", function() {
  gulp.watch("src/sass/**/*.scss", gulp.series("style"));
  gulp.watch("src/*.html").on("change", gulp.series("html:copy", server.reload));
  gulp.watch("src/**/*.js").on("change", gulp.series("js:copy", server.reload));
});


var build = gulp.series("clean", "copy", "style", "compress", "webp", "images", "html");

var watch = gulp.parallel("serve", "browserSync");

gulp.task("build", build);

gulp.task("default", watch);
