package domain

import (
	"strings"

	"github.com/google/uuid"
)

type Products struct {
	id             uuid.UUID
	categoryId     *uuid.UUID
	name           string
	content        *string
	skuPrefix      string
	publishStatus  PublishStatus
	activityStatus ActivityStatus
}

func NewProducts(
	id uuid.UUID,
	categoryId *uuid.UUID,
	name string,
	content *string,
	skuPrefix string,
	publishStatus PublishStatus,
	activityStatus ActivityStatus,
) *Products {
	return &Products{
		id:             id,
		categoryId:     categoryId,
		name:           name,
		content:        content,
		skuPrefix:      skuPrefix,
		publishStatus:  publishStatus,
		activityStatus: activityStatus,
	}
}

// Getter methods
func (p *Products) Id() uuid.UUID {
	return p.id
}

func (p *Products) CategoryId() *uuid.UUID {
	return p.categoryId
}

func (p *Products) Name() string {
	return p.name
}

func (p *Products) Content() *string {
	return p.content
}

func (p *Products) SkuPrefix() string {
	return p.skuPrefix
}

func (p *Products) PublishStatus() PublishStatus {
	return p.publishStatus
}

func (p *Products) ActivityStatus() ActivityStatus {
	return p.activityStatus
}

// Setter methods
func (p *Products) SetId(id uuid.UUID) {
	p.id = id
}

func (p *Products) SetCategoryId(categoryId *uuid.UUID) {
	p.categoryId = categoryId
}

func (p *Products) SetName(name string) {
	p.name = name
}

func (p *Products) SetContent(content *string) {
	p.content = content
}

func (p *Products) SetSkuPrefix(skuPrefix string) {
	p.skuPrefix = skuPrefix
}

func (p *Products) SetPublishStatus(publishStatus PublishStatus) {
	p.publishStatus = publishStatus
}

func (p *Products) SetActivityStatus(activityStatus ActivityStatus) {
	p.activityStatus = activityStatus
}

type PublishStatus int
type ActivityStatus int

const (
	PublishStatusDraft PublishStatus = iota
	PublishStatusPublished
	PublishStatusArchived
)
const (
	ProductActive   ActivityStatus = iota // 0
	ProductInactive                       // 1
)

func (r PublishStatus) String() string {
	return [3]string{"draft", "published", "archived"}[r]
}

func GetPublishStatus(s string) PublishStatus {
	switch strings.TrimSpace(strings.ToLower(s)) {
	case "draft":
		return PublishStatusDraft
	case "published":
		return PublishStatusPublished
	case "archived":
		return PublishStatusArchived
	default:
		return PublishStatusDraft
	}
}
func (r ActivityStatus) String() string {
	return [2]string{"active", "inactive"}[r]
}

func GetActivityStatus(s string) ActivityStatus {
	switch strings.TrimSpace(strings.ToLower(s)) {
	case "active":
		return ProductActive
	case "inactive":
		return ProductInactive
	default:
		return ProductActive
	}
}
