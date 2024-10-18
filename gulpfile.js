const gulp = require("gulp");
const ts = require("gulp-typescript");
const exec = require("child_process").exec;
const tsProject = ts.createProject("tsconfig.json");

const paths = {
  scripts: "src/**/*.ts",
  output: "dist", // Output directory for compiled TypeScript files
};

// Task to compile TypeScript files
gulp.task("compile-ts", () => {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(paths.output));
});

// Task to run JSCAD CLI and generate an STL model
gulp.task("generate-stl", (cb) => {
  exec("npx jscad dist/index.js -o dist/index.stl", (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
});

gulp.task("build", gulp.series("compile-ts", "generate-stl"));

// Watch task: compile TypeScript files and then run JSCAD CLI
gulp.task("watch", () => {
  gulp.watch(paths.scripts, gulp.series("compile-ts", "generate-stl"));
});

// Default task to run the watch
gulp.task("default", gulp.series("build", "watch"));
