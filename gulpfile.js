//STARTING BUILDS: gulp (for development) OR gulp --production (for production), break wather or procces: ctrl+c)

const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");

// KEY --production (start: gulp dev or gulp dev --production)
const isProd = process.argv.includes("--production");
const isDev = !isProd;

//PLUGINS
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const fileInclude = require("gulp-file-include");
const replace = require("gulp-replace");
const htmlmin = require("gulp-htmlmin");
const concat = require("gulp-concat");
const cssimport = require("gulp-cssimport");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const shorthand = require("gulp-shorthand");
const groupCssMediaQueries = require("gulp-group-css-media-queries");
const babel = require("gulp-babel");
const webpack = require("webpack-stream");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const webp = require("gulp-webp");
const webpHtml = require("gulp-webp-html");
const webpCss = require("gulp-webp-css");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const gulpIf = require("gulp-if");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//HTML
const html = () => {
	return src("./src/html/*.html")
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "HTML",
				message: error.message
			}))
		}))
		.pipe(fileInclude())
		.pipe(gulpIf(isDev, replace(/@html/g, '.html')))
		.pipe(gulpIf(isProd, replace(/@html/g, '')))
		.pipe(webpHtml())
		.pipe(gulpIf(isProd, htmlmin({
			collapseWhitespace: true,
			removeComments: true
		})))
		.pipe(dest("./public"))
		.pipe(gulpIf(isDev, browserSync.stream()));
}

//CSS
const css = () => {
	return src("./src/css/main.css", { sourcemaps: isDev })
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "CSS",
				message: error.message
			}))
		}))
		// .pipe(concat("main.css"))
		.pipe(cssimport())
		// .pipe(shorthand())
		.pipe(webpCss())
		.pipe(autoprefixer())
		.pipe(groupCssMediaQueries())
		.pipe(gulpIf(isDev, dest("./public/css", { sourcemaps: isDev })))
		.pipe(rename({ suffix: ".min" }))
		.pipe(csso())
		.pipe(dest("./public/css", { sourcemaps: isDev }))
		.pipe(gulpIf(isDev, browserSync.stream()));
}

//JS
const js = () => {
	return src("./src/js/*.js", { sourcemaps: isDev })
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "JS",
				message: error.message
			}))
		}))
		.pipe(gulpIf(isProd, babel()))
		.pipe(gulpIf(isDev, webpack({
			mode: "development",
			plugins: [new MiniCssExtractPlugin({filename: "[name].[contenthash].css"})],
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [MiniCssExtractPlugin.loader, "css-loader"],
					},
				],
			},
		})))
		.pipe(gulpIf(isDev, dest("./public/js", { sourcemaps: isDev })))
		// .pipe(webpack(require('./../webpack.config.js')))
		.pipe(webpack({
			mode: "production",
			plugins: [new MiniCssExtractPlugin()],
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [MiniCssExtractPlugin.loader, "css-loader"],
					},
				],
			},
		}))
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest("./public/js", { sourcemaps: isDev }))
		.pipe(gulpIf(isDev, browserSync.stream()));
}

//IMG
const img = () => {
	return src(["./src/img/**/*.{png,jpg,jpeg,gif,svg}",
							"!./src/img/certificates/**/*.*",
							"!./src/img/head-slider/**/*.*",
							"!./src/img/product-sliders/**/*.*",
							"!./src/img/products/*/offer-slider/**/*.*"])
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "IMG",
				message: error.message
			}))
		}))
		.pipe(newer("./public/img"))
		.pipe(webp())
		.pipe(dest("./public/img"))
		.pipe(src("./src/img/**/*.{png,jpg,jpeg,gif,svg}"))
		.pipe(plumber({
			errorHandler: true
		}))
		.pipe(newer("./public/img"))	
		.pipe(imagemin({
			verbose: true
		}))
		.pipe(dest("./public/img"))
		.pipe(gulpIf(isDev, browserSync.stream()));
}

//FONTS
const fonts = () => {
	return src("./src/fonts/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}")
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "FONTS",
				message: error.message
			}))
		}))
		.pipe(newer("./public/fonts"))
		.pipe(fonter({
			formats: ["ttf", "woff", "eot", "svg"]
		}))
		.pipe(dest("./public/fonts"))
		.pipe(ttf2woff2())
		.pipe(dest("./public/fonts"))
		.pipe(gulpIf(isDev, browserSync.stream()));
}

//FILES
const files = () => {
	return src("./src/files/**/*.*")
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "FILES",
				message: error.message
			}))
		}))
		.pipe(newer("./public/files"))
		.pipe(dest("./public/files"))
		.pipe(gulpIf(isDev, browserSync.stream()));
}

//FAVICON
const favicon = () => {
	return src("./src/favicon/*.*")
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "FAVICON",
				message: error.message
			}))
		}))
		.pipe(dest("./public"))
		.pipe(gulpIf(isDev, browserSync.stream()));
}

//DEL
const clear = () => {
	return del("./public");
}

//SERVER
const server = () => {
	browserSync.init({
		server: {
			baseDir: "./public"
		}
	});
}

//WATCHER
const watcher = () => {
	watch("./src/html/**/*.html", html);
	watch("./src/css/**/*.css", css);
	watch("./src/js/**/*.js", js);
	watch("./src/img/**/*.{png,jpg,jpeg,gif,svg}", img);
	watch("./src/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}", fonts);
	watch("./src/files/**/*.*", files);
}

//BUILD - production
const build = series(
	clear,
	parallel(html, css, js, img, fonts, files, favicon)
);

//DEV - development
const dev = series(
	build,
	parallel(watcher, server)
);

//TASKS (Start: gulp name_task)
exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.fonts = fonts;
exports.files = files;
exports.favicon = favicon;
exports.watch = watcher;
exports.clear = clear;

//BUILDS (Start: gulp dev OR gulp build --production)
exports.dev = dev;
exports.build = build;

//STARTING BUILDS (Start: gulp OR gulp --production, break wather or procces: ctrl+c)
exports.default = isProd ? build : dev;