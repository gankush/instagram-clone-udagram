//import { v4 as uuidv4 } from 'uuid'
import { TodoItem } from '../models/TodoItem'
//import {getUserId} from '../lambda/utils'
import { PostAccess } from '../dataLayer/TodosAccess'
//import { getUserId } from '../lambda/utils';

//import { APIGatewayProxyEvent } from 'aws-lambda'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const postAccess = new PostAccess()


export async function getAllToDos(userId:string): Promise<TodoItem[]> {
    return await postAccess.getAllToDos(userId);

}