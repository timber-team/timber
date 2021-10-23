package customerror

import (
	"errors"
	"fmt"
	"net/http"
)

// Type holds an errorType string and integer code for the error
type Type string

// valid errorTypes
const (
	Authorization      Type = "AUTHORIZATION"       // Authentication Failures - 401
	BadRequest         Type = "BAD_REQUEST"         // Validation errors / BadInput - 400
	Conflict           Type = "CONFLICT"            // Already exists (e.g create account with existent email) - 409
	Internal           Type = "INTERNAL"            // Server and fallback errors - 500
	NotFound           Type = "NOT_FOUND"           // Resource not found - 404
	ServiceUnavailable Type = "SERVICE_UNAVAILABLE" // Handler running for too long - 503
)

// Error Custom error
type Error struct {
	Type    Type   `json:"type"`
	Message string `json:"message"`
}

// Standard error interface
func (e *Error) Error() string {
	return e.Message
}

// Status Mapping errors to status codes
func (e *Error) Status() int {
	switch e.Type {
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
	var e *Error
	if errors.As(err, &e) {
		return e.Status()
	}
	return http.StatusInternalServerError
}

/*
* Error Generators
 */

// NewAuthorization ->	code 401
func NewAuthorization(reason string) *Error {
	return &Error{
		Type:    Authorization,
		Message: reason,
	}
}

// NewBadRequest ->	code 400
func NewBadRequest(reason string) *Error {
	return &Error{
		Type:    BadRequest,
		Message: fmt.Sprintf("Bad request. Reason: %v", reason),
	}
}

// NewConflict ->	code 409
func NewConflict(name string, value string) *Error {
	return &Error{
		Type:    Conflict,
		Message: fmt.Sprintf("resource: %v with value: %v already exists", name, value),
	}
}

// NewInternal ->	code 500
func NewInternal() *Error {
	return &Error{
		Type:    Internal,
		Message: fmt.Sprintln("Internal server error."),
	}
}

// NewNotFound ->	code 404
func NewNotFound(name string, value string) *Error {
	return &Error{
		Type:    NotFound,
		Message: fmt.Sprintf("resource: %v with value: %v not found", name, value),
	}
}

// NewServiceUnavailable ->	code 503
func NewServiceUnavailable() *Error {
	return &Error{
		Type:    ServiceUnavailable,
		Message: "Service unavailable or timed out",
	}
}
