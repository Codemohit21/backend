class ApiResponse{
    constructor(statusCode,data,message="success"){
        tj=history.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}