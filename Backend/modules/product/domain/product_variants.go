package domain

import (
	"strings"

	"github.com/google/uuid"
)

type ProductVariants struct {
	id             uuid.UUID
	productId      uuid.UUID
	sku            string
	price          float64
	comparePrice   *float64
	color          *string
	size           *string
	quantity       int
	activityStatus VariantActivityStatus
}

func NewProductVariants(
	id uuid.UUID,
	productId uuid.UUID,
	sku string,
	price float64,
	comparePrice *float64,
	color *string,
	size *string,
	quantity int,
	activityStatus VariantActivityStatus,
) *ProductVariants {
	return &ProductVariants{
		id:             id,
		productId:      productId,
		sku:            sku,
		price:          price,
		comparePrice:   comparePrice,
		color:          color,
		size:           size,
		quantity:       quantity,
		activityStatus: activityStatus,
	}
}

// Getter methods
func (pv *ProductVariants) Id() uuid.UUID {
	return pv.id
}

func (pv *ProductVariants) ProductId() uuid.UUID {
	return pv.productId
}

func (pv *ProductVariants) Sku() string {
	return pv.sku
}

func (pv *ProductVariants) Price() float64 {
	return pv.price
}

func (pv *ProductVariants) ComparePrice() *float64 {
	return pv.comparePrice
}

func (pv *ProductVariants) Color() *string {
	return pv.color
}

func (pv *ProductVariants) Size() *string {
	return pv.size
}

func (pv *ProductVariants) Quantity() int {
	return pv.quantity
}

func (pv *ProductVariants) ActivityStatus() VariantActivityStatus {
	return pv.activityStatus
}

// Setter methods
func (pv *ProductVariants) SetId(id uuid.UUID) {
	pv.id = id
}

func (pv *ProductVariants) SetProductId(productId uuid.UUID) {
	pv.productId = productId
}

func (pv *ProductVariants) SetSku(sku string) {
	pv.sku = sku
}

func (pv *ProductVariants) SetPrice(price float64) {
	pv.price = price
}

func (pv *ProductVariants) SetComparePrice(comparePrice *float64) {
	pv.comparePrice = comparePrice
}

func (pv *ProductVariants) SetColor(color *string) {
	pv.color = color
}

func (pv *ProductVariants) SetSize(size *string) {
	pv.size = size
}

func (pv *ProductVariants) SetQuantity(quantity int) {
	pv.quantity = quantity
}

func (pv *ProductVariants) SetActivityStatus(activityStatus VariantActivityStatus) {
	pv.activityStatus = activityStatus
}

// Enum for activity status
type VariantActivityStatus int

const (
	VariantActive   VariantActivityStatus = iota // 0
	VariantInactive                              // 1
)

func (vas VariantActivityStatus) String() string {
	return [2]string{"active", "inactive"}[vas]
}

func GetVariantActivityStatus(s string) VariantActivityStatus {
	switch strings.TrimSpace(strings.ToLower(s)) {
	case "active":
		return VariantActive
	case "inactive":
		return VariantInactive
	default:
		return VariantActive
	}
}
