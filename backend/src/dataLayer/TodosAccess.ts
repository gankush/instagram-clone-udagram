import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
//import {APIGatewayProxyEvent } from 'aws-lambda'
//import { getUserId } from '../lambda/utils';
import { TodoUpdate } from '../models/TodoUpdate';
//import { APIGatewayProxyEvent} from 'aws-lambda'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

//import * as AWSXRay from "aws-xray-sdk";
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
export class PostAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODOS_TABLE
    ) {
    }


    async getAllToDos(userId:string): Promise<TodoItem[]> {
        console.log(this.todoTable);
        //console.log("userID",getUserId(event))

        const result = await this.docClient.query({
            TableName: this.todoTable,
            //IndexName: 'index-name',
            KeyConditionExpression: 'userId = :paritionKey',
            ExpressionAttributeValues: {
                ':paritionKey': userId

            }

        }).promise();
        const items = result.Items;
        console.log(items)
        return items as TodoItem[];
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        }).promise()
        return todoItem
    }

    async updateTodo(updatedTodo:UpdateTodoRequest, userId: string, todoId: string): Promise<TodoUpdate> {


        var params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId

            },
            UpdateExpression: "set #name_todo = :n",
            ExpressionAttributeValues: {
                ":n": updatedTodo.name.toString()
                
            },
            ExpressionAttributeNames: {
                "#name_todo": "name"
               
                

            },
            ReturnValues: "UPDATED_NEW"
        };

        await this.docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                return {
                    statusCode: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: 'Unable to delete'

                }
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        }).promise();
        const item : TodoUpdate = {
            name:updatedTodo.name,
            todoId:todoId,
            userId:userId
        }
        return item

    }

}


function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log("Creating a local DynamoDB instance");
        return new XAWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:8000"
        });
    }
    return new XAWS.DynamoDB.DocumentClient();
}


