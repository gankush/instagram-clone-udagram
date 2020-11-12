/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  todoId:string,
  userId:string,
  name: string,
  url:string
  
}
