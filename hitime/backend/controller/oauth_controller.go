package controller

import (
	"github.com/gin-gonic/gin"
)

type OAuthController struct{}

func NewOAuthController() *OAuthController {
	return &OAuthController{}
}

func (c *OAuthController) Authorize(ctx *gin.Context) {
	// OAuth 授权码流程
}

func (c *OAuthController) Token(ctx *gin.Context) {
	// 颁发 token
}

func (c *OAuthController) Revoke(ctx *gin.Context) {
	// 撤销 token
} 