package customresponse

import (
	"errors"
	"fmt"
	"net/http"
)

// Type holds an errorType string and integer code for the error
type Type string

// valid errorTypes
const (
	Ok                 Type = "OK"                  // OK Response - 200
	Created            Type = "CREATED"             // Creation Response - 201
	Authorization      Type = "AUTHORIZATION"       // Authentication Failures - 401
	BadRequest         Type = "BAD_REQUEST"         // Validation errors / BadInput - 400
	Conflict           Type = "CONFLICT"            // Already exists (e.g create account with existent email) - 409
	Internal           Type = "INTERNAL"            // Server and fallback errors - 500
	NotFound           Type = "NOT_FOUND"           // Resource not found - 404
	ServiceUnavailable Type = "SERVICE_UNAVAILABLE" // Handler running for too long - 503
)

// Error Custom error
type Response struct {
	Type    Type   `json:"type"`
	Detail  string `json:"detail"`
	Message string `json:"message"`
}

// Standard error interface
func (r *Response) Error() string {
	return r.Message
}

// Status Mapping errors to status codes
func (r *Response) Status() int {
	switch r.Type {
	case Ok:
		return http.StatusOK
	case Created:
		return http.StatusCreated
	case Authorization:
		return http.StatusUnauthorized
	case BadRequest:
		return http.StatusBadRequest
	case Conflict:
		return http.StatusConflict
	case Internal:
		return http.StatusInternalServerError
	case NotFound:
		return http.StatusNotFound
	case ServiceUnavailable:
		return http.StatusServiceUnavailable
	default:
		return http.StatusInternalServerError
	}
}

// Status checks the runtime type of the error and returns a http status code
func Status(err error) int {
	var r *Response
	if errors.As(err, &r) {
		return r.Status()
	}
	return http.StatusInternalServerError
}

/*
* Response Generators
 */

// NewOK ->	code 200
func NewOK() *Response {
	return &Response{
		Type:    Ok,
		Detail:  "success",
		Message: "",
	}
}

// NewCreated ->	code 201
func NewCreated() *Response {
	return &Response{
		Type:    Created,
		Detail:  "created",
		Message: "",
	}
}

// NewBadRequest ->	code 400
func NewBadRequest(message string) *Response {
	return &Response{
		Type:    BadRequest,
		Detail:  "error",
		Message: message,
	}
}

// NewAuthorization ->	code 401
func NewAuthorization(message string) *Response {
	return &Response{
		Type:    Authorization,
		Detail:  "error",
		Message: message,
	}
}

// NewConflict ->	code 409
func NewConflict(name string, value string) *Response {
	return &Response{
		Type:    Conflict,
		Detail:  "error",
		Message: fmt.Sprintf("resource: %v with value: %v already exists", name, value),
	}
}

// NewInternal ->	code 500
func NewInternal() *Response {
	return &Response{
		Type:    Internal,
		Detail:  "error",
		Message: fmt.Sprintln("Internal server error."),
	}
}

// NewNotFound ->	code 404
func NewNotFound(name string, value string) *Response {
	return &Response{
		Type:    NotFound,
		Detail:  "error",
		Message: fmt.Sprintf("resource not found\n%s : %s", name, value),
	}
}

// NewServiceUnavailable ->	code 503
func NewServiceUnavailable() *Response {
	return &Response{
		Type:    ServiceUnavailable,
		Detail:  "error",
		Message: "Service unavailable or timed out",
	}
}
