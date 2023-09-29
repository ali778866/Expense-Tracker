require('dotenv').config();
const AWS = require('aws-sdk');

exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetrc';

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRATE_ACCESS_KEY
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err)
            } else {
                // console.log(response);
                resolve(response.Location)
            }
        })
    })
}