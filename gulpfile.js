const gulp = require("gulp");
const sass = require("gulp-sass");
const header = require("gulp-header");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");

const pkg = require("./package.json");
const browserSync = require("browser-sync").create();

// Set the banner content
const banner = [
  "/*!\n",
  " * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n",
  " * Copyright 2013-" + new Date().getFullYear(),
  " <%= pkg.author %>\n",
  " * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n",
  " */\n",
  "\n"
].join("");
const dist = "./public";
const src = "./src";

// Copy third party libraries from /node_modules into /vendor
gulp.task("vendor", () => {
  // Bootstrap
  gulp
    .src([
      "./node_modules/bootstrap/dist/**/*",
      "!./node_modules/bootstrap/dist/css/bootstrap-grid*",
      "!./node_modules/bootstrap/dist/css/bootstrap-reboot*"
    ])
    .pipe(gulp.dest(`${dist}/vendor/bootstrap`));

  // Font Awesome 5
  gulp
    .src(["./node_modules/@fortawesome/**/*"])
    .pipe(gulp.dest(`${dist}/vendor`));

  // jQuery
  gulp
    .src([
      "./node_modules/jquery/dist/*",
      "!./node_modules/jquery/dist/core.js"
    ])
    .pipe(gulp.dest(`${dist}/vendor/jquery`));

  // jQuery Easing
  gulp
    .src(["./node_modules/jquery.easing/*.js"])
    .pipe(gulp.dest(`${dist}/vendor/jquery-easing`));
});

// Compile SCSS
gulp.task("css:compile", () => {
  return gulp
    .src(`${src}/scss/**/*.scss`)
    .pipe(
      sass
        .sync({
          outputStyle: "expanded"
        })
        .on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(
      header(banner, {
        pkg: pkg
      })
    )
    .pipe(gulp.dest(`${dist}/css`));
});

// Minify CSS
gulp.task("css:minify", ["css:compile"], () => {
  return gulp
    .src([`${dist}/css/*.css`, `!${dist}/css/*.min.css`])
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(`${dist}/css`))
    .pipe(browserSync.stream());
});

// CSS
gulp.task("css", ["css:compile", "css:minify"]);

// Minify JavaScript
gulp.task("js:minify", () => {
  return gulp
    .src([`${src}/js/*.js`])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(
      header(banner, {
        pkg: pkg
      })
    )
    .pipe(gulp.dest(`${dist}/js`))
    .pipe(browserSync.stream());
});

// JS
gulp.task("js", ["js:minify"]);

// IMG
gulp.task("img", () =>
  gulp
    .src(`${src}/img/*`)
    .pipe(changed(`${dist}/img`))
    .pipe(imagemin())
    .pipe(gulp.dest(`${dist}/img`))
    .pipe(browserSync.stream())
);

// Static
gulp.task("static", () =>
  gulp
    .src(`${src}/static/*`)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
);

// Default task
gulp.task("default", ["css", "js", "img", "static", "vendor"]);

// Configure the browserSync task
gulp.task("browserSync", () => {
  browserSync.init({
    server: {
      baseDir: dist
    }
  });
});

// Dev task
gulp.task("dev", ["css", "js", "browserSync"], () => {
  gulp.watch(`${src}/scss/**/*.scss`, ["css"]);
  gulp.watch(`${src}/js/*.js`, ["js"]);
  gulp.watch(`${src}/img/*`, ["img"]);
  gulp.watch(`${src}/static/*`, ["static"]);
});
