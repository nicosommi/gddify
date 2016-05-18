import gulp from "gulp";
import { argv } from "yargs";
import runSequence from "run-sequence";
import componentUpdate from "./component.js";

gulp.task("godify-generate", () => {
	const basePath = `${__dirname}/..`;
	const rootSwComponentJson = require(`${basePath}/${argv.from}`).swComponentJson;
	if(argv.name) {
		rootSwComponentJson.swBlocks = rootSwComponentJson.swBlocks.filter(swBlock => swBlock.name === argv.name);
	}
	if(argv.type) {
		rootSwComponentJson.swBlocks = rootSwComponentJson.swBlocks.filter(swBlock => swBlock.type === argv.type);
	}

	return componentUpdate.synchronizeWith(rootSwComponentJson);
});

gulp.task("godify-compile", () => {
	return componentUpdate.clean([ "godifyph" ]);
});

gulp.task("god", done => {
	runSequence("godify-generate", "godify-compile", done);
});
