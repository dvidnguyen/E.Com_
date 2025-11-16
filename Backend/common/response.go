package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CanWithDebug interface {
	WithDebug(debug string) *DefaultError
}

func WriteErrorResponse(c *gin.Context, err error) {
	if errSt, ok := err.(StatusCodeCarrier); ok {
		if !gin.IsDebugging() {
			errWithNoDebug := errSt.(CanWithDebug).WithDebug("")
			c.JSON(errSt.StatusCode(), errWithNoDebug)
			return
		}

		c.JSON(errSt.StatusCode(), errSt)
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
}

type successResponse struct {
	CodeField   int         `json:"code"`
	StatusField string      `json:"status"`
	Data        interface{} `json:"data"`
	Paging      interface{} `json:"paging,omitempty"`
	Extra       interface{} `json:"extra,omitempty"`
}

func SuccessResponse(code int, status string, data, paging, extra interface{}) *successResponse {
	return &successResponse{
		CodeField:   code,
		StatusField: status,
		Data:        data,
		Paging:      paging,
		Extra:       extra,
	}
}

func WriteSuccessResponse(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, SuccessResponse(http.StatusOK, http.StatusText(http.StatusOK), data, nil, nil))
}

func WriteFullSuccessResponse(c *gin.Context, data, paging, extra interface{}) {
	c.JSON(http.StatusOK, SuccessResponse(http.StatusOK, http.StatusText(http.StatusOK), data, paging, extra))
}
