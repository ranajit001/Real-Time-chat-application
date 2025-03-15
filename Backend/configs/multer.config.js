import multer from "multer"
const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'uploads')
    },
    filename:function(req,file,callback){
        const unique_suffix = Date.now() + '-' + Math.round(Math.random() * 1E9+file.originalname)
        callback(null, unique_suffix)
    }
});

export default storage
