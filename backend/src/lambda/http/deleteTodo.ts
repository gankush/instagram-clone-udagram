import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
//import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const itemForDeletion = JSON.parse(event.body);
  const delTodoId = event.pathParameters.todoId;
  const userId = JSON.parse(event.body).userId;
  console.log("userID: ",userId,"    todoID: ",delTodoId);
  var params = {
    TableName:todoTable,
    Key: {
      "userId": userId,
      "todoId": delTodoId
      
    }
};
console.log("Attempting a conditional delete...");
await docClient.delete(params, function(err) {
    
    if (err) {
        return {
          statusCode:404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: 'Unable to delete' 
        }
    }

    
}).promise();

return {
  statusCode:201,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify(params) 
}
  
}