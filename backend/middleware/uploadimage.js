const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename:(req,file,cb)=>{
        const uniqueName=Date.now()+path.extname(file.originalname)
        cb(null,uniqueName)
    }
})
 const upload=multer({
    storage:storage,
    limits:{
        fileSize:1024 * 1024 * 10
    }
 })
 module.exports=upload
