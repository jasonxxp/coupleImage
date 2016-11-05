
//编码图片依赖模块https://github.com/zhangyuanwei/node-images  
var images = require("images");
var fs = require("fs");
var path = require("path");
//var src="./input",dist="./output";//src：图片源路径，dist：输出路径
var options = {
	"src":"./input",
	"dist":"./output"
};
function readFile(src,dst){
	//判断文件需要时间，则必须同步
	if(!fs.existsSync(dst)){
		fs.mkdir(dst);
	}
	if(fs.existsSync(src)){
		fs.stat(src,function(err,stats){
		    //判断文件需要时间，则必须同步		    	
		    if(stats.isDirectory()){
	    		//读取文件夹
	    		fs.readdir(src,function(err,files){
	    			if(err){
	    				throw err;
	    			}    

	    			files.forEach(function(filePath){
	    				var url = path.join(src,filePath);
	    				var dest = path.join(dst,filePath);
	    				readSingleFile(url,dest)
	    			});

	    		});
	    	}else if(stats.isFile()){
	    		var dest = path.join(dst,path.basename(src));
				readSingleFile(src,dest);
			}

		});

	}else{
		throw "no files,no such!";
	}


}

function readSingleFile(url,dest){
	fs.stat(url,function(err,stats){
		if(err)throw err;        
        //是文件
        if(stats.isFile()){
            //正则判定是图片
            if(/.*\.(jpg|png|gif)$/i.test(url)){
            	encoderImage(url,dest);
            }
        }else if(stats.isDirectory()){
        	exists(url,dest,readFile);
        }

    })
}


//这里处理文件跟复制有点相关，输出要检测文件是否存在，不存在要新建文件
function exists(url,dest,callback){
	fs.exists(dest,function(exists){
		if(exists){
			callback && callback(url,dest);
		}else{
            //第二个参数目录权限 ，默认0777(读写权限)
            fs.mkdir(dest,0777,function(err){
            	if (err) throw err;
            	callback && callback(url,dest);
            });
        }
    });    
}


function encoderImage(sourceImg,destImg){
	var img = images(sourceImg),width = img.width(),height=img.height();
	var isNeed = false;
   if(width % 2 == 1){
   	width= width + 1;
   	isNeed = true;
   }
   if(height % 2 == 1){
   	height = height + 1;
   	isNeed = true;
   }
   if(isNeed){
   	images(width, height)
   	.draw(img, 0, 0) 
	    .save(destImg, {               //Save the image to a file,whih quality 80
	        // quality : 80                    //保存图片到文件,图片质量为80
	    });
	    console.log("change:"+destImg);
	}else{
		fs.exists(destImg,function(exists){
			if(!exists){
				readable = fs.createReadStream( sourceImg );

                // 创建写入流

                writable = fs.createWriteStream( destImg );  

                // 通过管道来传输流

                readable.pipe( writable );
            	console.log("copy:"+destImg);
			}
	    });    

	}

}
readFile(options.src,options.dist);

module.exports = readFile;