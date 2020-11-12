import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS  from 'aws-sdk'
//import { v4 as uuidv4 } from 'uuid';
//import {getSignedUrl} from './generateUploadURL'  

import {TodoItem} from '../../models/TodoItem'
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  var date = new Date()
  //var timestamp = date.getTime();
  var currentTime = date.getHours() + ":" + date.getMinutes()+"::" + date.getDate() +"/" +date.getMonth() +"/"+ date.getFullYear()
  //const postId = uuidv4()
  const newTodoReq: CreateTodoRequest = 
  {
    ...JSON.parse(event.body)
  }
  //const urls = getSignedUrl("ss",newTodoReq.postId);
//   const uploadUrl = urls[0];
//   const downloadUrl = urls[1];
  //console.log(uploadUrl,downloadUrl);
  const newTodo:TodoItem = {
    userId: newTodoReq.userId,
    todoId: newTodoReq.todoId,
    name:newTodoReq.name,
    createdAt:currentTime.toString(),
    attachmentUrl : newTodoReq.url
  }
  await docClient.put({
    TableName: todoTable,
    Item: newTodo
  }).promise()
  

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newTodo
    })
  }
}