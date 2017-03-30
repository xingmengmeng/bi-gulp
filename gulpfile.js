var gulp=require('gulp');
var $=require('gulp-load-plugins')();//元素的  非自己的  需要安装模块   引入所有gulp开头的模块
gulp.task('html',function () {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'))
        .pipe($.connect.reload());
});
gulp.task('ico',function () {
    gulp.src('./src/*.ico')
        .pipe(gulp.dest('./build'));
});

gulp.task('css',['addAll'],function () {
    gulp.src('./src/css/*.less')
        .pipe($.less())
        .pipe($.concat('all.css'))
    //.pipe(gulp.dest('./build/css'))
        .pipe($.cleanCss())
        .pipe($.rename(function (file) {
            file.basename+='.min';
        }))
        .pipe(gulp.dest('./build/css'));
});
gulp.task('addAll', function () {
    return gulp.src('src/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('./build'));
});
gulp.task('js',function(){
    gulp.src('./src/js/*.js')
        .pipe($.plumber())
        .pipe($.babel({presets:['es2015']}))
        //.pipe($.concat('all.js'))
        //.pipe(gulp.dest('./build/js'))
        .pipe($.uglify())
        /*.pipe($.rename(function(file){
            file.basename += '.min';
        }))*/
        .pipe(gulp.dest('./build/js'));
});
gulp.task('comJs',function () {
    gulp.src('./src/commonJs/*.js')
        .pipe(gulp.dest('./build/commonJs'));
})
gulp.task('imagemin', function(){
    return gulp.src('./src/images/**/*.*')
        .pipe($.imagemin())
        .pipe(gulp.dest('./build/images'));
})
gulp.task('server',function () {
    $.connect.server({
        port:3000,//端口
        root:'./build',//根目录
        livereload:true,//启动自动刷新
    })
})
gulp.task('watch',function () {
    gulp.watch('./src/index.html',['html','inject']);
    gulp.watch('./src/less/*.less',['css','html','inject']);
    gulp.watch('./src/js/*.js',['js','html','inject']);
})
gulp.task('inject',function(){
    var src = gulp.src('./src/index.html');
    var source = gulp.src(['./build/js/all.min.js','./build/css/all.min.css']);
    src.pipe($.inject(source,{ignorePath:'build',addRootSlash:false}))
        .pipe(gulp.dest('./build'));
});
gulp.task('allCope',['ico','js','comJs', 'css', 'imagemin','addAll'],function () {
    console.log('tasks all done!')
})

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射    所有的复制完成后添加版本号
gulp.task('revCss',['addAll'], function(){
    gulp.src('./build/css/*.css')
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('rev/css'));
});
gulp.task('revJs',['addAll','js'], function(){
    gulp.src('./build/js/*.js')
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('rev/js'));
});
//Html更换css、js文件版本
gulp.task('default',['revCss','revJs','allCope','addAll'], function () {
    gulp.src(['rev/**/*.json', 'build/*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest('build'));
});

