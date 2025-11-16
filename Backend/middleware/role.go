package middleware

import (
	"Backend/common"

	"github.com/gin-gonic/gin"
)

func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		val, ok := c.Get(common.KeyRequester)

		// 2. BÂY GIỜ BẠN CÓ THỂ KIỂM TRA "ok"
		if !ok {
			// Lỗi này không nên xảy ra nếu RequireAuth đã chạy
			common.WriteErrorResponse(c, common.ErrUnauthorized.WithError("requester not found"))
			c.Abort()
			return
		}

		// 3. Ép kiểu (type assertion) cho `val`
		requester := val.(common.Requester)
		userRole := requester.Role() // Giả sử requester có hàm GetRole() trả về string

		// 2. Kiểm tra xem role của user có nằm trong danh sách được phép không
		isAllowed := false
		for _, role := range allowedRoles {
			if userRole == role {
				isAllowed = true
				break
			}
		}

		// 3. Nếu không được phép -> Cấm (Forbidden)
		if !isAllowed {
			// Dùng lỗi 403 Forbidden, không phải 401 Unauthorized
			common.WriteErrorResponse(c, common.ErrForbidden.WithError("you don't have permission for this action"))
			c.Abort() // Dừng xử lý
			return
		}

		// 4. Nếu được phép -> đi tiếp
		c.Next()
	}
}
