import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'


//import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedTodo = JSON.parse(event.body);
  const todoId = event.pathParameters.todoId;
  const userId = updatedTodo.userId;

  var params = {
    TableName:todoTable,
    Key:{
      "userId": userId,
      "todoId":todoId
      
    },
    UpdateExpression: "set #name_todo = :n",
    ExpressionAttributeValues:{
        ":n": updatedTodo.name.toString()
       
    },
    ExpressionAttributeNames:{
      "#name_todo": "name"

    },
    ReturnValues:"UPDATED_NEW"
};

await docClient.update(params, function(err, data) {
  if (err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      return {
        statusCode:404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: 'Unable to delete' 

      }
  } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
  }
}).promise();
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode:201,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(updatedTodo) 
  }
}