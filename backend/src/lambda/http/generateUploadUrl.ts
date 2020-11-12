import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
//import { strict } from 'assert';
//import { getUserId } from '../utils';

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

//const todoTable = process.env.TODO_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

// export async function getSignedUrl(userId:string,postId:string): Promise<string[]> {
//     const imageId = uuidv4()
//     const newItem = await createImage(userId, postId, imageId,{});
//     // console.log(newItem);
//     const url = getUploadUrl(imageId)
//     return [url,newItem.imageUrl]
// }

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Caller event', event)
    const todoId = event.pathParameters.todoId
    //   const userId = getUserId(event);
    const userId = 'ss'
    const imageId = uuidv4()
    const newItem = await createImage(userId, todoId, imageId)

    const url = getUploadUrl(imageId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true

        },
        body: JSON.stringify({
            newItem: newItem,
            uploadUrl: url
        })
    }
}


async function createImage(userId: string, todoId: string, imageId: string) {
    const timestamp = new Date().toISOString()
    //const newImage = JSON.parse(item)

    const newItem = {
        userId,
        todoId,
        timestamp,
        imageId,
       
        imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }
    console.log('Storing new item: ', newItem)
    //Put item in image imagetable
    await docClient
        .put({
            TableName: imagesTable,
            Item: newItem
        })
        .promise()
   
    return newItem
}

function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: parseInt(urlExpiration)
    })
}