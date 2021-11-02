package utils

import (
	"strings"
	"time"

	"github.com/Strum355/log"
	"github.com/gal/timber/utils/customresponse"
	"github.com/gin-gonic/gin"
)

func Respond(c *gin.Context, resp *customresponse.Response, payload interface{}) {
	if resp.Status() < 200 || resp.Status() > 210 {
		log.WithContext(c).WithError(resp).Error(resp.Message)
	}
	c.JSON(resp.Status(), gin.H{
		"detail":  resp.Detail,
		"message": resp.Message,
		"code":    resp.Status(),
		"data":    payload,
	})
}

// GetDurationInMillseconds takes a start time and returns a duration in milliseconds
func GetDurationInMillseconds(start time.Time) float64 {
	end := time.Now()
	duration := end.Sub(start)
	milliseconds := float64(duration) / float64(time.Millisecond)
	rounded := float64(int(milliseconds*100+.5)) / 100
	return rounded
}

// GetClientIP gets the correct IP for the end client instead of the proxy
func GetClientIP(c *gin.Context) string {
	// first check the X-Forwarded-For header
	requester := c.Request.Header.Get("X-Forwarded-For")
	// if empty, check the Real-IP header
	if len(requester) == 0 {
		requester = c.Request.Header.Get("X-Real-IP")
	}
	// if the requester is still empty, use the hard-coded address from the socket
	if len(requester) == 0 {
		requester = c.Request.RemoteAddr
	}

	// if requester is a comma delimited list, take the first one
	// (this happens when proxied via elastic load balancer then again through nginx)
	if strings.Contains(requester, ",") {
		requester = strings.Split(requester, ",")[0]
	}

	return requester
}
