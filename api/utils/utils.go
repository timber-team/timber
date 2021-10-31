package utils

import (
	"github.com/Strum355/log"
	"github.com/gal/timber/utils/customresponse"
	"github.com/gin-gonic/gin"
)

func Respond(c *gin.Context, resp *customresponse.Response, payload interface{}) {
	if resp.Status() >= 200 && resp.Status() <= 210 {
		log.WithContext(c).Info(resp.Message)
	} else {
		log.WithContext(c).WithError(resp).Error(resp.Message)
	}
	c.JSON(resp.Status(), gin.H{
		"detail":  resp.Detail,
		"message": resp.Message,
		"code":    resp.Status(),
		"data":    payload,
	})
}
